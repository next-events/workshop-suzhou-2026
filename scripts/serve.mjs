import http from "node:http";
import path from "node:path";
import { readFile, stat } from "node:fs/promises";
import { watch } from "node:fs";
import { build, root } from "./build.mjs";

let site = await build();
const output = path.join(root, "_site");
const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ttf": "font/ttf",
};
const server = http.createServer(async (request, response) => {
  try {
    let urlPath = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    if (
      site.baseurl &&
      !urlPath.startsWith(site.baseurl + "/") &&
      urlPath !== site.baseurl
    ) {
      response.writeHead(302, { Location: `${site.baseurl}/` });
      response.end();
      return;
    }
    if (site.baseurl) urlPath = urlPath.slice(site.baseurl.length);
    let file = path.resolve(output, "." + (urlPath || "/"));
    if (file !== output && !file.startsWith(output + path.sep)) {
      response.writeHead(403);
      response.end();
      return;
    }
    if ((await stat(file)).isDirectory()) file = path.join(file, "index.html");
    response.writeHead(200, {
      "Content-Type": types[path.extname(file)] || "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    response.end(await readFile(file));
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.end("Not found");
  }
});
server.listen(port, "127.0.0.1", () =>
  console.log(`Preview: http://localhost:${port}${site.baseurl}/`),
);
let timer;
let pendingBuild = Promise.resolve();
for (const directory of ["_config.yml", "_includes", "_layouts", "assets"]) {
  watch(
    path.join(root, directory),
    { recursive: directory !== "_config.yml" },
    () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        pendingBuild = pendingBuild
          .then(async () => {
            site = await build();
          })
          .catch((error) => console.error(error.message));
      }, 150);
    },
  );
}
