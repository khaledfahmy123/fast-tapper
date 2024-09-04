import { useState, useEffect, useRef } from "react";
import GamePlay from "./GamePlay";
// import ReactSpeedometer from "react-d3-speedometer";
import { Tour } from "@mui/icons-material";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
// import { ref } from "firebase/storage";

var cls = 0;

const GameLogic = ({ start, time, vidSrc, vidSrcForward }) => {
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

  const vid = useRef();

  const func1 = () => {
    cls = 8;
    if (counter <= 0) {
      setTrig(true);
    }
  };

  const func2 = () => {
    vid.current.currentTime = vid.current.currentTime - 1;
  };

  useEffect(() => {
    var timer;

    if (counter > 0 || trig) {
      timer = setInterval(() => {
        setCounter(counter < 100 ? counter - 1 + cls : 100 - 1);
      }, 100);
    }

    if (counter > 40) {
      setAllow(true);
    }

    return () => {
      clearInterval(timer);
      setTrig(false);
      setAllow(false);
      cls = 0;
    };
  }, [counter, trig]);

  useEffect(() => {
    document.body.addEventListener("click", func1);
    return () => document.body.removeEventListener("click", func1, true);
  });

  useEffect(() => {
    if (allow) {
      document.body.addEventListener("click", func2, true);
    } else {
      document.body.removeEventListener("click", func2, true);
    }
    return () => document.body.removeEventListener("click", func2, true);
  }, [allow]);

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
