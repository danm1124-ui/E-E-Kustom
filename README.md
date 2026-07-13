# E&E Kustom — Autobody Shop Website

A Node.js/Express site for E&E Custom, built around a speedometer-shaped
navigation gauge. The needle rotates to point at whichever page you're on,
and "Leave a Review" sits in the dial's redline zone.

## Pages

- `/` — Home
- `/team` — Our Team
- `/projects` — Projects
- `/contact` — Contact Us (working form, logs submissions to the console)
- `/review` — Leave a Review (working form with a star rating, appends to an in-memory list)

## Run it locally

```bash
npm install
npm start
```

Then open http://localhost:3000

For auto-reload during development:

```bash
npm install
npm run dev
```

## Notes / next steps

- **Data is in-memory.** Team members, projects, and reviews live in arrays
  inside `server.js`. Swap in a real database (Postgres, SQLite, MongoDB,
  whatever fits) when you're ready to persist real content.
- **Contact form** currently just logs to the console — wire it up to an
  email service (e.g. Nodemailer, SendGrid, Resend) in the `POST /contact`
  route in `server.js`.
- **Shop address/phone/hours** in the footer (`views/partials/footer.ejs`)
  are placeholders — update with the real info.
- **Team photos**: the team page currently uses initials avatars. Drop real
  photos into `public/images/team/` and swap the `.avatar` divs in
  `views/team.ejs` for `<img>` tags.
- **The gauge nav** is pure inline SVG generated server-side in
  `views/partials/header.ejs` — all the geometry (tick marks, labels,
  needle angle) is computed from a small set of constants at the top of
  that file, so you can add/remove/reposition links by editing the `NAV`
  array in `server.js` and the angles there.

## Project structure

```
server.js               Express app + routes + page data
views/
  partials/
    header.ejs           Speedometer nav (SVG, computed server-side)
    footer.ejs
  index.ejs, team.ejs, projects.ejs, contact.ejs, review.ejs, 404.ejs
public/
  css/style.css          Brand tokens + all styling
  js/main.js             Star-rating widget behavior
  images/ee_custom_logo.svg
```
# E-E-Kustom
