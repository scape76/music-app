import { ActionFunctionArgs } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { ZodError } from "zod";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { userSchema } from "~/lib/schema/user";
import { verifyLogin } from "~/models/user.server";
import { createUserSession } from "~/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const fd = await request.formData();
  try {
    const data = userSchema.parse(Object.fromEntries(fd.entries()));

    const user = await verifyLogin({ ...data });

    if (!user) {
      return {
        status: 404,
        errors: {
          email: "Invalid email or password",
          password: null,
        },
      };
    }

    return createUserSession({
      redirectTo: "/",
      remember: true,
      request,
      userId: user.id,
    });
  } catch (err) {
    if (err instanceof ZodError) {
      const messages = JSON.parse(err.message);

      if (Array.isArray(messages)) {
        const password =
          messages.find((err) => err.path?.includes("password"))?.message ??
          null;
        const email =
          messages.find((err) => err.validation === "email")?.message ?? null;

        return {
          status: 404,
          errors: {
            email,
            password,
          },
        };
      }
    }

    return {
      status: 404,
      errors: {
        email: null,
        password: null,
        err,
      },
    };
  }
};

export default function LoginPage() {
  const [errors, setErrors] = useState<{
    email: string | null;
    password: string | null;
  }>({ email: null, password: null });

  const ad = useActionData<{
    status: number;
    errors: { email: string | null; password: string | null };
  }>();

  useEffect(() => {
    console.log(ad);
    if (ad?.status === 404) {
      setErrors(ad.errors);
    }
  }, [ad]);

  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="w-full max-w-[400px] mx-4 flex flex-col gap-6 p-6">
        <CardTitle>Login</CardTitle>
        <Form method="post" className="space-y-6">
          <Input name="email" placeholder="email" />
          {errors.email && (
            <span className="text-xs text-destructive">{errors.email}</span>
          )}
          <Input name="password" placeholder="password" type="password" />
          {errors.email && (
            <span className="text-xs text-destructive">{errors.password}</span>
          )}
          <Button className="w-full">Submit</Button>
        </Form>
        <span className="flex-col sm:flex-row text-sm text-muted-foreground flex gap-2">
          Dont have an account yet?
          <Link to={"/sign-up"} className="text-blue-600">
            Sign up
          </Link>
        </span>
      </Card>
    </div>
  );
}
