/**
 * CTA pill class strings — the single source of truth for primary/secondary
 * call-to-action styling on public pages. Apply on <Link> or <a> directly:
 *
 *   <Link className={ctaPrimary} href="/contact">Get in touch</Link>
 *   <a   className={ctaSecondaryDark} href={messengerUrl}>Message us</a>
 *
 * Shape is shared (px-7 py-3 rounded-full text-sm font-medium transition-colors);
 * the color variant depends on the surface the button sits on.
 */

// Shared pill shape. Use `cn()` to compose with a variant below.
const ctaShape =
  "inline-flex min-h-11 items-center justify-center rounded-full px-7 py-3 text-sm font-medium transition-[background-color,color,border-color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100";

// On a light surface (bg-white / bg-cloud): solid ink button.
export const ctaPrimary = `${ctaShape} bg-ink text-white hover:bg-ink/90 focus-visible:ring-ink/45 focus-visible:ring-offset-white`;

// On a light surface: outlined button.
export const ctaSecondary = `${ctaShape} border border-wire text-ink hover:border-ink hover:bg-ink hover:text-white focus-visible:ring-ink/45 focus-visible:ring-offset-white`;

// On a dark surface (bg-ink): solid white button (max contrast).
export const ctaPrimaryDark = `${ctaShape} bg-white text-ink hover:bg-white/90 focus-visible:ring-white/70 focus-visible:ring-offset-ink`;

// On a dark surface: faintly outlined button.
export const ctaSecondaryDark = `${ctaShape} border border-white/25 text-white/75 hover:border-white/45 hover:bg-white/10 hover:text-white focus-visible:ring-white/70 focus-visible:ring-offset-ink`;
