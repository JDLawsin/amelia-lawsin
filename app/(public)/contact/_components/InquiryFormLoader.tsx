"use client";

import dynamic from "next/dynamic";
import InquiryFormShell from "./InquiryFormShell";

const InquiryForm = dynamic(() => import("./InquiryForm"), {
  ssr: false,
  loading: () => <InquiryFormShell />,
});

const InquiryFormLoader = () => <InquiryForm />;

export default InquiryFormLoader;
