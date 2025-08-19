import React from "react";
import { FloatingDock } from "@/components/ui/SideBar";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconWorld,
} from "@tabler/icons-react";

export function FloatingDockDemo() {
  const links = [
    {
      title: "Portfolio",
      icon: (
        <IconWorld className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://hireuzair.vercel.app",
    },

    {
      title: "LinkedIn",
      icon: (
        <IconBrandLinkedin className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://www.linkedin.com/in/muhammad-uzair-j21/",
    },
    {
      title: "GitHub",
      icon: (
        <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://github.com/Muhammad-Uzair21",
    },
  ];
  return (
    <div className="flex items-center justify-center h-[35rem] absolute w-full">
      <FloatingDock
        mobileClassName="translate-y-20"
        items={links}
      />
    </div>
  );
}
