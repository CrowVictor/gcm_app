import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  
  // Definir pasta client como raiz
  root: "client",
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@components": path.resolve(__dirname, "client/src/components"),
      "@pages": path.resolve(__dirname, "client/src/pages"),
      "@services": path.resolve(__dirname, "client/src/services"),
      "@mocks": path.resolve(__dirname, "client/src/mocks"),
      "@lib": path.resolve(__dirname, "client/src/lib"),
      "@hooks": path.resolve(__dirname, "client/src/hooks"),
    },
  },
  
  server: {
    port: 3000,
    host: true,
    open: true,
  },
  
  build: {
    // Output para pasta dist na raiz
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: false,
  },
  
  preview: {
    port: 4173,
    host: true,
  },
});