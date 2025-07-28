"use client";

import { Link, Navbar as NavbarComponent, NavbarItem } from "@heroui/react";

interface INavbar {
  active: "all" | "personal";
}

export const Navbar = ({ active }: INavbar) => {
  return (
    <div className="w-[400px] mx-auto mb-[16px]">
      <NavbarComponent className="flex gap-[16px]">
        <NavbarItem isActive={active === "all"}>
          <Link href="/">All recipes</Link>
        </NavbarItem>
        <NavbarItem isActive={active === "personal"}>
          <Link href="/personal">Personal recipes</Link>
        </NavbarItem>
      </NavbarComponent>
    </div>
  );
};
