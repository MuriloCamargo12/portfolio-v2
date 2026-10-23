export const profile = {
  name: "Murilo Camargo",
  username: "MuriloCamargo12",
  role: "Desenvolvedor full stack júnior",
  location: "Tatuí, SP",
  available: true,
  status: "Buscando a primeira oportunidade",
  email: "",
  github: "https://github.com/MuriloCamargo12",
  linkedin: "https://www.linkedin.com/in/murilo-camargo-morais-9b94463b2/",
  about: [
    "Tenho 23 anos, moro em Tatuí, SP, e estudo Desenvolvimento Web pela Formação DEV da Cod3r desde janeiro de 2025. O jeito que eu aprendo é simples: estudo um assunto e transformo em projeto, no front e no back.",
    "No front eu monto a interface com React, Next.js, TypeScript e Tailwind. No back, a API fica com Node.js, Express e NestJS, e os dados ficam no MySQL. O que mais pratico é componentizar a tela, autenticar o usuário e ligar as duas pontas.",
    "O EventHub é o projeto em que mais pratiquei o caminho inteiro: a pessoa busca um evento, reserva uma vaga e o organizador marca presença. No GitHub também estão o Estoque, o MineShop e o CineSearch, além de experimentos menores, como o Weather e o gerador de CPF.",
    "Busco a primeira oportunidade como desenvolvedor júnior, remoto. Quero entrar num time, colocar o que já construí em prática e continuar estudando. Também comecei o bootcamp de cibersegurança do Santander, em parceria com a DIO.",
  ],
  stack: [
    "TypeScript",
    "JavaScript",
    "React",
    "Next.js",
    "Tailwind CSS",
    "Node.js",
    "Express",
    "NestJS",
    "MySQL",
  ],
  experience: [],
  education: [
    {
      period: "jan 2025 — agora",
      title: "Desenvolvimento Web",
      place: "Cod3r",
    },
  ],
};

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
