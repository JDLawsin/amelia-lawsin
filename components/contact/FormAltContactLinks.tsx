import {
  buildMessengerUrl,
  buildSmsUrl,
  MOBILE_ONLY_CLASS,
  phoneTelHref,
} from "@/lib/contact-channels";
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/whatsapp-url";

type Props = {
  className?: string;
};

const FormAltContactLinks = ({ className }: Props) => {
  const whatsappUrl = buildWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGE);

  return (
    <p className={className}>
      {whatsappUrl && (
        <>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-ink"
          >
            WhatsApp
          </a>
          {" · "}
        </>
      )}
      <a
        href={buildMessengerUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:text-ink"
      >
        Messenger
      </a>
      <span className={MOBILE_ONLY_CLASS}>
        {" · "}
        <a
          href={phoneTelHref}
          className="underline underline-offset-2 hover:text-ink"
        >
          Call
        </a>
        {" · "}
        <a
          href={buildSmsUrl()}
          className="underline underline-offset-2 hover:text-ink"
        >
          SMS
        </a>
      </span>
    </p>
  );
};

export default FormAltContactLinks;
