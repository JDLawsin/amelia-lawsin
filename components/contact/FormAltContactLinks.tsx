import { SITE_CONFIG } from "@/constants";
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
        href={SITE_CONFIG.messengerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:text-ink"
      >
        Messenger
      </a>
      {" · "}
      <a href={SITE_CONFIG.smsUrl} className="underline underline-offset-2 hover:text-ink">
        SMS
      </a>
    </p>
  );
};

export default FormAltContactLinks;
