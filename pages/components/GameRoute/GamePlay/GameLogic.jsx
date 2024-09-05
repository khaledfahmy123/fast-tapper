import { useState, useEffect, useRef } from "react";
import GamePlay from "./GamePlay";
// import ReactSpeedometer from "react-d3-speedometer";
import { Tour } from "@mui/icons-material";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
// import { ref } from "firebase/storage";

var cls = 0;

const GameLogic = ({ start, time, vidSrc, vidSrcForward }) => {
  // State variables
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [tapRate, setTapRate] = useState(0);
  const [recentTaps, setRecentTaps] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackDirection, setPlaybackDirection] = useState(0);

  const vid = useRef();
  const videoRef = vid;
  const tapRateRef = useRef(tapRate);
  const lastUpdateTimeRef = useRef(0);

  const requiredTapRate = 5; // taps per second
  const maxRecentTaps = 5;
  const decayRate = 0.9;

  useEffect(() => {
    const handleClick = () => {
      const currentTime = new Date().getTime();
      if (lastTapTime !== 0) {
        const timeDiff = currentTime - lastTapTime;
        const instantRate = 1000 / timeDiff;
        setRecentTaps((prevTaps) => {
          const newTaps = [...prevTaps, instantRate];
          if (newTaps.length > maxRecentTaps) {
            newTaps.shift();
          }
          return newTaps;
        });
      }
      setLastTapTime(currentTime);
      setTapCount((prevCount) => prevCount + 1);

      updateTapRate();
      controlVideoPlayback();
    };

    document.body.addEventListener("click", handleClick);

    return () => {
      document.body.removeEventListener("click", handleClick);
    };
  }, [lastTapTime, maxRecentTaps]);

  const updateTapRate = () => {
    const currentTime = new Date().getTime();
    
    
    const timeSinceLastUpdate =
      (currentTime - lastUpdateTimeRef.current) / 1000;
    lastUpdateTimeRef.current = currentTime;
    
    
    recentTaps[recentTaps.length - 1] =
      recentTaps[recentTaps.length - 1] *
      Math.pow(decayRate, timeSinceLastUpdate);
    
    
      // Method 1: Immediate Response with Decay
    let newTapRate =
      tapRateRef.current * Math.pow(decayRate, timeSinceLastUpdate);
    if (recentTaps.length > 0) {
      newTapRate = Math.max(newTapRate, recentTaps[recentTaps.length - 1]);
    }

    // Update state
    setTapRate(newTapRate);
    tapRateRef.current = newTapRate;

    // document.getElementById("tap-rate").textContent = `Tap Rate: ${newTapRate.toFixed(2)} taps/second`;
    console.log("Tap rate: ", newTapRate);
  };

  const controlVideoPlayback = () => {
    if (!videoRef.current) return;

    if (tapRate >= requiredTapRate) {
      setPlaybackDirection(1);
      if (!isPlaying) {
        videoRef.current.play();
        setIsPlaying(true);
      }
      videoRef.current.playbackRate = Math.min(2, tapRate / requiredTapRate);
    } else if (tapRate > 0) {
      setPlaybackDirection(1);
      if (!isPlaying) {
        videoRef.current.play();
        setIsPlaying(true);
      }
      videoRef.current.playbackRate = 0.5;
    } else {
      setPlaybackDirection(-1);
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
      videoRef.current.currentTime -= 0.1; // Move backward
    }

    updatePlaybackDirection();
  };

  const updatePlaybackDirection = () => {
    const directionText =
      playbackDirection === 1
        ? "Forward"
        : playbackDirection === -1
        ? "Backward"
        : "Paused";
    // document.getElementById("playback-direction").textContent = `Playback: ${directionText}`;
    console.log("Direction: ", directionText);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      updateTapRate();
      controlVideoPlayback();
    }, 100);

    return () => clearInterval(interval);
  }, [tapRate, isPlaying]);

  const [counter, setCounter] = useState(20.0);
  const [trig, setTrig] = useState(false);
  const [allow, setAllow] = useState(false);
  const [love, setLove] = useState(false);
  const [flags, setFlags] = useState({
    flag1: true,
    flag2: false,
    flag3: false,
  });
  const [timer, setTimer] = useState(0);
  const [timerPlay, setTimerPlay] = useState(false);
  const [lives, setLives] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  let flagsPosition = ["20", "50", "80"];

  const func1 = () => {
    vid.current.currentTime = 3;
  };

  // useEffect(() => {
  //   document.body.addEventListener("click", func1);
  //   return () => document.body.removeEventListener("click", func1, true);
  // });

  // useEffect(() => {
  //   vid.current.currentTime = 3;
  // }, []);

  const loveHandler = () => {
    setLove((prev) => !prev);
  };

  const timeOutHandler = () => {
    if (lives) {
      setLives((prev) => prev - 1);
      setTimer((prev) => {
        console.log(prev);
        return parseInt(prev) + 10;
      });
    } else {
      // setGameOver(true);
    }
  };

  useEffect(() => {
    if (start) {
      setTimer(time);
      setTimerPlay(true);
      console.log(vidSrc);
      vid.current.currentTime = vid.current.duration || 5;
      vid.current.play();
      console.log(time);
    }
  }, [start, time, vidSrc]);

  useEffect(() => {
    document.body.style.background = "#000";
  }, []);

  return (
    <>
      <GamePlay
        ref={vid}
        love={love}
        loveHandler={loveHandler}
        setFlags={setFlags}
        setTimerPlay={setTimerPlay}
        flags={flags}
        lives={lives}
        gameOver={gameOver}
        vidSrc={vidSrc}
        vidSrcForward={vidSrcForward}
        speedMeter={
          <div
            style={{
              position: "absolute",
              zIndex: 2,
              height: "175px",
              bottom: "20px",
              left: "calc(50% - 125px)",
              opacity: "0.4",
              overflow: "hidden",
            }}
          >
            {/* <ReactSpeedometer
              startColor="tomato"
              endColor="green"
              needleColor={"#5959ac"}
              minValue={0}
              maxValue={100 / 100}
              value={counter / 100}
              customSegmentStops={[0, 0.4, 0.75, 1]}
              segmentColors={["tomato", "orange", "green"]}
              textColor={"#fff"}
              needleTransitionDuration={100}
              width={250}
              ringWidth={15}
            /> */}
          </div>
        }
        flag={[
          flagsPosition.map((e, i) => {
            return (
              <Tour
                key={i}
                style={{
                  position: "absolute",
                  zIndex: 2,
                  fontSize: "40px",
                  color: flags["flag" + (i + 1)] ? "#ffc932" : "#55555599",
                  bottom: flags["flag" + (i + 1)] ? "-5px" : "-12px",
                  left: e + "%",
                }}
              />
            );
          }),
        ]}
        timer={
          <CountdownCircleTimer
            isPlaying={timerPlay ? true : false}
            duration={timer}
            colors={["#00ab41", "#9a382d"]}
            colorsTime={[15, 0]}
            class={"base-timer"}
            size={100}
            strokeWidth={7}
            trailStrokeWidth={9}
            onComplete={timeOutHandler}
          >
            {({ remainingTime }) => remainingTime}
          </CountdownCircleTimer>
        }
      />
    </>
  );
};

export default GameLogic;
