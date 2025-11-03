import type { Metadata } from "next";
import "./globals.css";
import { DM_Sans, Geist_Mono } from "next/font/google";
import AppKitProvider from "@/providers/AppKitProvider";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-den-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const themeInitializer = `(() => {
  const storageKey = "wolf-den-theme";
  const root = document.documentElement;
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (stored === "light" || stored === "dark") {
      root.dataset.theme = stored;
      return;
    }
  } catch (error) {
    console.warn("Theme storage unavailable", error);
  }
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = prefersDark ? "dark" : "dark";
})();`;

export const metadata: Metadata = {
  title: "Wolf Den",
  description: "Control center for the Wolf Den builder collective.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${geistMono.variable} antialiased`}>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: theme bootstrap */}
        <script dangerouslySetInnerHTML={{ __html: themeInitializer }} />
        <AppKitProvider>{children}</AppKitProvider>
      </body>
    </html>
  );
}
