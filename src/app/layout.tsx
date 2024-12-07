import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";

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
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Borel&family=Cedarville+Cursive&family=Dancing+Script:wght@400..700&family=Lobster&family=Pacifico&family=Sacramento&display=swap"
          rel="stylesheet"
        />
        <script
          src="https://www.google.com/recaptcha/api.js"
          async
          defer
        ></script>
      </head>
      <body>
        <Toaster position="top-right" reverseOrder={false} />

        {/* Children content */}
        {children}

        <Analytics />
      </body>
    </html>
  );
}


// import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
// import { Metadata } from 'next';
// import './globals.css';
// import { Analytics } from '@vercel/analytics/react';
// import { Toaster } from 'react-hot-toast';

// export const metadata: Metadata = {
//   title: 'Sayonara, Seniors!',
//   description: 'Share your memories!!',
//   icons: {
//     icon: '/S.png',
//   },
// };

// export default function RootLayout({
//   children,
// }: Readonly<{ children: React.ReactNode }>) {
//   return (
//     <html lang="en">
//       <head>
//         <link rel="preconnect" href="https://fonts.googleapis.com" />
//         <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
//         <link
//           href="https://fonts.googleapis.com/css2?family=Anton&family=Borel&family=Cedarville+Cursive&family=Dancing+Script:wght@400..700&family=Lobster&family=Pacifico&family=Sacramento&display=swap"
//           rel="stylesheet"
//         />
//       </head>
//       <body>
//         <GoogleReCaptchaProvider
//           reCaptchaKey="6LffFJUqAAAAAG6hTof-Q744RC8txX5dErhAokAl" 
//           language="en" 
//           useEnterprise={true} 
//         >
//           <Toaster position="top-right" reverseOrder={false} />
//           {children}
//           <Analytics />
//         </GoogleReCaptchaProvider>
//       </body>
//     </html>
//   );
// }
