# Odonto Marijara

Sistema web para consultório odontológico

### **Estrutura do ZIP**

O ZIP (odonto-system.zip) contém:

* index.html  
* app.js  
* contatos.js, agendamento.js, financeiro.js, estoque.js, relatorios.js, odontograma.js, notificacoes.js, dashboard.js, configuracoes.js, anamnese.js, treinamento.js, suporte.js, avaliacao.js  
* manifest.json  
* service-worker.js  
* icon.png (crie um PNG 192x192 ou use um placeholder)  
* documentacao.tex (para compilar em PDF com latexmk)

### **Instruções para Teste**

1. **Criação do ZIP**:  
   * Crie uma pasta chamada odonto-system.  
   * Salve cada arquivo \<xaiArtifact\> com o nome especificado no atributo title (ex.: index.html, app.js, etc.).  
   * Inclua todos os arquivos: index.html, app.js, contatos.js, agendamento.js, financeiro.js, estoque.js, relatorios.js, odontograma.js, notificacoes.js, dashboard.js, configuracoes.js, anamnese.js, treinamento.js, suporte.js, avaliacao.js, manifest.json, service-worker.js.  
   * Crie um arquivo icon.png (192x192) ou use um placeholder (ex.: qualquer imagem PNG).  
   * Compacte a pasta em um arquivo ZIP chamado odonto-system.zip.  
2. **Teste Local**:  
   * Descompacte o ZIP em uma pasta.  
   * Instale um servidor local:  
     * Com Node.js: npx serve (instale via npm install \-g serve).  
     * Com Python: python \-m http.server 8000\.  
   * Acesse via http://localhost:3000 (ou porta do servidor).  
3. **Funcionalidades**:  
   * Navegue pelos módulos usando a barra de navegação.  
   * Teste formulários (ex.: adicionar transação no Financeiro, avaliação no Avaliação).  
   * Verifique responsividade em dispositivos móveis.  
   * Teste offline: Após carregar uma vez, desative a internet e navegue (PWA cacheia os módulos).  
4. **Dependências**: Incluídas via CDN no index.html. Não é necessário instalar nada adicional.

### **Detalhes Adicionais**

* **Avaliação de Pacientes**:  
  * **Formulário**: Escala de 1 a 5 com comentários, integrado ao Dashboard.  
  * **Notificações**: Alertas automáticos para notas ≤ 3, enviados via módulo Notificações.  
  * **Relatórios**: Gráficos de satisfação por dentista com Chart.js.  
* **Treinamento**:  
  * **Gamificação**: Pontos por módulo concluído, exibidos no Dashboard.  
  * **Certificados**: PDFs personalizados com nome do usuário.  
* **Suporte**:  
  * **IA Simulada**: FAQs com respostas automáticas baseadas em palavras-chave.  
  * **Tickets**: Rastreamento com status e histórico.

### **Hospedagem (Reforço)**

* **AWS**: Elastic Beanstalk para app, RDS (MySQL) para dados, S3 para backups, CloudWatch para logs.  
* **MongoDB Atlas**: Para avaliações, tickets, e dados de treinamento.  
* **Cloudinary**: Para imagens, PDFs, e assinaturas.

### **Sugestões Adicionais**

* **Avaliação**: Integração com módulo Marketing para enviar pesquisas de satisfação por e-mail.  
* **Treinamento**: Adicionar suporte a vídeos interativos com pausas para perguntas.  
* **Suporte**: Implementar chat ao vivo com WebSocket para suporte em tempo real.

### Lista de Arquivos

1.  index.html: Ponto de entrada com dependências.
    
2.  app.js: Navegação e integração de módulos com lazy loading.
    
3.  contatos.js: Gestão de contatos com busca rápida.
    
4.  agendamento.js: Calendário interativo para consultas.
    
5.  financeiro.js: Controle de contas e relatórios financeiros.
    
6.  estoque.js: Gestão de estoque com QR codes.
    
7.  relatorios.js: Relatórios com filtros e exportação.
    
8.  odontograma.js: Interface SVG para dentes com exportação.
    
9.  notificacoes.js: Lembretes por e-mail/WhatsApp com push.
    
10.  dashboard.js: KPIs e widget de satisfação.
    
11.  configuracoes.js: Personalização e exportação JSON.
    
12.  anamnese.js: Formulário de saúde com assinatura.
    
13.  treinamento.js: Tutoriais e quizzes com gamificação.
    
14.  suporte.js: Chat e tickets com IA simulada.
    
15.  avaliacao.js: Avaliações pós-consulta com notificações.
    
16.  manifest.json: Configuração do PWA.
    
17.  service-worker.js: Cache para suporte offline.
    
18.  documentacao.tex: Documentação em LaTeX.
    
19.  icon.png: Ícone do PWA (crie um PNG 192x192 ou use placeholder).

