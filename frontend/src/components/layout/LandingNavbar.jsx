import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Globe, Menu, X } from "lucide-react";
import LanguageDropdown from "../pages/common/LanguageDropdown";
import ThemeToggle from "../common/ThemeToggle";

const LandingNavbar = () => {
    const [open, setOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">

            <div className="container flex h-16 items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary group-hover:scale-110 transition-transform">
                        <Building2 className="h-5 w-5 text-primary-foreground" />
                    </div>

                    <span className="font-display text-xl font-bold text-foreground">
                        Public<span className="text-primary">Plus</span>
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden items-center gap-8 md:flex">

                    <Link to='/help'
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Help
                    </Link>

                    {/* <Link to='/impact'
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                        Impact
                        </Link> */}

                    <Link to='/contact'
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Contact
                    </Link>

                    <Link to='/about'
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        About
                    </Link>

                    <ThemeToggle />
                    <LanguageDropdown />

                    <Link to="/decide-role">
                        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition shadow-md shadow-primary/20">
                            Get Started
                        </button>
                    </Link>

                </div>

                {/* Mobile Menu Button */}
                <div className="flex items-center gap-2 md:hidden">
                    <ThemeToggle />
                    <button
                        onClick={() => setOpen(!open)}
                    >
                        {open ? (
                            <X className="h-6 w-6 text-foreground" />
                        ) : (
                            <Menu className="h-6 w-6 text-foreground" />
                        )}
                    </button>
                </div>

            </div>

            {/* Mobile Menu */}
            {open && (
                <div className="border-t border-border bg-background p-4 md:hidden">

                    <div className="flex flex-col gap-4">

                        <Link
                            to="/help"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground"
                        >
                            Help
                        </Link>

                        <Link
                            to="/impact"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground"
                        >
                            Impact
                        </Link>

                        <Link
                            to="/contact"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground"
                        >
                            Contact
                        </Link>

                        <Link
                            to="/about"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground"
                        >
                            About
                        </Link>

                        <Link to="/decide-role">
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

