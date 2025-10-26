import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import { Link } from "react-router-dom";
import {
  fetchPhotos,
  deletePhoto,
} from "../store/Slices/photosSlice";

import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import MenuIcon from "@mui/icons-material/Menu";
import ListItem from "@mui/material/ListItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import GroupIcon from "@mui/icons-material/Group";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  })
);

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    "& .MuiDrawer-paper": {
      position: "relative",
      whiteSpace: "nowrap",
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: "border-box",
      ...(!open && {
        overflowX: "hidden",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up("sm")]: { width: theme.spacing(9) },
      }),
    },
  })
);

const defaultTheme = createTheme();

export default function Dashboard() {
  const dispatch = useDispatch();
  const { items: photos, status, error } = useSelector((s) => s.photos);

  const [open, setOpen] = useState(true);

  useEffect(() => {
    dispatch(fetchPhotos());
  }, [dispatch]);

  const onDelete = (id) => {
    dispatch(deletePhoto(id));
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open} sx={{ backgroundColor: "white", boxShadow: 0 }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={() => setOpen(!open)}
              sx={{ marginRight: "36px", ...(open && { display: "none" }) }}>
              <MenuIcon sx={{ color: "#134074" }} />
            </IconButton>
            <Typography component="h1" variant="h6" color="black" noWrap sx={{ flexGrow: 1 }}>
              Admin Panel
            </Typography>
            <Link to="/admin/addphoto">
              <Button variant="contained">Add Photo</Button>
            </Link>
          </Toolbar>
        </AppBar>

        <Drawer variant="permanent" open={open}>
          <Toolbar sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", px: [1] }}>
            <IconButton onClick={() => setOpen(!open)}>
              <MenuIcon sx={{ color: "#134074" }} />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <ListItem>
              <Typography variant="subtitle1" sx={{ backgroundColor: "#134074", borderRadius: "7px", width: "100%", pl: "10px" }}>
                <Link style={{ textDecoration: "none", color: "white", display: "flex" }} to="/">
                  <GroupIcon style={{ marginRight: 10, color: "white" }} /> Photos
                </Link>
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="subtitle1" sx={{ backgroundColor: "#134074", borderRadius: "7px", width: "100%", pl: "10px" }}>
                <Link style={{ textDecoration: "none", color: "white", display: "flex" }} to="/admin/addphoto">
                  <PersonAddAlt1Icon style={{ marginRight: 10, color: "white" }} /> Add Photo
                </Link>
              </Typography>
            </ListItem>
          </List>
        </Drawer>

        <Box component="main" sx={{ backgroundColor: "#F3F4F8", flexGrow: 1, height: "100vh", overflow: "auto" }}>
          <Toolbar />
          <Container sx={{ mt: 4, mb: 4 }} maxWidth="lg">
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  {status === "loading" && <div>Yüklənir…</div>}
                  {status === "failed" && <div style={{ color: "red" }}>{error}</div>}
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Image</TableCell>
                          <TableCell>Title</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {photos.map((p) => (
                          <TableRow key={p._id}>
                            <TableCell>{p._id}</TableCell>
                            <TableCell>
                              {p.url ? (
                                <img src={p.url} alt={p.title} style={{ width: 90, height: 60, objectFit: "cover", borderRadius: 6 }} />
                              ) : "—"}
                            </TableCell>
                            <TableCell>{p.title || "—"}</TableCell>
                            <TableCell align="right">
                              <Link to={`/admin/edit/${p._id}`} style={{ color: "inherit" }}>
                                <IconButton><EditIcon /></IconButton>
                              </Link>
                              <IconButton onClick={() => onDelete(p._id)} sx={{ color: "red" }}>
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
