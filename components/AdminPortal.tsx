import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, LogOut, Loader2 } from 'lucide-react';
import ImagePicker from './admin/ImagePicker';

const AdminPortal: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/verify');
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
      } catch (err) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (data.success) {
        setIsAuthenticated(true);
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred during login');
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
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <AdminDashboard onLogout={handleLogout} />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-6">
      <div className="w-full max-w-md bg-white p-12 rounded-sm shadow-sm border border-stone-100">
        <div className="text-center mb-12">
          <h4 className="text-[10px] tracking-[0.5em] uppercase text-stone-400 mb-4">Secure Access</h4>
          <h2 className="serif text-4xl font-light text-stone-900">
            The Alchemist's <br/><span className="italic">Portal</span>
          </h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-1 group">
            <label className="text-[9px] tracking-[0.3em] uppercase text-stone-400 group-focus-within:text-stone-900 transition-colors">Username</label>
            <input 
              required
              type="text" 
              className="w-full bg-transparent border-b border-stone-200 py-3 text-stone-800 font-light focus:outline-none focus:border-stone-800 transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="space-y-1 group relative">
            <label className="text-[9px] tracking-[0.3em] uppercase text-stone-400 group-focus-within:text-stone-900 transition-colors">Password</label>
            <div className="relative">
              <input 
                required
                type={showPassword ? "text" : "password"} 
                className="w-full bg-transparent border-b border-stone-200 py-3 text-stone-800 font-light focus:outline-none focus:border-stone-800 transition-all pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 bottom-3 text-stone-400 hover:text-stone-900 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-[10px] text-red-500 italic tracking-widest text-center">{error}</p>
          )}

          <button 
            disabled={isLoading}
            className="w-full py-5 bg-stone-900 text-white text-[10px] tracking-[0.5em] uppercase hover:bg-stone-800 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {isLoading && <Loader2 className="w-3 h-3 animate-spin" />}
            {isLoading ? 'Authenticating...' : 'Enter Portal'}
          </button>
        </form>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [content, setContent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Force fresh fetch for admin portal
        const response = await fetch(`/api/content?t=${Date.now()}`);
        const data = await response.json();
        setContent(data);
      } catch (err) {
        console.error('Failed to fetch content', err);
      }
    };
    fetchContent();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      if (response.ok) {
        setSaveMessage('Content saved successfully');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage('Failed to save content');
      }
    } catch (err) {
      setSaveMessage('Error saving content');
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (section: string, field: string, value: any) => {
    setContent((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateArrayField = (section: string, arrayField: string, index: number, field: string, value: any) => {
    setContent((prev: any) => {
      const newArray = [...prev[section][arrayField]];
      newArray[index] = { ...newArray[index], [field]: value };
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [arrayField]: newArray
        }
      };
    });
  };

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
      </div>
    );
  }

  const tabs = [
    { id: 'hero', label: 'Hero' },
    { id: 'philosophy', label: 'Philosophy' },
    { id: 'agile', label: 'Agile Path' },
    { id: 'departure', label: 'Sabbatical' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'services', label: 'Services' },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-stone-100 px-8 py-6 flex justify-between items-center sticky top-0 bg-white z-30">
        <div className="flex items-center gap-4">
          <h1 className="serif text-3xl font-light text-stone-900">Alchemist's <span className="italic">Console</span></h1>
          <div className="h-4 w-px bg-stone-200"></div>
          <span className="text-[9px] tracking-[0.3em] uppercase text-stone-400">Content Management System</span>
        </div>
        <div className="flex items-center gap-6">
          {saveMessage && (
            <span className="text-[10px] text-stone-500 italic animate-fade-in">{saveMessage}</span>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-stone-900 text-white text-[10px] tracking-[0.2em] uppercase hover:bg-stone-800 transition-all rounded-sm disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Save Changes'}
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2.5 border border-stone-200 text-stone-600 text-[10px] tracking-[0.2em] uppercase hover:bg-stone-50 transition-all rounded-sm"
          >
            <LogOut className="w-3 h-3" />
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-grow overflow-hidden">
        {/* Sidebar Tabs */}
        <aside className="w-64 border-r border-stone-100 overflow-y-auto bg-stone-50/50">
          <nav className="p-6 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-3 text-[10px] tracking-[0.3em] uppercase transition-all rounded-sm ${
                  activeTab === tab.id 
                  ? 'bg-stone-900 text-white shadow-md' 
                  : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-grow overflow-y-auto p-12 bg-stone-50/20">
          <div className="max-w-4xl mx-auto space-y-12">
            {activeTab === 'hero' && (
              <div className="space-y-10 animate-fade-in">
                <SectionHeader title="Hero Section" description="The first impression of the alchemical journey." />
                <div className="grid gap-8">
                  <InputField label="Top Heading" value={content.hero.topHeading} onChange={(v) => updateField('hero', 'topHeading', v)} />
                  <InputField label="Main Heading" value={content.hero.mainHeading} onChange={(v) => updateField('hero', 'mainHeading', v)} />
                  <TextAreaField label="Description" value={content.hero.description} onChange={(v) => updateField('hero', 'description', v)} />
                  <ImagePicker label="Hero Image" value={content.hero.image} onChange={(v) => updateField('hero', 'image', v)} aspect={16/9} />
                </div>
              </div>
            )}

            {activeTab === 'philosophy' && (
              <div className="space-y-10 animate-fade-in">
                <SectionHeader title="Philosophy Section" description="Defining the balance between Pietra and Plume." />
                <div className="grid gap-8">
                  <InputField label="Sub Heading" value={content.philosophy.subHeading} onChange={(v) => updateField('philosophy', 'subHeading', v)} />
                  <InputField label="Main Heading" value={content.philosophy.mainHeading} onChange={(v) => updateField('philosophy', 'mainHeading', v)} />
                  <TextAreaField label="Quote" value={content.philosophy.quote} onChange={(v) => updateField('philosophy', 'quote', v)} />
                  
                  <div className="pt-8 border-t border-stone-100">
                    <h3 className="serif text-2xl mb-6 italic">Pietra Component</h3>
                    <div className="grid gap-6">
                      <InputField label="Pietra Title" value={content.philosophy.pietraTitle} onChange={(v) => updateField('philosophy', 'pietraTitle', v)} />
                      <TextAreaField label="Pietra Description" value={content.philosophy.pietraDescription} onChange={(v) => updateField('philosophy', 'pietraDescription', v)} />
                      <ImagePicker label="Pietra Image" value={content.philosophy.pietraImage} onChange={(v) => updateField('philosophy', 'pietraImage', v)} aspect={4/5} />
                    </div>
                  </div>

                  <div className="pt-8 border-t border-stone-100">
                    <h3 className="serif text-2xl mb-6 italic">Plume Component</h3>
                    <div className="grid gap-6">
                      <InputField label="Plume Title" value={content.philosophy.plumeTitle} onChange={(v) => updateField('philosophy', 'plumeTitle', v)} />
                      <TextAreaField label="Plume Description" value={content.philosophy.plumeDescription} onChange={(v) => updateField('philosophy', 'plumeDescription', v)} />
                      <ImagePicker label="Plume Image" value={content.philosophy.plumeImage} onChange={(v) => updateField('philosophy', 'plumeImage', v)} aspect={4/5} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'agile' && (
              <div className="space-y-10 animate-fade-in">
                <SectionHeader title="Agile Methodology" description="The Plume Path of iterative manifestation." />
                <div className="grid gap-8">
                  <InputField label="Sub Heading" value={content.agile.subHeading} onChange={(v) => updateField('agile', 'subHeading', v)} />
                  <InputField label="Main Heading" value={content.agile.mainHeading} onChange={(v) => updateField('agile', 'mainHeading', v)} />
                  <TextAreaField label="Description" value={content.agile.description} onChange={(v) => updateField('agile', 'description', v)} />
                  
                  <div className="pt-8 border-t border-stone-100">
                    <h3 className="serif text-2xl mb-6 italic">Principles</h3>
                    <div className="space-y-10">
                      {content.agile.principles.map((p: any, i: number) => (
                        <div key={i} className="p-6 bg-white border border-stone-100 rounded-sm space-y-4">
                          <InputField label={`Step ${p.step} Title`} value={p.title} onChange={(v) => updateArrayField('agile', 'principles', i, 'title', v)} />
                          <TextAreaField label={`Step ${p.step} Description`} value={p.description} onChange={(v) => updateArrayField('agile', 'principles', i, 'description', v)} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'departure' && (
              <div className="space-y-10 animate-fade-in">
                <SectionHeader title="The Grand Departure" description="Curated sabbatical sanctuaries for the client." />
                <div className="grid gap-8">
                  <InputField label="Sub Heading" value={content.departure.subHeading} onChange={(v) => updateField('departure', 'subHeading', v)} />
                  <InputField label="Main Heading" value={content.departure.mainHeading} onChange={(v) => updateField('departure', 'mainHeading', v)} />
                  <TextAreaField label="Description" value={content.departure.description} onChange={(v) => updateField('departure', 'description', v)} />
                  
                  <div className="pt-8 border-t border-stone-100">
                    <h3 className="serif text-2xl mb-6 italic">Holidays</h3>
                    <div className="grid gap-10">
                      {content.departure.holidays.map((h: any, i: number) => (
                        <div key={i} className="p-6 bg-white border border-stone-100 rounded-sm space-y-4">
                          <InputField label="Name" value={h.name} onChange={(v) => updateArrayField('departure', 'holidays', i, 'name', v)} />
                          <InputField label="Location" value={h.location} onChange={(v) => updateArrayField('departure', 'holidays', i, 'location', v)} />
                          <TextAreaField label="Description" value={h.description} onChange={(v) => updateArrayField('departure', 'holidays', i, 'description', v)} />
                          <ImagePicker label="Holiday Image" value={h.imageUrl} onChange={(v) => updateArrayField('departure', 'holidays', i, 'imageUrl', v)} aspect={16/9} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div className="space-y-10 animate-fade-in">
                <SectionHeader title="Portfolio" description="Selected works manifested by the studio." />
                <div className="grid gap-8">
                  <InputField label="Sub Heading" value={content.portfolio.subHeading} onChange={(v) => updateField('portfolio', 'subHeading', v)} />
                  <InputField label="Main Heading" value={content.portfolio.mainHeading} onChange={(v) => updateField('portfolio', 'mainHeading', v)} />
                  <TextAreaField label="Description" value={content.portfolio.description} onChange={(v) => updateField('portfolio', 'description', v)} />
                  
                  <div className="pt-8 border-t border-stone-100">
                    <h3 className="serif text-2xl mb-6 italic">Projects</h3>
                    <div className="grid gap-10">
                      {content.portfolio.projects.map((p: any, i: number) => (
                        <div key={i} className="p-6 bg-white border border-stone-100 rounded-sm space-y-4">
                          <InputField label="Title" value={p.title} onChange={(v) => updateArrayField('portfolio', 'projects', i, 'title', v)} />
                          <InputField label="Category" value={p.category} onChange={(v) => updateArrayField('portfolio', 'projects', i, 'category', v)} />
                          <InputField label="Location" value={p.location} onChange={(v) => updateArrayField('portfolio', 'projects', i, 'location', v)} />
                          <InputField label="Year" value={p.year} onChange={(v) => updateArrayField('portfolio', 'projects', i, 'year', v)} />
                          <TextAreaField label="Description" value={p.description} onChange={(v) => updateArrayField('portfolio', 'projects', i, 'description', v)} />
                          <ImagePicker label="Project Image" value={p.imageUrl} onChange={(v) => updateArrayField('portfolio', 'projects', i, 'imageUrl', v)} aspect={3/2} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="space-y-10 animate-fade-in">
                <SectionHeader title="Services" description="Ethereal provisions and alchemical expertise." />
                <div className="grid gap-8">
                  <InputField label="Sub Heading" value={content.services.subHeading} onChange={(v) => updateField('services', 'subHeading', v)} />
                  <InputField label="Main Heading" value={content.services.mainHeading} onChange={(v) => updateField('services', 'mainHeading', v)} />
                  
                  <div className="pt-8 border-t border-stone-100">
                    <h3 className="serif text-2xl mb-6 italic">Service Offerings</h3>
                    <div className="grid gap-10">
                      {content.services.services.map((s: any, i: number) => (
                        <div key={i} className="p-6 bg-white border border-stone-100 rounded-sm space-y-4">
                          <InputField label="Title" value={s.title} onChange={(v) => updateArrayField('services', 'services', i, 'title', v)} />
                          <TextAreaField label="Description" value={s.description} onChange={(v) => updateArrayField('services', 'services', i, 'description', v)} />
                          <TextAreaField label="Long Description" value={s.longDescription} onChange={(v) => updateArrayField('services', 'services', i, 'longDescription', v)} />
                          <ImagePicker label="Service Image" value={s.image} onChange={(v) => updateArrayField('services', 'services', i, 'image', v)} aspect={16/9} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

const SectionHeader: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="space-y-2">
    <h2 className="serif text-4xl font-light text-stone-900">{title}</h2>
    <p className="text-stone-400 font-light italic text-sm">{description}</p>
  </div>
);

const InputField: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => (
  <div className="space-y-1 group">
    <label className="text-[9px] tracking-[0.3em] uppercase text-stone-400 group-focus-within:text-stone-900 transition-colors">{label}</label>
    <input 
      type="text" 
      className="w-full bg-white border border-stone-100 px-4 py-3 text-stone-800 font-light focus:outline-none focus:border-stone-800 transition-all rounded-sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const TextAreaField: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => (
  <div className="space-y-1 group">
    <label className="text-[9px] tracking-[0.3em] uppercase text-stone-400 group-focus-within:text-stone-900 transition-colors">{label}</label>
    <textarea 
      rows={4}
      className="w-full bg-white border border-stone-100 px-4 py-3 text-stone-800 font-light focus:outline-none focus:border-stone-800 transition-all rounded-sm resize-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default AdminPortal;
