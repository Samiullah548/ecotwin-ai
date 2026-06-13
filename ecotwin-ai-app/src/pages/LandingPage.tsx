import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="bg-background text-on-surface overflow-x-hidden min-h-screen">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-surface/10 backdrop-blur-xl border-b border-white/10 shadow-sm transition-all duration-300 ease-in-out hidden md:block">
        <div className="flex justify-between items-center px-margin-desktop py-4 w-full max-w-container-max mx-auto">
          <div className="font-headline-md text-headline-md font-bold text-primary">EcoTwin AI</div>
          <div className="flex gap-8 items-center">
            <Link className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" to="/assessment">Assessment</Link>
            <Link className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" to="/simulator">Simulator</Link>
            <Link className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" to="/">Dashboard</Link>
          </div>
          <Link to="/" className="bg-secondary text-on-secondary font-label-md text-label-md px-6 py-2 rounded-full hover:bg-[#aed500] transition-colors shadow-[0_0_20px_2px_rgba(211,254,50,0.3)] inline-block">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Mobile Top Bar Proxy */}
      <nav className="fixed top-0 w-full z-50 bg-surface/10 backdrop-blur-xl border-b border-white/10 shadow-sm transition-all duration-300 ease-in-out md:hidden flex justify-between items-center px-margin-mobile py-4">
        <div className="font-headline-md text-headline-md font-bold text-primary">EcoTwin AI</div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-on-surface">
          <span className="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span>
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden fixed top-[68px] left-0 w-full bg-surface-container-low/95 backdrop-blur-xl border-b border-white/10 z-40 p-4 space-y-4 shadow-2xl flex flex-col">
          <Link onClick={() => setMenuOpen(false)} className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors p-2" to="/assessment">Assessment</Link>
          <Link onClick={() => setMenuOpen(false)} className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors p-2" to="/simulator">Simulator</Link>
          <Link onClick={() => setMenuOpen(false)} className="font-label-md text-label-md text-secondary transition-colors p-2" to="/">Dashboard</Link>
          <Link onClick={() => setMenuOpen(false)} to="/" className="bg-secondary text-on-secondary font-label-md text-label-md px-6 py-3 rounded-lg hover:bg-[#aed500] transition-colors text-center mt-2">
            Get Started
          </Link>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-24 md:pt-32 pb-24 min-h-screen" style={{ background: "radial-gradient(circle at 50% 0%, #0f2922 0%, #0c1513 70%)" }}>
        
        {/* Hero Section */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-32 relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center min-h-[716px]">
            <div className="md:col-span-6 z-10 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 font-label-sm text-label-sm text-primary mb-4">
                <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_theme('colors.secondary')]"></span>
                Live Earth Sync Enabled
              </div>
              <h1 className="font-display-lg text-display-lg md:text-[80px] leading-tight text-on-surface">
                Your Digital <br/>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-secondary to-tertiary">Climate Companion</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                Harness the power of biophilic futurism to simulate, understand, and optimize your environmental impact in real-time. Navigate towards a sustainable future with precision AI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/" className="bg-secondary text-on-secondary font-label-md text-label-md px-8 py-4 rounded-lg hover:bg-[#aed500] transition-all shadow-[0_0_20px_2px_rgba(211,254,50,0.3)] flex items-center justify-center gap-2 group">
                  Start Your Journey
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
                <Link to="/simulator" className="bg-white/5 backdrop-blur-md text-on-surface font-label-md text-label-md px-8 py-4 rounded-lg hover:bg-white/10 transition-all border border-secondary/30 flex items-center justify-center gap-2">
                  View Simulation
                  <span className="material-symbols-outlined">play_circle</span>
                </Link>
              </div>
            </div>

            <div className="md:col-span-6 relative h-[500px] md:h-[700px] w-full flex items-center justify-center mt-12 md:mt-0">
              {/* Globe Visualization Placeholder */}
              <div className="absolute inset-0 rounded-full w-[80%] h-[80%] m-auto bg-gradient-to-br from-tertiary/20 to-primary/10 blur-3xl mix-blend-screen"></div>
              <div 
                className="relative w-full h-full bg-cover bg-center rounded-full overflow-hidden border-t border-l border-white/15 shadow-2xl bg-white/5 backdrop-blur-3xl" 
                style={{ backgroundImage: "url('/hero.png')" }}
              >
                {/* Glass UI Overlay Elements */}
                <div className="absolute top-1/4 -left-4 bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-xl flex items-center gap-3 animate-[pulse_4s_ease-in-out_infinite]">
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined">co2</span>
                  </div>
                  <div>
                    <div className="font-label-sm text-label-sm text-on-surface-variant">Carbon Offset</div>
                    <div className="font-label-md text-label-md text-on-surface">+24.5%</div>
                  </div>
                </div>
                <div className="absolute bottom-1/3 -right-8 bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-xl flex items-center gap-3 animate-[pulse_5s_ease-in-out_infinite_reverse]">
                  <div className="w-10 h-10 rounded-full bg-tertiary/20 flex items-center justify-center text-tertiary">
                    <span className="material-symbols-outlined">thermostat</span>
                  </div>
                  <div>
                    <div className="font-label-sm text-label-sm text-on-surface-variant">Global Temp Variance</div>
                    <div className="font-label-md text-label-md text-tertiary">-0.2°C</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-32">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg md:text-[48px] text-on-surface mb-4">Intelligence meets Ecosystem</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">Advanced predictive models to guide sustainable decision-making.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[250px]">
            
            {/* Feature 1: AI Insights */}
            <div className="md:col-span-8 bg-white/5 backdrop-blur-3xl border-t border-l border-white/15 shadow-2xl rounded-2xl p-8 relative overflow-hidden flex flex-col justify-end group">
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-high/90 to-transparent z-10"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-tertiary/20 rounded-full blur-[80px] -mr-10 -mt-10"></div>
              <div className="relative z-20">
                <div className="w-12 h-12 rounded-lg bg-surface/50 border border-white/10 flex items-center justify-center text-tertiary mb-4">
                  <span className="material-symbols-outlined">insights</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2">AI Insights</h3>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-md">Deep-learning algorithms analyze complex environmental data to reveal hidden patterns and actionable sustainability metrics.</p>
              </div>
            </div>

            {/* Feature 2: Future Simulations */}
            <div className="md:col-span-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden flex flex-col justify-between group hover:border-secondary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-surface/50 border border-white/10 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined">public</span>
              </div>
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Future Simulations</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Project the long-term impact of today's choices with high-fidelity scenario modeling.</p>
              </div>
            </div>

            {/* Feature 3: Personalized Roadmap */}
            <div className="md:col-span-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 border-l-4 border-l-primary">
              <div className="flex-1">
                <div className="w-12 h-12 rounded-lg bg-surface/50 border border-white/10 flex items-center justify-center text-primary mb-4">
                  <span className="material-symbols-outlined">route</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Personalized Roadmap</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">A dynamic, step-by-step guide tailored to your unique operational footprint, designed to accelerate your transition to carbon neutral.</p>
              </div>
              <div className="flex-1 w-full relative h-32 bg-surface-container/50 rounded-xl overflow-hidden flex items-center p-6 border border-white/5">
                {/* Faux progress UI */}
                <div className="w-full space-y-4 relative z-10">
                  <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
                    <span>Phase 1: Reduction</span>
                    <span className="text-secondary">68%</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full w-[68%] bg-gradient-to-r from-primary to-secondary rounded-full shadow-[0_0_10px_theme('colors.secondary')]"></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full relative bottom-0 bg-surface-container-lowest border-t border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin-desktop py-12 w-full max-w-container-max mx-auto">
          <div className="flex flex-col items-center md:items-start gap-4 mb-8 md:mb-0">
            <div className="font-headline-md text-headline-md font-bold text-primary">EcoTwin AI</div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high border border-white/10 font-label-sm text-label-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-secondary text-[16px]">energy_savings_leaf</span>
              Carbon Neutral Computing
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-8 md:mb-0">
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-secondary hover:underline transition-opacity duration-200" href="#">Resources</a>
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-secondary hover:underline transition-opacity duration-200" href="#">Privacy Policy</a>
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-secondary hover:underline transition-opacity duration-200" href="#">Security</a>
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-secondary hover:underline transition-opacity duration-200" href="#">Sustainability Commitment</a>
          </div>
          <div className="font-body-md text-body-md text-on-surface-variant text-center md:text-right">
            © 2024 EcoTwin AI. Carbon Neutral Computing.
          </div>
        </div>
      </footer>
    </div>
  );
};
