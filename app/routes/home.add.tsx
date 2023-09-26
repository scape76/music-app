import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { musicSchema } from "~/lib/schema/music";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useNavigation, useSubmit } from "@remix-run/react";
import {
  ActionFunctionArgs,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { useCallback, useEffect, useRef, useState } from "react";
import { uploadToS3Bucket } from "~/upload.server";
import { getUserId } from "~/session.server";
import { createPost } from "~/models/music.server";
import { Crop, Loader2, Trash2 } from "lucide-react";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import Cropper, { ReactCropperElement } from "react-cropper";
import { Icons } from "~/components/Icons";
import { toast } from "~/components/ui/use-toast";

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await getUserId(request);

  if (!userId) {
    return { status: 402 };
  }

  const uploadHandler = unstable_composeUploadHandlers(
    // our custom upload handler
    async ({ name, contentType, data, filename }) => {
      if (name !== "file" && name !== "avatarFile") return undefined;

      const result = await uploadToS3Bucket(data, filename ?? "");

      if (result.$metadata.httpStatusCode === 200 && "Key" in result) {
        if (!result.Key) return filename;

        return result.Key;
      }

      return filename;
    },
    // fallback to memory for everything else
    unstable_createMemoryUploadHandler()
  );

  const fd = await unstable_parseMultipartFormData(request, uploadHandler);

  const name = fd.get("name");
  const fileKey = fd.get("file");
  const avatarFileKey = fd.get("avatarFile");

  if (typeof name !== "string" || !name) {
    return { status: 400, errors: { name: "Invalid name field" } };
  }

  if (typeof fileKey !== "string" || !fileKey) {
    return { status: 400, errors: { name: "Invalid file field" } };
  }

  if (typeof avatarFileKey !== "string" || !avatarFileKey) {
    return { status: 400, errors: { name: "Invalid avatar file field" } };
  }

  const post = await createPost({
    name,
    fileKey,
    userId,
    imageKey: avatarFileKey,
  });

  return { status: 200 };
};

export default function AddMusic() {
  const [image, setImage] = useState<string>();
  const [file, setFile] = useState<File>();
  const [avatar, setAvatarFile] = useState<File>();
  const submit = useSubmit();

  const [open, setIsOpen] = useState<boolean>(false);

  const cropperRef = useRef<ReactCropperElement>(null);

  const navigation = useNavigation();

  const isLoading = navigation.state === "loading";

  const form = useForm<z.infer<typeof musicSchema>>({
    resolver: zodResolver(musicSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof musicSchema>) {
    if (!file || !avatar) return;
    const formData = new FormData();

    for (const key in values) {
      formData.append(key, values[key as keyof typeof values]);
    }

    formData.append("file", file);
    formData.append("avatarFile", avatar);

    submit(formData, {
      method: "post",
      action: "/home/add",
      encType: "multipart/form-data",
    });
  }

  const onCrop = () => {
    if (!avatar || !cropperRef.current) return;
    const croppedCanvas = cropperRef.current?.cropper.getCroppedCanvas();

    setImage(croppedCanvas.toDataURL());

    croppedCanvas.toBlob((blob) => {
      if (!blob) {
        toast({
          title: "Something went wrong",
          description: "Please, try again later",
        });
        return;
      }

      const croppedImage = new File([blob], avatar.name, {
        type: avatar.type,
        lastModified: Date.now(),
      });

      setAvatarFile(croppedImage);
    });
  };

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Enter") {
        onCrop();
        setIsOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [onCrop]);

  return (
    <Card className="max-w-[460px]">
      <CardHeader>
        <CardTitle>Add a music</CardTitle>
        <CardDescription>Add your favourite music.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Hardy boys..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <Label>File</Label>
              <Input
                type="file"
                accept=".mp3,audio/*"
                onChange={(e) => setFile(e.target.files?.[0])}
              />
            </div>
            <div className="space-y-2">
              <Label>Avatar</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0];

                  if (!selectedFile) return;
                  const imageUrl = URL.createObjectURL(selectedFile);
                  setAvatarFile(selectedFile);
                  setImage(imageUrl);

                  const image = new Image();

                  image.onload = () => {
                    const width = image.width;
                    const height = image.height;

                    const aspectRatio = width / height;

                    if (aspectRatio !== 1) {
                      setIsOpen(true);
                    }

                    setAvatarFile(selectedFile);
                    setImage(URL.createObjectURL(selectedFile));
                  };

                  image.src = URL.createObjectURL(selectedFile);
                }}
              />
              {image && (
                <div className="w-full p-2 border border-border rounded-md flex justify-between items-center">
                  <div className="w-12">
                    <AspectRatio ratio={1}>
                      <img src={image} alt="image" className="rounded-md" />
                    </AspectRatio>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dialog open={open} onOpenChange={setIsOpen}>
                      <DialogTrigger asChild>
                        <Button type="button" size={"sm"} variant={"outline"}>
                          <Crop className="mr-2 h-4 w-4" />
                          Crop Image
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <p className="absolute left-5 top-4 text-base font-medium text-muted-foreground">
                          Crop image
                        </p>
                        <div className="mt-8 grid place-items-center space-y-5">
                          <Cropper
                            ref={cropperRef}
                            className="h-[450px] w-[450px] object-cover"
                            zoomTo={0.5}
                            initialAspectRatio={1 / 1}
                            preview=".img-preview"
                            src={image}
                            viewMode={1}
                            aspectRatio={1}
                            minCropBoxHeight={10}
                            minCropBoxWidth={10}
                            background={false}
                            responsive={true}
                            autoCropArea={1}
                            checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                            guides={true}
                          />
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              aria-label="Crop image"
                              type="button"
                              size="sm"
                              className="h-8"
                              onClick={() => {
                                onCrop();
                                setIsOpen(false);
                              }}
                            >
                              <Icons.crop
                                className="mr-2 h-3.5 w-3.5"
                                aria-hidden="true"
                              />
                              Crop Image
                            </Button>
                            <Button
                              aria-label="Reset crop"
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-8"
                              onClick={() => {
                                cropperRef.current?.cropper.reset();
                              }}
                            >
                              <Icons.reset
                                className="mr-2 h-3.5 w-3.5"
                                aria-hidden="true"
                              />
                              Reset Crop
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      type="button"
                      size={"icon"}
                      variant={"destructive"}
                      onClick={() => {
                        setAvatarFile(undefined);
                        setImage(undefined);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Upload
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
