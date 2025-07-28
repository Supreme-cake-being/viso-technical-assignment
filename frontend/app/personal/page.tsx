import { PersonalRecipes } from "@/src/components/PersonalRecipes";
import { usePersonalRecipes } from "@/src/hooks/recipes/usePersonalRecipes";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies();
  const userToken = cookieStore.get("token");

  if (!userToken) {
    redirect("/login");
  }

  const recipes = await usePersonalRecipes();

  return <PersonalRecipes recipes={recipes} />;
}
