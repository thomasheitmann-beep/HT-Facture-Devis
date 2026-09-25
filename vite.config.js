import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    react(),
    // exceljs (utilisé pour l'export du classeur de suivi complet) est conçu
    // pour Node.js et s'attend à trouver Buffer/process/etc. même dans son
    // bundle "navigateur" — ce plugin fournit ces polyfills pour que le
    // build Vite ne plante pas dessus.
    nodePolyfills({
      globals: { Buffer: true, global: true, process: true },
    }),
  ],
});
