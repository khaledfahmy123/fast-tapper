//@ts-ignore
import ffmpeg from "fluent-ffmpeg";
//@ts-ignore
import { IncomingForm } from "formidable";
import { promises as fs } from "fs";
import { existsSync, mkdirSync } from "fs";
import path from "path";
//@ts-ignore
import archiver from "archiver";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false, // Disable body parsing to handle file uploads
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Inside Req");
  if (req.method === "POST") {
    const dirPath = path.join("/temp", "uploads");

    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
      console.log("Directory created");
    } else {
      console.log("Directory already exists");
    }
    const form = new IncomingForm({
      uploadDir: dirPath,
      keepExtensions: true,
    });

    form.parse(req, async (err: Error, fields: any, files: any) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "File parsing failed" });
        return;
      }

      console.log("Hello inside ");

      const inputFile = files.file[0].filepath;
      const outForward = path.join("./uploads", `forward_${Date.now()}.mp4`);
      const outputFile = path.join("./uploads", `reverse_${Date.now()}.mp4`);
      console.log(inputFile);

      ffmpeg(inputFile) // Use the variable 'name' as the input file
        .videoCodec("libx264")
        .outputOptions([
          "-crf 28", // Compression setting
          "-preset ultrafast", // Encoding speed
        ])
        .output(outForward) // Output file
        .on("end", async () => {
          console.log("Processing finished!");
          ffmpeg(outForward)
            .outputOptions([
              "-crf 28", // Compression setting
              "-preset ultrafast", // Encoding speed
            ])
            .videoFilter("reverse") // Video reverse filter
            .audioFilter("areverse") // Audio reverse filter
            .output(outputFile)
            .on("end", async () => {
              const fileReverseBuffer = await fs.readFile(outputFile);
              const fileForwardBuffer = await fs.readFile(outForward);

              res.setHeader("Content-Type", "application/zip");
              res.setHeader(
                "Content-Disposition",
                "attachment; filename=videos.zip"
              );

              const archive = archiver("zip", { zlib: { level: 9 } });

              archive.pipe(res);
              archive.append(fileForwardBuffer, {
                name: "forward.mp4",
              });
              archive.append(fileReverseBuffer, {
                name: "reverse.mp4",
              });
              archive.finalize();

              // Clean up temporary files
              await fs.unlink(inputFile);
              await fs.unlink(outForward);
              await fs.unlink(outputFile);
            })
            .on("error", (error: Error) => {
              console.error("FFmpeg error:", error);
              res.status(500).json({ error: "FFmpeg processing failed" });
            })
            .run();
        })
        .on("error", (err: Error) => {
          console.log("Error: " + err.message);
        })
        .run();

      // Reverse the video using FFmpeg
    });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
