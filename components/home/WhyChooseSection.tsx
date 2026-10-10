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
  <section className="border-b border-wire bg-white px-6 py-20 md:py-24">
    <div className="max-w-7xl mx-auto">
      <h2 className="mx-auto mb-12 max-w-2xl text-center text-3xl font-serif font-medium leading-tight tracking-[-0.025em] text-ink md:text-4xl">
        Your trusted partner every step of the way
      </h2>

      <div className="grid grid-cols-1 divide-y divide-wire border-y border-wire md:grid-cols-3 md:divide-x md:divide-y-0">
        {WHY_CHOOSE.map((item) => (
          <div
            key={item.title}
            className="px-1 py-8 sm:px-6 md:px-8 md:py-10"
          >
            <div className="mb-5 flex size-10 items-center justify-center rounded-xl bg-ink">
              {item.icon}
            </div>
            <h3 className="mb-2 text-base font-medium text-ink">{item.title}</h3>
            <p className="max-w-sm text-sm leading-relaxed text-ash">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseSection;
