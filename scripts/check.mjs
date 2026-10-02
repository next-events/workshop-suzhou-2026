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
