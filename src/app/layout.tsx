import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sayonara, Seniors!",
  description: "Share your memories!!",
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Anton&family=Borel&family=Cedarville+Cursive&family=Dancing+Script:wght@400..700&family=Lobster&family=Pacifico&family=Sacramento&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
