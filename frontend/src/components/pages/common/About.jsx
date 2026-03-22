import { Shield, Workflow, Radar } from "lucide-react";
import LandingNavbar from "../../layout/LandingNavbar";
import img1 from "../../../assets/landing/Road.jpg";
import img2 from "../../../assets/landing/dataprocess.jpg";
import img3 from "../../../assets/landing/map.jpg";
import bgImage from "../../../assets/landing/about1.jpg";
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
return ( <div className="min-h-screen bg-gray-50 text-gray-900"> <LandingNavbar />


  {/* HERO */}
  <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
    <div>
      <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-4">
        Our Mission
      </p>

      <h1 className="text-4xl md:text-5xl font-bold leading-tight">
        Empowering Cities with Intelligent Accountability
      </h1>

      <p className="mt-6 text-gray-600">
        Civic Fault Intelligence is dedicated to building a future where
        urban infrastructure maintenance is proactive, transparent, and
        driven by high-precision AI.
      </p>

      <div className="mt-8 flex gap-4">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700">
          Join the Network
        </button>

        <button className="border px-6 py-3 rounded-lg font-medium hover:bg-gray-100">
          View Case Studies
        </button>
      </div>
    </div>

    {/* Hero Image Card */}
    <div
      className="relative rounded-2xl h-80 shadow-xl bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/40 rounded-2xl"></div>

      <div className="absolute bottom-6 left-6 bg-white rounded-xl shadow-lg p-4 w-40 z-10">
        <p className="text-blue-600 font-bold text-xl">99.8%</p>
        <p className="text-xs text-gray-600">
          Accuracy in automated fault categorization
        </p>
      </div>
    </div>
  </section>

  {/* VISION */}
  <section className="bg-white py-16">
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="text-center text-2xl font-bold mb-12">
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
            className="bg-gray-50 border rounded-xl p-8 text-center"
          >
            <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-blue-100 flex items-center justify-center">
              <item.icon className="text-blue-600" />
            </div>

            <h3 className="font-semibold text-lg">{item.title}</h3>
            <p className="mt-3 text-gray-600 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>

  {/* TECHNOLOGY */}
  <section className="max-w-7xl mx-auto px-6 py-16">
    <h2 className="text-2xl font-bold mb-4">
      The Technology Behind Accountability
    </h2>

    <p className="text-gray-600 mb-10 max-w-2xl">
      Our proprietary AI engine classifies and prioritizes infrastructure
      issues using deep learning models trained on urban datasets.
    </p>

    <div className="grid md:grid-cols-3 gap-8">
      {techItems.map((item) => (
        <div key={item.title} className="space-y-3">
          <img
            src={item.image}
            alt={item.title}
            className="h-40 w-full object-cover rounded-xl"
          />
          <h3 className="font-semibold">{item.title}</h3>
          <p className="text-sm text-gray-600">
            Advanced algorithms enable smarter and faster decision making.
          </p>
        </div>
      ))}
    </div>
  </section>

  {/* TRANSPARENCY */}
  <section className="bg-white py-16">
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">
          Transparency & Public Accountability
        </h2>

        {[
          "Ethical Data Practices",
          "Public Ledger",
          "Citizen Dashboards",
        ].map((item) => (
          <div key={item} className="bg-gray-50 border rounded-xl p-5">
            <h3 className="font-semibold">{item}</h3>
            <p className="text-sm text-gray-600 mt-1">
              Ensuring public trust through transparent reporting.
            </p>
          </div>
        ))}
      </div>

      <div className="bg-gray-100 h-72 rounded-2xl flex items-center justify-center text-gray-500">
        Data Visualization Placeholder
      </div>
    </div>
  </section>

  {/* PARTNERS */}
  <section className="max-w-7xl mx-auto px-6 py-12 text-center">
    <p className="text-xs uppercase text-gray-500 mb-6">
      Trusted by innovation partners
    </p>

    <div className="flex flex-wrap justify-center gap-10 text-gray-400 font-semibold">
      {["CITYGRAPH", "URBAN_AI", "MUNICIPAL_OS", "METROCORE", "GEOFLOW"].map(
        (p) => (
          <span key={p}>{p}</span>
        )
      )}
    </div>
  </section>

  {/* CTA */}
  <section className="max-w-6xl mx-auto px-6 pb-20">
    <div className="bg-blue-600 text-white rounded-2xl p-12 text-center shadow-xl">
      <h2 className="text-3xl font-bold mb-4">
        Ready to upgrade your city's infrastructure intelligence?
      </h2>

      <p className="text-blue-100 mb-8">
        Join leading metropolitan areas using AI to build smarter cities.
      </p>

      <div className="flex justify-center gap-4">
        <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100">
          Schedule a Demo
        </button>

        <button className="border border-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700">
          Download Whitepaper
        </button>
      </div>
    </div>
  </section>

  {/* FOOTER */}
  <footer className="bg-white border-t py-6 text-center text-sm text-gray-500">
    © 2026 Civic Fault Intelligence — Privacy · Terms · Contact
  </footer>
</div>

);
};

export default About;
