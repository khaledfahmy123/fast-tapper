// import "antd/dist/antd.min.css";
import "./app/index.css";
import "/components/GameRoute/GamePlay/styles.css";
import "/components/GameRoute/GamePlay/devStyle.css";
import "/components/GameRoute/GamePlay/game.css";
import Script from "next/script";
import { useEffect } from "react";
import { openDB } from "idb";
import React from "react";
function MyApp({ Component, pageProps }) {
  useEffect(() => {
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
    initDB();
  }, []);
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
