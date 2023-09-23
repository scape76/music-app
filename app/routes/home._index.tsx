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

export async function loader({ request }: LoaderFunctionArgs) {
  const posts = await getAllPosts();

  return posts;
}

export default function HomePage() {
  const posts = useLoaderData<typeof loader>();

  return (
    <>
      <Form className="w-full max-w-[400px]" method="post">
        <div className="relative">
          <Input placeholder="music name" className="pl-8 peer py-6" />
          <Search className="w-4 h-4 absolute top-4 left-2 peer-focus:text-primary transition-colors" />
        </div>
      </Form>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4 w-full border border-border p-2 rounded-md">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="w-full flex flex-col items-center gap-2">
            <span className="text-sm text-accent-foreground self-start">
              Name
            </span>
            <Progress className="h-[0.6rem]" value={69} />
            <div className="flex gap-2">
              <Button variant={"outline"} size="icon">
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button variant={"outline"} size="icon">
                <Play className="h-4 w-4" />
              </Button>
              <Button variant={"outline"} size="icon">
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      {posts?.map((p) => (
        <span key={p.id}>{p.description}</span>
      ))}
    </>
  );
}
