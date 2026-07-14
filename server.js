const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// In-memory store for demo review submissions (swap for a real DB later)
const reviews = [
  { name: 'Marcus D.', rating: 5, text: 'These guys brought my \'67 Camaro back from the dead. Paint match is flawless.' },
  { name: 'Priya S.', rating: 5, text: 'Fast, honest, and the attention to detail on the bodywork was next level.' },
  { name: 'Tommy R.', rating: 4, text: 'Great custom paint job, scheduling took a little longer than quoted but worth the wait.' }
];

const team = [
  { name: 'Ray Estrada', role: 'Founder & Master Fabricator', initials: 'RE' },
  { name: 'Elena Cho', role: 'Co-Founder & Paint Specialist', initials: 'EC' },
  { name: 'Dutch Malone', role: 'Frame & Chassis Lead', initials: 'DM' },
  { name: 'Sofia Reyes', role: 'Interior & Upholstery', initials: 'SR' }
];

const projects = [
  { title: "'67 Chevy Camaro SS", tag: 'Full Restomod', desc: 'Frame-off restoration, LS3 swap, custom candy-red paint.' },
  { title: "'72 Ford Bronco", tag: 'Off-Road Custom', desc: 'Widebody fenders, roll cage, matte olive wrap.' },
  { title: "'59 Cadillac Coupe DeVille", tag: 'Classic Restoration', desc: 'Period-correct bodywork with a modern air-ride suspension.' },
  { title: "'93 Mazda RX-7", tag: 'Show Car Build', desc: 'Widebody kit, pearl-white paint, competition livery.' }
];

const DASHBOARD_USER = 'admin';
const DASHBOARD_PASS = 'ee123';

// route -> gauge angle (degrees) for the speedometer nav needle
const NAV = [
  { key: 'home', label: 'HOME', href: '/', angle: 90 },
  { key: 'team', label: 'OUR TEAM', href: '/team', angle: 150 },
  { key: 'projects', label: 'PROJECTS', href: '/projects', angle: 110 },
  { key: 'contact', label: 'CONTACT US', href: '/contact', angle: 70 },
  { key: 'review', label: 'LEAVE A REVIEW', href: '/review', angle: 30 }
];

function render(res, view, opts = {}) {
  res.render(view, { nav: NAV, active: opts.active || 'home', title: opts.title || 'E&E Custom', ...opts });
}

function getCookie(req, name) {
  const header = req.headers.cookie || '';
  const pairs = header.split(';').map((c) => c.trim());
  const match = pairs.find((entry) => entry.startsWith(`${name}=`));
  if (!match) return null;
  return decodeURIComponent(match.split('=').slice(1).join('='));
}

function requireDashboardAuth(req, res, next) {
  if (getCookie(req, 'ee_dashboard_auth') === 'true') {
    return next();
  }
  return res.redirect('/dashboard/login');
}

app.get('/', (req, res) => {
  render(res, 'index', { active: 'home', title: 'E&E Custom | Classic. Bold. Kustom.' });
});

app.get('/team', (req, res) => {
  render(res, 'team', { active: 'team', title: 'Our Team | E&E Custom', team });
});

app.get('/projects', (req, res) => {
  render(res, 'projects', { active: 'projects', title: 'Projects | E&E Custom', projects });
});

app.get('/dashboard/login', (req, res) => {
  render(res, 'dashboard-login', { active: 'projects', title: 'Sign In | E&E Custom', error: false });
});

app.post('/dashboard/login', (req, res) => {
  const username = (req.body.username || '').trim();
  const password = (req.body.password || '').trim();

  if (username === DASHBOARD_USER && password === DASHBOARD_PASS) {
    res.setHeader('Set-Cookie', 'ee_dashboard_auth=true; Path=/; HttpOnly; Max-Age=3600; SameSite=Lax');
    return res.redirect('/dashboard/projects');
  }

  render(res, 'dashboard-login', { active: 'projects', title: 'Sign In | E&E Custom', error: true });
});

app.get('/dashboard/projects', requireDashboardAuth, (req, res) => {
  const added = req.query.added === '1';
  render(res, 'dashboard-projects', { active: 'projects', title: 'Project Dashboard | E&E Custom', projects, added });
});

app.post('/dashboard/projects', requireDashboardAuth, (req, res) => {
  const title = (req.body.title || '').trim();
  const tag = (req.body.tag || '').trim();
  const desc = (req.body.desc || '').trim();

  if (title && tag && desc) {
    projects.unshift({ title, tag, desc });
    return res.redirect('/dashboard/projects?added=1');
  }

  res.redirect('/dashboard/projects');
});

app.get('/contact', (req, res) => {
  render(res, 'contact', { active: 'contact', title: 'Contact Us | E&E Custom', sent: false });
});

app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  console.log('New contact message:', { name, email, message });
  render(res, 'contact', { active: 'contact', title: 'Contact Us | E&E Custom', sent: true, name });
});

app.get('/review', (req, res) => {
  render(res, 'review', { active: 'review', title: 'Leave a Review | E&E Custom', reviews, sent: false });
});

app.post('/review', (req, res) => {
  const { name, rating, text } = req.body;
  if (name && text) {
    reviews.unshift({ name, rating: Number(rating) || 5, text });
  }
  render(res, 'review', { active: 'review', title: 'Leave a Review | E&E Custom', reviews, sent: true });
});

app.use((req, res) => {
  res.status(404);
  render(res, '404', { active: '', title: '404 | E&E Custom' });
});

app.listen(PORT, () => {
  console.log(`E&E Custom site running at http://localhost:${PORT}`);
});
