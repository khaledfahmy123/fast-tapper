import { openDB } from "idb";

export async function saveVideoForSession(videoBlob, forward) {
  const db = await openDB("my-db", 1);
  await db.put("videos", videoBlob, forward ? "vid" : "rev");

  const videoUrl = URL.createObjectURL(videoBlob);
  console.log("video url: ", videoUrl);
}
