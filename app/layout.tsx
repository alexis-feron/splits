import Link from "next/link";
import Navbar from "./components/Navbar";
import "./globals.css";

export const metadata = {
  title: "Splits",
  description:
    "Your one-stop destination for F1 standings, game, and upcoming events.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-stone-900 flex flex-col min-h-screen">
        {/* Header */}
        <Navbar />

        {/* Main content */}
        <main className="flex-grow pt-14">{children}</main>

        {/* Footer */}
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
          <p className="text-xs text-gray-500 text-center w-full">
            © {new Date().getFullYear()}{" "}
            <span className="RaceSport">LITS</span> -{" "}
            <Link className="hover:text-black" href="https://alexis-feron.com">
              Alexis Feron
            </Link>
          </p>
        </footer>
      </body>
    </html>
  );
}
