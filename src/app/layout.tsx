import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { CookieBanner } from "@/components/cookie-banner";

export const metadata: Metadata = {
  title: {
    default: "The Gymist | Coach-Led Strength & Conditioning in Kilimani, Nairobi",
    template: "%s — The Gymist | Gym in Kilimani, Nairobi",
  },
  description:
    "Train with intent at The Gymist. Coach-led strength and conditioning in Kilimani, Nairobi. Small groups, real programming, measured results.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://thegymist.co.ke"),
  openGraph: {
    type: "website",
    locale: "en_KE",
    siteName: "The Gymist",
    images: [
      {
        url: "/brand/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Gymist — Train with intent",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@thegymist",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/brand/logo-mark.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: "var(--font-body)",
            },
          }}
        />
        <CookieBanner />
      </body>
    </html>
  );
}
