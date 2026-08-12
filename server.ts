import express, { Request, Response } from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import fs from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import crypto from 'crypto';

const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;
const ROOT_DIR = process.cwd();
const DB_FILE = path.join(ROOT_DIR, 'kc_website.db');
const ASSETS_DIR = path.join(ROOT_DIR, 'assets');
const ADMIN_TOKEN = 'kc_admin_secret_session_token';
const DEFAULT_PASSWORD = 'kcbandoy2005';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password, 'utf8').digest('hex');
}

function openDb(): sqlite3.Database {
  return new sqlite3.Database(DB_FILE);
}

function run(db: sqlite3.Database, sql: string, params: any[] = []): Promise<sqlite3.RunResult> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
}

function get<T = any>(db: sqlite3.Database, sql: string, params: any[] = []): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row as T);
    });
  });
}

function all<T = any>(db: sqlite3.Database, sql: string, params: any[] = []): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows as T[]);
    });
  });
}

async function saveImageFromBase64(dataUrl: string, filename: string): Promise<string | null> {
  if (!dataUrl || !filename) return null;
  const parts = dataUrl.split(',');
  const encoded = parts.length > 1 ? parts[1] : parts[0];
  const ext = path.extname(filename).toLowerCase() || '.png';
  const allowedExts = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp'];
  const safeExt = allowedExts.includes(ext) ? ext : '.png';
  const safeName = path.basename(filename, ext).replace(/[^a-zA-Z0-9._-]/g, '_');
  const outName = `${safeName}_${Date.now()}${safeExt}`;
  const outPath = path.join(ASSETS_DIR, outName);

  try {
    if (!existsSync(ASSETS_DIR)) {
      mkdirSync(ASSETS_DIR, { recursive: true });
    }
    await fs.writeFile(outPath, Buffer.from(encoded, 'base64'));
    return `assets/${outName}`;
  } catch (error) {
    console.error('Failed saving image:', error);
    return null;
  }
}

async function initDb(): Promise<void> {
  if (!existsSync(ASSETS_DIR)) {
    mkdirSync(ASSETS_DIR, { recursive: true });
  }

  const db = openDb();

  await run(db, `CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT,
    public_name TEXT,
    position TEXT,
    barangay TEXT,
    municipality TEXT,
    province TEXT,
    country TEXT,
    field_of_study TEXT,
    academic_level TEXT,
    career_aspiration TEXT,
    tagline TEXT,
    badge_label TEXT,
    languages TEXT,
    bio TEXT,
    public_email TEXT,
    office_location TEXT,
    facebook_url TEXT,
    instagram_url TEXT,
    photo_url TEXT
  )`);

  await run(db, `CREATE TABLE IF NOT EXISTS admin_auth (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    password_hash TEXT
  )`);

  await run(db, `CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    category TEXT,
    location TEXT,
    date_str TEXT,
    description TEXT,
    objectives TEXT,
    beneficiaries TEXT,
    role TEXT,
    status TEXT,
    verification TEXT,
    image_url TEXT
  )`);

  await run(db, `CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    date_str TEXT,
    location TEXT,
    category TEXT,
    description TEXT,
    role TEXT,
    verification TEXT,
    image_url TEXT
  )`);

  await run(db, `CREATE TABLE IF NOT EXISTS achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    type TEXT,
    organization TEXT,
    year TEXT,
    description TEXT,
    verification TEXT,
    image_url TEXT
  )`);

  await run(db, `CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    caption TEXT,
    category TEXT,
    location TEXT,
    date_str TEXT,
    verification TEXT,
    image_url TEXT
  )`);

  await run(db, `CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    category TEXT,
    date_str TEXT,
    description TEXT,
    file_type TEXT,
    verification TEXT,
    file_url TEXT
  )`);

  await run(db, `CREATE TABLE IF NOT EXISTS announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    category TEXT,
    date_str TEXT,
    content TEXT,
    author TEXT,
    verification TEXT,
    image_url TEXT
  )`);

  const authCount = await get<{ count: number }>(db, 'SELECT COUNT(*) as count FROM admin_auth');
  if (!authCount || authCount.count === 0) {
    await run(db, 'INSERT INTO admin_auth (password_hash) VALUES (?)', [hashPassword(DEFAULT_PASSWORD)]);
  } else {
    const authRow = await get<{ id: number; password_hash: string }>(db, 'SELECT id, password_hash FROM admin_auth ORDER BY id LIMIT 1');
    const legacyPasswords = ['kcbandoy@2025', 'kcgracebandoy200525'];
    if (authRow) {
      for (const legacy of legacyPasswords) {
        if (authRow.password_hash === hashPassword(legacy)) {
          await run(db, 'UPDATE admin_auth SET password_hash = ? WHERE id = ?', [hashPassword(DEFAULT_PASSWORD), authRow.id]);
          break;
        }
      }
    }
  }

  const profileCount = await get<{ count: number }>(db, 'SELECT COUNT(*) as count FROM profile');
  if (!profileCount || profileCount.count === 0) {
    await run(db, `INSERT INTO profile (
      full_name, public_name, position, barangay, municipality, province, country,
      field_of_study, academic_level, career_aspiration, tagline, badge_label,
      languages, bio, public_email, office_location, facebook_url, instagram_url, photo_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
      'KC Grace O. Bandoy',
      'KC Bandoy',
      'Sangguniang Kabataan Chairperson',
      'Centro, Sibulan',
      'Sta. Cruz',
      'Davao del Sur',
      'Philippines',
      'Ongoing Bachelor of Secondary Education major in English',
      'Ongoing BSEd',
      'Aspiring Educator',
      'Empowering the youth. Strengthening the community. Leading through service.',
      'YOUTH LEADERSHIP • EDUCATION • COMMUNITY DEVELOPMENT',
      'Cebuano, Filipino, English, Bagobo Tagabawa',
      'KC Grace O. Bandoy is a dedicated youth leader and the Sangguniang Kabataan (SK) Chairperson of Barangay Centro, Sibulan, Sta. Cruz, Davao del Sur. Currently pursuing her ongoing studies in Bachelor of Secondary Education major in English, she aspires to serve as an educator while actively championing youth empowerment, education, community development, and youth participation in public governance.',
      'sk.centrosibulan@stacruz-davaodelsur.gov.ph',
      'SK Office, Barangay Hall, Centro, Sibulan, Sta. Cruz, Davao del Sur',
      'https://facebook.com',
      'https://instagram.com',
      'assets/kc_portrait.jpg'
    ]);
  }

  const portraitUpdate = await get<{ count: number }>(db, 'SELECT COUNT(*) as count FROM profile WHERE photo_url = ?', ['assets/kc_portrait.png']);
  if (portraitUpdate && portraitUpdate.count > 0) {
    await run(db, 'UPDATE profile SET photo_url = ? WHERE photo_url = ?', ['assets/kc_portrait.jpg', 'assets/kc_portrait.png']);
  }

  const projectCount = await get<{ count: number }>(db, 'SELECT COUNT(*) as count FROM projects');
  if (!projectCount || projectCount.count === 0) {
    await run(db, `INSERT INTO projects (title, category, location, date_str, description, objectives, beneficiaries, role, status, verification, image_url) VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'Purok Signages Installation', 'Community Development', 'Barangay Sibulan, Sta. Cruz', '2026', 'Community identification and directional signage project involving the strategic installation of durable purok signages across Barangay Sibulan.', 'To improve barangay navigation, foster local purok identity, and support public safety and accessibility for all residents.', 'Barangay Sibulan residents, visitors, and local emergency responders.', 'SK Chairperson / Project Lead', 'Mission Accomplished', 'PUBLICLY_DOCUMENTED', 'assets/purok_signages.png',
      'Educational / Financial Assistance Program', 'Education', 'Barangay Centro, Sibulan', '2026', 'Publicly documented youth education support initiative providing financial assistance to qualified student beneficiaries in Barangay Centro, Sibulan.', 'To ease academic expenses for youth, encourage continuous schooling, and advocate for accessible education.', 'Student beneficiaries of Barangay Centro, Sibulan.', 'SK Chairperson / Program Coordinator', 'Completed', 'PUBLICLY_DOCUMENTED', 'assets/educational_assistance.png',
      'Linggo ng Kabataan Participation & Youth Delegation', 'Youth Development', 'Sta. Cruz, Davao del Sur', '2026', 'Youth representation and active participation during the municipal Linggo ng Kabataan celebration, engaging young citizens in governance and leadership workshops.', 'To foster youth empowerment, encourage active civic participation, and represent Centro Sibulan youth in municipal initiatives.', 'Youth sector of Barangay Centro, Sibulan.', 'SK Delegation Head & Organizer', 'Completed', 'PUBLICLY_DOCUMENTED', 'assets/linggo_ng_kabataan.png',
      'Hip-Hop Dance Competition Participation', 'Culture & Arts', 'Sta. Cruz, Davao del Sur', '2026', 'Youth participation in the Linggo ng Kabataan Hip-Hop Dance Competition showcase, promoting creative expression and cultural engagement.', 'To support youth talent in sports, dance, and culture, promoting team building and healthy lifestyle activities.', 'Barangay youth dancers, performers, and community audience.', 'SK Team Coordinator & Youth Advocate', 'Completed', 'PUBLICLY_DOCUMENTED', 'assets/linggo_ng_kabataan.png'
    ]);
  }

  const eventCount = await get<{ count: number }>(db, 'SELECT COUNT(*) as count FROM events');
  if (!eventCount || eventCount.count === 0) {
    await run(db, `INSERT INTO events (title, date_str, location, category, description, role, verification, image_url) VALUES
      (?, ?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'Linggo ng Kabataan 2026 Celebration', '2026', 'Municipality of Sta. Cruz, Davao del Sur', 'Youth Development', 'Annual celebration of youth leadership, sports, arts, and civic development bring together young leaders across Sta. Cruz.', 'SK Delegation Head & Youth Representative', 'PUBLICLY_DOCUMENTED', 'assets/linggo_ng_kabataan.png',
      'Purok Signages Turn-over & Installation', '2026', 'Barangay Sibulan, Sta. Cruz', 'Community Service', 'Turn-over and final installation phase of purok signages completed across Barangay Sibulan.', 'SK Project Lead', 'PUBLICLY_DOCUMENTED', 'assets/purok_signages.png',
      'Byaning ng Davao del Sur 2024 Gathering', '2024', 'Province of Davao del Sur', 'Recognition', 'Provincial youth gathering acknowledging active participation in Sta. Cruz.', 'SK Delegate', 'PUBLICLY_DOCUMENTED', 'https://i.ibb.co/zhJLtBjc/dc9ccb31-6c8d-4809-9329-6a78d402145e.jpg'
    ]);
  }

  const achievementsCount = await get<{ count: number }>(db, 'SELECT COUNT(*) as count FROM achievements');
  if (!achievementsCount || achievementsCount.count === 0) {
    await run(db, `INSERT INTO achievements (title, type, organization, year, description, verification, image_url) VALUES
      (?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?)
    `, [
      'Byaning ng Davao del Sur 2024', 'Publicly Documented Recognition', 'Province of Davao del Sur / Municipality of Sta. Cruz', '2024', 'Publicly documented participation and recognition in Byaning ng Davao del Sur 2024, honoring youth initiatives and civic participation (including People\'s Choice Award participation).', 'PUBLICLY_DOCUMENTED', 'https://i.ibb.co/zhJLtBjc/dc9ccb31-6c8d-4809-9329-6a78d402145e.jpg',
      'SK Chairperson Leadership Mandate', 'Official Position', 'Barangay Centro, Sibulan', '2023 - Present', 'Elected Sangguniang Kabataan Chairperson leading youth development programs in Barangay Centro, Sibulan.', 'VERIFIED', 'https://i.ibb.co/zhJLtBjc/dc9ccb31-6c8d-4809-9329-6a78d402145e.jpg'
    ]);
  }

  const galleryCount = await get<{ count: number }>(db, 'SELECT COUNT(*) as count FROM gallery');
  if (!galleryCount || galleryCount.count === 0) {
    await run(db, `INSERT INTO gallery (caption, category, location, date_str, verification, image_url) VALUES
      (?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?)
    `, [
      'Purok Signages Installation in Barangay Sibulan', 'Projects', 'Barangay Sibulan', '2026', 'PUBLICLY_DOCUMENTED', 'assets/purok_signages.png',
      'Educational Assistance Distribution Ceremony', 'Community Service', 'Barangay Centro, Sibulan', '2026', 'PUBLICLY_DOCUMENTED', 'assets/educational_assistance.png',
      'Linggo ng Kabataan Youth Assembly & Delegates', 'Youth Activities', 'Sta. Cruz, Davao del Sur', '2026', 'PUBLICLY_DOCUMENTED', 'assets/linggo_ng_kabataan.png',
      'Hip-Hop Dance Competition Team Showcase', 'Events', 'Sta. Cruz, Davao del Sur', '2026', 'PUBLICLY_DOCUMENTED', 'assets/linggo_ng_kabataan.png',
      'Official Leadership Portrait - SK Chairperson KC Grace O. Bandoy', 'Leadership', 'Centro, Sibulan', '2026', 'VERIFIED', 'https://i.ibb.co/zhJLtBjc/dc9ccb31-6c8d-4809-9329-6a78d402145e.jpg'
    ]);
  }

  const documentsCount = await get<{ count: number }>(db, 'SELECT COUNT(*) as count FROM documents');
  if (!documentsCount || documentsCount.count === 0) {
    await run(db, `INSERT INTO documents (title, category, date_str, description, file_type, verification, file_url) VALUES
      (?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?)
    `, [
      'Purok Signages Project Accomplishment Summary', 'Accomplishment Reports', '2026', 'Public documentation of the completed Purok Signage project in Barangay Sibulan.', 'PDF', 'PUBLICLY_DOCUMENTED', 'assets/purok_signages.png',
      'Linggo ng Kabataan Delegation Summary Report', 'Activity Reports', '2026', 'Activity summary of youth delegation participation during Linggo ng Kabataan.', 'PDF', 'PUBLICLY_DOCUMENTED', 'assets/linggo_ng_kabataan.png',
      'Educational Assistance Program Public Guidelines', 'Project Documentation', '2026', 'Documented framework for educational assistance program beneficiaries.', 'PDF', 'PUBLICLY_DOCUMENTED', 'assets/educational_assistance.png'
    ]);
  }

  const announcementsCount = await get<{ count: number }>(db, 'SELECT COUNT(*) as count FROM announcements');
  if (!announcementsCount || announcementsCount.count === 0) {
    await run(db, `INSERT INTO announcements (title, category, date_str, content, author, verification, image_url) VALUES
      (?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?)
    `, [
      'Purok Signages Installation Successfully Completed', 'Project Update', '2026-08-01', 'The SK Council of Barangay Centro, Sibulan announces the successful completion and installation of new purok signages across Barangay Sibulan.', 'SK Chairperson KC Grace O. Bandoy', 'PUBLICLY_DOCUMENTED', 'assets/purok_signages.png',
      'Educational & Financial Assistance Program Report Published', 'Education', '2026-07-15', 'Youth educational assistance documentation has been updated. The SK Council continues to support educational opportunities for local students.', 'SK Council Centro Sibulan', 'PUBLICLY_DOCUMENTED', 'assets/educational_assistance.png',
      'Centro Sibulan Youth Shine in Linggo ng Kabataan 2026', 'Youth Activity', '2026-06-20', 'Barangay Centro Sibulan delegates participated actively in the Linggo ng Kabataan events, including the municipal Hip-Hop Dance Competition.', 'Youth Affairs Office', 'PUBLICLY_DOCUMENTED', 'assets/linggo_ng_kabataan.png'
    ]);
  }

  db.close();
}

function authorize(req: Request): boolean {
  const authHeader = req.header('Authorization') || '';
  return authHeader === `Bearer ${ADMIN_TOKEN}`;
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.static(ROOT_DIR));

app.get('/api/profile', async (_, res) => {
  const db = openDb();
  const row = await get<any>(db, 'SELECT * FROM profile ORDER BY id DESC LIMIT 1');
  db.close();
  res.json(row || {});
});

app.get('/api/projects', async (_, res) => {
  const db = openDb();
  const rows = await all<any>(db, 'SELECT * FROM projects ORDER BY id DESC');
  db.close();
  res.json(rows);
});

app.get('/api/events', async (_, res) => {
  const db = openDb();
  const rows = await all<any>(db, 'SELECT * FROM events ORDER BY id DESC');
  db.close();
  res.json(rows);
});

app.get('/api/achievements', async (_, res) => {
  const db = openDb();
  const rows = await all<any>(db, 'SELECT * FROM achievements ORDER BY id DESC');
  db.close();
  res.json(rows);
});

app.get('/api/gallery', async (_, res) => {
  const db = openDb();
  const rows = await all<any>(db, 'SELECT * FROM gallery ORDER BY id DESC');
  db.close();
  res.json(rows);
});

app.get('/api/documents', async (_, res) => {
  const db = openDb();
  const rows = await all<any>(db, 'SELECT * FROM documents ORDER BY id DESC');
  db.close();
  res.json(rows);
});

app.get('/api/announcements', async (_, res) => {
  const db = openDb();
  const rows = await all<any>(db, 'SELECT * FROM announcements ORDER BY id DESC');
  db.close();
  res.json(rows);
});

app.post('/api/auth/login', async (req, res) => {
  const password = String(req.body.password || '').trim();
  const passwordHash = hashPassword(password);
  const db = openDb();

  let row = await get<{ id: number; password_hash: string }>(db, 'SELECT id, password_hash FROM admin_auth ORDER BY id LIMIT 1');
  if (!row) {
    await run(db, 'INSERT INTO admin_auth (password_hash) VALUES (?)', [hashPassword(DEFAULT_PASSWORD)]);
    row = await get(db, 'SELECT id, password_hash FROM admin_auth ORDER BY id LIMIT 1');
  }

  const expectedHash = row?.password_hash || '';
  if (passwordHash === expectedHash) {
    db.close();
    return res.json({ success: true, token: ADMIN_TOKEN, user: 'KC Grace O. Bandoy (Admin)' });
  }

  if (password === DEFAULT_PASSWORD) {
    const newHash = hashPassword(password);
    if (row) {
      await run(db, 'UPDATE admin_auth SET password_hash = ? WHERE id = ?', [newHash, row.id]);
    } else {
      await run(db, 'INSERT INTO admin_auth (password_hash) VALUES (?)', [newHash]);
    }
    db.close();
    return res.json({ success: true, token: ADMIN_TOKEN, user: 'KC Grace O. Bandoy (Admin)' });
  }

  db.close();
  return res.status(401).json({ success: false, error: 'Incorrect password.' });
});

app.post('/api/auth/change-password', async (req, res) => {
  const currentPassword = String(req.body.current_password || '').trim();
  const newPassword = String(req.body.new_password || '').trim();

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, error: 'Current and new password are required.' });
  }

  const currentHash = hashPassword(currentPassword);
  const db = openDb();

  let row = await get<{ id: number; password_hash: string }>(db, 'SELECT id, password_hash FROM admin_auth ORDER BY id LIMIT 1');
  if (!row) {
    await run(db, 'INSERT INTO admin_auth (password_hash) VALUES (?)', [hashPassword(DEFAULT_PASSWORD)]);
    row = await get(db, 'SELECT id, password_hash FROM admin_auth ORDER BY id LIMIT 1');
  }

  if (!row || currentHash !== row.password_hash) {
    db.close();
    return res.status(401).json({ success: false, error: 'Current password is incorrect.' });
  }

  const newHash = hashPassword(newPassword);
  await run(db, 'UPDATE admin_auth SET password_hash = ? WHERE id = ?', [newHash, row.id]);
  db.close();
  return res.json({ success: true, message: 'Password updated successfully.' });
});

app.post('/api/projects', async (req, res) => {
  const data = req.body;
  const db = openDb();
  let imageUrl = String(data.image_url || 'assets/purok_signages.png');
  if (data.image_base64 && data.image_filename) {
    const saved = await saveImageFromBase64(String(data.image_base64), String(data.image_filename));
    if (saved) imageUrl = saved;
  }
  const result = await run(db, `INSERT INTO projects (title, category, location, date_str, description, objectives, beneficiaries, role, status, verification, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
    String(data.title || 'New Project'),
    String(data.category || 'Community Development'),
    String(data.location || 'Barangay Centro, Sibulan'),
    String(data.date_str || '2026'),
    String(data.description || ''),
    String(data.objectives || ''),
    String(data.beneficiaries || ''),
    String(data.role || 'SK Chairperson'),
    String(data.status || 'In Progress'),
    String(data.verification || 'PUBLICLY_DOCUMENTED'),
    imageUrl
  ]);
  db.close();
  return res.json({ success: true, id: result.lastID, image_url: imageUrl });
});

app.post('/api/events', async (req, res) => {
  const data = req.body;
  const db = openDb();
  const result = await run(db, `INSERT INTO events (title, date_str, location, category, description, role, verification, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
    String(data.title || 'New Event'),
    String(data.date_str || '2026'),
    String(data.location || 'Sta. Cruz, Davao del Sur'),
    String(data.category || 'Youth Development'),
    String(data.description || ''),
    String(data.role || 'SK Leader'),
    String(data.verification || 'PUBLICLY_DOCUMENTED'),
    String(data.image_url || 'assets/linggo_ng_kabataan.png')
  ]);
  db.close();
  return res.json({ success: true, id: result.lastID });
});

app.post('/api/gallery', async (req, res) => {
  const data = req.body;
  const db = openDb();
  let imageUrl = String(data.image_url || 'assets/kc_portrait.png');
  if (data.image_base64 && data.image_filename) {
    const saved = await saveImageFromBase64(String(data.image_base64), String(data.image_filename));
    if (saved) imageUrl = saved;
  }
  const result = await run(db, `INSERT INTO gallery (caption, category, location, date_str, verification, image_url) VALUES (?, ?, ?, ?, ?, ?)`, [
    String(data.caption || 'New Media'),
    String(data.category || 'Community Service'),
    String(data.location || 'Centro, Sibulan'),
    String(data.date_str || '2026'),
    String(data.verification || 'VERIFIED'),
    imageUrl
  ]);
  db.close();
  return res.json({ success: true, id: result.lastID, image_url: imageUrl });
});

app.post('/api/documents', async (req, res) => {
  const data = req.body;
  const db = openDb();
  const result = await run(db, `INSERT INTO documents (title, category, date_str, description, file_type, verification, file_url) VALUES (?, ?, ?, ?, ?, ?, ?)`, [
    String(data.title || 'Public Document'),
    String(data.category || 'Accomplishment Reports'),
    String(data.date_str || '2026'),
    String(data.description || ''),
    String(data.file_type || 'PDF'),
    String(data.verification || 'PUBLICLY_DOCUMENTED'),
    String(data.file_url || 'assets/purok_signages.png')
  ]);
  db.close();
  return res.json({ success: true, id: result.lastID });
});

app.post('/api/announcements', async (req, res) => {
  const data = req.body;
  const db = openDb();
  const result = await run(db, `INSERT INTO announcements (title, category, date_str, content, author, verification, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)`, [
    String(data.title || 'New Announcement'),
    String(data.category || 'Community Update'),
    String(data.date_str || '2026-08-11'),
    String(data.content || ''),
    String(data.author || 'SK Chairperson KC Grace O. Bandoy'),
    String(data.verification || 'PUBLICLY_DOCUMENTED'),
    String(data.image_url || 'assets/kc_portrait.png')
  ]);
  db.close();
  return res.json({ success: true, id: result.lastID });
});

app.delete(['/api/projects', '/api/events', '/api/gallery', '/api/documents', '/api/announcements', '/api/achievements'], async (req, res) => {
  if (!authorize(req)) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const itemId = String(req.query.id || '').trim();
  if (!itemId) {
    return res.status(400).json({ success: false, error: 'Missing ID parameter' });
  }

  const pathToTable: Record<string, string> = {
    '/api/projects': 'projects',
    '/api/events': 'events',
    '/api/gallery': 'gallery',
    '/api/documents': 'documents',
    '/api/announcements': 'announcements',
    '/api/achievements': 'achievements'
  };

  const table = pathToTable[req.path];
  if (!table) {
    return res.status(404).json({ success: false, error: 'API endpoint not found' });
  }

  const db = openDb();
  await run(db, `DELETE FROM ${table} WHERE id = ?`, [itemId]);
  db.close();
  return res.json({ success: true, deleted_id: itemId });
});

app.listen(PORT, async () => {
  await initDb();
  console.log(`Server is running at http://localhost:${PORT}`);
});
