import { Post } from "@prisma/client";
import { Link } from "@remix-run/react";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { getFileUrl } from "~/lib/getFileUrl";
import { Jsonify } from "type-fest";
import { Button } from "./ui/button";
import { Play } from "lucide-react";
import { useAtom } from "jotai";
import { currentSongAtom } from "~/store/music.store";

export function MusicCard({ post }: { post: Jsonify<Post> }) {
  const [_, setCurrentSong] = useAtom(currentSongAtom);

  return (
    <div className="flex items-center gap-4 p-2 rounded-md">
      <div className="flex flex-col w-[156px]">
        <div
          //   to={`/home/watch/${post.id}`}
          className="group"
          onClick={() => setCurrentSong(post)}
        >
          <AspectRatio ratio={1} className="relative hover:brightness-75">
            {post.imageKey && (
              <img
                src={getFileUrl(post.imageKey)}
                alt={post.name}
                className="rounded-md"
              />
            )}
            <Button
              size={"icon"}
              variant={"ghost"}
              className="absolute invisible group-hover:visible bottom-3 right-3 rounded-full transition hover:scale-125"
            >
              <Play className="w-4 h-4" />
            </Button>
          </AspectRatio>
        </div>
        <span className="font-bold truncate">
          {post.name} asda,sodlasdl aapsldapsldapaspdlaspdlaspd
        </span>
        <span className="text-muted-foreground text-xs truncate">
          {"Somehow"}
        </span>
      </div>
    </div>
  );
}
