import React from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  IconButton,
  Divider,
  CssBaseline,
  Paper,
  alpha,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ChevronLeft as ChevronLeftIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { NavLink, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../features/authentication-module/authSlice";

const drawerWidth = 280;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.standard,
    }),
    marginLeft: open ? 0 : `-${drawerWidth}px`,
    background: theme.palette.background.paper,
    minHeight: "100vh",
    width: "100%",
    "@media (max-width: 960px)": {
      padding: theme.spacing(2),
      marginLeft: 0,
    },
  })
);

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background: alpha(theme.palette.background.paper, 0.95),
  color: theme.palette.text.primary,
  boxShadow: "0 0px 0px rgba(0,0,0,0.1)",
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
  }),
  "@media (max-width: 960px)": {
    width: "100%",
    marginLeft: 0,
  },
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  ...theme.mixins.toolbar,
  justifyContent: "space-between",
  padding: theme.spacing(0, 2),
  background: theme.palette.background.paper,
  "@media (max-width: 600px)": {
    padding: theme.spacing(0, 1),
  },
}));

const DrawerStyled = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    boxSizing: "border-box",
    background: theme.palette.background.paper,
    borderRight: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
    transition: theme.transitions.create(["transform", "width"], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.standard,
    }),
    "@media (max-width: 960px)": {
      width: "80vw",
      maxWidth: drawerWidth,
    },
    "@media (max-width: 600px)": {
      width: "70vw",
      maxWidth: 240,
    },
  },
}));

const NavLinkStyled = styled(NavLink)(({ theme }) => ({
  textDecoration: "none",
  color: theme.palette.text.secondary,
  width: "95%",
  borderRadius: theme.shape.borderRadius,
  "&.active": {
    background: "#bf08fb",
    color: theme.palette.primary.contrastText,
    "& .MuiListItemIcon-root": {
      color: theme.palette.primary.contrastText,
      transform: "scale(1.1)",
    },
    "& .MuiListItemText-primary": {
      fontWeight: theme.typography.fontWeightMedium,
    },
    "&:hover": {
      background: "#9c06c9",
      transform: "translateX(2px)",
      "& .MuiListItemIcon-root": {
        transform: "scale(1.15)",
      },
    },
  },
  "&:hover": {
    background: "#f0cdee",
    transform: "translateX(2px)",
    "& .MuiListItemIcon-root": {
      transform: "scale(1.1)",
    },
  },
}));

const ContentContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 12,
  background: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    boxShadow: theme.shadows[4],
  },
  "@media (max-width: 600px)": {
    padding: theme.spacing(2),
    borderRadius: 8,
  },
}));

const UserProfileButton = styled(IconButton)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  background: alpha(theme.palette.primary.main, 0.05),
  transition: "transform 0.3s ease-in-out, background 0.2s ease-in-out",
  animation: `$fadeIn 0.5s ease-in-out`,
  "&:hover": {
    background: alpha(theme.palette.primary.main, 0.15),
    transform: "scale(1.1)",
  },
  "@media (max-width: 600px)": {
    padding: theme.spacing(0.5),
  },
  "@keyframes fadeIn": {
    "0%": {
      opacity: 0,
      transform: "scale(0.8)",
    },
    "100%": {
      opacity: 1,
      transform: "scale(1)",
    },
  },
}));

const DrawerToggleButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary,
  transition: "transform 0.3s ease-in-out, background 0.2s ease-in-out",
  animation: `$fadeIn 0.5s ease-in-out`,
  "&:hover": {
    background: alpha(theme.palette.primary.main, 0.1),
    transform: "scale(1.1)",
  },
  "@keyframes fadeIn": {
    "0%": {
      opacity: 0,
      transform: "scale(0.8)",
    },
    "100%": {
      opacity: 1,
      transform: "scale(1)",
    },
  },
}));

const Layout = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(true);
  const location = useLocation();
  const isMenuOpen = Boolean(anchorEl);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout()); 
    handleMenuClose();
    navigate("/login"); 
  };

  const getPageTitle = () => {
    const currentRoute = navItems.find(
      (item) => item.path === location.pathname
    );
    return currentRoute ? currentRoute.text : "Dashboard";
  };

  const navItems = [
    {
      text: "Policy Management",
      path: "/policy-management",
      icon: <DashboardIcon />,
    },
  ];

  const drawerContent = (
    <>
      <DrawerHeader>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            fontWeight: 600,
            flexGrow: 1,
            letterSpacing: 0.2,
            fontSize: "1.25rem",
          }}
        >
          Policy Insurance
        </Typography>
        <Tooltip title={open ? "Close Drawer" : "Open Drawer"}>
          <DrawerToggleButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </DrawerToggleButton>
        </Tooltip>
      </DrawerHeader>
      <Divider />
      <List sx={{ pt: 2, px: 2 }}>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <NavLinkStyled to={item.path}>
              <ListItemButton>
                <ListItemIcon sx={{ minWidth: 45 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: 500,
                    fontSize: "1rem",
                  }}
                />
              </ListItemButton>
            </NavLinkStyled>
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <Box
      sx={{
        display: "flex",
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <CssBaseline />
      <AppBarStyled position="fixed" open={open}>
        <Toolbar sx={{ minHeight: "72px" }}>
          {!open && (
            <Tooltip title="Open Drawer">
              <DrawerToggleButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{
                  mr: 1,
                }}
              >
                <MenuIcon />
              </DrawerToggleButton>
            </Tooltip>
          )}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontWeight: 600,
              flexGrow: 1,
              letterSpacing: 0.2,
              fontSize: "1.25rem",
            }}
          >
            {getPageTitle()}
          </Typography>

          <Tooltip title="User Menu">
            <UserProfileButton
              size="small"
              onClick={handleProfileMenuOpen}
              aria-controls={anchorEl ? "account-menu" : undefined}
              aria-haspopup="true"
            >
              <AccountCircleIcon />
            </UserProfileButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            id="account-menu"
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 0.5,
                width: 220,
                borderRadius: 8,
                transition: "all 0.3s ease-in-out",
                "& .MuiMenuItem-root": {
                  padding: "12px 16px",
                  borderRadius: 6,
                  margin: "4px 8px",
                  transition:
                    "background-color 0.2s ease-in-out, transform 0.2s ease-in-out",
                  "&:hover": {
                    background: "#f0cdee",
                    transform: "translateX(2px)",
                    "& .MuiListItemIcon-root": {
                      transform: "scale(1.1)",
                    },
                  },
                },
                "& .MuiListItemIcon-root": {
                  transition:
                    "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
                  animation: `$fadeIn 0.5s ease-in-out`,
                  "@keyframes fadeIn": {
                    "0%": {
                      opacity: 0,
                      transform: "scale(0.8)",
                    },
                    "100%": {
                      opacity: 1,
                      transform: "scale(1)",
                    },
                  },
                },
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: -5,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                  transition: "all 0.3s ease-in-out",
                },
              },
            }}
          >
            <MenuItem
              disabled
              sx={{
                justifyContent: "center",
                padding: "12px 16px",
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                John Doe
              </Typography>
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBarStyled>

      <DrawerStyled
        variant="persistent"
        open={open}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {drawerContent}
      </DrawerStyled>

      <Main open={open}>
        <DrawerHeader />
        <ContentContainer elevation={0}>
          <Outlet />
        </ContentContainer>
      </Main>
    </Box>
  );
};

export default Layout;
