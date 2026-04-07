import type { Metadata } from "next";
import { Bricolage_Grotesque, Space_Mono } from "next/font/google";
import { AppProvider } from "@/components/providers/AppProvider";
import { APP_DESCRIPTION, APP_NAME, APP_URL, BASE_APP_ID, MINIAPP_EMBED } from "@/lib/app-config";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display"
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  metadataBase: new URL(APP_URL),
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    type: "website",
    images: ["/og-image.png"]
  },
  other: {
    "fc:miniapp": JSON.stringify(MINIAPP_EMBED),
    "base:app_id": BASE_APP_ID
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bricolage.variable} ${spaceMono.variable}`}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}

