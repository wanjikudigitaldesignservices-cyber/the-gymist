import Link from "next/link";
import Image from "next/image";
import { Instagram, Music2, Twitter } from "lucide-react";
import { WORKOUT_CATEGORIES } from "@/lib/utils";

const exploreLinks = [
  { href: "/about", label: "About" },
  { href: "/workouts", label: "Workouts" },
  { href: "/classes", label: "Classes" },
  { href: "/instructors", label: "Our Team" },
  { href: "/membership", label: "Membership" },
  { href: "/nutrition", label: "Nutrition" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/gallery", label: "Gallery" },
  { href: "/faq", label: "FAQ" },
];

const openingHours = [
  { day: "Mon–Fri", hours: "05:00 – 22:00" },
  { day: "Saturday", hours: "06:00 – 20:00" },
  { day: "Sunday", hours: "08:00 – 18:00" },
  { day: "Public Holidays", hours: "08:00 – 14:00" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white/70">
      <div className="container-gymist py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Column 1: Logo & Social */}
          <div className="space-y-6">
            <Link href="/">
              <Image
                src="/brand/logo-white.svg"
                alt="The Gymist"
                width={160}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-sm leading-relaxed">
              Coach-led strength and conditioning in Kilimani, Nairobi. Small groups. Real programming. Measured results.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com/thegymist"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-volt transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://tiktok.com/@thegymist"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-volt transition-colors"
                aria-label="TikTok"
              >
                <Music2 size={20} />
              </a>
              <a
                href="https://x.com/thegymist"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-volt transition-colors"
                aria-label="X (Twitter)"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div>
            <h3 className="font-heading text-white text-sm uppercase tracking-wider mb-6">
              Explore
            </h3>
            <ul className="space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Train */}
          <div>
            <h3 className="font-heading text-white text-sm uppercase tracking-wider mb-6">
              Train
            </h3>
            <ul className="space-y-3">
              {WORKOUT_CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/workouts?category=${cat}`}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/booking"
                  className="text-sm text-volt hover:text-volt/80 transition-colors font-medium"
                >
                  Book a Session →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Visit */}
          <div>
            <h3 className="font-heading text-white text-sm uppercase tracking-wider mb-6">
              Visit
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-white/90">
                  Wood Avenue, off Lenana Road
                  <br />
                  Kilimani, Nairobi
                </p>
              </div>

              <div>
                <table className="text-sm w-full">
                  <tbody>
                    {openingHours.map((item) => (
                      <tr key={item.day}>
                        <td className="py-1 pr-4 text-white/50">{item.day}</td>
                        <td className="py-1 font-mono text-xs text-white/80">
                          {item.hours}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-2">
                <a
                  href="tel:+254740396075"
                  className="block text-sm hover:text-white transition-colors"
                >
                  +254 740 396 075
                </a>
                <a
                  href="mailto:hello@thegymist.co.ke"
                  className="block text-sm hover:text-white transition-colors"
                >
                  hello@thegymist.co.ke
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-gymist py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {currentYear} The Gymist. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/terms"
              className="text-xs text-white/40 hover:text-white/60 transition-colors"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/privacy"
              className="text-xs text-white/40 hover:text-white/60 transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
