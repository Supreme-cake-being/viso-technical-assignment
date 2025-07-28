import { HeroUIProvider } from "@heroui/react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { useRefresh } from "@/src/hooks/auth/useRefresh";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Flavor",
  description: "A web application that helps users discover and manage recipes",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const userToken = cookieStore.get("token");

  const currentUser = await useRefresh(userToken);

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
