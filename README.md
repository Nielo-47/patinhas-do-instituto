<div align="center">
  <img src="public/logo.png" alt="Patinhas do Instituto" width="200"/>

  # 🐾 Patinhas do Instituto

  **Censo felino do IFCE Campus Fortaleza**

  [![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
  [![Instagram](https://img.shields.io/badge/@patinhasdoinstituto-E4405F?logo=instagram&logoColor=white)](https://instagram.com/patinhasdoinstituto)
</div>

---

## 🐱 Sobre o Projeto

O **Patinhas do Instituto** é uma plataforma criada por estudantes, professores e funcionários do **IFCE Campus Fortaleza** comprometidos com a causa animal.

Nosso objetivo é manter um **censo atualizado periodicamente** dos gatos que habitam o campus, facilitando o acompanhamento da saúde, vacinação e castração de cada bichinho — além de promover adoções responsáveis e conectar quem quer ajudar com quem precisa de ajuda. 🏫🐾

### ✨ Funcionalidades

- 📋 **Censo de Gatos** — listagem completa dos felinos do campus com status atualizado
- 🐾 **Perfil individual** — nome, fotos, situação de vacinação, castração e muito mais
- 💛 **Adoção** — formulário de interesse e acompanhamento de pedidos
- 🏅 **Protetores** — cadastro dos voluntários responsáveis pelo cuidado dos animais
- 📊 **Gráficos** — visão estatística da população felina do campus
- 🌹 **Memorial** — homenagem aos gatos que já partiram
- 📸 **Carrossel** — galeria de fotos dos nossos gatinhos
- 💸 **Como Ajudar** — informações sobre doações e apoio via Pix

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Descrição |
|---|---|
| [React 18](https://react.dev/) | Interface de usuário |
| [TypeScript](https://www.typescriptlang.org/) | Tipagem estática |
| [Vite](https://vitejs.dev/) | Bundler e servidor de desenvolvimento |
| [Tailwind CSS](https://tailwindcss.com/) | Estilização utilitária |
| [shadcn/ui](https://ui.shadcn.com/) | Componentes de UI acessíveis |
| [Supabase](https://supabase.com/) | Backend como serviço (banco de dados e autenticação) |
| [React Router](https://reactrouter.com/) | Navegação entre páginas |
| [TanStack Query](https://tanstack.com/query) | Gerenciamento de estado assíncrono |

---

## 🚀 Como Executar Localmente

Pré-requisito: [Node.js](https://nodejs.org/) instalado (recomendamos usar o [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)).

```sh
# 1. Clone o repositório
git clone https://github.com/Nielo-47/patinhas-do-instituto.git

# 2. Acesse a pasta do projeto
cd patinhas-do-instituto

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com as suas credenciais do Supabase

# 4. Instale as dependências
npm install

# 5. Inicie o servidor de desenvolvimento
npm run dev
```

A URL local será exibida no terminal após o comando acima (normalmente [http://localhost:5173](http://localhost:5173)). 🎉

### 🔑 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-supabase-anon-key>
```

> ⚠️ **Nunca commite o arquivo `.env`** — ele já está no `.gitignore`. Use sempre o `.env.example` como referência.

---

## 🤝 Como Contribuir

1. Faça um **fork** do repositório
2. Crie uma branch para sua feature: `git checkout -b minha-feature`
3. Faça o commit das suas alterações: `git commit -m 'feat: minha nova feature'`
4. Envie para o seu fork: `git push origin minha-feature`
5. Abra um **Pull Request** 🚀

> 🔒 A branch `main` é protegida — todos os Pull Requests precisam de ao menos **1 aprovação** do dono do repositório (via [CODEOWNERS](.github/CODEOWNERS)) antes de serem mesclados. Push direto para `main` não é permitido.

---

## 💛 Apoie a Causa

Se você quer ajudar os gatos do campus mas não pode adotar, há outras formas de contribuir:

- 🍽️ **Doação de ração**
- 💊 **Doação de medicamentos**
- 💸 **Doação via Pix** — consulte a chave na seção "Como Ajudar" do site
- 📣 **Divulgação** — siga e compartilhe nosso [Instagram](https://instagram.com/patinhasdoinstituto)

---

<div align="center">
  Feito com 💛 e muito amor pelos protetores do <strong>IFCE Campus Fortaleza</strong> 🐾
</div>
