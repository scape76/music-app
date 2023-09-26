import { S3Client } from "@aws-sdk/client-s3";
import invariant from "tiny-invariant";

invariant(process.env.AWS3_ACCESS, "AWS3_ACCESS must be set");
invariant(process.env.AWS3_SECRET, "AWS3_SECRET must be set");
invariant(process.env.S3_REGION, "S3_REGION must be set");

let client: S3Client;

if (process.env.NODE_ENV === "development") {
  client = new S3Client({
    region: "us-east-1",
    endpoint: "http://localhost:9001",
    credentials: {
      accessKeyId: "S3RVER",
      secretAccessKey: "S3RVER",
    },
  });
} else {
  client = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS3_ACCESS,
      secretAccessKey: process.env.AWS3_SECRET,
    },
    region: process.env.S3_REGION,
  });
}

export { client };
