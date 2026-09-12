# Sabor & Brasa / Neve e Sabor — App de Delivery

Projeto React (Vite) já conectado ao Firestore do projeto Firebase `sabor-e-brasa`.

## 1. Rodar localmente

```bash
npm install
npm run dev
```

Abra o endereço que aparecer no terminal (normalmente `http://localhost:5173`).

## 2. Ativar o Firestore (uma vez só)

No [Firebase Console](https://console.firebase.google.com/u/0/project/sabor-e-brasa/overview):

1. Vá em **Build → Firestore Database → Create database** (se ainda não tiver criado).
2. Escolha uma região (ex: `southamerica-east1`) e crie em **modo de teste** por enquanto.
3. Em **Firestore → Rules**, você pode colar o conteúdo do arquivo `firestore.rules` deste projeto (ele já libera leitura/escrita na coleção `appdata`, que é onde o app guarda tudo).

## 3. Subir para o GitHub

```bash
git init
git add .
git commit -m "App com Firebase"
git branch -M main
git remote add origin <URL_DO_SEU_REPOSITORIO>
git push -u origin main
```

O `.gitignore` já evita subir a pasta `node_modules`.

> **Atenção:** ao publicar no GitHub, a configuração do Firebase (`src/firebase.js`) fica visível pra qualquer um. Isso é normal em apps Firebase (essa chave não é "secreta" como uma senha), mas quem protege seus dados de verdade são as **regras do Firestore** — por isso o passo 2 é importante antes de divulgar o link do app.

## 4. Publicar o site (deixar acessível por um link)

Subir pro GitHub **não** coloca o site no ar sozinho — GitHub só guarda os arquivos. Escolha uma opção pra publicar:

### Opção A — Firebase Hosting (mais simples, já que você já usa Firebase)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# quando perguntar a pasta pública, use: dist
# quando perguntar se é single-page app, responda: yes
npm run build
firebase deploy --only hosting
```

### Opção B — GitHub Pages

1. No `vite.config.js`, troque `base: "/"` para `base: "/NOME-DO-SEU-REPOSITORIO/"`.
2. `npm install -D gh-pages`
3. Adicione em `package.json` → `"scripts"`: `"predeploy": "npm run build", "deploy": "gh-pages -d dist"`
4. `npm run deploy`
5. Ative o GitHub Pages nas configurações do repositório, apontando pra branch `gh-pages`.

### Opção C — Vercel ou Netlify

Basta conectar o repositório do GitHub direto no painel da Vercel/Netlify — eles detectam Vite automaticamente (build command `npm run build`, output `dist`).

## Estrutura do projeto

```
├── index.html
├── package.json
├── vite.config.js
├── firestore.rules
└── src/
    ├── main.jsx        → ponto de entrada do React
    ├── firebase.js     → configuração/inicialização do Firebase
    └── delivery-app.jsx → o app inteiro (loja, carrinho, painel admin)
```
