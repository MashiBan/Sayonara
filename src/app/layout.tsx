import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Sayonara, Seniors!",
  description: "Share you memories!!",
  icons: {
    icon: "/S.png", 
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
        {children}
      </body>
    </html>
  );
}
