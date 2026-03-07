import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET || "pp_alchemist_secret_key_2024";
const ADMIN_USER = "admin";
const ADMIN_PASS = "pp_alchemist_access1003";
const MONGODB_URI = process.env.MONGODB_URI;

// MongoDB Schema
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  galleryUrls: [{ type: String }],
  description: { type: String },
  pietraRatio: { type: Number },
  plumeRatio: { type: Number },
  materials: [{ type: String }],
  location: { type: String },
  year: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const settingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
});

const Project = (mongoose.models.Project || mongoose.model("Project", projectSchema)) as any;
const Setting = (mongoose.models.Setting || mongoose.model("Setting", settingSchema)) as any;

const app = express();

// Middleware to connect to MongoDB
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not defined");
    return;
  }
  await mongoose.connect(MONGODB_URI);
};

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.use(express.json());
app.use(cookieParser());

// API routes
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ user: username }, JWT_SECRET, { expiresIn: "24h" });
    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
    return res.json({ success: true });
  }

  res.status(401).json({ success: false, message: "Invalid credentials" });
});

app.post("/api/logout", (req, res) => {
  res.clearCookie("admin_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.json({ success: true });
});

app.get("/api/verify", (req, res) => {
  const token = req.cookies.admin_token;
  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    jwt.verify(token, JWT_SECRET);
    res.json({ authenticated: true });
  } catch (err) {
    res.status(401).json({ authenticated: false });
  }
});

// Project Management Routes
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

app.post("/api/projects", async (req, res) => {
  const token = req.cookies.admin_token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    jwt.verify(token, JWT_SECRET);
    const newProject = new Project(req.body);
    await newProject.save();
    res.json(newProject);
  } catch (err) {
    res.status(400).json({ error: "Invalid data" });
  }
});

app.delete("/api/projects/:id", async (req, res) => {
  const token = req.cookies.admin_token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    jwt.verify(token, JWT_SECRET);
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
});

// Settings Routes
app.get("/api/settings", async (req, res) => {
  try {
    const settings = await Setting.find();
    const settingsMap = settings.reduce((acc: any, s: any) => {
      acc[s.key] = s.value;
      return acc;
    }, {});
    res.json(settingsMap);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

app.post("/api/settings", async (req, res) => {
  const token = req.cookies.admin_token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    jwt.verify(token, JWT_SECRET);
    const { key, value } = req.body;
    await Setting.findOneAndUpdate({ key }, { value }, { upsert: true });
    res.json({ success: true });
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
});

// Migration Endpoint (Temporary)
app.post("/api/migrate", async (req, res) => {
  const token = req.cookies.admin_token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    jwt.verify(token, JWT_SECRET);
    const { projects } = req.body;
    
    // Clear existing projects to avoid duplicates during migration
    await Project.deleteMany({});
    await Setting.deleteMany({});
    
    const inserted = await Project.insertMany(projects);
    
    const defaultSettings = [
      // Hero
      { key: 'hero_tagline', value: 'Mastering the Art of the Possible' },
      { key: 'hero_heading', value: 'Ethereal Architecture' },
      { key: 'hero_body', value: 'Where the weight of stone meets the lightness of spirit.' },
      { key: 'hero_image', value: 'https://ik.imagekit.io/pietraplume/images/pietra-asset-001.jpg' },
      
      // Philosophy
      { key: 'philosophy_tag', value: 'Our Methodology' },
      { key: 'philosophy_heading', value: 'The Alchemist\'s Balance' },
      { key: 'philosophy_body', value: 'At Pietra & Plume, we believe great design is an act of reconciliation. We marry the heavy with the light, the ancient with the ephemeral.' },
      { key: 'pietra_heading', value: 'Pietra' },
      { key: 'pietra_body', value: 'The foundation. Raw materials, historical weight, and the unyielding strength of stone, marble, and ancient wood—nature\'s core manifested in physical form.' },
      { key: 'pietra_image', value: 'https://ik.imagekit.io/pietraplume/images/pietra-asset-002.jpg' },
      { key: 'plume_heading', value: 'Plume' },
      { key: 'plume_body', value: 'The spirit. Fluidity, transparency, and the ethereal dance of light through feathers and fabric. The breath of a structure that turns monoliths into living experiences.' },
      { key: 'plume_image', value: 'https://ik.imagekit.io/pietraplume/images/pietra-asset-003.jpg' },
      
      // Methodology
      { key: 'methodology_tag', value: 'The Plume Path' },
      { key: 'methodology_heading', value: 'Architectural Agility.' },
      { key: 'methodology_body', value: 'We have abandoned the rigid silos of traditional architecture. By adhering to modern IT delivery principles, we provide a delivery model where the blueprint is a living document, and the client is a co-developer.' },
      { key: 'meth_p1_title', value: 'Discovery Sprints' },
      { key: 'meth_p1_desc', value: 'We treat your vision as a set of dynamic \'User Stories\'. Instead of rigid static briefs, we define the core experience and iterate on the volume through rapid conceptual prototyping.' },
      { key: 'meth_p2_title', value: 'Iterative Manifestation' },
      { key: 'meth_p2_desc', value: 'Borrowing from the CI/CD pipeline of high-performance software, we deliver architectural \'builds\' in phases. This allows for evolving material choices and light-path adjustments as the space takes shape.' },
      { key: 'meth_p3_title', value: 'Refactorable Design' },
      { key: 'meth_p3_desc', value: 'We welcome changes late in the process. By utilizing modular IT-driven principles in our structural engineering, our blueprints remain flexible—responding to new insights rather than resisting them.' },
      { key: 'meth_p4_title', value: 'Responsive Environment' },
      { key: 'meth_p4_desc', value: 'The final deployment isn\'t the end. We view architecture as a living system that optimizes itself through usage data and human feedback loops, ensuring a permanent state of refinement.' },
      
      // Services
      { key: 'services_tag', value: 'Our Expertise' },
      { key: 'services_heading', value: 'Ethereal Provisions' },
      { key: 'services_body', value: 'From monolithic structural design to ethereal interior atmospheres, we provide a full spectrum of architectural services.' },
      { key: 'serv_1_title', value: 'Residential Architecture' },
      { key: 'serv_1_desc', value: 'Crafting private sanctuaries that harmonize ancestral weight with modern translucency. We build homes that breathe.' },
      { key: 'serv_1_img', value: 'https://ik.imagekit.io/pietraplume/images/pietra-asset-020.jpg' },
      { key: 'serv_2_title', value: 'Commercial Curation' },
      { key: 'serv_2_desc', value: 'Sculpting high-prestige environments for brands that value permanence. Where corporate identity meets alchemical form.' },
      { key: 'serv_2_img', value: 'https://ik.imagekit.io/pietraplume/images/pietra-asset-008.jpg' },
      { key: 'serv_3_title', value: 'Bespoke Materiality' },
      { key: 'serv_3_desc', value: 'The curation of the tactile. We design custom furniture and interior elements that explore the dialogue between raw monoliths and ethereal transparency.' },
      { key: 'serv_3_img', value: 'https://ik.imagekit.io/pietraplume/images/pietra-asset-023.jpg' },
      { key: 'serv_4_title', value: 'Urban Alchemy' },
      { key: 'serv_4_desc', value: 'Large-scale interventions designed to reconnect historical urban fabrics with sustainable, light-filled futures.' },
      { key: 'serv_4_img', value: 'https://ik.imagekit.io/pietraplume/images/pietra-asset-024.jpg' },
      
      // Departure
      { key: 'departure_tag', value: 'The Sabbatical Program' },
      { key: 'departure_heading', value: 'The Grand Departure.' },
      { key: 'departure_body', value: 'We believe the stress of execution should never touch the client. When our Agile Sprints begin, we invite you to depart. Choose a sanctuary from our curated Indian heritage partners; while you find yourself, we manifest your home.' },
      { key: 'departure_timeline_tag', value: 'Agile Lifecycles' },
      { key: 'departure_timeline_heading', value: 'Predictable Evolution.' },
      
      // Holidays
      { key: 'hol_1_name', value: 'The Spiti Monolith' },
      { key: 'hol_1_loc', value: 'Spiti Valley, Himachal Pradesh' },
      { key: 'hol_1_desc', value: 'Brutalist serenity in the high desert. A sanctuary of local stone and glass looking over ancient monasteries.' },
      { key: 'hol_1_img', value: 'https://ik.imagekit.io/pietraplume/images/pietra-asset-028.jpg' },
      { key: 'hol_2_name', value: 'The Emerald Plume' },
      { key: 'hol_2_loc', value: 'Kumarakom, Kerala' },
      { key: 'hol_2_desc', value: 'Weightless architecture suspended over the backwaters, where traditional teak meets ethereal translucency.' },
      { key: 'hol_2_img', value: 'https://ik.imagekit.io/pietraplume/images/pietra-asset-032.jpg' },
      { key: 'hol_3_name', value: 'The Amber Stillness' },
      { key: 'hol_3_loc', value: 'Jaisalmer, Rajasthan' },
      { key: 'hol_3_desc', value: 'Ancient golden sandstone recontextualized into a modern nomadic fortress of silence.' },
      { key: 'hol_3_img', value: 'https://ik.imagekit.io/pietraplume/images/pietra-asset-036.jpg' },
      
      // Contact
      { key: 'contact_tag', value: 'Restricted Access' },
      { key: 'contact_heading', value: 'Begin Your Odyssey' },
      { key: 'contact_body', value: 'Whether you seek to anchor a legacy or breathe life into a new vision, our sanctum is open for consultation.' },
      { key: 'contact_email', value: 'sanctum@pietraplume.com' },
      { key: 'contact_phone', value: '+39 02 123 4567' },
      { key: 'contact_address', value: 'Via del Marmo 12, Milan, Italy' },
      
      // Footer
      { key: 'footer_logo_text', value: 'PIETRA & PLUME' },
      { key: 'footer_logo_subtext', value: 'Architectural Alchemy' },
      { key: 'footer_body', value: 'Designing environments that endure through the philosophy of the solid and the spirit.' }
    ];
    
    await Setting.insertMany(defaultSettings);
    
    res.json({ success: true, count: inserted.length });
  } catch (err) {
    res.status(500).json({ error: "Migration failed" });
  }
});

export default app;
