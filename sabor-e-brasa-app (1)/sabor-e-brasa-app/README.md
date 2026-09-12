# Sabor & Brasa / Neve e Sabor — App de Delivery

Projeto React (Vite) conectado ao Firestore do projeto Firebase `sabor-e-brasa`,
pronto para publicar no GitHub Pages **sem precisar instalar nada no computador**
(o próprio GitHub compila o site pra você).

## Como publicar (só pelo site do GitHub, sem terminal)

### 1. Apague o que já está no repositório

No repositório `melotechdev-sudo/sabor-brasa`, abra o arquivo `index.html` que
você subiu antes, clique no ícone de lixeira e confirme a exclusão (esse
arquivo sozinho não funciona — ele foi feito pra ser compilado pelo Vite).

### 2. Suba TODOS os arquivos e pastas deste projeto

Na página do repositório, clique em **Adicionar arquivo → Fazer upload de arquivos**.
Depois, no seu computador, abra a pasta deste projeto (a que você extraiu do
zip) e **arraste a pasta inteira** (ou selecione tudo dentro dela, incluindo a
pasta `.github`, a pasta `src` e todos os arquivos soltos como `package.json`,
`vite.config.js`, `index.html`) para dentro da área de upload do GitHub.

> Importante: precisa subir a pasta `.github/workflows/deploy.yml` também —
> é ela que compila e publica o site automaticamente a cada envio.

Role até o final da página e clique em **Commit changes** (ou "Confirmar
alterações").

### 3. Ative o GitHub Pages usando GitHub Actions

No repositório, vá em **Settings → Pages**. Em "Build and deployment" →
**Source**, escolha **GitHub Actions** (não "Deploy from a branch"). Salve.

### 4. Acompanhe a publicação

Vá na aba **Actions** do repositório. Vai aparecer um fluxo de trabalho
chamado "Deploy to GitHub Pages" rodando (leva 1–2 minutos). Quando ficar
com um ✅ verde, o site já está no ar.

### 5. Acesse o site

`https://melotechdev-sudo.github.io/sabor-brasa/`

A cada vez que você subir arquivos novos pelo site do GitHub (repetindo o
passo 2), o site é recompilado e atualizado sozinho — não precisa repetir os
passos 3 e 4 de novo.

## Antes de divulgar o link pra clientes de verdade

1. No [Firebase Console](https://console.firebase.google.com/u/0/project/sabor-e-brasa/overview),
   ative o **Firestore Database** (Build → Firestore Database → Create database),
   se ainda não tiver feito isso.
2. Em **Firestore → Rules**, cole o conteúdo do arquivo `firestore.rules`
   deste projeto — sem isso o app não consegue ler/gravar dados.
3. Sua `apiKey` do Firebase (em `src/firebase.js`) vai ficar visível no
   código público — isso é normal em apps Firebase, mas quem protege seus
   dados de verdade são as regras do Firestore do passo acima.

## Estrutura do projeto

```
├── .github/workflows/deploy.yml → compila e publica o site sozinho a cada envio
├── index.html
├── package.json
├── vite.config.js
├── firestore.rules
└── src/
    ├── main.jsx         → ponto de entrada do React
    ├── firebase.js      → configuração/inicialização do Firebase
    └── delivery-app.jsx → o app inteiro (loja, carrinho, painel admin)
```
