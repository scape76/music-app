import { Form, Link, useActionData } from "@remix-run/react";
import { Card, CardContent, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { Button } from "~/components/ui/button";
import { userSchema } from "~/lib/schema/user";
import { ZodError } from "zod";
import { useEffect, useState } from "react";
import { createUser, getUserByEmail } from "~/models/user.server";
import { createUserSession } from "~/session.server";
import { Checkbox } from "~/components/ui/checkbox";

export const action = async ({ request }: ActionFunctionArgs) => {
  const fd = await request.formData();
  try {
    const remember = fd.get("remember");
    const data = userSchema.parse(Object.fromEntries(fd.entries()));

    console.log("data", data, " remember ", remember);

    const candidate = await getUserByEmail(data.email);

    console.log("candidate", candidate);

    if (candidate) {
      return {
        status: 404,
        errors: {
          email: "User already exists with this email",
          password: null,
        },
      };
    }

    const user = await createUser(data);

    return createUserSession({
      request,
      userId: user.id,
      redirectTo: "/",
      remember: remember === "on" ? true : false,
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

// if I get a zod error, i set it in validation errors

export default function SignUpPage() {
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
        <CardTitle>Sign up</CardTitle>
        <Form method="post" className="space-y-6">
          <Input
            name="email"
            placeholder="email"
            onChange={() => setErrors((prev) => ({ ...prev, email: null }))}
          />
          {errors.email && (
            <span className="text-xs text-destructive">{errors.email}</span>
          )}
          <Input
            name="password"
            placeholder="password"
            type="password"
            onChange={() => setErrors((prev) => ({ ...prev, password: null }))}
          />
          {errors.email && (
            <span className="text-xs text-destructive">{errors.password}</span>
          )}
          <Button className="w-full" type="submit">
            Submit
          </Button>
          <div className="flex w-full justify-between items-center gap-2">
            <label htmlFor="remember" className="text-xs text-muted-foreground">
              Remember me
            </label>
            <Checkbox id="remember" name="remember" />
          </div>
        </Form>
        <span className="flex-col sm:flex-row text-sm text-muted-foreground flex gap-2">
          Already have an account?
          <Link to={"/login"} className="text-blue-600">
            Log in
          </Link>
        </span>
      </Card>
    </div>
  );
}
