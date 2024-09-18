"use client";
import {
  Spin,
  Upload,
  Input,
  Button,
  message,
  Flex,
  Radio,
  Typography,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { createFFmpeg, fetchFile, FFmpeg } from "@ffmpeg/ffmpeg";
import { InboxOutlined } from "@ant-design/icons";
// import numerify from "numerify/lib/index.cjs";
import Progress from "../../components/Steps/Progress";
import { saveVideoForSession } from "../../utils/app/saveVid";
import React from "react";
import assert from "assert";
import { useRouter } from "next/router";
import JSZip from "jszip";
import { Group } from "antd/es/avatar";
import { error } from "console";
const { Dragger } = Upload;

const App = () => {
  const [spinning, setSpinning] = useState(false);
  const [tip, setTip] = useState<string>();
  const [file, setFile] = useState<File>();
  const [fileList, setFileList] = useState<File[]>([]);
  const [name, setName] = useState("input.mp4");
  const [step, setStep] = useState<number>(0);
  const [processor, setProcessor] = useState<string>("client");
  const ffmpeg = useRef<FFmpeg>();
  const currentFSls = useRef<string[]>([]);
  const [videoUrl, setVideoUrl] = useState("");

  const router = useRouter();

  const handleExec = async () => {
    assert(ffmpeg.current != undefined, "FFmpeg Hasn't Loaded");
    if (!file) {
      return;
    }
    try {
      setTip("Loading file into browser");
      setSpinning(true);
      for (const fileItem of fileList) {
        ffmpeg.current.FS(
          "writeFile",
          fileItem.name,
          await fetchFile(fileItem)
        );
      }
      currentFSls.current = ffmpeg.current.FS("readdir", ".");
      setTip("start executing the command");
      await ffmpeg.current.run(
        "-i",
        name,
        "-c:v",
        "libx264",
        "-crf",
        "28",
        // "-vf",
        // "scale=1280:720",
        "-preset",
        "ultrafast",
        "forward.mp4"
      );

      await ffmpeg.current.run(
        "-i",
        "forward.mp4",
        "-c:v",
        "libx264",
        "-crf",
        "28",
        "-preset",
        "ultrafast",
        "-vf",
        `reverse`,
        "-af",
        "areverse",
        "rev.mp4"
      );
      console.log("Video processing completed successfully.");

      setSpinning(false);
      const FSls = ffmpeg.current.FS("readdir", ".");
      const outputFiles = FSls.filter((i) => !currentFSls.current.includes(i));
      console.log("output dir: ", outputFiles);
      if (outputFiles.length > 1) {
        for (const file of outputFiles) {
          const data = ffmpeg.current.FS("readFile", file);
          // const type = await fileTypeFromBuffer(data.buffer);

          saveVideoForSession(new Blob([data.buffer]), file === "forward.mp4");
        }

        message.success("Run successfully, You're ready to start the game", 10);
        setStep(2);
      } else {
        message.success("Error uploading the file", 10);
      }
    } catch (err) {
      console.error(err);
      setSpinning(false);
      message.error("Failed to run, Please try again with smaller video", 10);
    }
  };

  const handleApi = async () => {
    assert(file != undefined, "File Not Uploaded Correctly");
    const formData = new FormData();
    formData.append("file", file);
    setTip("Wait a second...");
    setSpinning(true);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/video`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      const blob = await response.blob();
      const zip = new JSZip();
      const unzipped = await zip.loadAsync(blob);

      const forwardVid = await unzipped.file("forward.mp4")?.async("blob");

      const reverseVid = await unzipped.file("reverse.mp4")?.async("blob");

      saveVideoForSession(forwardVid, true);
      saveVideoForSession(reverseVid, false);
      setSpinning(false);
      message.success("Run successfully, You're ready to start the game", 10);
      setStep(2);
    } else {
      setSpinning(false);
      message.error("Failed to run, Please try again with smaller video", 10);
    }
  };

  useEffect(() => {
    (async () => {
      ffmpeg.current = createFFmpeg({
        log: true,
        corePath:
          "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js",
      });
      ffmpeg.current.setProgress(({ ratio }) => {
        console.log(ratio);
        setTip(Math.round(ratio * 100) + "%");
      });

      ffmpeg.current.setLogger(({ type, message: msg }) => {
        if (msg.includes("error")) {
          setSpinning(false);
          message.error(
            "Failed to run, Please try again with smaller video",
            10
          );
        }
      });
      setTip("ffmpeg static resource loading...");
      setSpinning(true);
      await ffmpeg.current.load();
      setSpinning(false);
    })();
  }, []);

  useEffect(() => {
    if (fileList.length > 0) {
      setStep(1);
    }
  }, [fileList]);

  // const handleSegementation = async () => {
  //   assert(ffmpeg.current != undefined, "FFmpeg Hasn't Loaded");
  //   // let ffmpeg =
  //   ffmpeg.current.FS("writeFile", "input.mp4", await fetchFile(fileList[0]));

  //   // Step 1: Split the video into 10-second chunks
  //   await ffmpeg.current.run(
  //     "-i",
  //     "input.mp4",
  //     "-c",
  //     "copy",
  //     "-f",
  //     // "-vf",
  //     // "scale=1280:720",
  //     "segment",
  //     "-segment_time",
  //     "10",
  //     "-reset_timestamps",
  //     "1",
  //     "-map",
  //     "0",
  //     "chunk%d.mp4"
  //   );

  //   // Get the chunk files
  //   const chunkFiles = ffmpeg.current
  //     .FS("readdir", ".")
  //     .filter((file) => file.startsWith("chunk") && file.endsWith(".mp4"));

  //   // Step 2: Reverse each chunk
  //   for (let i = 0; i < chunkFiles.length; i++) {
  //     const chunkName = chunkFiles[i];
  //     const reversedName = `rev_${chunkName}`;
  //     await ffmpeg.current.run("-i", chunkName, "-vf", "reverse", reversedName);
  //   }

  //   // Step 3: Concatenate reversed chunks
  //   const concatList = "concat_list.txt";
  //   const fileListContent = chunkFiles
  //     .map((file) => `file 'rev_${file}'`)
  //     .join("\n");
  //   ffmpeg.current.FS("writeFile", concatList, fileListContent);

  //   await ffmpeg.current.run(
  //     "-f",
  //     "concat",
  //     "-safe",
  //     "0",
  //     "-i",
  //     concatList,
  //     "-c",
  //     "copy",
  //     "output.mp4"
  //   );

  //   // Step 4: Retrieve and prepare the final video for download
  //   const data = ffmpeg.current.FS("readFile", "output.mp4");
  //   const blob = new Blob([data.buffer], { type: "video/mp4" });
  //   const url = URL.createObjectURL(blob);
  //   setVideoUrl(url);
  // };

  return (
    <div className="page-app">
      {spinning && (
        <Spin spinning={spinning} tip={tip}>
          <div className="component-spin" />
        </Spin>
      )}
      <h2
        style={{
          marginBottom: "30px",
          textAlign: "center",
        }}
      >
        Teriffic Tapper
      </h2>
      <Progress step={step} />
      {/* <h4>1. Select file</h4> */}
      <Dragger
        beforeUpload={(file, fileList) => {
          setFile(file);
          setFileList(() => [...fileList]);
          setName(file.name);
          return false;
        }}
        maxCount={1}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file</p>
      </Dragger>

      <Group
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
          border: "2px dashed #00000044",
          padding: "50px 15px",
          borderRadius: "12px",
          gap: "12px",
          marginTop: "15px",
        }}
      >
        <Typography.Text style={{ fontSize: "18px", textAlign: "center" }}>
          How would you like your video to be processed?
        </Typography.Text>
        <Flex vertical gap="middle" justify="center" align="center">
          <Radio.Group
            defaultValue="client"
            buttonStyle="solid"
            style={{ width: "100%" }}
            onChange={(e) => setProcessor(e.target.value)}
            value={processor}
          >
            <Radio.Button
              value="server"
              style={{ width: "50%", textAlign: "center" }}
            >
              Server Side
            </Radio.Button>
            <Radio.Button
              value="client"
              style={{ width: "50%", textAlign: "center" }}
            >
              Client Side
            </Radio.Button>
          </Radio.Group>
        </Flex>

        <p style={{ color: "gray", textAlign: "center" }}>
          Your files will not be saved in the server, It is processed on the fly
          and discarded afterwards.
        </p>
      </Group>
      <br />
      <br />
      <Button
        type="primary"
        disabled={step != 1}
        onClick={processor === "server" ? handleApi : handleExec}
      >
        Compile The Video
      </Button>
      <Button
        type="primary"
        disabled={step < 2}
        onClick={() => {
          router.push("/game");
        }}
      >
        Go to game
      </Button>
      {/* <Button
        type="primary"
        onClick={() => {
          handleSegementation();
        }}
      >
        Do it lol
      </Button> */}
      {/* <video src={videoUrl} controls></video> */}
    </div>
  );
};

export default App;
