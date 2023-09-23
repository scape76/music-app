import { useForm } from "react-hook-form";
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
import { useSubmit } from "@remix-run/react";
import {
  ActionFunctionArgs,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { useState } from "react";



export const action = async ({ request }: ActionFunctionArgs) => {
  // const fd = await request.formData();
  const uploadHandler = unstable_composeUploadHandlers(
    // our custom upload handler
    async ({ name, contentType, data, filename }) => {
      if (name !== "file") return undefined;
      console.log("name", name);
      console.log("conentType", contentType);
      console.log("data", data);
      console.log("fileName", filename);

      return filename;
    },
    // fallback to memory for everything else
    unstable_createMemoryUploadHandler()
  );

  const formdata = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  // console.log("received:; ", fd);

  return null;
};

export default function AddMusic() {
  const [file, setFile] = useState<File>();
  const submit = useSubmit();

  const form = useForm<z.infer<typeof musicSchema>>({
    resolver: zodResolver(musicSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof musicSchema>) {
    if (!file) return;
    const formData = new FormData();

    for (const key in values) {
      formData.append(key, values[key as keyof typeof values]);
    }

    formData.append("file", file);

    submit(formData, {
      method: "post",
      action: "/home/add",
      encType: "multipart/form-data",
    });
  }

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
            <Button className="w-full" type="submit">
              Upload
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
