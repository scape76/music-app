import { NavItem } from "~/types";

export const siteConfig = {
  name: "Music app",
  mainNav: [
    {
      title: "Home",
      to: "/home",
      icon: "home",
    },
    {
      title: "Add music",
      to: "/home/add",
      icon: "music",
    },
  ] satisfies NavItem[],
};
