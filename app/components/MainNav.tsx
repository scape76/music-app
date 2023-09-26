import { Link, useLocation } from "@remix-run/react";
import { siteConfig } from "~/config/site";
import { Icons } from "./Icons";
import { cn } from "~/lib/utils";

export function MainNav() {
  const location = useLocation();

  return (
    <nav className="w-52 fixed top-14 bottom-0 hidden lg:block h-[calc(100vh-72px)] pr-2 border-r border-border">
      <ul className="mt-4 flex flex-col gap-2">
        {siteConfig.mainNav.map((route) => {
          const Icon = Icons[route.icon];
          const isCurrentPath = location.pathname === route.to;

          return (
            <Link to={route.to} key={route.title}>
              <div
                className={cn(
                  { "bg-accent": isCurrentPath },
                  "w-full flex items-center p-2 text-sm rounded-md hover:bg-accent"
                )}
              >
                <Icon className="mr-2 w-4 h-4" aria-hidden="true" />
                <span>{route.title}</span>
              </div>
            </Link>
          );
        })}
      </ul>
    </nav>
  );
}
