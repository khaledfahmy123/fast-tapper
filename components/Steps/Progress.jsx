import React from "react";
import { Steps } from "antd";
const description = "";
const Progress = ({ step }) => (
  <Steps
    progressDot
    direction="horizontal"
    current={step}
    style={{
      paddingLeft: "12px"
    }}
    items={[
      {
        title: "Upload",
        description,
      },
      {
        title: "Compile Video",
        description,
      },
      {
        title: "Game Is Ready",
        description,
      },
    ]}
  />
);
export default Progress;
