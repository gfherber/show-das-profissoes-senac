/* Show das Profissões - Senac Taquara
   Configuração, dados dos cursos e banco de perguntas. */

/* =====================================================================
   CONFIGURAÇÃO  (edite aqui)
   ===================================================================== */
const ACERTOS_PARA_ROLETA = 5;
const TEMPO_POR_PERGUNTA = 20;   // segundos por pergunta (0 = sem cronômetro)
const VOLTAR_SE_PARADO  = 0;     // 0 = nunca volta sozinho. Coloque um número (ex.: 120) para voltar à tela inicial após X segundos parado
const PREMIOS = ["1 mil","10 mil","100 mil","500 mil","1 MILHÃO"];

/* Logo: cole aqui o endereço da imagem ou um data:image/png;base64,...
   Enquanto estiver vazio, aparece o nome "Senac Taquara" em texto. */
const LOGO_SRC = "img/logo-senac.png";

/* Dados dos cursos mostrados depois de cada resposta.
   Fonte: site do Senac-RS (Senac Taquara), consultado em 09/11/2026. Datas podem mudar.
   Campo vazio aparece como "Consulte a equipe". */
const CURSOS = {
 "Técnico em Desenvolvimento de Sistemas": {mod:"Presencial", inicio:"09/03/2027", horario:"Segunda a sexta, 19h às 22h", carga:"1200 horas"},
 "Gestão de Tráfego Pago":                 {mod:"Presencial", inicio:"09/08/2027", horario:"Segundas e quartas, 19h às 22h", carga:"30 horas"},
 "Analista de Marketing Digital em Mídias Sociais": {mod:"Presencial", inicio:"12/05/2027", horario:"Segundas e quartas, 19h às 22h", carga:"48 horas"},
 "Pilotagem de Drones com Filmagens Aéreas": {mod:"Presencial", inicio:"13/03/2027", horario:"Sábados, 9h às 18h", carga:"30 horas"},
 "Dicção, Desinibição e Oratória":         {mod:"Presencial", inicio:"06/04/2027", horario:"Terças e quintas, 19h às 22h", carga:"30 horas"},
 "Formação de Vendedores de Alto Desempenho": {mod:"Presencial", inicio:"06/07/2027", horario:"Terças e quartas, 19h às 22h", carga:"36 horas"},
 "Barbeiro":                               {mod:"Presencial", inicio:"12/04/2027", horario:"Segundas e quartas, 19h às 22h", carga:"180 horas"},
 "Massagista":                             {mod:"Presencial", inicio:"15/02/2027", horario:"Segundas e quintas, 19h às 22h", carga:"240 horas"},
 "Ferramentas de Design Gráfico":          {mod:"Presencial", inicio:"12/04/2027", horario:"Segundas e quintas, 19h às 22h", carga:"96 horas"},
 "Formação de Gerentes e Supervisores":    {mod:"Presencial", inicio:"08/03/2027", horario:"Segundas, quartas e quintas, 19h às 22h", carga:"104 horas"},
 "Design de Sobrancelhas e Extensão de Cílios": {mod:"Presencial", inicio:"03/07/2027", horario:"Sábados, 9h às 12h", carga:"40 horas"},
 "Excel":                                  {mod:"Presencial", inicio:"", horario:"", carga:""},
 "Técnico em Logística":                   {mod:"EAD", inicio:"Início imediato", horario:"EAD", carga:""},
 "Técnico em Óptica":                      {mod:"EAD", inicio:"Início imediato", horario:"EAD", carga:""},
 "Técnico em Recursos Humanos":            {mod:"EAD", inicio:"Início imediato", horario:"EAD", carga:""},
 "Técnico em Contabilidade":               {mod:"EAD", inicio:"Início imediato", horario:"EAD", carga:""},
 "Técnico em Transações Imobiliárias":     {mod:"EAD", inicio:"Início imediato", horario:"EAD", carga:""},
 "Técnico em Design de Interiores":        {mod:"EAD", inicio:"Início imediato", horario:"EAD", carga:""},
 "Técnico em Meio Ambiente":               {mod:"EAD", inicio:"Início imediato", horario:"EAD", carga:""},
 "Técnico em Administração":               {mod:"EAD", inicio:"Início imediato", horario:"EAD", carga:""},
};

/* Perguntas. A PRIMEIRA opção é sempre a correta (embaralha na hora).
   dev:true = Desenvolvimento de Sistemas (sempre aparece pelo menos uma). */
const BANCO = [
 {dev:true,q:"O que faz um Técnico em Desenvolvimento de Sistemas?",o:["Cria e mantém softwares, sites e aplicativos","Conserta celulares e eletrodomésticos","Instala redes de energia elétrica","Fabrica peças de computador"],c:"Técnico em Desenvolvimento de Sistemas",i:"Programa, testa e mantém sistemas, sites e apps. É uma das áreas que mais contratam no Brasil."},
 {dev:true,q:"Quem cria o aplicativo do banco que você usa no celular?",o:["Técnico em Desenvolvimento de Sistemas","Técnico em Logística","Técnico em Óptica","Técnico em Contabilidade"],c:"Técnico em Desenvolvimento de Sistemas",i:"Apps, sites e sistemas de empresas são feitos por quem sabe programar. No Senac você aprende na prática."},
 {dev:true,q:"Qual destas é uma linguagem de programação?",o:["Python","Latim","Braille","Código Morse"],c:"Técnico em Desenvolvimento de Sistemas",i:"Python, JavaScript, Java e SQL estão entre as linguagens que o desenvolvedor usa no dia a dia."},
 {dev:true,q:"O sistema do caixa que registra suas compras no mercado foi feito por quem?",o:["Um desenvolvedor de sistemas","Um técnico em óptica","Um massagista","Um designer de interiores"],c:"Técnico em Desenvolvimento de Sistemas",i:"Por trás de cada caixa, estoque e nota fiscal tem um sistema feito por desenvolvedores."},
 {q:"Quem planeja o estoque e o transporte para os produtos chegarem na prateleira do mercado?",o:["Técnico em Logística","Técnico em Meio Ambiente","Técnico em Óptica","Barbeiro"],c:"Técnico em Logística",i:"Cuida de compras, armazenagem, transporte e distribuição. Sem logística, a prateleira fica vazia!"},
 {q:"Quem monta e ajusta os óculos a partir da receita do oftalmologista?",o:["Técnico em Óptica","Técnico em Contabilidade","Técnico em Logística","Técnico em Recursos Humanos"],c:"Técnico em Óptica",i:"Interpreta a receita, monta as lentes e ajusta a armação no rosto do cliente."},
 {q:"O que faz um Técnico em Recursos Humanos?",o:["Recruta, seleciona e cuida das pessoas da empresa","Faz a manutenção das máquinas","Faz o projeto elétrico do prédio","Cria anúncios na internet"],c:"Técnico em Recursos Humanos",i:"Atua com recrutamento, seleção, treinamentos, folha de pagamento e clima da empresa."},
 {q:"Quem calcula impostos e organiza as contas de uma empresa?",o:["Técnico em Contabilidade","Técnico em Design de Interiores","Técnico em Óptica","Fotógrafo"],c:"Técnico em Contabilidade",i:"Registra receitas e despesas, apura impostos e mostra a saúde financeira do negócio."},
 {q:"Quem pode intermediar a compra, venda e aluguel de imóveis?",o:["Técnico em Transações Imobiliárias","Técnico em Meio Ambiente","Técnico em Logística","Técnico em Óptica"],c:"Técnico em Transações Imobiliárias",i:"É a formação para atuar como corretor de imóveis: avaliar, negociar e fechar contratos."},
 {q:"O que faz um Técnico em Design de Interiores?",o:["Planeja ambientes, móveis, cores e iluminação","Constrói a estrutura de concreto do prédio","Instala o encanamento da casa","Faz a limpeza pós-obra"],c:"Técnico em Design de Interiores",i:"Projeta ambientes bonitos e funcionais: layout, mobiliário, revestimentos e luz."},
 {q:"Quem ajuda empresas a reduzir o impacto no meio ambiente e cuidar do lixo que geram?",o:["Técnico em Meio Ambiente","Técnico em Transações Imobiliárias","Técnico em Óptica","Barbeiro"],c:"Técnico em Meio Ambiente",i:"Atua com gestão de resíduos, licenciamento, monitoramento ambiental e sustentabilidade."},
 {q:"Quem organiza as rotinas, o planejamento e o controle de uma empresa?",o:["Técnico em Administração","Técnico em Óptica","Massagista","Piloto de drone"],c:"Técnico em Administração",i:"Atua em finanças, compras, vendas, pessoas e planejamento do negócio."},
 {q:"Quem cria e gerencia anúncios pagos no Google e no Instagram?",o:["Gestor de Tráfego Pago","Técnico em Contabilidade","Barbeiro","Técnico em Óptica"],c:"Gestão de Tráfego Pago",i:"Escolhe público, orçamento e anúncios para trazer clientes pela internet."},
 {q:"Quem planeja os posts e a estratégia de uma marca nas redes sociais?",o:["Analista de Marketing Digital","Técnico em Logística","Técnico em Meio Ambiente","Massagista"],c:"Analista de Marketing Digital em Mídias Sociais",i:"Planeja conteúdo, calendário de posts e engajamento, e mede os resultados da marca."},
 {q:"Quem faz fotos e vídeos aéreos de eventos, obras e imóveis?",o:["Piloto de drone","Técnico em Contabilidade","Designer de sobrancelhas","Técnico em RH"],c:"Pilotagem de Drones com Filmagens Aéreas",i:"Atende eventos, imobiliárias, construtoras e agricultura com imagens aéreas."},
 {q:"Qual curso ensina a criar planilhas com fórmulas, tabelas e gráficos?",o:["Excel","Barbeiro","Massagista","Técnico em Óptica"],c:"Excel",i:"Excel é pedido em quase toda vaga administrativa. Quem domina sai na frente!"},
 {q:"Tem medo de falar em público? Qual curso ajuda nisso?",o:["Dicção, Desinibição e Oratória","Barbeiro","Técnico em Logística","Pilotagem de Drones"],c:"Dicção, Desinibição e Oratória",i:"Trabalha voz, postura e confiança para apresentações, entrevistas e reuniões."},
 {q:"Quem aprende técnicas de negociação e fechamento para bater metas de vendas?",o:["Vendedor de Alto Desempenho","Técnico em Meio Ambiente","Técnico em Óptica","Designer de Interiores"],c:"Formação de Vendedores de Alto Desempenho",i:"Abordagem, argumentação, contorno de objeções e fechamento."},
 {q:"Quem faz o corte masculino e o desenho da barba?",o:["Barbeiro","Técnico em Contabilidade","Piloto de drone","Técnico em Logística"],c:"Barbeiro",i:"Barbearia é um dos mercados que mais crescem. Dá até para abrir o próprio negócio!"},
 {q:"Quem usa técnicas manuais para aliviar tensões e trazer bem-estar?",o:["Massagista","Técnico em Transações Imobiliárias","Técnico em RH","Gestor de Tráfego"],c:"Massagista",i:"Aplica massagem relaxante e terapêutica em clínicas, spas ou atendimento próprio."},
 {q:"Quem cria logos, cartazes e posts usando ferramentas de design?",o:["Designer gráfico","Técnico em Logística","Técnico em Óptica","Massagista"],c:"Ferramentas de Design Gráfico",i:"Aprenda os programas de design para criar peças e identidades visuais para empresas."},
 {q:"Quem lidera equipes e cuida dos resultados de uma loja ou setor?",o:["Gerente ou Supervisor","Técnico em Óptica","Barbeiro","Piloto de drone"],c:"Formação de Gerentes e Supervisores",i:"Liderança, gestão de equipes, metas e comunicação para crescer na carreira."},
 {q:"Quem faz o design de sobrancelhas e a extensão de cílios?",o:["Designer de sobrancelhas","Técnico em Contabilidade","Técnico em Logística","Técnico em RH"],c:"Design de Sobrancelhas e Extensão de Cílios",i:"Área da beleza com alta procura e ótima para empreender."},
];
