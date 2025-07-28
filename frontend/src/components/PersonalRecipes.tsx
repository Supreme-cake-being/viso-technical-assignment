import { Card, CardBody, CardFooter, CardHeader, Divider } from "@heroui/react";
import { Navbar } from "./NavBar";

interface IRecipes {
  recipes: Record<string, any>;
}

export const PersonalRecipes = ({ recipes }: IRecipes) => {
  return (
    <>
      <Navbar active="personal" />

      <section className="flex gap-[16px] sm:flex-col">
        {recipes.map(({ id, name, cuisine, details }: any) => (
          <Card key={id} className="w-[400px]">
            <CardHeader className="flex gap-3">
              <p className="text-md">{name}</p>
            </CardHeader>
            <Divider />
            <CardBody>
              <p>
                {cuisine.charAt(0).toUpperCase() +
                  cuisine.slice(1).toLowerCase(0)}
              </p>
            </CardBody>
            <Divider />
            <CardFooter>
              <p>{details}</p>
            </CardFooter>
          </Card>
        ))}
      </section>
    </>
  );
};
