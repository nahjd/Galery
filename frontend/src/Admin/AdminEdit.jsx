import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPhotoById, updatePhoto } from "../store/Slices/photosSlice";

import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Button, TextField } from "@mui/material";

const drawerWidth = 240;
const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.leavingScreen }),
  ...(open && { marginLeft: drawerWidth, width: `calc(100% - ${drawerWidth}px)` }),
}));
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
  "& .MuiDrawer-paper": { position: "relative", whiteSpace: "nowrap", width: drawerWidth, boxSizing: "border-box" },
}));
const defaultTheme = createTheme();

export default function AdminEdit() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const { current, status } = useSelector((s) => s.photos);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => { dispatch(fetchPhotoById(id)); }, [dispatch, id]);

  useEffect(() => {
    if (current) {
      setTitle(current.title || "");
      setUrl(current.url || "");
    }
  }, [current]);

  const onSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updatePhoto({ id, data: { title, url } }));
    navigate("/admin/admin");
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar open={open} sx={{ backgroundColor: "white", boxShadow: 0 }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => setOpen(!open)} sx={{ mr: 3, ...(open && { display: "none" }) }}>
              <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="primary" noWrap sx={{ flexGrow: 1 }}>
              Edit Photo
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar><IconButton onClick={() => setOpen(!open)}><ChevronLeftIcon /></IconButton></Toolbar>
          <Divider />
        </Drawer>

        <Box component="main" sx={{ backgroundColor: "#EAF4F4", flexGrow: 1, minHeight: "100vh" }}>
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  {status === "loading" && "Yüklənir…"}
                  <form onSubmit={onSubmit}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField label="Title" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField label="Image URL" required fullWidth value={url} onChange={(e) => setUrl(e.target.value)} />
                      </Grid>
                      <Grid item xs={12}>
                        {url && <img src={url} alt="preview" style={{ width: 140, height: 100, objectFit: "cover", borderRadius: 8 }} />}
                      </Grid>
                      <Grid item xs={12}>
                        <Button type="submit" variant="contained">Update</Button>
                      </Grid>
                    </Grid>
                  </form>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
