# Afaz Explains — homepage starter

A bespoke navy, champagne-gold and white **homepage only**, designed for desktop, tablet and mobile.

It is built for **Cloudflare Pages** and **Pages CMS**. The text and images are managed through Pages CMS after the code is uploaded to GitHub and connected to Cloudflare. No paid template or website builder is needed.

## Included

- `content/homepage.json` — all editable text, services, highlights, main photographs and contact links.
- `.pages.yml` — sets up the Pages CMS editor for that file and image uploads. **Keep this hidden-dot file in the root of your GitHub repository.**
- `build.mjs` — creates a fast, static HTML homepage from the editor content; no third-party dependencies.
- `public/styles.css` — the navy/gold website design and responsive layouts.
- `public/site.js` — mobile menu.
- `public/media/` — example hero and about photographs cropped from the reference mock-up.
- `dist/` — an already-built copy of the homepage, created by running the build command. This folder can be deleted; Cloudflare automatically rebuilds it.

## A. Put the files in GitHub

1. Sign in or create a free account at **https://github.com**.
2. Create a repository named `afaz-explains` (private is fine). Do not initialize it with a README if you plan to upload the entire project.
3. Unzip this package. Upload the files **with their folder structure intact**, including `.pages.yml`, `build.mjs`, `package.json`, `content/` and `public/`. You do not need to upload `dist/`.
4. To upload through a web browser, use the GitHub repository's **Add file → Upload files** facility. If dragging folders does not preserve them in your browser, use the free **GitHub Desktop** app to publish the unzipped folder instead (https://desktop.github.com/).
5. Check that your GitHub repository shows `.pages.yml` at its top level and the content file under `content/homepage.json`.

## B. Publish through Cloudflare Pages

1. In Cloudflare, open **Workers & Pages → Create application**.
2. Select **Pages** (or **Import an existing Git repository** / **Connect to Git**, depending on your account's current UI).
3. Authorize GitHub if asked, and choose the `afaz-explains` repository.
4. Set the following settings exactly:
   - **Framework preset:** None
   - **Production branch:** `main` (or the actual repository default branch)
   - **Build command:** `node build.mjs`
   - **Build output directory:** `dist`
   - **Root directory:** `/` (repository root)
5. Deploy. Cloudflare gives you a free `*.pages.dev` preview address.
6. Keep your GoDaddy domain pointed where it is until you've reviewed the Cloudflare preview. You can connect it under **Custom domains** later.

**Important:** use the **Git integration** route, not only Cloudflare's direct file-upload route. Automatic republishing from Pages CMS needs Cloudflare to be connected to the GitHub repository.

## C. Enable the editing dashboard (Pages CMS)

1. Go to **https://app.pagescms.org/**.
2. Sign in with your **GitHub account** (this is separate from the Gmail login you use for Cloudflare).
3. Approve the Pages CMS GitHub App for the `afaz-explains` repository.
4. Open the repository in Pages CMS. It will automatically find `.pages.yml`.
5. Choose **Homepage**. You'll have sections for website title, brand, top banner, services, highlights, About, editorial statement, booking/contact and footer.
6. Change a text field, then **Save**. Pages CMS commits the edit to GitHub, and Cloudflare deploys a fresh version automatically.

**If the editor asks you to create `.pages.yml`, check that this file was uploaded to the root of the repo.** It has already been supplied.

## D. Before making your website public

The starting design includes sample wording and illustration-style photographs but no fabricated testimonials.

In **Pages CMS → Homepage → Booking & contact**, add your real:

- `booking_url` (full `https://` address to your calendar or booking system), and/or
- `email` (the business contact address), and optionally
- `phone`.

Until at least one of these has been added, booking buttons jump to a contact section with a temporary notice. **No appointments, payments or messages can be collected by the current version.** This homepage has no form or payment processing.

Check your service wording, business information and images. There is intentionally no legal-compliance claim or invented professional accreditation. Confirm that you have the correct privacy notice and terms before collecting personal information with any future form or booking system.

Once the site is ready, go to **Pages CMS → Homepage → Website & search settings** and enable **Allow search engines to index this website**. It is **off by default** while the site is a draft.

## E. Changing the design later

Pages CMS edits content and media, not the exact layout. To adjust spacing, colours or page structure, update `public/styles.css` or `build.mjs`, or ask ChatGPT to revise these files. The same site works across mobile, tablet and desktop automatically.

## F. Optional local preview / test

If Node.js is installed, in the project folder run:

```
node build.mjs
```

Serve the `dist` folder with any static web server or publish to Cloudflare to see the latest version. The site is a plain static webpage; no dependency installation is required.

---

Note: the two example photographs have been cropped from the visual concept shared in this conversation. They are placeholders and can be replaced in Pages CMS with your own business-approved images.
