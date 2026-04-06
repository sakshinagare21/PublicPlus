import { Shield, Workflow, Radar } from "lucide-react";
import LandingNavbar from "../../layout/LandingNavbar";
import img1 from "../../../assets/landing/Road.jpg";
import img2 from "../../../assets/landing/dataprocess.jpg";
import img3 from "../../../assets/landing/map.jpg";
import bgImage from "../../../assets/landing/about1.jpg";
import Footer from "../../layout/Footer";
const techItems = [
    {
        title: "AI Image Recognition",
        image: img1,
    },
    {
        title: "Data Processing",
        image: img2,
    },
    {
        title: "Automated Routing",
        image: img3,
    },
];

const About = () => {
    return (<div className="min-h-screen bg-background text-foreground transition-colors duration-300"> <LandingNavbar />


        {/* HERO */}
        <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
            <div>
                <p className="text-xs font-semibold text-primary tracking-widest mb-4">
                    Our Mission
                </p>

                <h1 className="text-4xl md:text-5xl font-bold leading-tight text-foreground">
                    Empowering Cities with Intelligent Accountability
                </h1>

                <p className="mt-6 text-muted-foreground">
                    Civic Fault Intelligence is dedicated to building a future where
                    urban infrastructure maintenance is proactive, transparent, and
                    driven by high-precision AI.
                </p>

            </div>

            {/* Hero Image Card */}
            <div
                className="relative rounded-2xl h-80 shadow-xl bg-cover bg-center"
                style={{ backgroundImage: `url(${bgImage})` }}
            >
                <div className="absolute inset-0 bg-black/40 rounded-2xl"></div>

                <div className="absolute bottom-6 left-6 bg-card border border-border rounded-xl shadow-lg p-4 w-40 z-10 transition-colors">
                    <p className="text-primary font-bold text-xl">99.8%</p>
                    <p className="text-xs text-muted-foreground">
                        Accuracy in automated fault categorization
                    </p>
                </div>
            </div>
        </section>

        {/* VISION */}
        <section className="bg-card py-16 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-center text-2xl font-bold mb-12 text-foreground">
                    Our Vision for Smarter Cities
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Radar,
                            title: "Seamless Detection",
                            desc: "AI monitoring infrastructure faults in real-time to reduce response delays.",
                        },
                        {
                            icon: Workflow,
                            title: "Automated Workflows",
                            desc: "Smart routing of maintenance tasks to the correct teams instantly.",
                        },
                        {
                            icon: Shield,
                            title: "Public Trust",
                            desc: "Transparent reporting and verification systems for accountability.",
                        },
                    ].map((item) => (
                        <div
                            key={item.title}
                            className="bg-background border border-border rounded-xl p-8 text-center transition-all hover:border-primary/50"
                        >
                            <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
                                <item.icon className="text-primary" />
                            </div>

                            <h3 className="font-semibold text-lg text-foreground">{item.title}</h3>
                            <p className="mt-3 text-muted-foreground text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* TECHNOLOGY */}
        <section className="max-w-7xl mx-auto px-6 py-16">
            <h2 className="text-2xl font-bold mb-4 text-foreground">
                The Technology Behind Accountability
            </h2>

            <p className="text-muted-foreground mb-10 max-w-2xl">
                Our proprietary AI engine classifies and prioritizes infrastructure
                issues using deep learning models trained on urban datasets.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
                {techItems.map((item) => (
                    <div key={item.title} className="space-y-3">
                        <img
                            src={item.image}
                            alt={item.title}
                            className="h-40 w-full object-cover rounded-xl border border-border"
                        />
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">
                            Advanced algorithms enable smarter and faster decision making.
                        </p>
                    </div>
                ))}
            </div>
        </section>


        {/* FOOTER */}
        <Footer />
    </div>

    );
};

export default About;

