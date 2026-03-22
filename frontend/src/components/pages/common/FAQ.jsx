import { useState } from "react";
import { Search, User, Building2, Shield, CreditCard, ChevronDown, ThumbsUp, ThumbsDown } from "lucide-react";
import Footer from "../../layout/Footer";
import LandingNavbar from "../../layout/LandingNavbar";

const AccordionItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-4 text-left font-medium text-gray-800"
      >
        {question}
        <ChevronDown
          className={`h-5 w-5 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="px-4 pb-4 text-sm text-gray-600">
          {answer}
        </div>
      )}
    </div>
  );
};

const FAQ = () => {
  return (
    <div className="min-h-screen bg-gray-50">
        <LandingNavbar/>
      {/* HERO SEARCH */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            How can we help you today?
          </h1>

          <div className="relative mx-auto mt-6 max-w-2xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Search for questions, keywords, or topics..."
              className="w-full rounded-xl border border-gray-200 bg-gray-100 py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Popular:{" "}
            <span className="text-blue-600">Reporting faults</span>{" "}
            <span className="text-blue-600">Data privacy</span>{" "}
            <span className="text-blue-600">API Access</span>
          </p>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="mx-auto flex max-w-6xl gap-8 px-6 py-10">

        {/* SIDEBAR */}
        <aside className="hidden w-64 space-y-3 md:block">

          {[
            { icon: User, label: "For Citizens", active: true },
            { icon: Building2, label: "For Government" },
            { icon: Shield, label: "Technical & Privacy" },
            { icon: CreditCard, label: "Plans & Billing" },
          ].map((item) => (
            <button
              key={item.label}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium ${
                item.active
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}

          {/* HELP CARD */}
          <div className="mt-6 rounded-xl border bg-white p-5">
            <h3 className="font-semibold text-gray-900">
              Still need help?
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Can’t find what you’re looking for? Our support team is here
              for you.
            </p>

            <button className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700">
              Contact Support
            </button>

            <button className="mt-2 w-full rounded-lg border py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
              View Support Center
            </button>
          </div>
        </aside>

        {/* FAQ CONTENT */}
        <main className="flex-1 space-y-10">

          {/* FOR CITIZENS */}
          <section>
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              For Citizens
            </h2>

            <div className="space-y-4">
              <AccordionItem
                question="How do I report a new infrastructure fault?"
                answer="You can report a fault by clicking the 'New Report' button on your dashboard. Upload a photo, add a description, and confirm the location."
              />

              <AccordionItem
                question="Can I track the status of my report?"
                answer="Yes. All submitted reports are visible in your dashboard with real-time status updates."
              />

              <AccordionItem
                question="Is my data shared with anyone?"
                answer="Your data is securely encrypted and only shared with authorized municipal departments."
              />
            </div>
          </section>

          {/* FOR GOVERNMENT */}
          <section>
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              For Government
            </h2>

            <div className="space-y-4">
              <AccordionItem
                question="How is the priority of faults determined?"
                answer="Our AI analyzes severity, safety impact, and location density to assign priority."
              />

              <AccordionItem
                question="Can we integrate our existing ticketing system?"
                answer="Yes. We provide API access for seamless integration."
              />
            </div>
          </section>

          {/* TECHNICAL */}
          <section>
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Technical & Privacy
            </h2>

            <div className="space-y-4">
              <AccordionItem
                question="How accurate is the AI image recognition?"
                answer="Our AI achieves over 90% accuracy in infrastructure classification."
              />

              <AccordionItem
                question="What encryption standards do you use?"
                answer="We use industry-standard AES-256 encryption."
              />
            </div>
          </section>

          {/* HELPFUL BOX */}
          <div className="rounded-xl border bg-white p-6 text-center">
            <h3 className="font-semibold text-gray-800">
              Was this page helpful?
            </h3>

            <div className="mt-4 flex justify-center gap-4">
              <button className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-100">
                <ThumbsUp className="h-4 w-4 text-green-600" />
                Yes
              </button>

              <button className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-100">
                <ThumbsDown className="h-4 w-4 text-red-600" />
                No
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* FOOTER */}
        <Footer/>
    </div>
  );
};

export default FAQ;
