import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configurado para o repositório do GitHub: melotechdev-sudo/sabor-brasa
// Publicando em GitHub Pages, a URL fica: https://melotechdev-sudo.github.io/sabor-brasa/
export default defineConfig({
  plugins: [react()],
  base: "/sabor-brasa/",
});
