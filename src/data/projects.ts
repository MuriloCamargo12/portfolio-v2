export type Project = {
  slug: string;
  name: string;
  summary: string;
  about: string;
  built: string;
  stack: string[];
  demo: string | null;
  repo: string | null;
  image?: string;
  featured?: boolean;
  example?: boolean;
};

export const projects: Project[] = [
  {
    slug: "eventhub",
    name: "EventHub",
    summary:
      "Site de eventos para encontrar um evento, reservar um lugar e o organizador marcar presença.",
    about:
      "Uma versão enxuta de um site de eventos. A pessoa vê a lista, filtra por cidade, categoria e data, abre o evento e reserva um lugar. O organizador cria o próprio evento, vê quem reservou e marca presença.",
    built:
      "O site é Next.js e a API é NestJS, com Prisma e MySQL. A sessão fica num cookie HttpOnly, e o token fica numa tabela de sessões. Cada pessoa tem uma reserva por evento. Cancelar não apaga a linha: o status vira cancelled e a vaga volta.",
    stack: ["Next.js", "TypeScript", "NestJS", "Prisma", "MySQL"],
    demo: null,
    repo: "https://github.com/MuriloCamargo12/EventHub",
    featured: true,
  },
  {
    slug: "estoque",
    name: "Estoque",
    summary: "Controle de estoque com produtos, entradas, saídas e um painel do que está ativo.",
    about:
      "Aplicação para cadastrar produtos, acompanhar a quantidade e ver o histórico de entradas e saídas. O painel mostra quantos produtos estão ativos, o total de itens e o valor do estoque.",
    built:
      "O frontend é Next.js e a API é Express, com Prisma e MySQL. Cada alteração de quantidade grava um movimento de entrada ou saída. O login usa JWT de 7 dias e a senha fica com hash. Cada usuário só acessa os próprios produtos.",
    stack: ["Next.js", "TypeScript", "Node.js", "Express", "Prisma", "MySQL"],
    demo: null,
    repo: "https://github.com/MuriloCamargo12/Estoque",
    image: "/projetos/estoque.png",
    featured: true,
  },
  {
    slug: "mineshop",
    name: "MineShop",
    summary: "Loja com tema de Minecraft, carrinho e pagamento em Pix.",
    about:
      "Loja virtual com tema de Minecraft. Dá para filtrar os produtos, montar o carrinho e gerar um pagamento em Pix.",
    built:
      "Feito com Next.js, React e Tailwind. O carrinho fica no localStorage e é compartilhado por contexto. O QR Code do Pix é montado no navegador, com a chave configurada no ambiente.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    demo: "https://mine-shop-mu.vercel.app/",
    repo: "https://github.com/MuriloCamargo12/MineShop",
    image: "/projetos/mineshop.jpg",
    featured: true,
  },
  {
    slug: "cinesearch",
    name: "CineSearch",
    summary: "Busca de filmes e séries, com sinopse, nota e data de lançamento.",
    about:
      "Busca filmes e séries no The Movie Database. A tela mostra sinopse, nota e data de lançamento, e avisa quando a busca falha ou não encontra nada.",
    built:
      "Next.js com App Router. Filmes, séries, desenhos e lançamentos passam por rotas da própria aplicação, então a chave da API fica no servidor. O detalhe abre num modal.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    demo: "https://cine-search.vercel.app/",
    repo: "https://github.com/MuriloCamargo12/CineSearch",
    image: "/projetos/cinesearch.jpg",
    featured: true,
  },
  {
    slug: "elite-barber-club",
    name: "Elite Barber Club",
    summary: "Página de uma barbearia, com serviços, horários e contato.",
    about:
      "Landing page de uma barbearia. Mostra os serviços, os horários e um caminho direto para falar com o estabelecimento.",
    built:
      "Uma página em Next.js e Tailwind, separada por seções. As animações entram no scroll, e o botão de contato abre o WhatsApp.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    demo: "https://elite-barber-club.vercel.app/",
    repo: "https://github.com/MuriloCamargo12/Elite-Barber-Club",
    image: "/projetos/elite-barber-club.jpg",
  },
  {
    slug: "weather",
    name: "Weather",
    summary: "Consulta a previsão do tempo de uma cidade.",
    about: "A pessoa digita uma cidade e vê a previsão do tempo daquele lugar.",
    built:
      "Next.js. A página chama uma rota interna, e essa rota consulta a OpenWeatherMap com a chave no servidor. A resposta vem em português e em graus Celsius. Cidade inexistente volta como erro.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    demo: "https://weather-psi-khaki-35.vercel.app/",
    repo: "https://github.com/MuriloCamargo12/Weather",
    image: "/projetos/weather.jpg",
  },
  {
    slug: "fraseando",
    name: "Fraseando",
    summary: "Gera uma frase aleatória, traduz para português e deixa favoritar.",
    about:
      "Gera uma frase aleatória, traduz do inglês para o português, deixa favoritar e compartilhar no WhatsApp.",
    built:
      "Next.js. A frase e a tradução passam por rotas da aplicação, usando as APIs ZenQuotes e Langbly. Favoritos e a opção de traduzir ficam no localStorage.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    demo: "https://fraseando-six.vercel.app/",
    repo: "https://github.com/MuriloCamargo12/fraseando",
    image: "/projetos/fraseando.jpg",
  },
  {
    slug: "gerador-de-senhas",
    name: "Gerador de senhas",
    summary: "Monta uma senha aleatória e mostra a força numa barra.",
    about: "Gera uma senha aleatória no tamanho escolhido e mostra a força numa barra.",
    built:
      "Next.js. A geração fica numa classe que junta números, maiúsculas, minúsculas e especiais conforme as opções marcadas. A barra marca fraca, média ou forte pelo tamanho e pela variedade de caracteres.",
    stack: ["Next.js", "React", "TypeScript"],
    demo: "https://gerador-senhas-eta-two.vercel.app/",
    repo: "https://github.com/MuriloCamargo12/Gerador-Senhas",
    image: "/projetos/gerador-de-senhas.jpg",
  },
  {
    slug: "to-do-list",
    name: "To-do list",
    summary: "Lista para criar, concluir e apagar tarefas.",
    about: "Página para adicionar uma tarefa, marcar como concluída e apagar.",
    built:
      "HTML, CSS e JavaScript. O script cria cada item na página: concluir muda a cor, e excluir remove o item da lista.",
    stack: ["HTML", "CSS", "JavaScript"],
    demo: "https://murilocamargo12.github.io/to-do-list/",
    repo: "https://github.com/MuriloCamargo12/to-do-list",
    image: "/projetos/to-do-list.jpg",
  },
  {
    slug: "cpf",
    name: "CPF",
    summary: "Gera um CPF válido e confere se um número informado é válido.",
    about: "Gera um CPF válido e verifica se um número informado é válido ou inválido.",
    built:
      "HTML, CSS e JavaScript. Com 9 dígitos, a página calcula os dois verificadores e completa o número. Com 11, só diz se o CPF é válido.",
    stack: ["HTML", "CSS", "JavaScript"],
    demo: "https://murilocamargo12.github.io/CPF/",
    repo: "https://github.com/MuriloCamargo12/CPF",
    image: "/projetos/cpf.png",
  },
  {
    slug: "portfolio",
    name: "Portfólio",
    summary: "Primeiro site pessoal, com início, sobre e projetos na mesma página.",
    about: "Primeiro site pessoal, com a apresentação, um texto sobre mim e a lista de projetos.",
    built:
      "Uma página em Next.js e Tailwind, com cabeçalho, as seções e o rodapé. Este desktop é a versão seguinte.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    demo: "https://portfolio-seven-tau-ekxdszr48t.vercel.app/",
    repo: "https://github.com/MuriloCamargo12/Portfolio",
    image: "/projetos/portfolio.jpg",
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
