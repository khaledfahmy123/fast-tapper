import { useState, useEffect, useRef } from "react";
import GamePlay from "./GamePlay";
// import ReactSpeedometer from "react-d3-speedometer";
import { Tour } from "@mui/icons-material";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
// import { ref } from "firebase/storage";

var cls = 0;

const GameLogic = ({
  start,
  time,
  vidSrc,
  vidSrcForward,
  requiredTapRate,
  maxFingers,
}) => {
  // State variables
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [tapRate, setTapRate] = useState(0);
  const [recentTaps, setRecentTaps] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackDirection, setPlaybackDirection] = useState(0);

  const vid = useRef();
  const vidRev = useRef();
  const vidPoint = useRef(0);
  const videoRef = vid;
  const tapRateRef = useRef(tapRate);
  const lastUpdateTimeRef = useRef(0);

  // const requiredTapRate = 5; // taps per second
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

  useEffect(() => {
    const handleTouch = (event) => {
      const activeTouches = event.touches.length;
      console.log("lol: ", maxFingers)
      if (activeTouches > maxFingers) {
        alert(`You're only allowed to use ${maxFingers} fingers`);
      }
    };

    document.body.addEventListener("touchstart", handleTouch);

    return () => {
      document.body.removeEventListener("touchstart", handleTouch);
    };
  }, [maxFingers]);

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
    // console.log("Tap rate: ", newTapRate);
    // let vidLength = vid.current.duration || 0;
    // if (playbackDirection > 0) {
    //   vidRev.current.currentTime = vidLength - vid.current.currentTime || 0;
    // } else {
    //   vid.current.currentTime = vidLength - vidRev.current.currentTime || 0;
    // }
  };

  const controlVideoPlayback = () => {
    if (!videoRef.current) return;

    if (tapRate >= requiredTapRate * 1.2) {
      setPlaybackDirection(1);
      if (!isPlaying) {
        vid.current.currentTime = vidPoint.current || 0;
        vid.current.play();
        vidRev.current.pause();
        setIsPlaying(true);
      }
      vid.current.playbackRate = Math.min(2, tapRate / requiredTapRate);
    } else if (tapRate >= requiredTapRate) {
      setPlaybackDirection(1);
      if (!isPlaying) {
        vid.current.currentTime = vidPoint.current || 0;
        vid.current.play();
        vidRev.current.pause();
        setIsPlaying(true);
      }

      vid.current.playbackRate = Math.min(2, tapRate / requiredTapRate);
    } else {
      setPlaybackDirection(-1);
      if (isPlaying) {
        vidRev.current.currentTime =
          vid.current.duration - vidPoint.current || 0;
        vid.current.pause();
        vidRev.current.play();
        setIsPlaying(false);
      }
      // videoRef.current.currentTime -= 0.1; // Move backward
      vidRev.current.playbackRate = 1;
    }
    // console.log(`Length: ${vidLength - vidRev.current.currentTime || 0}`);
    console.log("Video Rate: ", vid.current.playbackRate);
    console.log("Video Time: ", vid.current.currentTime);
    console.log("Reveo Rate: ", vidRev.current.playbackRate);
    console.log("Reveo Time: ", vidRev.current.currentTime);

    // updatePlaybackDirection();
  };

  var refGlobe = {
    vidRef: vid,
    revRef: vidRev,
    vidPoint: vidPoint,
  };

  // const updatePlaybackDirection = () => {
  //   const directionText =
  //     playbackDirection === 1
  //       ? "Forward"
  //       : playbackDirection === -1
  //       ? "Backward"
  //       : "Paused";
  //   // document.getElementById("playback-direction").textContent = `Playback: ${directionText}`;
  //   console.log("Direction: ", directionText);
  // };

  useEffect(() => {
    const interval = setInterval(() => {
      updateTapRate();
      controlVideoPlayback();
      console.log("Status Playing: ", !vid.current.paused);
    }, 100);

    return () => clearInterval(interval);
  }, [tapRate, isPlaying]);

  useEffect(() => {
    if (vidSrc && vidSrcForward) {
      vidRev.current.pause();
      vid.current.pause();
    }
  }, [vidSrc, vidSrcForward]);

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
      setGameOver(true);
    }
  };

  useEffect(() => {
    if (start) {
      setTimer(time);
      setTimerPlay(true);
      console.log(vidSrc);
      vid.current.currentTime = 0;
      vid.current.pause();
      vidRev.current.pause();
      console.log(time);
    }
  }, [start, vidSrc]);

  useEffect(() => {
    document.body.style.background = "#000";
  }, []);

  return (
    <>
      <GamePlay
        ref={refGlobe}
        // revRef={vidRev}
        love={love}
        loveHandler={loveHandler}
        setFlags={setFlags}
        setTimerPlay={setTimerPlay}
        flags={flags}
        lives={lives}
        gameOver={gameOver}
        vidSrc={vidSrc}
        vidSrcForward={vidSrcForward}
        direction={playbackDirection}
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
