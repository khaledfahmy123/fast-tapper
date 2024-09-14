"use client";
import { Spin, Upload, Input, Button, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { createFFmpeg, fetchFile, FFmpeg } from "@ffmpeg/ffmpeg";
import { InboxOutlined } from "@ant-design/icons";
// import numerify from "numerify/lib/index.cjs";
import Progress from "../../components/Steps/Progress";
import { saveVideoForSession } from "../../utils/app/saveVid";
import React from "react";
import assert from "assert";
import { useRouter } from "next/router";

const { Dragger } = Upload;

const App = () => {
  const [spinning, setSpinning] = useState(false);
  const [tip, setTip] = useState<string>();
  const [file, setFile] = useState<File>();
  const [fileList, setFileList] = useState<File[]>([]);
  const [name, setName] = useState("input.mp4");
  const [step, setStep] = useState<number>(0);
  const ffmpeg = useRef<FFmpeg>();
  const currentFSls = useRef<string[]>([]);

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
        setStep((prev) => prev + 1);
      } else {
        message.success("Error uploading the file", 10);
      }
    } catch (err) {
      console.error(err);
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
        setTip(Math.round(ratio * 100).toFixed(1));
      });
      setTip("ffmpeg static resource loading...");
      setSpinning(true);
      await ffmpeg.current.load();
      setSpinning(false);
    })();
  }, []);

  useEffect(() => {
    if (fileList.length > 0) {
      setStep((prev) => prev + 1);
    }
  }, [fileList]);

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
      <p style={{ color: "gray" }}>
        Your files will not be uploaded to the server, only processed in the
        browser
      </p>

      <br />
      <br />
      <Button type="primary" disabled={step != 1} onClick={handleExec}>
        Compile The Video
      </Button>

      <Button
        type="primary"
        disabled={step < 2}
        onClick={() => {
          router.push("/about");
        }}
      >
        Go to game
      </Button>
    </div>
  );
};

export default App;
