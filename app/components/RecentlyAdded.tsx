import { useLoaderData } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { ScrollArea } from "~/components/ui/scroll-area";
import { getFileUrl } from "~/lib/getFileUrl";
import { loader } from "~/routes/home._index";
import { MusicCard } from "./MusicCard";

export function RecentlyAdded() {
  const { recentlyAdded: posts } = useLoaderData<typeof loader>();

  const [width, setWidth] = useState<number>();

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (sectionRef.current) {
        if (window.innerWidth < 1024) {
          setWidth(window.innerWidth - 120);
        } else {
          console.log(sectionRef.current.clientWidth);
          setWidth(sectionRef.current.clientWidth);
        }
      }
    };
    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section ref={sectionRef}>
      <h1>Recently added</h1>
      <ScrollArea style={{ width }} className="pb-2">
        <div className="flex flex-row gap-2 w-full">
          {posts?.map((p) => (
            <MusicCard post={p} key={p.id} />
          ))}
        </div>
      </ScrollArea>
    </section>
  );
}
