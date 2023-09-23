import { User } from "@prisma/client";
import {
  ActionFunctionArgs,
  type MetaFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";
import {
  Form,
  Link,
  Outlet,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { Play, Search, SkipBack, SkipForward } from "lucide-react";
import { Header } from "~/components/Header";
import { MainNav } from "~/components/MainNav";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button, buttonVariants } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Progress } from "~/components/ui/progress";
import { cn } from "~/lib/utils";
import { createPost, getAllPosts } from "~/models/gallery.server";
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
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <Header user={user as unknown as User} />
      <div className="container">
        <MainNav />
        <main className="mt-2 flex flex-col items-center lg:block lg:ml-72 lg:pr-64 space-y-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// export const action = async ({ request }: ActionFunctionArgs) => {
//   const fd = await request.formData();

//   const description = fd.get("description");

//   if (!description || typeof description !== "string") return null;

//   console.log("creating post...");

//   await createPost({ description });

//   return null;
// };
