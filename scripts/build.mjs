import { readFile, writeFile, mkdir, cp } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Liquid } from "liquidjs";
import { parse } from "yaml";

export const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
export async function build() {
  const site = parse(await readFile(path.join(root, "_config.yml"), "utf8"));
  site.css_version = createHash("sha256")
    .update(await readFile(path.join(root, "assets/css/site.css")))
    .digest("hex")
    .slice(0, 12);
  site.baseurl = (process.env.SITE_BASEURL ?? site.baseurl ?? "").replace(
    /\/$/,
    "",
  );
  if (site.baseurl && !site.baseurl.startsWith("/"))
    site.baseurl = "/" + site.baseurl;
  const engine = new Liquid({
    root: path.join(root, "_includes"),
    extname: ".html",
    strictFilters: true,
  });
  engine.registerFilter(
    "relative_url",
    (value) => `${site.baseurl}/${String(value).replace(/^\//, "")}`,
  );
  const template = await readFile(
    path.join(root, "_layouts/home.html"),
    "utf8",
  );
  const html = await engine.parseAndRender(template, { site });
  await mkdir(path.join(root, "_site"), { recursive: true });
  await writeFile(path.join(root, "_site/index.html"), html);
  await cp(path.join(root, "assets"), path.join(root, "_site/assets"), {
    recursive: true,
  });
  await writeFile(path.join(root, "_site/.nojekyll"), "");
  console.log(
    `Built ${site.title} → _site/ (base path: ${site.baseurl || "/"})`,
  );
  return site;
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  await build();
