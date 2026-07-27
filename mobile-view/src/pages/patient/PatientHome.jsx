import React, { useEffect, useState } from 'react';
import TopBar from '../../components/layout/TopBar';
import BottomNavigation from '../../components/layout/BottomNavigation';
import Card from '../../components/ui/Card';
import RiskBadge from '../../components/ui/RiskBadge';
import Button from '../../components/ui/Button';

export default function PatientHome() {
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = (e) => {
    setScrolled(e.target.scrollTop > 20);
  };

  return (
    <div className="flex flex-col h-full w-full relative">
      <div className={`transition-all duration-300 ${scrolled ? 'shadow-md z-20' : ''}`}>
        <TopBar 
          title="Good morning, Maria!"
          subtitle="Barangay San Isidro"
          imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuCzHG_xKgYuvHPrajWtThD6dDk9l96CDEP_g_s0wr2zAnYp4nydj9zWjOsaC57aMf5wjiUp4TnVMyz5pXoTzJMCF2Yqfy2erQzVXgOd1gZQDTdFClNXlrZatFurykwdoFhHYXsyXHoTowlv5l20XxlHp9sUpacLt0t0UaBPBzUePFJpCJae80guqjgxZCa2S-alDjeMnr_TPM8lMOrSJc9I4Coz3EXspYNIty__U_QW6R7kcBViGrRBxoFL2EjPGqwEs0wpY4JcCjE"
          showNotification
        />
      </div>

      <main className="flex-1 overflow-y-auto px-edge_margin py-md space-y-stack_gap" onScroll={handleScroll}>
        
        {/* Reference Image Overlay (Bento Component) */}
        <section className="w-full h-48 rounded-xl overflow-hidden forest-card-shadow relative group">
          <img 
            alt="Dashboard Overview" 
            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAysXOaDaug9HdDnsIDf55qKq76r2uLEFWZhG98GrMKHUQ60S1OeR1GczYQ9UwYCTBHzcJOhB0XtJIz07VAYETmHjuR4RnXCHimQn5TGMABXJQdYse1InppeFblmtRX7lLkimSIXZKK1Vx1zmEizyg-OR686yIEfoP-6wiNXGczYZWDYOZUDZGXoRUAWWQywBRABsPZvcGp9docsDwvk9NyiOhgWG4KcU9H1D7xsaUXQtfzWzqToAgxtXFay0er3uYVqGr4KtAkrbU"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
          <div className="absolute bottom-md left-md">
            <span className="bg-secondary-container text-on-secondary-container px-sm py-xs rounded-full font-label-sm text-[10px]">COMMUNITY INSIGHT</span>
            <h2 className="text-white font-headline-sm text-lg mt-xs">Health trends in San Isidro</h2>
          </div>
        </section>

        {/* Risk Status Card */}
        <Card className="flex items-start gap-md">
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-primary-fixed-dim pulse-soft" style={{ fontVariationSettings: "'FILL' 1" }}>ecg_heart</span>
          </div>
          <div className="flex-grow">
            <div className="flex items-center justify-between mb-xs">
              <h3 className="text-primary font-headline-sm text-[18px]">Risk Status</h3>
              <RiskBadge level="low" />
            </div>
            <p className="text-on-surface-variant font-body-md text-sm leading-relaxed">
              Your last check-up looked healthy. Keep doing what you're doing!
            </p>
          </div>
        </Card>

        {/* Appointment Card */}
        <section className="bg-primary text-on-primary p-md rounded-xl forest-card-shadow relative overflow-hidden group">
          <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-md">
              <div>
                <span className="text-primary-fixed-dim font-label-sm text-[10px] uppercase tracking-widest">Upcoming Visit</span>
                <h3 className="font-headline-sm text-lg mt-xs text-white">Follow-up check</h3>
              </div>
              <div className="bg-primary-container border border-on-primary-container/20 px-md py-xs rounded-lg flex flex-col items-center">
                <span className="text-white font-headline-md text-2xl">04</span>
                <span className="text-primary-fixed-dim font-label-sm text-[10px] uppercase">Aug</span>
              </div>
            </div>
            <div className="flex flex-col gap-sm">
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary-fixed-dim text-[20px]">location_on</span>
                <span className="font-body-md text-sm text-white">San Isidro Rural Health Unit</span>
              </div>
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary-fixed-dim text-[20px]">schedule</span>
                <span className="font-body-md text-sm text-white">09:00 AM - 10:30 AM</span>
              </div>
            </div>
            <Button variant="surface" className="mt-lg" iconRight="arrow_forward">
              VIEW INSTRUCTIONS
            </Button>
          </div>
        </section>

        {/* Health Tip Card */}
        <section className="bg-secondary-container/30 border-l-4 border-secondary p-md rounded-r-xl rounded-l-sm relative overflow-hidden">
          <div className="absolute top-2 right-2 opacity-10">
            <span className="material-symbols-outlined text-[64px]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
          </div>
          <div className="flex items-center gap-xs mb-sm">
            <span className="material-symbols-outlined text-secondary text-[20px]">spa</span>
            <span className="text-on-secondary-fixed-variant font-label-sm text-[10px] uppercase tracking-tighter">Health Tip</span>
          </div>
          <p className="text-on-secondary-fixed-variant font-headline-sm text-base leading-snug mb-xs">
            Stay hydrated today!
          </p>
          <p className="text-on-secondary-fixed-variant font-body-md text-sm">
            Drinking at least 8 glasses of water helps your digestion and keeps your focus sharp during field work.
          </p>
        </section>
        
        {/* Daily Goals */}
        <div className="grid grid-cols-2 gap-md pb-xl">
          <Card className="flex flex-col justify-between h-32">
            <span className="material-symbols-outlined text-primary">directions_walk</span>
            <div>
              <span className="text-primary font-display-lg text-2xl">5,432</span>
              <p className="text-on-surface-variant font-label-sm text-xs mt-1">Steps Today</p>
            </div>
          </Card>
          <Card className="flex flex-col justify-between h-32">
            <span className="material-symbols-outlined text-primary">water_drop</span>
            <div>
              <span className="text-primary font-display-lg text-2xl">6/8</span>
              <p className="text-on-surface-variant font-label-sm text-xs mt-1">Glasses</p>
            </div>
          </Card>
        </div>

      </main>
      
      <BottomNavigation mode="patient" />
    </div>
  );
}
