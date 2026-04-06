import React from "react";
import { Link } from "react-router-dom";
import LandingNavbar from "../../layout/LandingNavbar";
import Footer from "../../layout/Footer";
import heroDashboard from "../../../assets/hero-dashboard.jpg";

import {
  Camera,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Play,
  Download,
  Building2,
  CheckCircle,
  Users,
  Star,
} from "lucide-react";

/* Tailwind Button Replacement */
const Button = ({ children, className = "", variant, ...props }) => {
  const base = "rounded-lg px-5 py-2.5 text-sm font-medium transition";

  const styles =
    variant === "outline"
      ? "border border-border bg-transparent hover:bg-secondary text-foreground"
      : variant === "secondary"
        ? "bg-secondary text-foreground hover:opacity-90"
        : "bg-primary text-primary-foreground hover:opacity-90";

  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
};


const steps = [
  {
    icon: Camera,
    num: "1",
    title: "Report",
    desc: "Citizens snap a photo or describe an issue. Our AI automatically geolocates and tags the infrastructure category.",
  },
  {
    icon: BarChart3,
    num: "2",
    title: "Analyze",
    desc: "The platform prioritizes issues based on safety, urgency, and community impact, delivering data-rich insights to city officials.",
  },
  {
    icon: CheckCircle2,
    num: "3",
    title: "Resolve",
    desc: "Governments assign tasks and update statuses in real-time. Citizens get notified the moment the issue is closed.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />

      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--hero-gradient)" }}
      >
        <div className="container py-20 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="animate-fade-in">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground">
                <Star className="h-3.5 w-3.5" />
                TRANSFORMING GOVERNANCE
              </div>

              <h1 className="font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
                Civic issue Reporting and Resolution System
              </h1>

              <p className="mt-6 max-w-lg text-lg text-muted-foreground">
                Bridging the gap between citizens and local governments through
                transparent, AI-driven infrastructure management and real-time
                response tracking.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/decide-role">
                  <Button className="gap-2 flex items-center">
                    Start Reporting
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div
              className="relative animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="overflow-hidden rounded-2xl border border-border shadow-2xl shadow-primary/10">
                <img
                  src={heroDashboard}
                  alt="AI-powered urban monitoring dashboard"
                  className="w-full"
                />
              </div>

              <div className="absolute -bottom-4 left-4 right-4 rounded-xl border border-border bg-background/95 backdrop-blur p-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Real-time Node Monitoring
                  </span>

                  <span className="rounded-md bg-success px-2 py-0.5 text-xs font-bold text-success-foreground">
                    ACTIVE
                  </span>
                </div>

                <div className="mt-2 h-1.5 w-full rounded-full bg-secondary">
                  <div className="h-full w-4/5 rounded-full bg-primary transition-all" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="features" className="container py-20">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            How It Works
          </h2>

          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Our seamless three-step process ensures every concern is heard,
            categorized, and resolved efficiently.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.num}
              className="group rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                <step.icon className="h-6 w-6 text-accent-foreground" />
              </div>

              <h3 className="font-display text-xl font-semibold text-foreground">
                {step.num}. {step.title}
              </h3>

              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
      {/* For Citizens / Governments */}
      <section className="container py-20">
        <div className="grid gap-8 md:grid-cols-2">
          {[
            {
              icon: Download,
              title: "For Citizens",
              items: [
                "Easy 30-second reporting",
                "Real-time status tracking notifications",
                "Community impact scoreboards",
              ],
              cta: "Access Citizen Portal",
            },
            {
              icon: Building2,
              title: "For Governments",
              items: [
                "Automated issue categorization",
                "Predictive maintenance analytics",
                "Resource optimization dashboard",
              ],
              cta: "Request Partner Portal",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-lg"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                <card.icon className="h-5 w-5 text-accent-foreground" />
              </div>

              <h3 className="font-display text-xl font-bold text-foreground mb-4">
                {card.title}
              </h3>

              <ul className="space-y-3 mb-6">
                {card.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle className="h-4 w-4 text-success" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link to="/decide-role">
                <Button variant="outline" className="w-full">
                  {card.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>
      {/* Mission */}
      <section id="mission" className="container py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="rounded-2xl bg-secondary/50 p-8 flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-accent flex items-center justify-center">
                <Users className="h-12 w-12 text-accent-foreground" />
              </div>

              <h3 className="font-display text-2xl font-bold text-foreground">
                Our Vision
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Transparent cities, empowered citizens
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold tracking-widest text-muted-foreground mb-2">
              OUR MISSION
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground">
              Transparency as a Service
            </h2>

            <p className="mt-4 text-muted-foreground leading-relaxed">
              Civic Intel was founded on a simple premise: technology should
              bring people closer to the systems that serve them. We believe
              that by providing clear, data-driven pathways for accountability,
              we can foster stronger, more resilient communities.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-display font-bold text-foreground">
                  Ethics First
                </h4>

                <p className="mt-1 text-sm text-muted-foreground">
                  Privacy-preserving AI that protects citizen identity while
                  surfacing truth.
                </p>
              </div>

              <div>
                <h4 className="font-display font-bold text-foreground">
                  Open Data
                </h4>

                <p className="mt-1 text-sm text-muted-foreground">
                  Empowering third-party auditors and researchers with API
                  access.
                </p>
              </div>
            </div>

            <a
              href="#"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Read Our Full Story
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
