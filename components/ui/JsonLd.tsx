import type { ReactElement } from "react";

type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

const JsonLd = ({ data }: JsonLdProps): ReactElement => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);

export default JsonLd;
