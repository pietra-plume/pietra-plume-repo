import React, { useState } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { GOOGLE_SHEET_WEBHOOK_URL } from '../../constants';

interface ConsultationModalProps {
  onClose: () => void;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({ onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    apartmentType: '2 BHK'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (GOOGLE_SHEET_WEBHOOK_URL) {
      try {
        // Prepare payload: Prepend single quote to contactNumber to prevent Google Sheets formula parsing errors
        // for numbers starting with '+'
        const payload = {
          ...formData,
          contactNumber: `'${formData.contactNumber}`,
          timestamp: new Date().toLocaleString()
        };

        // We use mode: 'no-cors' to avoid CORS preflight issues with simple Google Apps Scripts.
        // The data is sent, but we won't receive a readable JSON response.
        await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain', // Use text/plain to avoid preflight
          },
          body: JSON.stringify(payload)
        });
      } catch (error) {
        console.error("Submission error:", error);
        // We proceed to show success state anyway to ensure good UX
      }
    } else {
        console.warn("Google Sheet Webhook URL is not configured in constants.ts");
    }

    // Simulate network delay for better UX
    setTimeout(() => {
      setSubmitted(true);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-sm shadow-2xl relative overflow-hidden">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8 md:p-10">
          {!submitted ? (
            <>
              <h2 className="text-3xl font-serif text-stone-900 mb-2">Start Your Journey</h2>
              <p className="text-stone-600 mb-8">Book your 15-day sprint. We'll handle the rest.</p>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Full Name</label>
                  <input 
                    name="fullName"
                    type="text" 
                    required 
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full p-3 bg-stone-50 border border-stone-200 focus:border-amber-600 focus:outline-none transition-colors" 
                    placeholder="John Doe" 
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Contact Number</label>
                  <input 
                    name="contactNumber"
                    type="tel" 
                    required 
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="w-full p-3 bg-stone-50 border border-stone-200 focus:border-amber-600 focus:outline-none transition-colors" 
                    placeholder="+91 98765 00000" 
                  />
                </div>

                <div>
                   <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Apartment Type</label>
                   <select 
                      name="apartmentType"
                      value={formData.apartmentType}
                      onChange={handleChange}
                      className="w-full p-3 bg-stone-50 border border-stone-200 focus:border-amber-600 focus:outline-none transition-colors"
                   >
                       <option>2 BHK</option>
                       <option>3 BHK</option>
                       <option>4 BHK / Penthouse</option>
                       <option>Villa</option>
                   </select>
                </div>

                <div className="pt-2">
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full py-4 bg-stone-900 text-white font-bold tracking-widest hover:bg-amber-600 transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="animate-spin" size={16} /> SCHEDULING...
                          </>
                        ) : (
                          "SCHEDULE CONSULTATION"
                        )}
                    </button>
                    <p className="text-xs text-stone-400 text-center mt-4">We respect your privacy. No spam.</p>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={32} />
              </div>
              <h3 className="text-2xl font-serif text-stone-900 mb-2">Request Received</h3>
              <p className="text-stone-600 mb-8">
                Thank you, {formData.fullName}.<br/>
                Our Senior Agile Design Lead will contact you shortly at {formData.contactNumber}.
              </p>
              <button onClick={onClose} className="text-sm font-bold border-b border-stone-900 pb-1 hover:text-amber-600 hover:border-amber-600 transition-colors">
                CLOSE WINDOW
              </button>
            </div>
          )}
        </div>
        
        {!submitted && <div className="h-2 bg-amber-600 w-full absolute bottom-0"></div>}
      </div>
    </div>
  );
};