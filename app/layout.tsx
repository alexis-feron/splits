import Link from "next/link";
import Navbar from "./components/Navbar";
import favicon from "./favicon.ico";
import "./globals.css";

export const metadata = {
  title: "Splits - F1 Standings, Game Information, and Upcoming Events",
  description:
    "Splits is your one-stop destination for comprehensive F1 standings, detailed game information, and updates on upcoming Formula 1 events. Stay informed with the latest in the world of Formula 1.",
  keywords:
    "F1, Formula 1, standings, game information, upcoming events, Formula 1 news, F1 updates",
  author: "Alexis Feron",
  manifest: "/manifest.json",
  themeColor: "#dc2626",
  icons: {
    icon: "/icon-192x192.png",
    apple: "/icon-192x192.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="author" content={metadata.author} />
        <meta charSet="utf-8" />
        <meta property="og:image" content={favicon.src} />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="google-site-verification"
          content="id5BdwKoxPwKEcQ5LHteqFS6Vx0L4cQnkNCszpTTvSo"
        />
        <title>{metadata.title}</title>
      </head>
      <body className="bg-white text-stone-900 flex flex-col min-h-screen">
        {/* Header */}
        <Navbar />

        {/* Main content */}
        <main className="flex-grow sm:pt-14 pb-0">{children}</main>

        {/* Footer */}
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
          <p className="text-xs text-gray-500 text-center w-full">
            © {new Date().getFullYear()}{" "}
            <span className="RaceSport">LITS</span> -{" "}
            <Link
              className="hover:text-black"
              href="https://alexis-feron.com"
              target="_blank"
              title="Alexis Feron Portfolio"
              rel="noopener noreferrer"
            >
              Alexis Feron
            </Link>
          </p>
        </footer>
      </body>
    </html>
  );
}
