import { cn } from "~/lib/utils";
import { Button, buttonVariants } from "./ui/button";
import { User } from "@prisma/client";
import { Form, Link } from "@remix-run/react";

export function Header({ user }: { user?: User | null }) {
  return (
    <header className="w-full p-4 px-8 bg-muted">
      <div className="container flex items-center justify-between">
        <Link to={"/"}>Music app</Link>
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
