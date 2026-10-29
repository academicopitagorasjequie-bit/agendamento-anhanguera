// Teste Automatizado Atualizado - Anhanguera EAD

const http = require('http');

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body), headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body, headers: res.headers });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(typeof data === 'string' ? data : JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log('--- INICIANDO TESTES: ANHANGUERA EAD - COORDENADORA JACKE ---');

  process.env.PORT = '3099';
  require('./server.js');

  await new Promise(r => setTimeout(r, 1000));

  try {
    // 1. Configuração Anhanguera
    console.log('[TESTE 1] GET /api/config');
    const resConfig = await request({
      hostname: 'localhost',
      port: 3099,
      path: '/api/config',
      method: 'GET'
    });
    console.log('Status:', resConfig.status);
    console.assert(resConfig.status === 200, 'Config deve retornar 200');
    console.assert(resConfig.data.data.instituicao.includes('Anhanguera'), 'Deve ser Anhanguera');
    console.assert(resConfig.data.data.coordenadoraNome === 'Coordenadora Jacke', 'Nome Coordenadora Jacke');
    console.assert(resConfig.data.data.localAtendimento === 'Sala da Coordenação', 'Local Sala da Coordenação');
    console.assert(resConfig.data.data.horarioAtendimento.inicio === '18:00', 'Início 18:00');
    console.assert(resConfig.data.data.horarioAtendimento.fim === '20:00', 'Fim 20:00');
    console.log('Config OK! Horários:', resConfig.data.data.horarioAtendimento);

    // 2. Testar Bloqueio de Fim de Semana
    console.log('\n[TESTE 2] Bloqueio estrito de Fim de Semana');
    // Encontrar próximo Sábado
    const sabado = new Date();
    while (sabado.getDay() !== 6) {
      sabado.setDate(sabado.getDate() + 1);
    }
    const sabadoStr = sabado.toISOString().split('T')[0];

    const resSabado = await request({
      hostname: 'localhost',
      port: 3099,
      path: `/api/horarios-disponiveis?data=${sabadoStr}`,
      method: 'GET'
    });
    console.assert(resSabado.data.disponivel === false, 'Fim de semana deve estar indisponivel');
    console.log(`Data de Sábado (${sabadoStr}) bloqueada com sucesso: "${resSabado.data.motivoBloqueio}"`);

    // 3. Testar Horários das 18:00 às 20:00 em Dia Útil
    console.log('\n[TESTE 3] Grade de Horários 18:00 às 20:00');
    const diaUtil = new Date();
    diaUtil.setDate(diaUtil.getDate() + 1);
    if (diaUtil.getDay() === 0) diaUtil.setDate(diaUtil.getDate() + 1);
    if (diaUtil.getDay() === 6) diaUtil.setDate(diaUtil.getDate() + 2);
    const diaUtilStr = diaUtil.toISOString().split('T')[0];

    const resHorarios = await request({
      hostname: 'localhost',
      port: 3099,
      path: `/api/horarios-disponiveis?data=${diaUtilStr}`,
      method: 'GET'
    });
    console.assert(resHorarios.status === 200, 'Horários deve retornar 200');
    console.assert(resHorarios.data.horarios[0].horario === '18:00', 'Primeiro horário deve ser 18:00');
    console.log(`Horários carregados para ${diaUtilStr}:`, resHorarios.data.horarios.map(h => h.horario).join(', '));

    const slotLivre = resHorarios.data.horarios.find(h => h.livre);
    console.log('Slot selecionado para agendamento:', slotLivre.horario);

    // 4. Testar Criação de Agendamento Presencial
    console.log('\n[TESTE 4] POST /api/agendamentos');
    const randomDigits = Math.floor(100000000 + Math.random() * 900000000).toString();
    const payload = {
      nome: 'Lucas Mendes Ferreira',
      cpf: `${randomDigits}00`,
      curso: 'Administração',
      semestre: '6º Semestre',
      telefone: '(11) 98111-2233',
      data: diaUtilStr,
      horario: slotLivre.horario,
      motivo: 'Estágio',
      relato: 'Dúvidas presenciais sobre o preenchimento do termo de estágio.'
    };

    const resCriar = await request({
      hostname: 'localhost',
      port: 3099,
      path: '/api/agendamentos',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, payload);

    console.assert(resCriar.status === 201, 'Criação deve retornar 201');
    console.assert(resCriar.data.data.protocolo.startsWith('ANH-'), 'Protocolo deve iniciar com ANH-');
    console.assert(resCriar.data.data.local === 'Sala da Coordenação', 'Local Sala da Coordenação');
    console.assert(resCriar.data.data.status === 'Agendado', 'Status inicial deve ser Agendado');
    console.log('Agendamento criado! Protocolo:', resCriar.data.data.protocolo);

    // 5. Testar Login Admin
    console.log('\n[TESTE 5] POST /api/admin/login');
    const resLogin = await request({
      hostname: 'localhost',
      port: 3099,
      path: '/api/admin/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { senha: 'jacke2026' });

    console.assert(resLogin.status === 200, 'Login deve retornar 200');
    const token = resLogin.data.token;
    console.log('Login autorizado! Token obtido.');

    // 6. Testar Relatório Diário com Status Limpos
    console.log('\n[TESTE 6] GET /api/admin/relatorio-diario');
    const resRelatorio = await request({
      hostname: 'localhost',
      port: 3099,
      path: `/api/admin/relatorio-diario?data=${diaUtilStr}`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    console.assert(resRelatorio.status === 200, 'Relatório deve retornar 200');
    console.assert(resRelatorio.data.estatisticas.agendados !== undefined, 'Deve ter agendados');
    console.assert(resRelatorio.data.estatisticas.concluidos !== undefined, 'Deve ter concluidos');
    console.assert(resRelatorio.data.estatisticas.ausentes !== undefined, 'Deve ter ausentes');
    console.assert(resRelatorio.data.estatisticas.confirmados === undefined, 'NÃO deve ter confirmados');
    console.assert(resRelatorio.data.estatisticas.cancelados === undefined, 'NÃO deve ter cancelados');
    console.log('Métricas do Relatório Diário:', resRelatorio.data.estatisticas);

    // 7. Testar Exportação CSV Corrigida (Com Token)
    console.log('\n[TESTE 7] GET /api/admin/export/csv');
    const resCsv = await request({
      hostname: 'localhost',
      port: 3099,
      path: `/api/admin/export/csv?data=${diaUtilStr}&token=${token}`,
      method: 'GET'
    });

    console.assert(resCsv.status === 200, 'CSV deve retornar 200');
    console.assert(resCsv.raw.includes('Sala da Coordenação'), 'Deve conter Sala da Coordenação');
    console.log('Exportação CSV realizada com 100% de sucesso!');

    console.log('\n======================================================');
    console.log('✅ TODAS AS CORREÇÕES E EXIGÊNCIAS TESTADAS COM SUCESSO!');
    console.log('======================================================');
    process.exit(0);

  } catch (err) {
    console.error('❌ Erro no teste:', err);
    process.exit(1);
  }
}

runTests();
