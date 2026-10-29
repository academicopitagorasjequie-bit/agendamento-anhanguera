# 🎓 Anhanguera EAD - Sistema de Agendamento da Coordenação (Jacke)

Sistema oficial de agendamento presencial com a **Coordenadora Jacke** na **Sala da Coordenação**, com identidade visual da **Faculdade Anhanguera (Laranja)** e emissão do **Relatório Diário de Agendamentos**.

---

## ⚡ Como Iniciar o Sistema (1 Clique)

1. Dê dois cliques no arquivo:
   ```text
   iniciar_agendamento.bat
   ```
2. O navegador abrirá automaticamente em `http://localhost:3000`.

---

## 🔗 Links de Acesso

| Painel | Endereço | Descrição |
|---|---|---|
| **Página de Agendamento (Aluno)** | [`http://localhost:3000`](http://localhost:3000) | Agendamento presencial para alunos de Graduação EAD. |
| **Painel da Coordenadora (Admin)** | [`http://localhost:3000/admin.html`](http://localhost:3000/admin.html) | Acesso exclusivo da Jacke com o **Relatório Diário de Agendamentos**, exportação em CSV/Excel e impressão oficial. |

> 🔑 **Senha padrão de acesso da Coordenação:** `jacke2026`

---

## 🎯 Alterações e Melhorias Realizadas

1. **Identidade Visual Anhanguera:**
   - Todo o design foi alterado do azul para o **Laranja Anhanguera**.
2. **Exclusivo para Graduação:**
   - Remoção de pós-graduação. Agora é exclusivo para alunos de **Cursos de Graduação EAD**.
3. **Coordenadora Jacke:**
   - Títulos e referências alterados para **Coordenadora Jacke**.
4. **Local Fixo: Sala da Coordenação:**
   - Removido Google Meet e opções online. O atendimento é presencial na **Sala da Coordenação**.
5. **Horário de Atendimento das 18:00 às 20:00:**
   - Turnos diurnos removidos. O expediente configurado é exclusivamente das **18:00 às 20:00**.
6. **Bloqueio Estrito de Finais de Semana:**
   - Sábados e Domingos estão estritamente bloqueados para agendamentos. O sistema avisa o aluno e sugere o próximo dia útil.
7. **Remoção de WhatsApp e Google Agenda na Tela Final:**
   - Removidos os botões de confirmação no WhatsApp e Google Agenda. O aluno recebe o número do protocolo e a opção de imprimir o comprovante.
8. **Remoção da Consulta Pública:**
   - O site de consulta foi desativado conforme solicitado; o portal é direto para agendamento.
9. **Status Simplificados (Sem Confirmado e Sem Cancelado):**
   - Os status agora são apenas: **Agendado**, **Concluído** e **Ausente**.
10. **Correção do Relatório e da Exportação CSV:**
   - A exportação CSV agora envia o token de autenticação e faz o download direto da planilha formatada compatível com Microsoft Excel.
   - O layout de impressão oficial A4 foi ajustado com cabeçalho institucional e campo de assinatura da Coordenadora Jacke.
