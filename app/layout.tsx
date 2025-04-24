import type { Metadata } from "next";
import { Inter, Nunito, Poppins } from "next/font/google";
import 'react-toastify/dist/ReactToastify.css';
import "./globals.css";
import "./embla.css";
import Wrapper from "./wrapper";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// const inter = Nunito({ subsets: ['latin'], weight: ["200", "300", "400", "500", "600", "700", "800", "900"] })
const inter = Poppins({ subsets: ['latin'], weight: ["200", "300", "400", "500", "600", "700", "800", "900"] })

export const metadata: Metadata = {
  title: "Explore Chandapura | Your Local Search Engine for Businesses, Real Estate, Jobs, and Classifieds",
  description: "Discover the best of Chandapura with Chandapura.com, your local search engine for businesses, real estate listings, job opportunities, and classifieds. Find everything you need in one place, tailored to your community. Start your search today!",
  // authors: [{name: "Priyadarsi Panigrahi"}, {name: "Priyanka das", url: "https://www.priyankadas.com/"}],
  authors: [{name: "Priyadarsi Panigrahi"}, {name: "Priyanka Das"}],
  robots: "index, follow",
    alternates: {
      canonical: `https://www.chandapura.com`,
      languages: {
        "en-US": "/",
      },
    },
    openGraph: {
      type: "website",
      url: `https://www.chandapura.com`,
      title: "Explore Chandapura | Your Local Search Engine for Businesses, Real Estate, Jobs, and Classifieds",
      description: "Discover the best of Chandapura with Chandapura.com, your local search engine for businesses, real estate listings, job opportunities, and classifieds. Find everything you need in one place, tailored to your community. Start your search today!",
      siteName: "Chandapura.com",
      images: [
        {
          url: "https://www.chandapura.com/images/og-logo.jpeg",
        },
      ],
    },
    assets: "https://www.chandapura.com/images/og-logo.jpeg",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Wrapper session={session}>
          {children}
        </Wrapper>
      </body>
    </html>
  );
}
