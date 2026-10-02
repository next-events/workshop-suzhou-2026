# NExT++ 2026 Workshop · Suzhou

An independent Suzhou edition based on [next-events/workshop-dec-2024](https://github.com/next-events/workshop-dec-2024). The original Jekyll/Liquid layout-and-includes structure and conference theme are retained. A short campus banner and compact, continuous information sections follow the 2024 site's reading order: introduction, registration, hotel, program, organizers, sponsors and location. The responsive layout uses the official NExT++ logo and updated Suzhou event information.

## Preview locally

Requires Node.js 20 or newer.

```sh
npm ci
npm run dev
```

Open http://localhost:4173. Source changes rebuild automatically; refresh the browser to see them. Stop the server with Ctrl-C. Set `PORT=4180` if port 4173 is occupied.

## Edit content

The desktop layout pairs section headings with compact content columns. Section boundaries use 96px spacing (68px on mobile), while hotel rows and the program table remain compact. A shared event strip below the campus cover presents the date, location and invitation status. CSS and JavaScript URLs are content-versioned to avoid stale updates.

- `_config.yml`: edition, year, dates, venue, hotel addresses and invitation wording.
- `_includes/`: overview, registration, venue/map, hotel, program and organizer sections.
- `_layouts/home.html`: page structure, cover and footer.
- `assets/css/site.css`: desktop/mobile layout and visual style.
- `assets/img/`: local campus photographs and official campus map.

The attachment states October 27–28 for the venue and October 26–27 / October 28 for the hotels, without a year. **2026** is used because the request says “this year.” The research theme is retained from the source project. If the year changes, also update the weekday labels in `program`.

The detailed agenda, organizing committee and sponsors are pending. Previous-edition organizers and sponsors are not presented as confirmed participants for this year. Registration intentionally has no form or invented contact address; it states that invitations and registration details will follow by email.

## Build and publish

```sh
npm run check
npm run build
```

The check command validates current branding, section order, invitation-only registration, anchor targets and local asset paths for both local and GitHub Pages builds.

`_site/` is the complete static website; no server or runtime is required in production. All images, CSS and JavaScript are local. Map links open Baidu Maps searches; the official campus map remains visible without a third-party map service.

For a repository-path deployment, use:

```sh
SITE_BASEURL=/workshop-suzhou-2026 npm run build
```

The deployment target is `next-events/workshop-suzhou-2026`, with the expected Pages address `https://next-events.github.io/workshop-suzhou-2026/` after a successful deployment. In the new repository, choose **Settings → Pages → Source → GitHub Actions**. The included workflow builds and deploys updates to `main` automatically using the repository's Pages path. The original 2024 repository remains separate.

The templates can also be built with Jekyll (`bundle install`, then `bundle exec jekyll serve`). Node is the tested preview and deployment path.

## Provenance

See [SOURCES.md](SOURCES.md) for the attachment transcription, upstream revision, image URLs and assumptions. Upstream code is CC0; university photographs and maps retain their owners' rights and are credited separately.
