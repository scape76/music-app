import { cn } from "~/lib/utils";
import { Button, buttonVariants } from "./ui/button";
import { User } from "@prisma/client";
import { Form, Link } from "@remix-run/react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

export function Header({ user }: { user?: User | null }) {
  return (
    <header className="sticky top-0 z-50 w-full p-2 bg-background/90 border-b border-border">
      <div className="container flex items-center justify-between gap-2">
        <div className="flex items-center">
          <Link to={"/"} className="lg:w-72 lg:pr-2">
            Music app
          </Link>
          <Form className="w-full max-w-[300px] lg:ml-[5.5rem]" method="post">
            <div className="relative">
              <Input placeholder="music name" className="pl-8 peer py-6" />
              <Search className="w-4 h-4 absolute top-4 left-2 peer-focus:text-primary transition-colors" />
            </div>
          </Form>
        </div>
        {user ? (
          <Form action="/logout" method="post">
            <Button variant={"ghost"} type="submit">
              Logout
            </Button>
          </Form>
        ) : (
          <Link
            className={cn(buttonVariants({ variant: "default" }))}
            to={"/login"}
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
