import { User } from "@prisma/client";
import { ScrollAreaViewport } from "@radix-ui/react-scroll-area";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { Play, Search, SkipBack, SkipForward } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { RecentlyAdded } from "~/components/RecentlyAdded";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Input } from "~/components/ui/input";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { getFileUrl } from "~/lib/getFileUrl";
import { getAllPosts, getRecentlyAddedMusic } from "~/models/music.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const recentlyAdded = await getRecentlyAddedMusic();

  console.log("in loader");

  return json({ recentlyAdded });
}

export default function HomePage() {
  const [width, setWidth] = useState<number>();
  const posts = useLoaderData<typeof loader>();

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (sectionRef.current) {
        console.log("here", window.innerWidth);
        if (window.innerWidth < 1024) {
          setWidth(window.innerWidth - 120);
        } else {
          console.log(sectionRef.current.clientWidth);
          setWidth(sectionRef.current.clientWidth);
        }
      }
    };

    // Add the event listener
    window.addEventListener("resize", handleResize);

    // Call handleResize initially to get the initial width
    handleResize();

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  console.log("posts ", posts);

  return (
    <>
      <RecentlyAdded />
      <RecentlyAdded />
      <RecentlyAdded />
      <RecentlyAdded />
    </>
  );
}
