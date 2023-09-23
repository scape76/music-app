import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { logout } from "~/session.server";

export const action = async ({ request }: ActionFunctionArgs) =>
  logout(request);

export const loader = async () => {
  return redirect("/");
};
