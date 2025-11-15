// import { Dashboard } from "@/components/dashboard";
import { Navigation } from "@/components/navigation";
// import { ThemeProvider } from "@/components/theme-provider";
import { ReactNode } from "react";

export default function Home({ children }: { children: ReactNode }) {
  return (
    // <ThemeProvider
    //   attribute="class"
    //   defaultTheme={isDark ? "dark" : "light"}
    //   enableSystem
    // >
    <div>
      <div className="flex min-h-screen bg-background  p-8">
        <Navigation />
        <main className="flex-1">
          {/* <Dashboard activeSection={activeSection} />
           */}
          {children}
        </main>
      </div>
    </div>
    // </ThemeProvider>
  );
}
