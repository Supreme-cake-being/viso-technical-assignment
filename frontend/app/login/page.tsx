import { LoginForm } from "@/src/components/LoginForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies();
  const userToken = cookieStore.get("token");

  if (userToken) {
    redirect("/");
  }

  return <LoginForm></LoginForm>;
}
