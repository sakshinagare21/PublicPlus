import React from "react";
import { Building2 } from "lucide-react";
import FAQChatbot from "../common/FAQChatbot";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12">

        <div className="grid gap-8 md:grid-cols-4">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Building2 className="h-4 w-4 text-primary-foreground" />
              </div>

              <span className="font-display text-lg font-bold">
                PublicPlus
              </span>
            </div>

            <p className="text-sm text-muted-foreground">
              A smart civic issue reporting platform that connects citizens with 
              government authorities for faster resolution and better city management.
            </p>
          </div>

          {/* Columns */}
          {[
            {
              title: "Platform",
              links: [
                "Report Issue",
                "Track Complaints",
                "Department Dashboard",
                "AI Issue Categorization",
              ],
            },
            {
              title: "Company",
              links: [
                "About PublicPlus",
                "Our Mission",
                "Team",
                "Contact Us",
              ],
            },
            {
              title: "Legal",
              links: [
                "Privacy Policy",
                "Terms & Conditions",
                "Data Security",
                "User Guidelines",
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
            © 2026 PublicPlus Platform. All rights reserved.
          </p>

          <p className="text-sm text-muted-foreground">
            Built to empower citizens and improve governance 🚀
          </p>

        </div>

      </div>

      {/* Chatbot */}
      <FAQChatbot role="user" />

    </footer>
  );
};

export default Footer;