import { atom, useAtom } from "jotai";
import { Post } from "@prisma/client";
import { Jsonify } from "type-fest";

export const currentSongAtom = atom<Jsonify<Post> | null>(null);
