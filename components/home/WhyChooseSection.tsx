import SectionLabel from "@/components/ui/SectionLabel";

const icons = {
  experience: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon
        points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
        stroke="white"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="white"
        fillOpacity="0.15"
      />
    </svg>
  ),
  ofw: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5" />
      <ellipse cx="12" cy="12" rx="4" ry="9" stroke="white" strokeWidth="1.5" />
      <line
        x1="3"
        y1="9"
        x2="21"
        y2="9"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="3"
        y1="15"
        x2="21"
        y2="15"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  network: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="7" r="3" stroke="white" strokeWidth="1.5" />
      <circle cx="5" cy="17" r="2.5" stroke="white" strokeWidth="1.5" />
      <circle cx="19" cy="17" r="2.5" stroke="white" strokeWidth="1.5" />
      <line
        x1="12"
        y1="10"
        x2="5"
        y2="14.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="12"
        y1="10"
        x2="19"
        y2="14.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
};

const WHY_CHOOSE = [
  {
    icon: icons.experience,
    title: "10+ Years Experience",
    description: "Trusted by hundreds of clients across Cebu and beyond",
  },
  {
    icon: icons.ofw,
    title: "OFW Specialist",
    description: "Expert in Pag-IBIG, bank & in-house financing options",
  },
  {
    icon: icons.network,
    title: "Wide Network",
    description: "Access to exclusive listings across all of Cebu",
  },
];

const WhyChooseSection = () => (
  <section className="border-b border-wire bg-white py-14 px-6">
    <div className="max-w-7xl mx-auto">
      <SectionLabel>Why choose Amelia</SectionLabel>
      <h2 className="text-2xl md:text-3xl font-serif font-medium text-ink tracking-tight leading-snug text-center mb-10">
        Your trusted partner every step of the way
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {WHY_CHOOSE.map((item) => (
          <div
            key={item.title}
            className="border border-wire rounded-2xl p-6 hover:shadow-apple-sm transition-shadow duration-200"
          >
            <div className="w-9 h-9 bg-ink rounded-xl flex items-center justify-center mb-4">
              {item.icon}
            </div>
            <h3 className="text-sm font-medium text-ink mb-2">{item.title}</h3>
            <p className="text-xs text-ash leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseSection;
