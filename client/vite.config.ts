import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import path from "node:path";
import net from "node:net";

const PORTS_FILE = path.resolve(__dirname, "..", ".ports.json");

function readPortsIfPresent(): { serverUrl: string } | null {
  if (!fs.existsSync(PORTS_FILE)) return null;
  try {
    return JSON.parse(fs.readFileSync(PORTS_FILE, "utf8"));
  } catch {
    return null;
  }
}

function probeFreePort(min = 30000, max = 60000, tries = 30): Promise<number> {
  const rand = () => Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const tryOne = () => {
      if (attempts++ >= tries) return reject(new Error("no free port"));
      const port = rand();
      const srv = net.createServer();
      srv.unref();
      srv.once("error", () => tryOne());
      srv.once("listening", () => srv.close(() => resolve(port)));
      srv.listen(port, "0.0.0.0");
    };
    tryOne();
  });
}

export default defineConfig(async ({ command }) => {
  const isBuild = command === "build";

  // For PROD builds, default API URL is "" (same-origin). For dev, read .ports.json.
  let serverUrl = "";
  let devPort: number | undefined;

  if (!isBuild) {
    const ports = readPortsIfPresent();
    if (!ports) {
      throw new Error(
        "Server not running. Start the server first (it writes .ports.json).\n" +
          "From repo root: `npm run dev` (or `cd server && npm run dev`)."
      );
    }
    serverUrl = ports.serverUrl;
    devPort = await probeFreePort();
    setTimeout(() => {
      console.log("\n" + "═".repeat(56));
      console.log(`  🟣 PrepNxt client on http://localhost:${devPort}`);
      console.log(`     API → ${serverUrl}`);
      console.log("═".repeat(56) + "\n");
    }, 250);
  }

  return {
    plugins: [react(), tailwindcss()],
    server: devPort
      ? { port: devPort, strictPort: true, host: "localhost" }
      : undefined,
    define: {
      __API_URL__: JSON.stringify(serverUrl),
    },
    build: {
      outDir: "dist",
      sourcemap: false,
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks: {
            "vendor-react": ["react", "react-dom", "react-router-dom"],
            "vendor-monaco": ["@monaco-editor/react"],
            "vendor-mermaid": ["mermaid"],
            "vendor-pdf": ["jspdf", "html2canvas"],
            "vendor-markdown": ["react-markdown", "remark-gfm", "rehype-highlight"],
          },
        },
      },
    },
  };
});
