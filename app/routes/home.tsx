import { User } from "@prisma/client";
import { type MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Header } from "~/components/Header";
import { Icons } from "~/components/Icons";
import { MainNav } from "~/components/MainNav";
import { Button } from "~/components/ui/button";
import { getUser } from "~/session.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Music App" },
    { name: "description", content: "Welcome to music app!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);

  return { user };
}

export default function Index() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div
      style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}
      className="min-h-screen"
    >
      <Header user={user as unknown as User} />
      <div className="container">
        <MainNav />
        <main className="flex flex-col items-center lg:block lg:ml-72 lg:pr-64 space-y-4 mt-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
