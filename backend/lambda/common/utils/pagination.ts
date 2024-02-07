export const decodePageKey = function (encoded: string): { [id: string]: any } {
  let pageKey;
  if (encoded) {
    const decodedPageKey = Buffer.from(encoded, "base64").toString("ascii");
    pageKey = JSON.parse(decodedPageKey);
  }

  return pageKey;
}
