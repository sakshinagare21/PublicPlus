import React from "react";
import { Link } from "react-router-dom";
import LandingNavbar from "../../layout/LandingNavbar";
import Footer from "../../layout/Footer";

import heroBg from "../../../assets/images/landing/newbg.png";

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

const Reveal = ({ children, className = "", delay = "" }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${isVisible ? "active" : ""} ${delay} ${className}`}
    >
      {children}
    </div>
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
        className="relative overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${heroBg})`,
        }}
      >
        <div className="container relative z-10 py-20 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <div className="text-white">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/20 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-white">
                  <Star className="h-3.5 w-3.5" />
                  TRANSFORMING GOVERNANCE
                </div>

                <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                  Civic issue Reporting and Resolution System
                </h1>

                <p className="mt-6 max-w-lg text-lg text-white/80">
                  Bridging the gap between citizens and local governments through
                  transparent, AI-driven infrastructure management and real-time
                  response tracking.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Link to="/decide-role">
                    <Button className="gap-2 flex items-center bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
                      Start Reporting
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="features" className="container py-20">
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              How It Works
            </h2>

            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Our seamless three-step process ensures every concern is heard,
              categorized, and resolved efficiently.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, idx) => (
            <Reveal key={step.num} delay={`reveal-delay-${idx + 1}`}>
              <div className="group h-full rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20">
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
            </Reveal>
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
          ].map((card, idx) => (
            <Reveal key={card.title} delay={`reveal-delay-${idx + 1}`}>
              <div className="rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-lg h-full">
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
            </Reveal>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
