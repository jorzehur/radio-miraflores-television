import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const Toaster = dynamic(() =>
  import("@/components/ui/toaster").then((m) => ({ default: m.Toaster })),
);

export const metadata: Metadata = {
  title: "Radio Miraflores Televisión | Tu Estación de Rock",
  description: "Radio Miraflores Televisión - La estación de rock que mueve tu mundo. Música, noticias, ranking internacional y mucha energía.",
  keywords: ["Radio Miraflores", "rock", "música", "radio", "televisión", "noticias", "ranking"],
  authors: [{ name: "Radio Miraflores Televisión" }],
  icons: {
    icon: "/images/logo-rmtv.png",
  },
  openGraph: {
    title: "Radio Miraflores Televisión",
    description: "La estación de rock que mueve tu mundo",
    siteName: "Radio Miraflores Televisión",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
