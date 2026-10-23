# Portfólio

Site pessoal do Murilo Camargo, em formato de área de trabalho. A página abre o `sobre.txt` e, a partir dele, dá para ver os projetos, o currículo, o terminal e os links do GitHub e do LinkedIn.

Feito com Next.js, React, TypeScript e Tailwind CSS.

## Rodar localmente

```bash
npm install
npm run dev
```

Abre em [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

## O que tem na tela

- **Área de trabalho:** ícones arrastáveis, dock, janelas que abrem, fecham, minimizam e maximizam.
- **Arquivos e Navegador:** projetos separados em Principais e Experimentos. Cada um tem texto, stack e, quando a demo está no ar, uma foto da tela.
- **Editor:** `sobre.txt` e `curriculo.pdf`. O currículo da janela não leva telefone nem e-mail.
- **Terminal:** `help` lista os comandos (`whoami`, `ls`, `cat`, `neofetch`, `projetos`, `abrir`, `contato`, `clear`).
- **Barra superior:** relógio, calendário, tema claro/escuro e volume do som de clique.

Atalhos: `Ctrl+Alt+T` abre o terminal e `Alt+Tab` troca a janela ativa.

Abaixo de 1024 px a interface vira a do celular: grade de ícones e janela em tela cheia, com botão de voltar. A partir de 1024 px voltam o dock e as janelas flutuantes.

## Onde editar

| O quê | Arquivo |
| --- | --- |
| Nome, bio, cidade e links | `src/data/profile.ts` |
| Projetos, demos e grupos | `src/data/projects.ts` |
| Texto do currículo da janela | `src/data/resume.ts` |
| Fotos dos projetos | `public/projetos/` |
| Avatar da barra | `public/murilo-avatar.png` |

Um projeto entra na lista ao ganhar um item em `src/data/projects.ts`. `featured: true` coloca ele em Principais. `image` aponta para o arquivo em `public/projetos/`. A rota `/projetos/[slug]` abre esse projeto direto no navegador.
