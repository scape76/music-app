import { createRequestHandler } from "@remix-run/express";
import express from "express";
import { broadcastDevReady } from "@remix-run/node";

import * as build from "./build/index.js";

const app = express();
app.use(express.static("public"));

app.all("*", createRequestHandler({ build }));

const a = [2, 3, 4];

debugger;

app.listen(3000, () => {
  if (process.env.NODE_END === "development") {
    broadcastDevReady(build);
  }
  console.log("App is listening on port 3000");
});
