# KnowSphere starter website

This is the first visual and functional prototype of KnowSphere.

## What works now
- Responsive homepage for phones and computers.
- Search across six sample KnowSphere articles.
- External topic search using the public Wikipedia API.
- Image discovery using the public Wikimedia Commons API.
- Category shortcuts.
- No API key is required for these public Wikimedia endpoints.

## Important limitations
- This is a prototype, not a complete encyclopedia.
- The six local articles are starter examples only.
- External Wikipedia results open on Wikipedia; they are not copied into KnowSphere.
- Wikimedia Commons images link to their original file pages. Always review the individual license and attribution requirements before reusing an image.
- There is no admin dashboard or database yet. The next development phase will add an admin-only content management system.
- Search depends on the visitor's internet connection and the availability/terms of the external Wikimedia services.

## Publish free with Cloudflare Pages
1. Create or sign in to a GitHub account.
2. Create a new public repository named `knowsphere`.
3. Upload `index.html`, `styles.css`, `app.js`, and this README to the repository's root.
4. Sign in to Cloudflare and open Workers & Pages.
5. Choose Create application → Pages → Connect to Git.
6. Select your `knowsphere` GitHub repository.
7. For a plain HTML site, leave the build command empty and set the output directory to `/` (the repository root), if prompted.
8. Deploy. Cloudflare will provide a public `*.pages.dev` address.

## Roadmap
1. Prototype homepage and discovery search (this package).
2. Article system: structured articles, references, categories, related topics.
3. Admin-only publishing workflow and content database.
4. Improved search: filters, spelling support, article ranking, image attribution.
5. Reliability, accessibility, backups, moderation and performance.
6. Optional domain name and future expansion.

Keep the site owner-only for publishing. Do not add public editing until moderation and account security are ready.
