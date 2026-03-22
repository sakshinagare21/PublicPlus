import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Globe, Menu, X } from "lucide-react";
import LanguageDropdown from "../pages/common/LanguageDropdown";

const LandingNavbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">

      <div className="container flex h-16 items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>

          <span className="font-display text-xl font-bold text-foreground">
            Civic Intel
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-8 md:flex">

          <Link to='/help'
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Help
          </Link>

          <Link to='/impact'
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Impact
          </Link>

          <Link to='/about'
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>

          <LanguageDropdown/>

          <Link to="/decide-role">
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition">
              Get Started
            </button>
          </Link>

        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>

      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-border bg-background p-4 md:hidden">

          <div className="flex flex-col gap-4">

            <a
              href="#features"
              className="text-sm font-medium text-muted-foreground"
            >
              Features
            </a>

            <a
              href="#impact"
              className="text-sm font-medium text-muted-foreground"
            >
              Impact
            </a>

            <a
              href="#mission"
              className="text-sm font-medium text-muted-foreground"
            >
              About
            </a>

            <Link to="/dashboard">
              <button className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition">
                Get Started
              </button>
            </Link>

          </div>

        </div>
      )}

    </nav>
  );
};

export default LandingNavbar;
