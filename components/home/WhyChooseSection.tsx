import { Card, CardContent } from "../ui/shadcn/card";

const icons = {
  experience: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon
        points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
        stroke="#C9A84C"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="#C9A84C"
        fillOpacity="0.15"
      />
    </svg>
  ),
  ofw: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="9" stroke="#C9A84C" strokeWidth="1.5" />
      <ellipse
        cx="12"
        cy="12"
        rx="4"
        ry="9"
        stroke="#C9A84C"
        strokeWidth="1.5"
      />
      <line
        x1="3"
        y1="9"
        x2="21"
        y2="9"
        stroke="#C9A84C"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="3"
        y1="15"
        x2="21"
        y2="15"
        stroke="#C9A84C"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  network: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="7" r="3" stroke="#C9A84C" strokeWidth="1.5" />
      <circle cx="5" cy="17" r="2.5" stroke="#C9A84C" strokeWidth="1.5" />
      <circle cx="19" cy="17" r="2.5" stroke="#C9A84C" strokeWidth="1.5" />
      <line
        x1="12"
        y1="10"
        x2="5"
        y2="14.5"
        stroke="#C9A84C"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="12"
        y1="10"
        x2="19"
        y2="14.5"
        stroke="#C9A84C"
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
  <section className="border-y bg-white py-12 px-4">
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col items-center mb-8">
        <h2 className="text-2xl font-serif font-semibold text-ink">
          {"Why Choose Amelia?"}
        </h2>
        <div className="w-8 h-0.5 bg-ink mt-2 mb-2" />
        <span className="text-sm text-ash">
          {"Your trusted partner every step of the way"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {WHY_CHOOSE.map((item) => (
          <Card key={item.title} className="bg-cloud border border-wire">
            <CardContent className="flex flex-col items-center text-center gap-3 pt-6">
              <div className="w-12 h-12 rounded-full bg-ink flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
              <span className="text-xs text-ash leading-relaxed">
                {item.description}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseSection;
