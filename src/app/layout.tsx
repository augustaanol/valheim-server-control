import type { Metadata } from "next";
import { Geist, Geist_Mono, Pirata_One } from "next/font/google";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Theme, Container, Flex, Heading } from "@radix-ui/themes";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pirataOne = Pirata_One({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ADiheim",
  description: "valheim server control",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <Theme appearance="dark" accentColor="amber" radius="full" grayColor="mauve">
          <Flex style={{
            backgroundImage: "url('/images/background.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            minHeight: "100vh",
          }}
          direction="column">
            <Container size="4">
              <Flex align={"center"} className="pt-6 pb-12 gap-6 sticky top-0">
                <Image alt="logo" src="/images/valheim_logo_large.webp" width={"160"} height={"100"}/>
                <Heading 
                    as="h1" 
                    size={"8"} 
                    style={{ fontFamily: pirataOne.style.fontFamily }}
                  >
                    ADiheim server companion
                </Heading>
              </Flex>
              {children}
            </Container>
          </Flex>
        </Theme>
      </body>
    </html>
  );
}
