import { Icons } from "~/components/Icons";
import { Button } from "~/components/ui/button";
import { Slider } from "./ui/slider";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { currentSongAtom } from "~/store/music.store";
import { calculateTime, cn } from "~/lib/utils";
import { getFileUrl } from "~/lib/getFileUrl";
import { AspectRatio } from "./ui/aspect-ratio";
import { Input } from "./ui/input";
import { Toggle } from "./ui/toggle";

const MIN_VOLUME = 0;

export function CurrentSongPlayer() {
  const audioElementRef = useRef<HTMLAudioElement>(null);
  const sliderRef = useRef<HTMLInputElement>(null);
  const audioContainerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const [isLoop, setIsLoop] = useState<boolean>(false);

  const [prevVolume, setPrevVolume] = useState<number>();
  const [volume, setVolume] = useState<number>(50);

  const [duration, setDuration] = useState<
    { seconds: number; time: string } | undefined
  >();

  const [currentTime, setCurrentTime] = useState<number>(0);

  const [currentSong] = useAtom(currentSongAtom);

  const displayBufferedAmount = useCallback(
    (event: React.SyntheticEvent<HTMLAudioElement, Event>) => {
      if (!audioContainerRef.current || !duration?.seconds) return;

      const bufferedAmount = Math.floor(
        event.currentTarget.buffered.end(
          event.currentTarget.buffered.length - 1
        )
      );

      audioContainerRef.current.style.setProperty(
        "--buffered-width",
        `${(bufferedAmount / duration.seconds) * 100}%`
      );
    },
    [audioElementRef, audioContainerRef, duration]
  );

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      if (!audioElementRef.current) return prev;
      if (prev) {
        audioElementRef.current.pause();
        return false;
      } else {
        audioElementRef.current.play();
        return true;
      }
    });
  }, [audioElementRef, setIsPlaying]);

  useEffect(() => {
    if (!audioElementRef.current || !sliderRef.current) return;

    const listener = () => {
      const duration = audioElementRef?.current?.duration;

      if (!duration || !sliderRef.current) return;

      setDuration({ seconds: duration, time: calculateTime(duration) });
    };

    audioElementRef.current.addEventListener("loadedmetadata", listener);

    return () => {
      audioElementRef.current?.removeEventListener("loadedmetadata", listener);
    };
  }, [audioElementRef, sliderRef, currentSong]);

  return (
    <div
      className={cn(
        "sticky bottom-0 w-full p-2 bg-background border-t border-border hidden",
        { block: !!currentSong }
      )}
      id="audio-player-container"
      ref={audioContainerRef}
    >
      <Input
        type="range"
        max={duration?.seconds}
        defaultValue={0}
        value={currentTime}
        ref={sliderRef}
        className="p-0 border-none outline-none bg-background"
        onChange={(e) => {
          if (!audioElementRef.current) return;
          const val = Number(e.currentTarget.value);
          setCurrentTime(val);
          audioElementRef.current.currentTime = val;
        }}
        onInput={(e) => setCurrentTime(Number(e.currentTarget.value))}
      />
      <div className="container flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <Button size={"icon"} variant={"ghost"}>
            <Icons.skipBack className="w-4 h-4" />
          </Button>
          <Button size={"icon"} variant={"ghost"} onClick={togglePlay}>
            {!isPlaying ? (
              <Icons.play className="w-6 h-6" />
            ) : (
              <Icons.pause className="w-6 h-6" />
            )}
          </Button>
          <Button size={"icon"} variant={"ghost"}>
            <Icons.skipForward className="w-4 h-4" />
          </Button>
          <span className="text-muted-foreground text-xs">
            {calculateTime(currentTime)} {" / "}
            {duration?.time}
          </span>
        </div>
        <div className="flex gap-2 items-center">
          {currentSong?.imageKey && (
            <div className="w-12">
              <AspectRatio ratio={1}>
                <img
                  src={getFileUrl(currentSong?.imageKey)}
                  alt={currentSong?.name}
                />
              </AspectRatio>
            </div>
          )}
          <div className="flex flex-col gap-1 text-sm">
            <span className="font-semibold">{currentSong?.name}</span>
            <span className="text-muted-foreground font-semibold">
              {"TODO: Someone"}
            </span>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <Slider
            defaultValue={[volume]}
            value={[volume]}
            onValueChange={(val) => {
              if (!audioElementRef.current) return;
              setVolume(val?.[0]);
              audioElementRef.current.volume = val?.[0] / 100;
            }}
            max={100}
            step={1}
            className={"w-[100px]"}
          />
          <Button
            size={"icon"}
            variant={"ghost"}
            onClick={() =>
              setVolume((prev) => {
                if (!audioElementRef.current) return prev;
                if (prev === MIN_VOLUME) {
                  audioElementRef.current.volume = (prevVolume ?? 50) / 100;
                  return prevVolume ?? 50;
                }
                audioElementRef.current.volume = 0;
                setPrevVolume(prev);
                return 0;
              })
            }
          >
            {volume === MIN_VOLUME ? (
              <Icons.volumex className="w-4 h-4" />
            ) : (
              <Icons.volume className="w-4 h-4" />
            )}
          </Button>
          <Toggle
            aria-label="Toggle italic"
            pressed={isLoop}
            onPressedChange={setIsLoop}
            size={"icon"}
          >
            <Icons.repeat className="w-4 h-4" />
          </Toggle>
        </div>
      </div>
      {currentSong?.fileKey && (
        <audio
          src={getFileUrl(currentSong?.fileKey)}
          preload="metadata"
          onTimeUpdate={(e) => {
            setCurrentTime(e.currentTarget.currentTime);
          }}
          autoPlay
          loop={isLoop}
          onEnded={() => {
            console.log("music ended!");
          }}
          onProgress={(e) => displayBufferedAmount(e)}
          ref={audioElementRef}
        />
      )}
    </div>
  );
}
