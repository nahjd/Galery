import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createPhoto } from "../store/Slices/photosSlice";
import { uploadPhotoFile } from "../store/Slices/photosSlice"; // 🔹 əlavə olundu
import { useNavigate } from "react-router-dom";

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

export default function AddPhoto() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");          // URL ilə əlavə üçün
  const [file, setFile] = useState(null);      // PC-dən seçilən fayl
  const [preview, setPreview] = useState("");  // önizləmə

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    if (f && f.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(f));
      // istəsən burada auto-upload edə bilərsən (comment aşağıda)
    } else {
      setPreview("");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      let finalUrl = url.trim();

      // Əgər fayl seçilibsə -> əvvəlcə yüklə, sonra createPhoto
      if (file) {
        finalUrl = await dispatch(uploadPhotoFile(file)).unwrap();
      }

      if (!finalUrl) return; // nə fayl var, nə də URL yazılıbsa

      await dispatch(createPhoto({ title, url: finalUrl })).unwrap();

      // təmizlə
      setTitle("");
      setUrl("");
      setFile(null);
      setPreview("");

      navigate("/admin/admin");
    } catch (err) {
      console.error("Create error:", err);
    }
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
              Add Photo
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
                  <form onSubmit={onSubmit}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField label="Title" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} />
                      </Grid>

                      {/* URL ilə əlavə */}
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Image URL"
                          fullWidth
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          placeholder="https://..."
                        />
                      </Grid>

                      {/* Fayldan əlavə */}
                      <Grid item xs={12} md={6}>
                        <Button component="label" variant="outlined">
                          Choose File
                          <input type="file" accept="image/*" hidden onChange={onFileChange} />
                        </Button>
                        {file && <span style={{ marginLeft: 10 }}>{file.name}</span>}
                      </Grid>

                      <Grid item xs={12}>
                        {(preview || url) && (
                          <img
                            src={preview || url}
                            alt="preview"
                            style={{ width: 180, height: 120, objectFit: "cover", borderRadius: 8 }}
                          />
                        )}
                      </Grid>

                      <Grid item xs={12}>
                        <Button type="submit" variant="contained">Create</Button>
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
