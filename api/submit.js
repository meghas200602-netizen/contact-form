// Vercel serverless function: replaces PHP. Saves the form into MySQL.
const mysql = require('mysql2/promise');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST.' });

  const { name, email, message } = req.body || {};
  if (!name || !email || !message ||
      name.length > 50 || email.length > 100 || message.length > 1000 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please fill all fields correctly.' });
  }

  let conn;
  try {
    conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
    });
    // Prepared statement: protects against SQL injection
    await conn.execute(
      'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)',
      [name.trim(), email.trim(), message.trim()]
    );
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not save your message. Try again later.' });
  } finally {
    if (conn) await conn.end();
  }
};
