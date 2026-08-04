"use client";

import dynamic from "next/dynamic";
import FaqAccordionShell from "./FaqAccordionShell";

const FaqAccordion = dynamic(() => import("./FaqAccordion"), {
  ssr: false,
  loading: () => <FaqAccordionShell />,
});

const FaqAccordionLoader = () => <FaqAccordion />;

export default FaqAccordionLoader;
