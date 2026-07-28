import React, { useState, useEffect } from 'react';
import { useLiveDemoStore } from '../../../../packages/shared/src/store/useLiveDemoStore';
import TopBar from '../../components/layout/TopBar';
import { useLanguage } from '../../hooks/useLanguage';

export default function PatientHome() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const healthTips = useLiveDemoStore(s => s.healthTips);
  const tip = healthTips[0];

  useEffect(() => {
    const onScroll = (e) => setScrolled(e.target.scrollTop > 10);
    const el = document.getElementById('scroll-container');
    el?.addEventListener('scroll', onScroll);
    return () => el?.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="flex justify-center items-start min-h-screen bg-background">
      <div className="relative w-full h-full bg-background flex flex-col">
        {/* Top App Bar / Header */}
        <header className={`glass-header z-20 w-full px-edge_margin pt-xl pb-md flex flex-col gap-xs sticky top-0 transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`} style={{ backdropFilter: 'blur(8px)', background: 'rgba(250, 249, 247, 0.85)' }}>
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-sm">
              <div className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden">
                <img 
                  className="w-full h-full object-cover" 
                  alt="Profile" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzHG_xKgYuvHPrajWtThD6dDk9l96CDEP_g_s0wr2zAnYp4nydj9zWjOsaC57aMf5wjiUp4TnVMyz5pXoTzJMCF2Yqfy2erQzVXgOd1gZQDTdFClNXlrZatFurykwdoFhHYXsyXHoTowlv5l20XxlHp9sUpacLt0t0UaBPBzUePFJpCJae80guqjgxZCa2S-alDjeMnr_TPM8lMOrSJc9I4Coz3EXspYNIty__U_QW6R7kcBViGrRBxoFL2EjPGqwEs0wpY4JcCjE"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">Barangay San Isidro</span>
                <h1 className="text-primary font-headline-md text-headline-md -mt-1">Good morning, Maria!</h1>
              </div>
            </div>
            <button className="relative w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-high transition-transform active:scale-95">
              <span className="material-symbols-outlined text-primary">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Scrollable Canvas */}
        <main id="scroll-container" className="flex-1 overflow-y-auto px-edge_margin py-md space-y-stack_gap pb-24">
          {/* Reference Image Overlay (Bento Component) */}
          <section className="w-full h-48 rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(30,58,47,0.04)] relative group">
            <img 
              alt="Dashboard Overview" 
              className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAysXOaDaug9HdDnsIDf55qKq76r2uLEFWZhG98GrMKHUQ60S1OeR1GczYQ9UwYCTBHzcJOhB0XtJIz07VAYETmHjuR4RnXCHimQn5TGMABXJQdYse1InppeFblmtRX7lLkimSIXZKK1Vx1zmEizyg-OR686yIEfoP-6wiNXGczYZWDYOZUDZGXoRUAWWQywBRABsPZvcGp9docsDwvk9NyiOhgWG4KcU9H1D7xsaUXQtfzWzqToAgxtXFay0er3uYVqGr4KtAkrbU"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
            <div className="absolute bottom-md left-md">
              <span className="bg-secondary-container text-on-secondary-container px-sm py-xs rounded-full font-label-sm text-label-sm">COMMUNITY INSIGHT</span>
              <h2 className="text-white font-headline-sm text-headline-sm mt-xs">Health trends in San Isidro</h2>
            </div>
          </section>

          {/* Risk Status Card */}
          <section className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl shadow-[0_4px_12px_rgba(30,58,47,0.04)] flex items-start gap-md">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-primary-fixed-dim animate-[pulse_3s_infinite_ease-in-out]" style={{ fontVariationSettings: "'FILL' 1" }}>ecg_heart</span>
            </div>
            <div className="flex-grow">
              <div className="flex items-center justify-between mb-xs">
                <h3 className="text-primary font-headline-sm text-headline-sm">Risk Status</h3>
                <span className="px-sm py-1 bg-secondary-container text-on-secondary-container rounded-full text-label-sm font-label-sm flex items-center gap-xs">
                  <span className="w-2 h-2 bg-secondary rounded-full"></span>
                  Low Risk
                </span>
              </div>
              <p className="text-on-surface-variant font-body-md text-body-md leading-relaxed">
                Your last check-up looked healthy. Keep doing what you're doing!
              </p>
            </div>
          </section>

          {/* Appointment Card */}
          <section className="bg-primary text-on-primary p-md rounded-xl shadow-[0_4px_12px_rgba(30,58,47,0.04)] relative overflow-hidden group">
            {/* Abstract Texture Decor */}
            <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-md">
                <div>
                  <span className="text-primary-fixed-dim font-label-sm text-label-sm uppercase tracking-widest">Upcoming Visit</span>
                  <h3 className="font-headline-sm text-headline-sm mt-xs text-white">Follow-up check</h3>
                </div>
                <div className="bg-primary-container border border-on-primary-container/20 px-md py-xs rounded-lg flex flex-col items-center">
                  <span className="text-white font-headline-md text-headline-md">04</span>
                  <span className="text-primary-fixed-dim font-label-sm text-label-sm uppercase">Aug</span>
                </div>
              </div>
              <div className="flex flex-col gap-sm">
                <div className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary-fixed-dim text-[20px]">location_on</span>
                  <span className="font-body-md text-body-md">San Isidro Rural Health Unit</span>
                </div>
                <div className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary-fixed-dim text-[20px]">schedule</span>
                  <span className="font-body-md text-body-md">09:00 AM - 10:30 AM</span>
                </div>
              </div>
              <button className="w-full mt-lg bg-surface-bright text-primary font-label-sm text-label-sm py-md rounded-lg flex items-center justify-center gap-sm transition-all active:scale-95">
                VIEW INSTRUCTIONS
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </section>

          {/* Health Tip Card (Unique Style) */}
          <section className="bg-secondary-container/30 border-l-4 border-secondary p-md rounded-r-xl rounded-l-sm relative overflow-hidden">
            <div className="absolute top-2 right-2 opacity-10">
              <span className="material-symbols-outlined text-[64px]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
            </div>
            <div className="flex items-center gap-xs mb-sm">
              <span className="material-symbols-outlined text-secondary text-[20px]">spa</span>
              <span className="text-on-secondary-fixed-variant font-label-sm text-label-sm uppercase tracking-tighter">Health Tip</span>
            </div>
            <p className="text-on-secondary-fixed-variant font-headline-sm text-headline-sm leading-snug mb-xs">
              Stay hydrated today!
            </p>
            <p className="text-on-secondary-fixed-variant font-body-md text-body-md">
              Drinking at least 8 glasses of water helps your digestion and keeps your focus sharp during field work.
            </p>
          </section>

          {/* Daily Goals / Metrics Bento Grid Section */}
          <div className="grid grid-cols-2 gap-md pb-xl">
            <div className="bg-surface-container p-md rounded-xl shadow-[0_4px_12px_rgba(30,58,47,0.04)] flex flex-col justify-between h-32">
              <span className="material-symbols-outlined text-primary">directions_walk</span>
              <div>
                <span className="text-primary font-display-lg text-display-lg">5,432</span>
                <p className="text-on-surface-variant font-label-sm text-label-sm">Steps Today</p>
              </div>
            </div>
            <div className="bg-surface-container p-md rounded-xl shadow-[0_4px_12px_rgba(30,58,47,0.04)] flex flex-col justify-between h-32">
              <span className="material-symbols-outlined text-primary">water_drop</span>
              <div>
                <span className="text-primary font-display-lg text-display-lg">6/8</span>
                <p className="text-on-surface-variant font-label-sm text-label-sm">Glasses</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
