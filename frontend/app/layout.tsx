import { HeroUIProvider } from "@heroui/react";
import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Flavor",
  description: "A web application that helps users discover and manage recipes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <HeroUIProvider>
          <div className="container pt-4">
            <main>{children}</main>
          </div>
        </HeroUIProvider>
      </body>
    </html>
  );
}
