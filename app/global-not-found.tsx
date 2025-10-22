import { Home, Search, ArrowLeft, AlertCircle } from "lucide-react";
import "./globals.css";
import { Metadata } from "next";
import { Poppins } from "next/font/google";
function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 */}
        <div className="relative">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-600 animate-pulse">
            404
          </h1>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <AlertCircle className="w-24 h-24 text-purple-500 opacity-20" />
          </div>
        </div>

        {/* Message */}
        <div className="mt-8 space-y-4">
          <h2 className="text-3xl font-bold text-white">Page Not Found</h2>
          <p className="text-gray-300 text-lg">
            Oops! The page you're looking for seems to have wandered off into
            the digital void.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50"
          >
            <Home className="w-5 h-5" />
            Go Home
          </a>

          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </a>
        </div>

        {/* Search Suggestion */}
        <div className="mt-12 p-6 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700">
          <div className="flex items-center justify-center gap-2 text-gray-300 mb-3">
            <Search className="w-5 h-5" />
            <span className="font-medium">Looking for something specific?</span>
          </div>
          <p className="text-gray-400 text-sm">
            Try searching from our homepage or check the navigation menu.
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="mt-8 flex justify-center gap-2">
          <div
            className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export function metadata(): Metadata {
  return {
    title: "Page Not Found",
    description: "The page you are looking for does not exist.",
  };
}

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${poppins.variable} antialiased`}>
      <body>
        <NotFound />
      </body>
    </html>
  );
}
