import invariant from "tiny-invariant";
import { client } from "~/lib/s3.server";
import { Upload } from "@aws-sdk/lib-storage";

const Bucket = process.env.S3_BUCKET;

invariant(process.env.S3_BUCKET, "S3_BUCKET must be set");

async function concatenateAsyncUint8Arrays(
  asyncIterable: AsyncIterable<Uint8Array>
): Promise<Uint8Array> {
  const chunks: Uint8Array[] = [];

  // Iterate through the async iterable and collect the Uint8Arrays in an array
  for await (const chunk of asyncIterable) {
    chunks.push(chunk);
  }

  // Calculate the total length of all the Uint8Arrays
  let totalLength = 0;
  for (const chunk of chunks) {
    totalLength += chunk.length;
  }

  // Create a new Uint8Array with the total length
  const result = new Uint8Array(totalLength);

  // Copy the chunks into the result Uint8Array
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}

export async function uploadToS3Bucket(data: AsyncIterable<Uint8Array>, filename: string) {
  const result = await concatenateAsyncUint8Arrays(data);

  new Upload({
    client,
    params: {
      ACL: "public-read",
      Bucket,
      Key: `${Date.now().toString()}-${filename}`,
      Body: result,
    },
  });
}
