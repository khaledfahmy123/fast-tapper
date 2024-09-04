import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import StartIcon from "@mui/icons-material/Start";
import { FileOpen } from "@mui/icons-material";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { Button, Divider, Select, MenuItem } from "@mui/material";
import { FormControl, FormLabel } from "@mui/material";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import { useRef } from "react";
import FullScreenDialog from "../Dialog/Dialog";
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';

export default function StartMenuLayout({
  startGame,
  videos,
  setVidHandler,
  setRevHandler,
  timeVal,
}) {
  const time = useRef();
  const rtr = useRef();

  const startHandler = (e) => {
    e.preventDefault();
    startGame(time.current.value, rtr.current.value);
  };

  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <form onSubmit={startHandler}>
      {/* <SelectAlgorithm /> */}
      <FormControl
        color="secondary"
        sx={{
          "& > :not(style)": {
            m: 2,
            width: "100%",
            fontSize: "clamp(1rem, 1.2rem, 3rem)",
          },
          width: "fit-content",
        }}
        style={{
          alignItems: "center",
          alignSelf: "center",
          padding: "20px",
          borderRadius: "7px",
          border: "1px solid #eee",
          boxShadow: "2px 2px 20px #999",
          boxSizing: "border-box",
          backgroundColor: "#fff",
        }}
        variant="outlined"
      >
        <FormLabel style={{ fontSize: "clamp(1rem, 1.7rem, 3rem)" }}>
          Set Game Difficulty
        </FormLabel>
        <Box sx={{ display: "flex", alignItems: "flex-end" }}>
          <AccessTimeIcon sx={{ mr: 1, my: 0.5 }} color="primary" />
          <TextField
            id=""
            label="Time Limit"
            variant="standard"
            sx={{ width: "100%" }}
            type="number"
            inputRef={time}
            required
            value={timeVal}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <OfflineBoltIcon sx={{ mr: 1, my: 0.5 }} color="primary" variant={"outlined"} />
          <Select
            color="primary"
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            // value={age}
            defaultValue="Algorithm"
            onChange={handleChange}
            // variant="outlined"
            style={{
              width: "100%",
              color: "black",
              height: "40px",
              textAlign: "left"
            }}
          >
            <MenuItem value={0}>Algorithm 1</MenuItem>
            <MenuItem value={1}>Algorithm 2</MenuItem>
            <MenuItem value={2}>Algorithm 3</MenuItem>
          </Select>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <TouchAppIcon sx={{ mr: 1, my: 0.5 }} color="primary" />
          <TextField
            id="input-with-sx"
            label="Minimum Rate Required"
            variant="standard"
            sx={{ width: "100%" }}
            type="number"
            inputRef={rtr}
            required
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          <FullScreenDialog
            variant="outlined"
            videos={videos}
            setVidHandler={setVidHandler}
            setRevHandler={setRevHandler}
          />
        </Box>
        <Divider />
        <Button
          type="submit"
          variant="contained"
          endIcon={<SportsEsportsIcon />}
        >
          Start Game
        </Button>
      </FormControl>
    </form>
  );
}
