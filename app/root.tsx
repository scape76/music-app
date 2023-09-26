import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import styles from "./globals.css";
import { Toaster } from "./components/ui/toaster";
import cropperStyles from "cropperjs/dist/cropper.css";
import scrollbarStyles from "~/styles/scrollbar.css";
import sliderStyles from "~/styles/slider.css";
import { CurrentSongPlayer } from "./components/CurrentSongPlayer";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "stylesheet", href: cropperStyles },
  { rel: "stylesheet", href: scrollbarStyles },
  { rel: "stylesheet", href: sliderStyles },
];

export default function App() {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen">
        <Outlet />
        <Toaster />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <CurrentSongPlayer />
      </body>
    </html>
  );
}
