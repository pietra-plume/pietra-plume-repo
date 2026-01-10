import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Philosophy from './components/Philosophy';
import Portfolio from './components/Portfolio';
import Services from './components/Services';
import AgileMethodology from './components/AgileMethodology';
import TheDeparture from './components/TheDeparture';
import Footer from './components/Footer';
import { GOOGLE_SHEET_WEBHOOK_URL } from './constants';

const Home: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (GOOGLE_SHEET_WEBHOOK_URL) {
        await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain',
          },
          body: JSON.stringify({
            name: formData.name,
            phone: `'${formData.phone}`, // Prefix with quote to force string interpretation in Sheets
            message: formData.message,
            timestamp: new Date().toLocaleString(),
            source: 'Main Contact Form'
          })
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
    }

    // Simulate high-end processing / wait for request to likely complete
    setTimeout(() => {
      setSubmitted(true);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Philosophy />
      <AgileMethodology />
      <TheDeparture />
      <Portfolio />
      <Services />
      
      {/* Contact Section - The Dialogue */}
      <section id="contact" className="py-32 px-6 bg-white scroll-mt-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24">
            {/* Left Column: Firm Details */}
            <div className="space-y-16">
              <div className="space-y-6">
                <h4 className="text-[10px] tracking-[0.5em] uppercase text-stone-400">Initiate Connection</h4>
                <h2 className="serif text-6xl md:text-7xl font-light leading-tight text-stone-900">
                  The Design <br/><span className="italic">Dialogue</span>.
                </h2>
                <p className="text-stone-500 text-lg font-light leading-relaxed max-w-md">
                  Whether you possess a definitive blueprint or merely a whisper of intent, we invite you to cross the threshold.
                </p>
              </div>

              <div className="pt-12 border-t border-stone-100">
                <div className="space-y-4">
                  <span className="text-[9px] tracking-[0.4em] uppercase text-stone-900 font-bold">Inquiries</span>
                  <p className="text-sm text-stone-500 font-light">
                    contactus@pietraplume.com
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Form */}
            <div className="bg-stone-50 p-8 md:p-16 rounded-sm shadow-sm">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="space-y-1 group">
                    <label className="text-[9px] tracking-[0.3em] uppercase text-stone-400 group-focus-within:text-stone-900 transition-colors">Your Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-transparent border-b border-stone-200 py-3 text-stone-800 font-light focus:outline-none focus:border-stone-800 transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1 group">
                    <label className="text-[9px] tracking-[0.3em] uppercase text-stone-400 group-focus-within:text-stone-900 transition-colors">Phone Number</label>
                    <input 
                      required
                      type="tel" 
                      className="w-full bg-transparent border-b border-stone-200 py-3 text-stone-800 font-light focus:outline-none focus:border-stone-800 transition-all"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1 group">
                    <label className="text-[9px] tracking-[0.3em] uppercase text-stone-400 group-focus-within:text-stone-900 transition-colors">Your Vision</label>
                    <textarea 
                      required
                      rows={4}
                      className="w-full bg-transparent border-b border-stone-200 py-3 text-stone-800 font-light focus:outline-none focus:border-stone-800 transition-all resize-none"
                      placeholder="Briefly describe the essence of your project..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                  </div>

                  <button 
                    disabled={isSubmitting}
                    className="w-full py-5 bg-stone-900 text-white text-[10px] tracking-[0.5em] uppercase hover:bg-stone-800 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                  >
                    {isSubmitting && <div className="w-3 h-3 border-t-2 border-white rounded-full animate-spin"></div>}
                    {isSubmitting ? 'Transmitting...' : 'Begin the Dialogue'}
                  </button>
                  <p className="text-[9px] text-stone-400 italic text-center tracking-widest">
                    Your transmission will be handled with absolute discretion.
                  </p>
                </form>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-fade-in">
                  <div className="w-20 h-20 border border-stone-200 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-stone-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="space-y-4">
                    <h3 className="serif text-4xl italic font-light">Dialogue Initiated.</h3>
                    <p className="text-stone-500 font-light max-w-xs mx-auto leading-relaxed">
                      Thank you, {formData.name.split(' ')[0]}. An architectural alchemist will review your vision and reach out within one lunar cycle.
                    </p>
                  </div>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="text-[10px] tracking-[0.3em] uppercase text-stone-400 hover:text-stone-900 border-b border-stone-200 pb-1 transition-all"
                  >
                    Send Another Vision
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;