require('dotenv').config();
const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false }
    })
  : null;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

const initiatives = [
  {
    id: 1,
    name: 'GyaanDaata',
    description: 'Knowledge sharing and mentorship for students.',
    focus: 'Education'
  },
  {
    id: 2,
    name: 'DaanVeer',
    description: 'Community support, generosity, and service-driven impact.',
    focus: 'Community Support'
  },
  {
    id: 3,
    name: 'Volunteer Circle',
    description: 'A welcoming space for mentors, donors, and changemakers.',
    focus: 'Volunteerism'
  }
];

let submissions = [];

async function saveSubmission(submission) {
  if (supabase) {
    try {
      const { error } = await supabase.from('volunteer_submissions').insert([submission]);
      if (!error) {
        return true;
      }
      console.error('Supabase insert error:', error.message);
    } catch (error) {
      console.error('Supabase connection error:', error.message);
    }
  }

  submissions.push(submission);
  return false;
}

async function getStoredSubmissions() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('volunteer_submissions').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        return data;
      }
      console.error('Supabase fetch error:', error?.message);
    } catch (error) {
      console.error('Supabase fetch connection error:', error.message);
    }
  }

  return submissions;
}

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Gyaan Daan API',
    activeSubmissions: submissions.length
  });
});

app.get('/api/initiatives', (req, res) => {
  res.json(initiatives);
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};

  if (email === 'admin@gyaandaan.com' && password === 'password123') {
    return res.json({
      success: true,
      message: 'Login successful',
      user: {
        name: 'Admin',
        email,
        role: 'admin'
      }
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Invalid email or password'
  });
});

app.post('/api/volunteer', async (req, res) => {
  const { name, email, role, message } = req.body || {};

  if (!name || !email || !role) {
    return res.status(400).json({
      success: false,
      error: 'Please provide your name, email, and your area of interest.'
    });
  }

  const submission = {
    id: Date.now().toString(),
    name,
    email,
    role,
    message: message || '',
    created_at: new Date().toISOString()
  };

  const savedToSupabase = await saveSubmission(submission);

  return res.status(201).json({
    success: true,
    message: `Thanks ${name}! We will contact you soon.`,
    submission,
    storage: savedToSupabase ? 'supabase' : 'memory'
  });
});

app.get('/api/submissions', async (req, res) => {
  const stored = await getStoredSubmissions();
  res.json({ count: stored.length, submissions: stored });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Centralized error handler. Must be defined last, after all routes, and
// must keep all four arguments so Express recognizes it as an error handler.
// Without this, thrown/forwarded errors (e.g. malformed JSON bodies) fell
// through to Express's default handler, which returns the raw error stack
// (including local file-system paths) to the client.
app.use((err, req, res, next) => {
  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, error: 'Invalid JSON in request body.' });
  }

  console.error('Unhandled error:', err);
  res.status(err.status || err.statusCode || 500).json({
    success: false,
    error: 'Something went wrong. Please try again later.'
  });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Gyaan Daan server running at http://localhost:${port}`);
  });
}

module.exports = app;
