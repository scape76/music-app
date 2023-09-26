import invariant from "tiny-invariant";

// invariant(process.env.S3_BUCKET_URL, "S3_BUCKET_URL has to be defined");

export function getFileUrl(key: string) {
  let encodedKey = encodeURI(key);

  // if (process.env.NODE_ENV === "development")
    return `http://localhost:9001/music-app-bucket.localhost/${encodedKey}`;
  // else return `${process.env.URL}/${encodedKey}`;
}
