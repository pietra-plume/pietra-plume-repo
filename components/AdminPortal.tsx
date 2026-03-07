import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, LogOut, Loader2 } from 'lucide-react';

const AdminPortal: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [isMigrating, setIsMigrating] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState<'projects' | 'content'>('projects');
  const [activeContentTab, setActiveContentTab] = useState('hero');
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
      fetchSettings();
    }
  }, [isAuthenticated]);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      console.error('Failed to fetch settings', err);
    }
  };

  const handleUpdateSetting = async (key: string, value: string) => {
    try {
      setIsSaving(true);
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });
      if (res.ok) {
        setSettings(prev => ({ ...prev, [key]: value }));
      }
    } catch (err) {
      console.error("Failed to update setting", err);
    } finally {
      setIsSaving(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProjects();
      }
    } catch (err) {
      console.error('Failed to delete project', err);
    }
  };

  const handleMigrate = async () => {
    const confirmMigrate = window.confirm("This will clear all existing database projects and replace them with the default portfolio. Continue?");
    if (!confirmMigrate) return;

    setIsMigrating(true);
    const defaultProjects = [
      { 
        title: 'The Obsidian Pavilion', 
        category: 'Residential', 
        imageUrl: 'https://ik.imagekit.io/pietraplume/images/pietra-asset-004.jpg',
        galleryUrls: [
          'https://ik.imagekit.io/pietraplume/images/pietra-asset-004.jpg',
          'https://ik.imagekit.io/pietraplume/images/pietra-asset-005.jpg',
          'https://ik.imagekit.io/pietraplume/images/pietra-asset-006.jpg'
        ],
        description: 'A Masterclass in contrast. The Obsidian Pavilion utilizes volcanic basalt monoliths to anchor a structure that appears to float over the landscape through invisible glazing techniques.',
        pietraRatio: 75,
        plumeRatio: 25,
        materials: ['Basalt Monoliths', 'Invisible Glazing', 'Shadow Maple'],
        location: 'Reykjavík, Iceland',
        year: '2023'
      },
      { 
        title: 'Ethereal Office', 
        category: 'Commercial', 
        imageUrl: 'https://ik.imagekit.io/pietraplume/images/pietra-asset-007.jpg',
        galleryUrls: [
          'https://ik.imagekit.io/pietraplume/images/pietra-asset-007.jpg',
          'https://ik.imagekit.io/pietraplume/images/pietra-asset-008.jpg',
          'https://ik.imagekit.io/pietraplume/images/pietra-asset-009.jpg'
        ],
        description: 'Redefining corporate permanence. This workspace transitions from heavy Carrara marble public zones to airy, cloud-like collaborative spaces separated only by diffused light.',
        pietraRatio: 40,
        plumeRatio: 60,
        materials: ['Carrara Marble', 'Diffused Polycarbonate', 'Brushed Aluminum'],
        location: 'Milan, Italy',
        year: '2022'
      },
      { 
        title: 'Lighthouse Retreat', 
        category: 'Hospitality', 
        imageUrl: 'https://ik.imagekit.io/pietraplume/images/pietra-asset-010.jpg',
        galleryUrls: [
          'https://ik.imagekit.io/pietraplume/images/pietra-asset-010.jpg',
          'https://ik.imagekit.io/pietraplume/images/pietra-asset-011.jpg',
          'https://ik.imagekit.io/pietraplume/images/pietra-asset-012.jpg'
        ],
        description: 'A coastal sanctuary that honors the rugged shoreline. Local limestone provides the thermal mass, while a "Plume" roof structure allows the breeze to pass through the living quarters.',
        pietraRatio: 50,
        plumeRatio: 50,
        materials: ['Local Limestone', 'Bleached Oak', 'Sailcloth Membranes'],
        location: 'Paros, Greece',
        year: '2024'
      },
      { 
        title: 'The Marble Archive', 
        category: 'Cultural', 
        imageUrl: 'https://ik.imagekit.io/pietraplume/images/pietra-asset-013.jpg',
        galleryUrls: [
          'https://ik.imagekit.io/pietraplume/images/pietra-asset-013.jpg',
          'https://ik.imagekit.io/pietraplume/images/pietra-asset-014.jpg',
          'https://ik.imagekit.io/pietraplume/images/pietra-asset-015.jpg'
        ],
        description: 'A monolithic library designed for a century of silence. Massive marble light-wells penetrate the structural core, bringing "spirit" into the deep earth of the archive.',
        pietraRatio: 90,
        plumeRatio: 10,
        materials: ['Statuary Marble', 'Architectural Concrete', 'Cast Bronze'],
        location: 'Kyoto, Japan',
        year: '2021'
      }
    ];

    try {
      const res = await fetch('/api/migrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects: defaultProjects }),
      });
      if (res.ok) {
        alert("Migration successful!");
        fetchProjects();
        fetchSettings();
      }
    } catch (err) {
      alert("Migration failed.");
    } finally {
      setIsMigrating(false);
    }
  };

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/verify');
      const data = await res.json();
      setIsAuthenticated(data.authenticated);
    } catch (err) {
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
      } else {
        setError('Invalid credentials. Access denied.');
      }
    } catch (err) {
      setError('An error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setUsername('');
      setPassword('');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-stone-400 animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-50 p-8 relative">
        <button
          onClick={handleLogout}
          className="absolute top-8 right-8 flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-sm text-stone-600 hover:text-stone-900 hover:border-stone-400 transition-all text-sm font-light"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
        <div className="max-w-6xl mx-auto pt-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <h1 className="serif text-4xl font-light text-stone-900 mb-2">Admin Dashboard</h1>
              <p className="text-stone-400 text-xs font-light tracking-widest uppercase">Sanctum Control Center</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex bg-stone-100 p-1 rounded-sm">
                <button
                  onClick={() => setActiveMainTab('projects')}
                  className={`px-6 py-2 text-[10px] tracking-[0.2em] uppercase transition-all ${activeMainTab === 'projects' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
                >
                  Projects
                </button>
                <button
                  onClick={() => setActiveMainTab('content')}
                  className={`px-6 py-2 text-[10px] tracking-[0.2em] uppercase transition-all ${activeMainTab === 'content' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
                >
                  Content
                </button>
              </div>
              <button
                onClick={handleMigrate}
                disabled={isMigrating}
                className="px-4 py-2 border border-stone-200 text-[10px] tracking-[0.2em] uppercase text-stone-400 hover:text-stone-900 hover:border-stone-800 transition-all disabled:opacity-50"
              >
                {isMigrating ? 'Migrating...' : 'Reset Defaults'}
              </button>
            </div>
          </div>
          
          {activeMainTab === 'projects' ? (
            <div className="grid gap-8">
              {/* Add Project Form */}
              <div className="bg-white p-8 rounded-sm border border-stone-100 shadow-sm">
                <h3 className="text-[10px] tracking-[0.3em] uppercase text-stone-400 mb-6">Manifest New Project</h3>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const projectData = {
                    title: formData.get('title'),
                    category: formData.get('category'),
                    imageUrl: formData.get('imageUrl'),
                    description: formData.get('description'),
                    location: formData.get('location'),
                    year: formData.get('year'),
                    pietraRatio: Number(formData.get('pietraRatio')),
                    plumeRatio: Number(formData.get('plumeRatio')),
                    materials: (formData.get('materials') as string).split(',').map(m => m.trim()),
                    galleryUrls: [formData.get('imageUrl') as string]
                  };

                  try {
                    const res = await fetch('/api/projects', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(projectData),
                    });
                    if (res.ok) {
                      (e.target as HTMLFormElement).reset();
                      fetchProjects();
                    }
                  } catch (err) {
                    console.error('Failed to add project', err);
                  }
                }} className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[9px] tracking-[0.2em] uppercase text-stone-400">Title</label>
                    <input name="title" required className="w-full bg-transparent border-b border-stone-200 py-2 text-stone-800 font-light focus:outline-none focus:border-stone-800 transition-all text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] tracking-[0.2em] uppercase text-stone-400">Category</label>
                    <input name="category" required className="w-full bg-transparent border-b border-stone-200 py-2 text-stone-800 font-light focus:outline-none focus:border-stone-800 transition-all text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] tracking-[0.2em] uppercase text-stone-400">Image URL</label>
                    <input name="imageUrl" required type="url" className="w-full bg-transparent border-b border-stone-200 py-2 text-stone-800 font-light focus:outline-none focus:border-stone-800 transition-all text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] tracking-[0.2em] uppercase text-stone-400">Location</label>
                    <input name="location" className="w-full bg-transparent border-b border-stone-200 py-2 text-stone-800 font-light focus:outline-none focus:border-stone-800 transition-all text-sm" />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[9px] tracking-[0.2em] uppercase text-stone-400">Description</label>
                    <textarea name="description" rows={2} className="w-full bg-transparent border-b border-stone-200 py-2 text-stone-800 font-light focus:outline-none focus:border-stone-800 transition-all text-sm resize-none" />
                  </div>
                  <button type="submit" className="md:col-span-2 py-4 bg-stone-900 text-white text-[10px] tracking-[0.4em] uppercase hover:bg-stone-800 transition-all">
                    Manifest Project
                  </button>
                </form>
              </div>

              {/* Project List */}
              <div className="bg-white p-8 rounded-sm border border-stone-100 shadow-sm">
                <h3 className="text-[10px] tracking-[0.3em] uppercase text-stone-400 mb-6">Manifested Projects ({projects.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <div key={project._id} className="group relative aspect-square bg-stone-50 overflow-hidden border border-stone-100">
                      <img 
                        src={project.imageUrl} 
                        alt={project.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                        <p className="text-white text-xs font-medium mb-1">{project.title}</p>
                        <p className="text-white/60 text-[9px] tracking-widest uppercase mb-4">{project.category}</p>
                        <button
                          onClick={() => handleDeleteProject(project._id)}
                          className="text-[9px] tracking-[0.2em] uppercase text-white border border-white/40 px-3 py-1 hover:bg-red-500 hover:border-red-500 transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <div className="col-span-full py-12 text-center">
                      <p className="text-stone-400 font-light italic text-sm">The sanctum is empty. Use the reset button above to populate.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Content Tabs */}
              <div className="flex border-b border-stone-200 overflow-x-auto no-scrollbar">
                {['hero', 'philosophy', 'methodology', 'services', 'departure', 'contact', 'footer'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveContentTab(tab)}
                    className={`px-8 py-4 text-[10px] tracking-[0.3em] uppercase transition-all border-b-2 whitespace-nowrap ${activeContentTab === tab ? 'border-stone-900 text-stone-900 font-medium' : 'border-transparent text-stone-400 hover:text-stone-600'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Content Editor */}
              <div className="bg-white p-10 rounded-sm border border-stone-100 shadow-sm">
                <div className="max-w-3xl space-y-12">
                  {activeContentTab === 'hero' && (
                    <HeroEditor settings={settings} onSave={handleUpdateSetting} />
                  )}
                  {activeContentTab === 'philosophy' && (
                    <PhilosophyEditor settings={settings} onSave={handleUpdateSetting} />
                  )}
                  {activeContentTab === 'methodology' && (
                    <MethodologyEditor settings={settings} onSave={handleUpdateSetting} />
                  )}
                  {activeContentTab === 'services' && (
                    <ServicesEditor settings={settings} onSave={handleUpdateSetting} />
                  )}
                  {activeContentTab === 'departure' && (
                    <DepartureEditor settings={settings} onSave={handleUpdateSetting} />
                  )}
                  {activeContentTab === 'contact' && (
                    <ContactEditor settings={settings} onSave={handleUpdateSetting} />
                  )}
                  {activeContentTab === 'footer' && (
                    <FooterEditor settings={settings} onSave={handleUpdateSetting} />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-12 rounded-sm shadow-xl border border-stone-200">
        <div className="text-center mb-12">
          <h4 className="text-[10px] tracking-[0.5em] uppercase text-stone-400 mb-4">Restricted Access</h4>
          <h2 className="serif text-4xl font-light text-stone-900">The Alchemist's <span className="italic">Gate</span></h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-1">
            <label className="text-[9px] tracking-[0.3em] uppercase text-stone-400">Username</label>
            <input
              required
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent border-b border-stone-200 py-3 text-stone-800 font-light focus:outline-none focus:border-stone-800 transition-all"
            />
          </div>

          <div className="space-y-1 relative">
            <label className="text-[9px] tracking-[0.3em] uppercase text-stone-400">Password</label>
            <div className="relative">
              <input
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-stone-200 py-3 text-stone-800 font-light focus:outline-none focus:border-stone-800 transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 bottom-3 text-stone-400 hover:text-stone-800 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500 font-light text-center">{error}</p>
          )}

          <button
            disabled={isLoading}
            className="w-full py-5 bg-stone-900 text-white text-[10px] tracking-[0.5em] uppercase hover:bg-stone-800 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {isLoading && <Loader2 className="w-3 h-3 animate-spin" />}
            {isLoading ? 'Authenticating...' : 'Enter the Sanctum'}
          </button>
        </form>
      </div>
    </div>
  );
};

const HeroEditor: React.FC<{ settings: any, onSave: any }> = ({ settings, onSave }) => (
  <div className="space-y-8">
    <ContentField label="Heading" settingsKey="hero_heading" value={settings.hero_heading} onSave={onSave} />
    <ContentField label="Subheading / Body" settingsKey="hero_body" value={settings.hero_body} onSave={onSave} isTextArea />
    <ContentField label="Background Image URL" settingsKey="hero_image" value={settings.hero_image} onSave={onSave} />
    <ContentField label="Tagline" settingsKey="hero_tagline" value={settings.hero_tagline} onSave={onSave} />
  </div>
);

const PhilosophyEditor: React.FC<{ settings: any, onSave: any }> = ({ settings, onSave }) => (
  <div className="space-y-12">
    <div className="space-y-8">
      <h3 className="text-[10px] tracking-[0.3em] uppercase text-stone-900 font-bold border-b border-stone-100 pb-2">Main Content</h3>
      <ContentField label="Heading" settingsKey="philosophy_heading" value={settings.philosophy_heading} onSave={onSave} />
      <ContentField label="Philosophy Body" settingsKey="philosophy_body" value={settings.philosophy_body} onSave={onSave} isTextArea />
    </div>
    
    <div className="space-y-8 pt-8 border-t border-stone-100">
      <h3 className="text-[10px] tracking-[0.3em] uppercase text-stone-900 font-bold border-b border-stone-100 pb-2">Pietra Subcomponent</h3>
      <ContentField label="Pietra Heading" settingsKey="pietra_heading" value={settings.pietra_heading} onSave={onSave} />
      <ContentField label="Pietra Body" settingsKey="pietra_body" value={settings.pietra_body} onSave={onSave} isTextArea />
      <ContentField label="Pietra Image URL" settingsKey="pietra_image" value={settings.pietra_image} onSave={onSave} />
    </div>

    <div className="space-y-8 pt-8 border-t border-stone-100">
      <h3 className="text-[10px] tracking-[0.3em] uppercase text-stone-900 font-bold border-b border-stone-100 pb-2">Plume Subcomponent</h3>
      <ContentField label="Plume Heading" settingsKey="plume_heading" value={settings.plume_heading} onSave={onSave} />
      <ContentField label="Plume Body" settingsKey="plume_body" value={settings.plume_body} onSave={onSave} isTextArea />
      <ContentField label="Plume Image URL" settingsKey="plume_image" value={settings.plume_image} onSave={onSave} />
    </div>
  </div>
);

const MethodologyEditor: React.FC<{ settings: any, onSave: any }> = ({ settings, onSave }) => (
  <div className="space-y-12">
    <div className="space-y-8">
      <h3 className="text-[10px] tracking-[0.3em] uppercase text-stone-900 font-bold border-b border-stone-100 pb-2">Main Content</h3>
      <ContentField label="Section Tag" settingsKey="methodology_tag" value={settings.methodology_tag} onSave={onSave} />
      <ContentField label="Heading" settingsKey="methodology_heading" value={settings.methodology_heading} onSave={onSave} />
      <ContentField label="Body Text" settingsKey="methodology_body" value={settings.methodology_body} onSave={onSave} isTextArea />
    </div>

    <div className="grid md:grid-cols-2 gap-12 pt-8 border-t border-stone-100">
      <div className="space-y-6">
        <h3 className="text-[10px] tracking-[0.3em] uppercase text-stone-900 font-bold border-b border-stone-100 pb-2">Principle 01</h3>
        <ContentField label="Title" settingsKey="meth_p1_title" value={settings.meth_p1_title} onSave={onSave} />
        <ContentField label="Description" settingsKey="meth_p1_desc" value={settings.meth_p1_desc} onSave={onSave} isTextArea />
      </div>
      <div className="space-y-6">
        <h3 className="text-[10px] tracking-[0.3em] uppercase text-stone-900 font-bold border-b border-stone-100 pb-2">Principle 02</h3>
        <ContentField label="Title" settingsKey="meth_p2_title" value={settings.meth_p2_title} onSave={onSave} />
        <ContentField label="Description" settingsKey="meth_p2_desc" value={settings.meth_p2_desc} onSave={onSave} isTextArea />
      </div>
      <div className="space-y-6">
        <h3 className="text-[10px] tracking-[0.3em] uppercase text-stone-900 font-bold border-b border-stone-100 pb-2">Principle 03</h3>
        <ContentField label="Title" settingsKey="meth_p3_title" value={settings.meth_p3_title} onSave={onSave} />
        <ContentField label="Description" settingsKey="meth_p3_desc" value={settings.meth_p3_desc} onSave={onSave} isTextArea />
      </div>
      <div className="space-y-6">
        <h3 className="text-[10px] tracking-[0.3em] uppercase text-stone-900 font-bold border-b border-stone-100 pb-2">Principle 04</h3>
        <ContentField label="Title" settingsKey="meth_p4_title" value={settings.meth_p4_title} onSave={onSave} />
        <ContentField label="Description" settingsKey="meth_p4_desc" value={settings.meth_p4_desc} onSave={onSave} isTextArea />
      </div>
    </div>
  </div>
);

const DepartureEditor: React.FC<{ settings: any, onSave: any }> = ({ settings, onSave }) => (
  <div className="space-y-12">
    <div className="space-y-8">
      <h3 className="text-[10px] tracking-[0.3em] uppercase text-stone-900 font-bold border-b border-stone-100 pb-2">Intro Section</h3>
      <ContentField label="Section Tag" settingsKey="departure_tag" value={settings.departure_tag} onSave={onSave} />
      <ContentField label="Heading" settingsKey="departure_heading" value={settings.departure_heading} onSave={onSave} />
      <ContentField label="Body Text" settingsKey="departure_body" value={settings.departure_body} onSave={onSave} isTextArea />
    </div>
    
    <div className="space-y-8 pt-8 border-t border-stone-100">
      <h3 className="text-[10px] tracking-[0.3em] uppercase text-stone-900 font-bold border-b border-stone-100 pb-2">Timeline Section</h3>
      <ContentField label="Timeline Tag" settingsKey="departure_timeline_tag" value={settings.departure_timeline_tag} onSave={onSave} />
      <ContentField label="Timeline Heading" settingsKey="departure_timeline_heading" value={settings.departure_timeline_heading} onSave={onSave} />
    </div>

    <div className="space-y-8 pt-8 border-t border-stone-100">
      <h3 className="text-[10px] tracking-[0.3em] uppercase text-stone-900 font-bold border-b border-stone-100 pb-2">Holidays / Sabbaticals</h3>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <h4 className="text-[9px] tracking-widest uppercase text-stone-400">Holiday 01</h4>
          <ContentField label="Name" settingsKey="hol_1_name" value={settings.hol_1_name} onSave={onSave} />
          <ContentField label="Location" settingsKey="hol_1_loc" value={settings.hol_1_loc} onSave={onSave} />
          <ContentField label="Image URL" settingsKey="hol_1_img" value={settings.hol_1_img} onSave={onSave} />
          <ContentField label="Description" settingsKey="hol_1_desc" value={settings.hol_1_desc} onSave={onSave} isTextArea />
        </div>
        <div className="space-y-4">
          <h4 className="text-[9px] tracking-widest uppercase text-stone-400">Holiday 02</h4>
          <ContentField label="Name" settingsKey="hol_2_name" value={settings.hol_2_name} onSave={onSave} />
          <ContentField label="Location" settingsKey="hol_2_loc" value={settings.hol_2_loc} onSave={onSave} />
          <ContentField label="Image URL" settingsKey="hol_2_img" value={settings.hol_2_img} onSave={onSave} />
          <ContentField label="Description" settingsKey="hol_2_desc" value={settings.hol_2_desc} onSave={onSave} isTextArea />
        </div>
        <div className="space-y-4">
          <h4 className="text-[9px] tracking-widest uppercase text-stone-400">Holiday 03</h4>
          <ContentField label="Name" settingsKey="hol_3_name" value={settings.hol_3_name} onSave={onSave} />
          <ContentField label="Location" settingsKey="hol_3_loc" value={settings.hol_3_loc} onSave={onSave} />
          <ContentField label="Image URL" settingsKey="hol_3_img" value={settings.hol_3_img} onSave={onSave} />
          <ContentField label="Description" settingsKey="hol_3_desc" value={settings.hol_3_desc} onSave={onSave} isTextArea />
        </div>
      </div>
    </div>
  </div>
);

const ServicesEditor: React.FC<{ settings: any, onSave: any }> = ({ settings, onSave }) => (
  <div className="space-y-12">
    <div className="space-y-8">
      <h3 className="text-[10px] tracking-[0.3em] uppercase text-stone-900 font-bold border-b border-stone-100 pb-2">Main Content</h3>
      <ContentField label="Section Tag" settingsKey="services_tag" value={settings.services_tag} onSave={onSave} />
      <ContentField label="Heading" settingsKey="services_heading" value={settings.services_heading} onSave={onSave} />
      <ContentField label="Body Text" settingsKey="services_body" value={settings.services_body} onSave={onSave} isTextArea />
    </div>

    <div className="grid md:grid-cols-2 gap-12 pt-8 border-t border-stone-100">
      <div className="space-y-6">
        <h3 className="text-[10px] tracking-[0.3em] uppercase text-stone-900 font-bold border-b border-stone-100 pb-2">Service 01</h3>
        <ContentField label="Title" settingsKey="serv_1_title" value={settings.serv_1_title} onSave={onSave} />
        <ContentField label="Image URL" settingsKey="serv_1_img" value={settings.serv_1_img} onSave={onSave} />
        <ContentField label="Description" settingsKey="serv_1_desc" value={settings.serv_1_desc} onSave={onSave} isTextArea />
      </div>
      <div className="space-y-6">
        <h3 className="text-[10px] tracking-[0.3em] uppercase text-stone-900 font-bold border-b border-stone-100 pb-2">Service 02</h3>
        <ContentField label="Title" settingsKey="serv_2_title" value={settings.serv_2_title} onSave={onSave} />
        <ContentField label="Image URL" settingsKey="serv_2_img" value={settings.serv_2_img} onSave={onSave} />
        <ContentField label="Description" settingsKey="serv_2_desc" value={settings.serv_2_desc} onSave={onSave} isTextArea />
      </div>
      <div className="space-y-6">
        <h3 className="text-[10px] tracking-[0.3em] uppercase text-stone-900 font-bold border-b border-stone-100 pb-2">Service 03</h3>
        <ContentField label="Title" settingsKey="serv_3_title" value={settings.serv_3_title} onSave={onSave} />
        <ContentField label="Image URL" settingsKey="serv_3_img" value={settings.serv_3_img} onSave={onSave} />
        <ContentField label="Description" settingsKey="serv_3_desc" value={settings.serv_3_desc} onSave={onSave} isTextArea />
      </div>
      <div className="space-y-6">
        <h3 className="text-[10px] tracking-[0.3em] uppercase text-stone-900 font-bold border-b border-stone-100 pb-2">Service 04</h3>
        <ContentField label="Title" settingsKey="serv_4_title" value={settings.serv_4_title} onSave={onSave} />
        <ContentField label="Image URL" settingsKey="serv_4_img" value={settings.serv_4_img} onSave={onSave} />
        <ContentField label="Description" settingsKey="serv_4_desc" value={settings.serv_4_desc} onSave={onSave} isTextArea />
      </div>
    </div>
  </div>
);

const ContactEditor: React.FC<{ settings: any, onSave: any }> = ({ settings, onSave }) => (
  <div className="space-y-8">
    <ContentField label="Section Tag" settingsKey="contact_tag" value={settings.contact_tag} onSave={onSave} />
    <ContentField label="Heading" settingsKey="contact_heading" value={settings.contact_heading} onSave={onSave} />
    <ContentField label="Contact Body" settingsKey="contact_body" value={settings.contact_body} onSave={onSave} isTextArea />
    <div className="grid md:grid-cols-2 gap-8">
      <ContentField label="Email" settingsKey="contact_email" value={settings.contact_email} onSave={onSave} />
      <ContentField label="Phone" settingsKey="contact_phone" value={settings.contact_phone} onSave={onSave} />
    </div>
    <ContentField label="Address" settingsKey="contact_address" value={settings.contact_address} onSave={onSave} isTextArea />
  </div>
);

const FooterEditor: React.FC<{ settings: any, onSave: any }> = ({ settings, onSave }) => (
  <div className="space-y-8">
    <ContentField label="Logo Text" settingsKey="footer_logo_text" value={settings.footer_logo_text} onSave={onSave} />
    <ContentField label="Logo Subtext" settingsKey="footer_logo_subtext" value={settings.footer_logo_subtext} onSave={onSave} />
    <ContentField label="Footer Body Text" settingsKey="footer_body" value={settings.footer_body} onSave={onSave} isTextArea />
  </div>
);

interface ContentFieldProps {
  label: string;
  settingsKey: string;
  value?: string;
  onSave: (key: string, value: string) => Promise<void>;
  isTextArea?: boolean;
}

const ContentField: React.FC<ContentFieldProps> = ({ label, settingsKey, value = '', onSave, isTextArea }) => {
  const [localValue, setLocalValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(settingsKey, localValue);
    setIsSaving(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <label className="text-[9px] tracking-[0.2em] uppercase text-stone-400">{label}</label>
        <button
          onClick={handleSave}
          disabled={isSaving || localValue === value}
          className="text-[9px] tracking-[0.2em] uppercase text-stone-900 font-medium hover:text-stone-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
      {isTextArea ? (
        <textarea
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          rows={4}
          className="w-full bg-stone-50 border border-stone-100 p-4 text-stone-800 font-light focus:outline-none focus:border-stone-400 transition-all text-sm leading-relaxed"
        />
      ) : (
        <input
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          className="w-full bg-transparent border-b border-stone-200 py-2 text-stone-800 font-light focus:outline-none focus:border-stone-800 transition-all text-sm"
        />
      )}
    </div>
  );
};

export default AdminPortal;
