import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Se for publicar em GitHub Pages num repositório chamado, por exemplo,
// "sabor-e-brasa-app", troque a linha "base" abaixo para "/sabor-e-brasa-app/".
// Se for publicar no Firebase Hosting ou Vercel/Netlify, pode deixar "/".
export default defineConfig({
  plugins: [react()],
  base: "/",
});
