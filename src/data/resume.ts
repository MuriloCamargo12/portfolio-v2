export const resume = {
  availability: "Tatuí, SP · Disponível para trabalho remoto",
  summary:
    "Desenvolvedor full stack júnior em formação pela Formação DEV da Cod3r, com 11 projetos pessoais publicados no GitHub. Desenvolvo aplicações web de ponta a ponta com React, Next.js e TypeScript no front-end e Node.js, Express, NestJS e MySQL no back-end, incluindo APIs REST, autenticação com JWT, modelagem de dados com Prisma ORM e deploy na Vercel e na Railway. Busco a primeira oportunidade como desenvolvedor júnior, em regime remoto.",
  skills: [
    {
      label: "Front-end",
      items:
        "HTML5, CSS3, JavaScript, TypeScript, React, Next.js, Tailwind CSS, React Hooks, Context API, design responsivo",
    },
    {
      label: "Back-end",
      items: "Node.js, Express, NestJS, APIs REST, autenticação JWT, bcrypt, cookies HttpOnly",
    },
    { label: "Banco de dados", items: "MySQL, Prisma ORM, modelagem relacional" },
    { label: "Ferramentas", items: "Git, GitHub, Vercel, Railway, Cursor" },
    {
      label: "Boas práticas",
      items: "arquitetura em camadas (Controller, Service e Repository), componentização, variáveis de ambiente",
    },
  ],
  projects: [
    {
      slug: "eventhub",
      title: "EventHub | Plataforma de Eventos Full Stack",
      stack: "Next.js, TypeScript, NestJS, Prisma ORM, MySQL",
      bullets: [
        "Plataforma em que o usuário busca eventos por cidade, categoria e data e reserva uma vaga; o organizador cria eventos, acompanha as reservas e registra a presença.",
        "Implementei autenticação por sessão em cookie HttpOnly, com o token salvo em uma tabela de sessões.",
        "Modelei a regra de uma reserva por pessoa em cada evento; o cancelamento libera a vaga e mantém o histórico.",
      ],
    },
    {
      slug: "estoque",
      title: "Controle de Estoque | Aplicação Full Stack",
      stack: "Next.js, React, TypeScript, Tailwind CSS, Node.js, Express, Prisma ORM, MySQL, JWT",
      bullets: [
        "Desenvolvi a aplicação do banco de dados à interface: CRUD de produtos, histórico de movimentações de entrada e saída e dashboard com produtos ativos, total de itens e valor em estoque.",
        "Implementei autenticação com JWT e hash de senhas com bcrypt, isolando os dados de cada usuário.",
        "Organizei a API em camadas (Controller, Service e Repository), separando rotas, regras de negócio e acesso ao banco.",
      ],
    },
    {
      slug: "mineshop",
      title: "MineShop | E-commerce",
      stack: "Next.js (App Router), React, TypeScript, Tailwind CSS",
      bullets: [
        "Loja virtual responsiva com filtros de produtos e carrinho persistido em localStorage via Context API.",
        "Gerei o QR Code de pagamento Pix no navegador, com a chave em variáveis de ambiente, e publiquei o projeto na Vercel.",
      ],
    },
    {
      slug: "cinesearch",
      title: "CineSearch | Busca de Filmes e Séries",
      stack: "Next.js, React, TypeScript, Tailwind CSS",
      bullets: [
        "Integrei a API do The Movie Database (TMDB) por rotas internas do Next.js, mantendo a chave de API no servidor.",
        "Exibi sinopse, nota e data de lançamento em um modal, com tratamento de erro e de buscas sem resultado.",
      ],
    },
  ],
  otherProjects:
    "Weather (API OpenWeatherMap), Fraseando (APIs ZenQuotes e Langbly), Gerador de Senhas, Elite Barber Club, Gerador e Validador de CPF e To-do List.",
  education: {
    title: "Formação DEV | Desenvolvimento Web",
    place: "Cod3r",
    period: "01/2025 – atual",
  },
  certifications: [
    "Cod3r: React & Next (01/2026), TypeScript (10/2025), Git & GitHub (08/2025), Web: HTML, CSS e JavaScript (08/2025) e Inicial (06/2025)",
    "Santander e DIO: Bootcamp de Cibersegurança (em andamento)",
  ],
};
