import type { Metadata } from "next";
import CustomCursor from '../components/Cursor';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://wxwreak.vercel.app/'), 
  title : {
    default: "wxwreak | Infrastructure, Automation & Security Tooling",
    template: "%s | wxwreak"
  },
  description: "Infrastructure, Automation & Security Tooling",
  authors : [{ name: "wxwreak" }],
  openGraph: {
    title: "wxwreak | Infrastructure, Automation & Security Tooling",
    description: "Infrastructure, Automation & Security Tooling",
    url: "https://wxwreak.vercel.app/",
    siteName: "wxwreak | Infrastructure, Automation & Security Tooling",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://avatars.githubusercontent.com/u/217353155?v=4&s=400",
        width: 400,
        height: 400,
        alt: "wxwreak Github PFP" ,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "wxwreak | Infrastructure, Automation & Security Tooling",
    images: ["https://avatars.githubusercontent.com/u/217353155?v=4&s=400"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-black">
      <body className="bg-black text-white m-0 p-0 antialiased overflow-x-hidden">
        <CustomCursor />
        {children}
      </body>
    </html>
  )
}