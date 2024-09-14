import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import SlowMotionVideoIcon from "@mui/icons-material/SlowMotionVideo";
import { Grid } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog({
  videos,
  setVidHandler,
  setRevHandler,
}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const selectHandler = (e) => {
    if (!e.target.id) {
      console.log(e.target.children[0].id);
      setVidHandler(videos[e.target.children[0].id].vid);
      setRevHandler(videos[e.target.children[0].id].rev);
    } else {
      console.log(e.target.id);
      setVidHandler(videos[e.target.id].vid);
      setRevHandler(videos[e.target.id].rev);
    }
    handleClose();
  };

  return (
    <div>
      <Button
        variant="outlined"
        startIcon={<SlowMotionVideoIcon />}
        onClick={handleClickOpen}
        sx={{ width: "100%", borderRadius: "50px" }}
      >
        Choose a video
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
              sx={{ aspectRatio: "1" }}
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Choose a video
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 4, md: 4 }}
          sx={{ padding: 2 }}
        >
          {Object.keys(videos).map((val, index) => {
            console.log(val);
            return (
              <Grid
                item
                xs={4}
                sm={2}
                md={1}
                key={index}
                sx={{
                  "& > *": {
                    maxHeight: "120px",
                  },
                  background: "#eee",
                  margin: 2,
                  boxSizing: "border-box",
                  textAlign: "center",
                }}
                onClick={selectHandler}
              >
                {/* <video src={videos[val]}></video> */}
                <video id={val} src={videos[val].vid}></video>
              </Grid>
            );
          })}
        </Grid>
      </Dialog>
    </div>
  );
}
