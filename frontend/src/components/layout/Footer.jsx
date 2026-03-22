import React from "react";
import { Building2 } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-secondary/50">
      <div className="container py-12">

        <div className="grid gap-8 md:grid-cols-4">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Building2 className="h-4 w-4 text-primary-foreground" />
              </div>

              <span className="font-display text-lg font-bold">
                Civic Intel
              </span>
            </div>

            <p className="text-sm text-muted-foreground">
              Empowering smart cities through citizen participation and
              AI-optimized governance.
            </p>
          </div>

          {/* Columns */}
          {[
            {
              title: "Platform",
              links: [
                "Reporting Tool",
                "Gov Dashboard",
                "Impact Data",
                "API Docs",
              ],
            },
            {
              title: "Company",
              links: ["About Us", "Careers", "Ethics Board", "Contact"],
            },
            {
              title: "Legal",
              links: [
                "Privacy Policy",
                "Terms of Service",
                "Security",
                "Data Policy",
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-display font-semibold text-foreground mb-4">
                {col.title}
              </h4>

              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom */}
        <div className="mt-8 border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-sm text-muted-foreground">
            © 2024 Civic Intel Platform. All rights reserved.
          </p>

          <p className="text-sm text-muted-foreground">
            Proudly built for global transparency.
          </p>

        </div>

      </div>
    </footer>
  );
};

export default Footer;
