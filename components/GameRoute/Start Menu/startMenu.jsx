import { useRef, useEffect, useState } from "react";
import styles from "./startMenu.module.css";
import $ from "jquery";
import StartMenuLayout from "./StartMenuLayout";
// import {
//   ref as vidRef,
//   getDownloadURL,
//   getStorage,
//   listAll,
// } from "firebase/storage";
import { openDB } from "idb";

const StartMenu = ({
  passInput,
  setVidHandler,
  setRevHandler,
  setStart,
  time,
  setRequiredTapRate,
}) => {
  const alert = useRef();

  const [vids, setVids] = useState([]);

  // const storage = getStorage();

  // const videoStorage = vidRef(storage, `videos/`);

  const startGame = (time, rtr) => {
    $(alert.current).animate({ opacity: 0 }, 300, () => {
      $(alert.current).css({ display: "none" });
      passInput(time, rtr);
      setStart(true);
    });
  };

  useEffect(() => {
    // listAll(videoStorage).then((response) => {
    //   var updatedValue = {};
    //   response.items.forEach((item) => {
    //     getDownloadURL(item).then((url) => {
    //       let prop = item["_location"].path.split("/")[1].split(".")[0];
    //       let txt = String(item["_location"].path.split("/")[1]);

    //       if (!updatedValue.hasOwnProperty(prop)) {
    //         updatedValue[prop] = { vid: "", rev: "" };
    //       }

    //       if (!txt.includes("rev")) {
    //         updatedValue[prop].vid = url;
    //         setVids((prev) => ({ ...prev, ...updatedValue }));
    //       } else {
    //         updatedValue[prop].rev = url;
    //         setVids((prev) => ({ ...prev, ...updatedValue }));
    //       }
    //     });
    //   });
    // });
    const initDB = async () => {
      const db = await openDB("my-db", 1, {
        upgrade(db) {
          db.createObjectStore("videos", {
            autoIncrement: true,
          });
        },
      });
      return db;
    };

    const loadVideoFromIndexedDB = async () => {
      const db = await initDB();
      let data = { vid: "", rev: "" };
      const videoBlob = await db.get("videos", "vid");
      if (videoBlob) {
        const videoUrl = URL.createObjectURL(videoBlob);
        data.vid = videoUrl;
        // console.log("url: ", videoUrl);
      }

      const videoRevBlob = await db.get("videos", "rev");
      if (videoBlob) {
        const videoUrl = URL.createObjectURL(videoRevBlob);
        data.rev = videoUrl;
      }
      setVids([data]);
    };

    loadVideoFromIndexedDB();
  }, []);

  return (
    <>
      <div className={`${styles.cont}`} ref={alert}>
        <StartMenuLayout
          startGame={startGame}
          videos={vids}
          setVidHandler={setVidHandler}
          setRevHandler={setRevHandler}
          timeVal={time}
          setRequiredTapRate={setRequiredTapRate}
        />
      </div>
    </>
  );
};

export default StartMenu;
