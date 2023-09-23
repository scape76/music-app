import { Link } from "@remix-run/react";
import { siteConfig } from "~/config/site";
import { Icons } from "./Icons";

export function MainNav() {
  return (
    <nav className="w-72 fixed bottom-0 top-20 hidden lg:flex flex-col g-4 h-[calc(100vh-72px)] pr-6">
      {siteConfig.mainNav.map((route) => {
        const Icon = Icons[route.icon];
        return (
          <Link to={route.to} key={route.title}>
            <div className="w-full flex items-center p-2 rounded-md border border-border hover:bg-accent">
              <Icon className="mr-2 w-4 h-4" aria-hidden="true" />
              <span>{route.title}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
