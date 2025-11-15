"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Layers,
  Search,
  ImageIcon,
  Settings,
  ChevronRight,
  LogOut,
  User,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Navigation() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  const [isDark, setIsDark] = useState(false);
  const menuItems = [
    { link: "/", label: "Overview", icon: LayoutDashboard },
    { link: "pages", label: "Pages", icon: FileText },
    { link: "sections", label: "Sections", icon: Layers },
    { link: "blog", label: "Blog", icon: FileText },
    // { link: "seo", label: "SEO", icon: Search },
    { link: "media", label: "Media", icon: ImageIcon },
  ];

  return (
    <>
      <aside
        className={`fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-500 ease-out z-40 ${
          isExpanded ? "w-64" : "w-20"
        }`}
      >
        {/* Sidebar header with toggle */}
        <div className="h-20 border-b border-sidebar-border flex items-center justify-between px-4 backdrop-blur-sm bg-sidebar">
          {isExpanded && (
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-foreground">ContentHub</h1>
              <p className="text-xs text-muted-foreground">Management</p>
            </div>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-auto hover:bg-muted"
          >
            <ChevronRight
              className={`w-4 h-4 transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </Button>
        </div>

        {/* Navigation menu */}
        <nav className="p-4 flex flex-col gap-2 ">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.link;

            return (
              <Link
                href={item?.link}
                key={item.link}
                onClick={() => setActiveSection(item.link)}
                className={`sidebar-item group w-full flex items-center gap-3 transition-all duration-300 rounded-lg px-4 py-2.5 ${
                  isActive
                    ? "active bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted"
                }`}
              >
            
                  <Icon
                    className={`w-5 h-5 transition-all duration-300 ${
                      isActive ? "text-primary" : ""
                    }`}
                  />
                  {isExpanded && (
                    <span className="text-sm font-medium truncate">
                      {item.label}
                    </span>
                  )}
                  {isExpanded && isActive && (
                    <ChevronRight className="w-4 h-4 ml-auto opacity-60" />
                  )}
        
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border p-4 space-y-2 bg-sidebar">
          {/* <button 
            onClick={() => setIsDark(!isDark)}
            className="sidebar-item group w-full flex items-center gap-3 text-foreground hover:bg-muted rounded-lg px-4 py-2.5"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {isExpanded && <span className="text-sm font-medium">{isDark ? 'Light' : 'Dark'}</span>}
          </button> */}
          <button className="sidebar-item group w-full flex items-center gap-3 text-foreground hover:bg-muted rounded-lg px-4 py-2.5">
            <User className="w-5 h-5" />
            {isExpanded && <span className="text-sm font-medium">Profile</span>}
          </button>
          <button className="sidebar-item group w-full flex items-center gap-3 text-foreground hover:bg-muted rounded-lg px-4 py-2.5">
            <Settings className="w-5 h-5" />
            {isExpanded && (
              <span className="text-sm font-medium">Settings</span>
            )}
          </button>
          <button className="sidebar-item group w-full flex items-center gap-3 text-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg px-4 py-2.5">
            <LogOut className="w-5 h-5" />
            {isExpanded && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      <div
        className={`transition-all duration-500 ease-out ${
          isExpanded ? "ml-64" : "ml-20"
        }`}
      />
    </>
  );
}
