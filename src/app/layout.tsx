import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { siteData } from "@content/site-data";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteData.seo.defaultTitle,
    template: `%s | ${siteData.practice.shortName}`,
  },
  description: siteData.seo.defaultDescription,
  metadataBase: new URL(siteData.practice.website),
  openGraph: {
    title: siteData.seo.defaultTitle,
    description: siteData.seo.defaultDescription,
    locale: siteData.seo.locale,
    type: "website",
    siteName: siteData.practice.shortName,
  },
};

const dayMap: Record<string, string> = {
  Montag: "Monday",
  Dienstag: "Tuesday",
  Mittwoch: "Wednesday",
  Donnerstag: "Thursday",
  Freitag: "Friday",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["Dentist", "LocalBusiness"],
  name: siteData.practice.name,
  url: siteData.practice.website,
  telephone: siteData.practice.phone,
  email: siteData.practice.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteData.practice.address.street,
    postalCode: siteData.practice.address.zip,
    addressLocality: siteData.practice.address.city,
    addressCountry: "DE",
  },
  openingHoursSpecification: siteData.openingHours.map((h) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: dayMap[h.day] ?? h.day,
    opens: h.hours.split("–")[0]?.trim(),
    closes: h.hours.split("–")[1]?.trim(),
  })),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
