import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import Providers from "@/store/providers/Provider";

import ClientAuth from "@/components/auth/ClientAuth";

import "./globals.css";
// import HeroBackground from "@/components/contact/HeroBackground";
import I18nProvider from "./i18n-provider";
export const metadata = {
  title: "FullStack Commerce Hub",
  description: "A full-stack commerce experience built as a portfolio project",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const faviconUrl = `${process.env.NEXT_PUBLIC_S3_URL}/final_favicon.png`;
  // useAuth();
  return (
    <html lang="en">
      <head>
        <link rel="icon" href={faviconUrl} sizes="32x32" type="image/png" />
      </head>
      <body>
        <Providers>
          <I18nProvider>
            <ClientAuth />
            <Header />
            {children}
            <Footer />
          </I18nProvider>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
