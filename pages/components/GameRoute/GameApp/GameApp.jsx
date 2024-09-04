import { useState, useRef } from "react";
import styles from "./App.module.css";
import Game from "../Game2/game";
import StartMenu from "../Start Menu/startMenu";
import GameLogic from "../GamePlay/GameLogic";
// import "./global.css";

function GameApp() {
  const [videoSrc, setVideoSrc] = useState();
  const [videoRevSrc, setVideoRevSrc] = useState();
  const [RTP, setRTP] = useState(2);
  const [time, setTime] = useState(0);
  const [start, setStart] = useState(false);

  const getVideoDuration = (videoUrl) => {
    return new Promise((resolve, reject) => {
      // Create a video element
      const videoElement = document.createElement("video");

      // Create a Blob URL from the video blob

      // Set the video element's source to the Blob URL
      videoElement.src = videoUrl;

      // Listen for the 'loadedmetadata' event to get the duration
      videoElement.addEventListener("loadedmetadata", () => {
        // Duration is available now
        const duration = videoElement.duration;

        // Clean up the Blob URL
        URL.revokeObjectURL(videoUrl);

        // Resolve the promise with the duration
        resolve(duration);
      });

      // Handle errors
      videoElement.addEventListener("error", (error) => {
        reject(`Error loading video metadata: ${error}`);
      });
    });
  };

  const videoRevHandler = (vid) => {
    setVideoRevSrc(vid);
  };

  const videoHandler = (vid) => {
    setVideoSrc(vid);

    getVideoDuration(vid)
      .then((duration) => {
        console.log(`The video duration is ${duration} seconds`);
        setTime(duration);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const inputHandler = (time, rtp) => {
    setRTP(rtp);
    setTime(time);
  };

  return (
    <div className={styles.GameApp}>
      <StartMenu
        passInput={inputHandler}
        setRevHandler={videoRevHandler}
        setVidHandler={videoHandler}
        setStart={setStart}
        time={time}
      />
      {/* <Game
        // videoSrc={require("../../vid.mp4")}
        // videoRevSrc={require("../../rev.mp4")}
        // RTP={3}
        // timeLimit={50}
        videoSrc={videoSrc}
        videoRevSrc={videoRevSrc}
        RTP={RTP}
        timeLimit={time}
      ></Game> */}
      <GameLogic
        vidSrc={videoRevSrc}
        time={time}
        start={start}
        vidSrcForward={videoSrc}
      />
    </div>
  );
}

export default GameApp;
