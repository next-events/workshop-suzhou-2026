import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { build, root } from "./build.mjs";

const originalBase = process.env.SITE_BASEURL;
try {
  for (const base of ["", "/workshop-suzhou-2026"]) {
    process.env.SITE_BASEURL = base;
    await build();
    const html = await readFile(path.join(root, "_site/index.html"), "utf8");
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(ids.length, new Set(ids).size, "IDs must be unique");
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert(html.includes('<h1 id="hero-title">Agentic AI</h1>'), "Use this year's Agentic AI theme");
    assert(!/Responsible AI|Large Foundation Models/.test(html), "Remove the previous edition's theme everywhere");
    assert(!/NExT(?!\+\+)/.test(html), "Use the correct NExT++ name");
    assert(!/Soochow|Singapore/.test(html), "Use current Suzhou event details");
    assert(!/{{|{%/.test(html), "All Liquid templates must be rendered");
    assert(html.includes("Invitations and registration details will be sent by email"));
    assert(!/<form\b/.test(html), "Registration remains invitation-only");
    const sections = [...html.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map((match) => match[1]);
    assert.deepEqual(sections, ["summary", "registration", "hotel", "schedule", "organizer", "sponsors", "location"]);
    assert.equal((html.match(/class="hotel-row"/g) || []).length, 2);
    assert.equal((html.match(/data-copy=/g) || []).length, 3);
    assert(/site\.css\?v=[a-f0-9]{12}"/.test(html), "Version styles by content to prevent stale browser caches");
    assert(/site\.js\?v=[a-f0-9]{12}"/.test(html), "Version interactions by content to prevent stale browser caches");
    assert(html.includes('class="container event-strip"'), "Keep essential event facts directly below the cover");
    assert(html.includes('class="hero-visual"'), "Reserve a separate image area for the Suzhou cityscape");
    assert.equal((html.match(/suzhou-jinji-lake\.jpg/g) || []).length, 3, "Use the Suzhou city photograph for the cover, preload and social preview");
    assert(!html.includes('suzhou-campus-name-stone.jpg'), "The cover now represents Suzhou city rather than the university");
    assert(html.includes('CC BY-SA 4.0') && html.includes('铁头娃蛤蛤'), "Keep the city photograph's author and license attribution");
    assert(!html.includes('hero-attribution'), "Keep the attribution line off the cover");
    assert(/<details class="photo-credits"><summary>Photo credits<\/summary>/.test(html), "Keep photo credits in a collapsed footer disclosure");
    assert(html.includes('nanyong-building.jpg') && html.includes('campus-map.jpg'), "Keep the university's venue photo and campus map");
    assert.equal((html.match(/class="section-heading"/g) || []).length, 7);
    assert(html.includes('class="hero-actions"'), "Keep useful cover links to venue and participation details");
    assert(html.includes('class="map-heading"'), "Label the venue map clearly");
    assert(html.includes('manrope-variable.ttf'), "Preload the locally hosted typeface");
    assert((await stat(path.join(root, "assets/fonts/manrope-variable.ttf"))).size > 0);
    assert((await readFile(path.join(root, "assets/fonts/OFL-Manrope.txt"), "utf8")).includes("SIL OPEN FONT LICENSE"));
    assert.equal(await readFile(path.join(root, "README.md"), "utf8"), "# NExT++ 2026 Workshop · Suzhou\n", "Keep the user's title-only README");
    for (const [, href] of html.matchAll(/\bhref="(#[^"]+)"/g)) {
      assert(ids.includes(href.slice(1)), `Missing anchor target: ${href}`);
    }
    for (const [, asset] of html.matchAll(/(?:src|href)="(\/[^"#]+)"/g)) {
      assert(asset.startsWith(`${base}/assets/`), `Incorrect asset base: ${asset}`);
      const target = path.join(root, "_site", asset.split("?")[0].slice(base.length));
      assert((await stat(target)).size > 0, `Missing or empty asset: ${target}`);
    }
    console.log(`Content, anchors and asset checks passed (${base || "/"}).`);
  }
} finally {
  if (originalBase === undefined) delete process.env.SITE_BASEURL;
  else process.env.SITE_BASEURL = originalBase;
  await build();
}
