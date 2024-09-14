// import "./game.css";
// import "./styles.css";
// import "./devStyle.css";
import { useEffect, useRef, useState } from "react";
import $ from "jquery";
import { forwardRef } from "react";
import { ThumbUpOffAlt, ThumbUpAlt, Star, Reviews } from "@mui/icons-material";
import { Button } from "@mui/material";

const GamePlay = forwardRef(function GamePlay(props, ref) {
  const prog = useRef();

  const { vidRef, revRef, vidPoint } = ref;

  const { vidSrcForward, direction } = props;

  const [score, setScore] = useState(0);
  const [footage, setFootage] = useState(false);
  const [win, setWin] = useState(false);

  const openSettings = () => {
    $("#level-options").css({ transform: "scale(1)" });
    vidRef.current.pause();
    revRef.current.pause();
    props.setTimerPlay(false);
  };
  const openPowerUp = () => {
    $("#purchase-booster").css({ display: "flex" });
  };
  const confirmQuit = () => {
    $("#quit-confirmation").css({ display: "flex" });
  };

  const progressHandler = () => {
    let val = (vidRef.current.currentTime / vidRef.current.duration) * 100;

    vidPoint.current = vidRef.current.currentTime;

    prog.current.style.width = val + "%";
    if (props.gameOver || win) {
      console.log("inside", vidRef.current.currentTime);
      vidRef.current.pause();
      revRef.current.pause();
    }
    if (val >= 80) {
      props.setFlags({ flag1: true, flag2: true, flag3: true });
    } else if (val >= 50) {
      props.setFlags({ flag1: true, flag2: true, flag3: false });
    } else if (val >= 20) {
      props.setFlags({ flag1: true, flag2: false, flag3: false });
    } else {
      props.setFlags({ flag1: false, flag2: false, flag3: false });
    }

    setScore(
      props.flags.flag1 * 50 + props.flags.flag2 * 50 + props.flags.flag3 * 50
    );

    if (vidRef.current.currentTime >= vidRef.current.duration) {
      setWin(true);
    }

    // if (val < 10) {
    //   ref.current.currentTime = 15;
    // }
    // if (val > 95) {
    //   vidRef.current.currentTime = 2;
    // }
  };
  const progressRevHandler = () => {
    let val = (1 - revRef.current.currentTime / revRef.current.duration) * 100;

    vidPoint.current = revRef.current.duration - revRef.current.currentTime;

    prog.current.style.width = val + "%";

    if (props.gameOver || win) {
      console.log("inside", vidRef.current.currentTime);
      vidRef.current.pause();
      revRef.current.pause();
    }
    if (val >= 80) {
      props.setFlags({ flag1: true, flag2: true, flag3: true });
    } else if (val >= 50) {
      props.setFlags({ flag1: true, flag2: true, flag3: false });
    } else if (val >= 20) {
      props.setFlags({ flag1: true, flag2: false, flag3: false });
    } else {
      props.setFlags({ flag1: false, flag2: false, flag3: false });
    }

    setScore(
      props.flags.flag1 * 50 + props.flags.flag2 * 50 + props.flags.flag3 * 50
    );

    // if (vidRef.current.currentTime <= 0.1) {
    //   revRef.current.pause()
    // }

    // if (val < 10) {
    //   ref.current.currentTime = 15;
    // }
    // if (val > 95) {
    //   revRef.current.currentTime = 25;
    // }
  };

  const loveHandler = () => {
    props.loveHandler();
  };

  const gameEnd = () => {
    if (props.gameOver) {
      window.location.reload();
    } else {
      setFootage(true);
    }
    console.log(footage);
  };

  useEffect(() => {
    if (props.gameOver || win) {
      vidRef.current.pause();
      revRef.current.pause();
      props.setTimerPlay(false);
      console.log("lol paused");
    }
  }, [win, props.gameOver]);

  return (
    <>
      <div className="game-area" id="gameArea">
        <div id="example-video">
          <video
            muted
            ref={revRef}
            style={{
              opacity: direction > 0 ? "0" : "1",
              display: direction > 0 ? "none" : "block",
            }}
            src={props.vidSrc}
            onTimeUpdate={progressRevHandler}
            type="video/mp4"
          ></video>
          <video
            muted
            ref={vidRef}
            onTimeUpdate={progressHandler}
            src={props.vidSrcForward}
            type="video/mp4"
            style={{
              opacity: direction < 0 ? "0" : "1",
              display: direction < 0 ? "none" : "block",
            }}
            autoPlay
          ></video>
        </div>
        {/* <div id="example-video" style={{opacity: direction > 0? "0" : "1"}}>
          
        </div> */}

        <div className="gradient-overlays" />
        <div className="top-elements-container">
          <div id="timer" className="number">
            {props.timer}
          </div>
          <button
            id="pause"
            className="game-info-element"
            onClick={openSettings}
          />
        </div>
        <div className="side-elements-container">
          <div
            id="love"
            className="game-info-element number"
            onClick={loveHandler}
          >
            {props.love ? (
              <ThumbUpAlt
                style={{
                  fontSize: "45px",
                  cursor: "pointer",
                  color: "#ff1790",
                }}
              />
            ) : (
              <ThumbUpOffAlt
                style={{ fontSize: "45px", cursor: "pointer", color: "white" }}
              />
            )}
          </div>
          {/* <div id="tap-rate" className="game-info-element number">
            6.7
          </div> */}
          <div id="points" className="game-info-element number">
            {score}
          </div>
          <div id="lives" className="game-info-element number">
            {props.lives}
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress" ref={prog} />
        </div>

        <div
          id="level-options"
          className="level-options-container"
          style={{ transform: "scale(0)" }}
        >
          <div className="level-options-header">
            <div id="handedness">
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider round" />
              </label>
            </div>
            <button
              className="close-level-options"
              onClick={(e) => {
                e.target.parentElement.parentElement.style.transform =
                  "scale(0)";
                vidRef.current.play();
                revRef.current.pause();
                props.setTimerPlay(true);
              }}
            >
              Resume
            </button>
          </div>
          <div className="level-actions">
            <div
              id="power-up"
              className="level-action floating-button"
              onClick={openPowerUp}
            >
              Buy Booster
            </div>
            <div
              id="quit-level"
              className="level-action floating-button"
              onClick={() => {
                confirmQuit();
              }}
            >
              Quit Level
            </div>
          </div>
          <div className="level-stats">
            <h1>🏅 Level stats 🏅</h1>
            <div id="player-tap-rate" className="level-stat">
              Fastest tap rate
            </div>
            <div id="points-collected" className="level-stat">
              Points accumulated
            </div>
            <div id="lives-remaining" className="level-stat">
              Lives remaining
            </div>
          </div>
        </div>
        <div
          id="quit-confirmation"
          className="popup"
          style={{ display: "none" }}
        >
          <div className="popup-contents">
            <button
              className="close-popup-button"
              onClick={(e) => {
                // console.log(e.target.parentElement);
                e.target.parentElement.parentElement.style.display = "none";
              }}
            />
            <div className="popup-header">
              <h1>Quit Level?</h1>
            </div>
            <div className="popup-content">
              <h2>Do you you wish to finish prematurely?</h2>
            </div>
            <div className="popup-footer">
              <button id="confirm-quit" className="floating-button">
                Yes I quit
              </button>
            </div>
          </div>
        </div>
        <div
          id="purchase-booster"
          className="popup"
          style={{ display: "none" }}
        >
          <div className="popup-contents">
            <button
              className="close-popup-button"
              onClick={(e) => {
                e.target.parentElement.parentElement.style.display = "none";
                // if (!window.__cfRLUnblockHandlers) return false;
              }}
            />
            <div className="popup-header">
              <h1>Boosters</h1>
            </div>
            <div className="popup-content">
              <ul className="popup-content-options">
                <li className="popup-content-option floating-button">
                  <button id="add-time" className="popup-item">
                    <div className="popup-price number">30</div>
                    <div className="popup-description">
                      Add extra 30 seconds
                    </div>
                  </button>
                </li>
                <li className="popup-content-option floating-button">
                  <button id="two-fingers" className="popup-item">
                    <div className="popup-price number">100</div>
                    <div className="popup-description">
                      Allow 2 finger tapping
                    </div>
                  </button>
                </li>
                <li className="popup-content-option floating-button">
                  <button id="two-fingers" className="popup-item">
                    <div className="popup-price number">300</div>
                    <div className="popup-description">
                      Allow 3 finger tapping
                    </div>
                  </button>
                </li>
                <li className="popup-content-option floating-button">
                  <button id="three-fingers" className="popup-item">
                    <div className="popup-price number">1k</div>
                    <div className="popup-description">Auto win level</div>
                  </button>
                </li>
              </ul>
            </div>
            <div className="popup-footer">
              <div className="available-points">
                <span className="number">1,730</span>available
              </div>
              <button className="floating-button">Get Points</button>
            </div>
          </div>
        </div>
        <div
          id="ready-confirmation"
          className="popup"
          style={{ display: "none" }}
        >
          <div className="popup-contents">
            <button
              className="close-popup-button"
              onClick={() => {
                this.parentElement.parentElement.style.transform = "scale(0)";
              }}
            />
            <div className="popup-header">
              <h1>Get ready</h1>
            </div>
            <div className="popup-content">
              <h2>Tap as fast as you can before time runs out.</h2>
            </div>
            <div className="popup-footer">
              <button id="confirm-quit" className="floating-button">
                Start game
              </button>
            </div>
          </div>
        </div>
        <div id="get-points" className="popup" style={{ display: "none" }}>
          <div className="popup-contents">
            <button className="popup-back-button" />
            <div className="popup-header">
              <h1>Get points</h1>
            </div>
            <div className="popup-content">
              <ul className="popup-content-options">
                <li className="popup-content-option floating-button">
                  <button id="watch-ads" className="popup-item">
                    <div className="popup-price">50</div>
                    <div className="popup-description">
                      Watch ads (+50 pts per ad)
                    </div>
                  </button>
                </li>
                <li className="popup-content-option floating-button">
                  <button id="buy-points" className="popup-item">
                    <div className="popup-price">100</div>
                    <div className="popup-description">Buy 100 pts for $1</div>
                  </button>
                </li>
                <li className="popup-content-option floating-button">
                  <button id="buy-points" className="popup-item">
                    <div className="popup-price">500</div>
                    <div className="popup-description">Buy 500 pts for $4</div>
                  </button>
                </li>
                <li className="popup-content-option floating-button">
                  <button id="buy-points" className="popup-item">
                    <div className="popup-price">1k</div>
                    <div className="popup-description">
                      Buy 1,000 pts for $7
                    </div>
                  </button>
                </li>
              </ul>
            </div>
            <div className="popup-footer">
              <div className="available-points">
                <span>1,730</span>available
              </div>
              <button className="floating-button">Cancel</button>
            </div>
          </div>
        </div>
        <div className="win-confirmation">
          You
          <br />
          Win!
        </div>
        {props.flag}
        <div
          className="level-options-container"
          style={{
            transform: props.gameOver || win ? "scale(1)" : "scale(0)",
            zIndex: footage ? 10 : 4,
          }}
        >
          <div
            className="win-confirmation"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div>
              {[
                ...Array(
                  props.flags.flag1 + props.flags.flag2 + props.flags.flag3
                ),
              ].map((e, i) => (
                <Star
                  key={i}
                  style={{
                    fontSize: "65px",
                    margin: "12px",
                    color: "#ffc932",
                  }}
                />
              ))}
            </div>
            <Button
              variant="contained"
              color={props.gameOver ? "error" : "success"}
              style={{
                fontSize: 20,
                marginTop: "20px",
              }}
              onClick={gameEnd}
            >
              {props.gameOver ? "Back To Main Menu" : "play forward footage"}
            </Button>
            <video
              src={props.vidSrcForward}
              style={{
                display: footage ? "block" : "none",
                height: "70%",
                margin: "12px",
              }}
              type="video/mp4"
              controls
            ></video>
          </div>
        </div>
      </div>

      {props.speedMeter}
    </>
  );
});

export default GamePlay;
