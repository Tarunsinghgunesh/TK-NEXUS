import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ============================================
// FAKE DATABASE
// ============================================

interface User {
  id: string;
  email: string;
  password: string;
  businessName: string;
  createdAt: Date;
}

interface Lead {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  createdAt: Date;
}

const usersDB: Map<string, User> = new Map();
const leadsDB: Map<string, Lead> = new Map();

// Demo account
usersDB.set('test@example.com', {
  id: 'user-1',
  email: 'test@example.com',
  password: bcrypt.hashSync('password123', 10),
  businessName: 'Demo Business',
  createdAt: new Date(),
});

// ============================================
// HELPERS
// ============================================

function generateToken(userId: string): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRE,
  });
}

function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      userId: string;
    };
  } catch {
    return null;
  }
}

function authMiddleware(req: any, res: any, next: any) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.userId = decoded.userId;
  next();
}

// ============================================
// AUTH ROUTES
// ============================================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, businessName } = req.body;

    if (!email || !password || !businessName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (usersDB.has(email)) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const userId = uuidv4();

    const user: User = {
      id: userId,
      email,
      password: hashedPassword,
      businessName,
      createdAt: new Date(),
    };

    usersDB.set(email, user);
    const token = generateToken(userId);

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: userId, email, businessName },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = usersDB.get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      user: { id: user.id, email: user.email, businessName: user.businessName },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  try {
    let user = null;
    for (const [_, u] of usersDB) {
      if (u.id === req.userId) {
        user = u;
        break;
      }
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        businessName: user.businessName,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================
// LEADS ROUTES
// ============================================

app.post('/api/leads/find', authMiddleware, (req, res) => {
  try {
    const { keywords, location, quantity } = req.body;

    const fakeLEADS = [
      { name: 'John Fitness Center', email: 'john@fitness.com', phone: '9876543210', company: 'Fitness Center' },
      { name: 'Sarah Coaching Academy', email: 'sarah@coaching.com', phone: '9876543211', company: 'Coaching' },
      { name: 'Mike Beauty Salon', email: 'mike@salon.com', phone: '9876543212', company: 'Salon' },
      { name: 'Emma Restaurant', email: 'emma@restaurant.com', phone: '9876543213', company: 'Restaurant' },
      { name: 'David Freelance Studio', email: 'david@studio.com', phone: '9876543214', company: 'Studio' },
      { name: 'Lisa Yoga Center', email: 'lisa@yoga.com', phone: '9876543215', company: 'Yoga' },
      { name: 'Tom Photography', email: 'tom@photo.com', phone: '9876543216', company: 'Photography' },
      { name: 'Anna Digital Agency', email: 'anna@agency.com', phone: '9876543217', company: 'Agency' },
    ];

    const leads = fakeLEADS.slice(0, quantity || 5).map((lead) => ({
      id: uuidv4(),
      userId: req.userId,
      ...lead,
      source: 'google_maps',
      createdAt: new Date(),
    }));

    res.json({
      message: `Found ${leads.length} leads`,
      count: leads.length,
      leads,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/leads', authMiddleware, (req, res) => {
  try {
    const userLeads = Array.from(leadsDB.values()).filter(
      (lead) => lead.userId === req.userId
    );

    res.json({
      leads: userLeads,
      count: userLeads.length,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/leads/bulk', authMiddleware, (req, res) => {
  try {
    const { leads } = req.body;

    if (!Array.isArray(leads)) {
      return res.status(400).json({ error: 'Leads must be an array' });
    }

    const imported = leads.map((lead) => {
      const id = uuidv4();
      const newLead: Lead = {
        id,
        userId: req.userId,
        name: lead.name,
        email: lead.email,
        phone: lead.phone || '',
        company: lead.company || '',
        source: lead.source || 'manual',
        createdAt: new Date(),
      };
      leadsDB.set(id, newLead);
      return newLead;
    });

    res.json({
      message: `Imported ${imported.length} leads`,
      imported,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================
// OUTREACH ROUTES
// ============================================

app.post('/api/outreach/send', authMiddleware, (req, res) => {
  try {
    const { leadId, channel, message } = req.body;

    res.json({
      message: 'Message sent successfully',
      leadId,
      channel,
      status: 'sent',
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/outreach/results', authMiddleware, (req, res) => {
  try {
    res.json({
      results: {
        sent: 150,
        delivered: 145,
        opened: 78,
        replied: 23,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================
// WEBSITE ROUTES
// ============================================

app.post('/api/website/generate', authMiddleware, (req, res) => {
  try {
    res.json({
      message: 'Website generated',
      domain: 'yourbusiness.tknexus.app',
      pages: [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
      ],
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/website/publish', authMiddleware, (req, res) => {
  try {
    res.json({
      message: 'Website published',
      url: 'https://yourbusiness.tknexus.app',
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================
// AI ROUTES
// ============================================

app.post('/api/ai/ask', authMiddleware, (req, res) => {
  try {
    const { question } = req.body;

    const responses: { [key: string]: string } = {
      'grow': 'To grow your business: 1) Find quality leads 2) Send personalized outreach 3) Build professional website 4) Create engaging content 5) Analyze and optimize metrics',
      'leads': 'Find leads from Google Maps, Instagram, LinkedIn. Use our Lead Finder to discover 100+ prospects quickly.',
      'marketing': 'Marketing strategies: Content marketing, Email sequences, Paid ads, Local SEO, Referrals, Retargeting',
      'default': 'Great question! Focus on customer relationships, leverage AI automation, stay consistent with content, and measure results.'
    };

    const answer = Object.keys(responses).find(key => question.toLowerCase().includes(key))
      ? responses[Object.keys(responses).find(key => question.toLowerCase().includes(key)) || 'default']
      : responses['default'];

    res.json({
      question,
      answer,
      suggestions: [
        'Find leads in your area',
        'Generate content calendar',
        'Create outreach campaign',
      ],
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================
// ANALYTICS ROUTES
// ============================================

app.get('/api/analytics/summary', authMiddleware, (req, res) => {
  try {
    res.json({
      totalLeads: 150,
      messagesSent: 450,
      repliesReceived: 89,
      websiteVisitors: 1230,
      conversionRate: 19.8,
      trends: {
        leads: 12,
        messages: 8,
        replies: 15,
        visitors: 22,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/analytics/insights', authMiddleware, (req, res) => {
  try {
    res.json({
      insights: [
        'Email opens are 45% above industry average!',
        'Instagram gets 3x more engagement than Facebook',
        'Best time to send: 9-10 AM',
        'Conversion rate improved 12% this week',
      ],
      recommendations: [
        'Post 3x per week',
        'Focus on email - highest ROI',
        'A/B test outreach messages',
        'Schedule posts for 9 AM',
      ],
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================
// HEALTH & INFO ROUTES
// ============================================

app.get('/health', (req, res) => {
  res.json({
    status: 'Server is running! ✅',
    timestamp: new Date(),
  });
});

app.get('/', (req, res) => {
  res.json({
    message: '🚀 TK Nexus Backend API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth/register, /api/auth/login, /api/auth/me',
      leads: '/api/leads, /api/leads/find, /api/leads/bulk',
      outreach: '/api/outreach/send, /api/outreach/results',
      website: '/api/website/generate, /api/website/publish',
      ai: '/api/ai/ask',
      analytics: '/api/analytics/summary, /api/analytics/insights',
    },
  });
});

// Error handling
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════╗
║  🚀 TK Nexus Backend API           ║
║  Running on port ${PORT}              ║
║  http://localhost:${PORT}            ║
╚════════════════════════════════════╝
  `);
});
