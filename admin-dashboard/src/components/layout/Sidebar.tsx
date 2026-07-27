"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  ArrowRightLeft,
  CheckCircle,
  BarChart,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Patient Registry", href: "/patients", icon: Users },
  { name: "Risk Queue", href: "/risk-queue", icon: AlertTriangle, badge: 6 },
  { name: "Referrals", href: "/referrals", icon: ArrowRightLeft },
  { name: "Clinical Validation", href: "/clinical-validation", icon: CheckCircle },
  { name: "Reports & Analytics", href: "/reports", icon: BarChart },
  { name: "Settings", href: "/settings", icon: Settings },
];

import { usePathname } from "next/navigation";
import { useDemoStore } from "@/store/useDemoStore";

export function Sidebar() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  useEffect(() => setMounted(true), []);

  const { triggerLiveSync, liveTriggerFired } = useDemoStore();

  if (!mounted) {
    return <aside className="fixed left-0 top-0 h-full w-[228px] bg-sidebar flex flex-col py-8 z-50 text-sidebar-foreground"></aside>;
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-[228px] bg-sidebar flex flex-col py-8 z-50 text-sidebar-foreground">
      <div className="px-6 mb-10 flex items-center gap-3 relative group">
        <div className="w-10 h-10 bg-sidebar-primary/20 rounded-lg flex items-center justify-center text-sidebar-primary font-bold text-xl">
          A
        </div>
        <div>
          <h1 className="text-xl font-bold leading-none">AImhotech</h1>
          <p className="text-[10px] tracking-widest text-sidebar-foreground/60 mt-1 uppercase">
            WEB ADMIN
          </p>
        </div>
        
        {/* Hidden Dev Trigger for Live Demo */}
        <button 
          onClick={triggerLiveSync}
          className={`absolute top-0 right-0 w-4 h-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
            liveTriggerFired ? 'bg-primary' : 'bg-muted/50 cursor-pointer hover:bg-muted'
          }`}
          title="Dev Trigger: Inject Maria Dela Cruz"
        />
      </div>

      <nav className="flex-1 space-y-1">
        {navigation.map((item) => {
          // Check if current path starts with item.href (except for exact match on "/")
          const isActive = item.href === "/" 
            ? pathname === "/" 
            : pathname.startsWith(item.href);
            
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center w-full px-6 py-3 transition-colors text-sm",
                isActive
                  ? "bg-white/10 border-l-4 border-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-white/5 hover:text-sidebar-foreground"
              )}
            >
              <div className="flex items-center flex-1">
                <item.icon className="mr-3 h-5 w-5" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="bg-destructive px-2 py-0.5 rounded-full text-[10px] font-bold text-destructive-foreground">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 pt-6 mt-6 border-t border-white/10">
        <p className="text-[11px] font-bold tracking-wider text-sidebar-foreground/40 uppercase mb-4">
          VIEWING AS
        </p>
        <select className="w-full bg-primary text-primary-foreground text-sm rounded-lg border-white/20 focus:ring-sidebar-ring focus:border-sidebar-ring mb-6 py-2 px-3 appearance-none">
          <option>RHU Physician</option>
          <option>Admin</option>
        </select>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold">
            DA
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">Dr. Carmela Ramos</p>
            <p className="text-[11px] text-sidebar-foreground/50 leading-tight">
              RHU Physician
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
