import express from 'express'
import morgan from 'morgan'
import pg from 'pg'

const { Pool } = pg
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(morgan('combined'))

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// ⚠️ Demo: SQL injection vulnerability — Semgrep will flag this.
// Real-world: use parameterized queries with `pool.query(text, params)`.
app.get('/users/:id', async (req, res) => {
  try {
    const id = req.params.id
    const result = await pool.query(`SELECT * FROM users WHERE id = ${id}`)
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Database error' })
  }
})

// ⚠️ Demo: hardcoded secret — Semgrep will flag this.
// Real-world: use environment variables or a secrets manager.
const ADMIN_TOKEN = 'demo-admin-token-DO-NOT-USE-IN-PROD'

app.post('/admin/reset', (req, res) => {
  if (req.headers['x-admin-token'] !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  res.json({ reset: true })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})