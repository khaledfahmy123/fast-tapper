import { useState, useRef, useEffect } from "react";
// import "../../vid.mp4";
// import styles from "../../../App.module.css";
import styles from "../GameApp/App.module.css"
import MainStyles from "./game.module.css";
import $ from "jquery";

const Game = ({ videoSrc, videoRevSrc, RTP, timeLimit }) => {
  // time duration needed as vairable

  const vid = useRef();
  const rev = useRef();
  const btn = useRef();
  const prog = useRef();
  const secP = useRef();
  const blank = useRef();

  const [intervId, setIntervId] = useState();
  const [PTR, setPTR] = useState(0);
  const [switchVid, setSwitchVid] = useState(0);
  const [time, setTime] = useState();
  const [playbackState, setPlayback] = useState("0 (at start)");
  const [speedState, setSpeed] = useState();

  var score;
  var startTime;
  var total;
  var reset;
  var timeStart, timeLapse;

  useEffect(() => {
    vid.current.currentTime = 0;
    rev.current.currentTime = vid.current.duration || 0;
    rev.current.pause();
    vid.current.pause();
  }, [videoSrc]);

  useEffect(() => {
    if (time <= 0) {
      lost();
    }
  }, [time]);

  const start = () => {
    $(btn.current).animate({ opacity: 0 }, 500, () => {
      $(btn.current).css({ display: "none" });
    });

    blank.current.style.display = "none";
    prog.current.classList.remove(styles.red);
    rev.current.pause();
    rev.current.currentTime = rev.current.duration / 2;
    vid.current.currentTime = 0;

    document.addEventListener("click", function (e) {
      score++;
      rev.current.currentTime -= 1;
      rev.current.play();
    });
  };

  const reachedStart = () => {
    vid.current.pause();
    rev.current.pause();
    setPlayback("0 (at start)");
    console.log("lol from start");
  };

  const endHandler = (msg = "you won") => {
    if (time > 0) {
      console.log(msg);
      clearInterval(intervId);
      blank.current.style.display = "block";
      vid.current.pause();
      rev.current.pause();
      $(btn.current).css({ display: "block", background: "rgb(86 132 173)" });
      $(btn.current).animate({ opacity: 1 }, 200);
      $(btn.current).html("You Won! Again?");
    }
  };

  const lost = () => {
    clearInterval(intervId);
    blank.current.style.display = "block";
    vid.current.pause();
    rev.current.pause();
    $(btn.current).css({ display: "block", background: "rgb(163 64 64)" });
    $(btn.current).animate({ opacity: 1 }, 200);
    $(btn.current).html("You Lost! Again?");
  };

  const onChange = () => {
    prog.current.value =
      (vid.current.currentTime / vid.current.duration) * 100 || 0;
  };

  const onChangeRev = () => {
    prog.current.value =
      ((vid.current.duration - rev.current.currentTime) /
        vid.current.duration) *
        100 || 0;
  };

  return (
    <>
      <div className={`${styles.cont} ${MainStyles.cont}`}>
        <div className={MainStyles.gameCont}>
          <video
            ref={vid}
            className="vid"
            src={videoSrc}
            onEnded={endHandler}
            onTimeUpdate={onChange}
          ></video>

          <video
            ref={rev}
            className="vid"
            src={videoRevSrc}
            onEnded={reachedStart}
            // muted="true"
            onTimeUpdate={onChangeRev}
            type="video/mp4"
          ></video>

          <div className={styles.overlay}>
            <div ref={blank} className={styles.blank}></div>
          </div>
        </div>

        <progress ref={prog} id="prog" value="0" max="100"></progress>
      </div>

      <div className={styles.control}>
        <button
          id="play"
          ref={btn}
          onClick={start}
          className={MainStyles.startBtn}
        >
          Click Play
        </button>

        <div className={MainStyles.scoreboard}>
          <p ref={secP}>Time : {time}</p>
          <p>PTR : {PTR}</p>
          <p>RTR : {RTP}</p>
          <p>Playback : {playbackState}</p>
        </div>
      </div>
    </>
  );
};

export default Game;
