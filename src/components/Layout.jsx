import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
  CssBaseline,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import DashboardIcon from "@mui/icons-material/Dashboard";

// Styled components for the layout
const drawerWidth = 240;

const Main = styled("main")(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: open ? `${drawerWidth}px` : theme.spacing(7),
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: "#f5f5f5",
  minHeight: "calc(100vh - 64px)", // Adjust for header height
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
}));

const Header = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: "#1e293b",
}));

const DrawerStyled = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
    borderRight: "1px solid #e5e7eb",
  },
}));

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <Box sx={{ pt: 2 }}>
      <Typography
        variant="h6"
        sx={{ px: 2, py: 1, fontWeight: "bold", color: "#1e293b" }}
      >
        Menu
      </Typography>
      <List>
        {[
          { text: "Home", icon: <HomeIcon /> },
          { text: "Dashboard", icon: <DashboardIcon /> },
          { text: "About", icon: <InfoIcon /> },
          { text: "Contact", icon: <ContactMailIcon /> },
        ].map((item) => (
          <ListItem
            button
            key={item.text}
            sx={{
              "&:hover": {
                backgroundColor: "#f1f5f9",
                "& .MuiListItemIcon-root": {
                  color: "#3b82f6",
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: "#64748b" }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{ color: "#1e293b", fontWeight: "medium" }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Header position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            sx={{ flexGrow: 1, fontWeight: "bold" }}
          >
            My Application
          </Typography>
        </Toolbar>
      </Header>
      <DrawerStyled
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
        }}
        open
      >
        {drawerContent}
      </DrawerStyled>
      <DrawerStyled
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better performance on mobile
        }}
        sx={{
          display: { xs: "block", sm: "none" },
        }}
      >
        {drawerContent}
      </DrawerStyled>
      <Main open={!mobileOpen} sx={{ mt: 8 }}>
        <Box sx={{ maxWidth: "1200px", width: "100%" }}>{children}</Box>
      </Main>
    </Box>
  );
};

export default Layout;
