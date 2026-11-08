const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'portal.db');
const db = new Database(dbPath);

const row = db.prepare("SELECT payload FROM items WHERE collection = 'settings' AND id = 'site'").get();
if (row) {
  const data = JSON.parse(row.payload);
  data.brand = '#0A192F';
  data.brandDark = '#070F1E';
  data.brandSoft = '#F1F5F9';
  data.accent = '#FF5722';
  data.ink = '#0F172A';
  data.muted = '#64748B';
  data.line = '#E2E8F0';
  data.surface = '#FFFFFF';
  data.headerBg = '#0A192F';
  data.headerColor = '#FFFFFF';
  data.backgroundStyle = 'solid';
  data.backgroundValue = '#F8FAFC';
  data.backgroundValue2 = '#EEF2F6';
  data.linkHoverColor = '#FF5722';
  data.radius = '14px';
  db.prepare("UPDATE items SET payload = ? WHERE collection = 'settings' AND id = 'site'").run(JSON.stringify(data));
  console.log('portal.db updated with UI/UX Pro Max palette!');
} else {
  console.log('No settings row found');
}
