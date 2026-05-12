import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import SchemaOrg from "@/components/SchemaOrg";
import "../index.css";

export const metadata: Metadata = {
  title: "Studio | Crafting Digital Experiences That Inspire",
  description: "We transform bold ideas into exceptional brands, products, and digital platforms that captivate and convert. Selected work in Branding, Photography, and Interior Design.",
  keywords: ["Digital Studio", "Branding Agency", "Creative Work", "Portfolio", "Design Excellence"],
  authors: [{ name: "Studio Team" }],
  openGraph: {
    title: "Studio | Crafting Digital Experiences That Inspire",
    description: "Exceptional brands, products, and digital platforms.",
    url: "https://example.com",
    siteName: "Studio Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Studio | Digital Experience Agency",
    description: "Transforming bold ideas into exceptional brands.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SchemaOrg />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
