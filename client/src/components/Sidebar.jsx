import React from "react";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  SettingsOutlined,
  ChevronLeft,
  ChevronRightOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  Groups2Outlined,
  ReceiptLongOutlined,
  PublicOutlined,
  PointOfSaleOutlined,
  TodayOutlined,
  CalendarMonthOutlined,
  AdminPanelSettingsOutlined,
  TrendingUpOutlined,
  PieChartOutlined,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { setIsSidebarOpen } from "state";
import FlexBetween from "./FlexBetween";
import profileImage from "assets/profile.jpeg";
import { useSelector, useDispatch } from "react-redux";

const navItems = [
  {
    text: "Dashboard",
    icon: <HomeOutlined />,
  },
  {
    text: "Client Facing",
    icon: null,
  },
  {
    text: "Products",
    icon: <ShoppingCartOutlined />,
  },
  {
    text: "Customers",
    icon: <Groups2Outlined />,
  },
  {
    text: "Transactions",
    icon: <ReceiptLongOutlined />,
  },
  {
    text: "Geography",
    icon: <PublicOutlined />,
  },
  {
    text: "Sales",
    icon: null,
  },
  {
    text: "Overview",
    icon: <PointOfSaleOutlined />,
  },
  {
    text: "Daily",
    icon: <TodayOutlined />,
  },
  {
    text: "Monthly",
    icon: <CalendarMonthOutlined />,
  },
  {
    text: "Breakdown",
    icon: <PieChartOutlined />,
  },
  {
    text: "Management",
    icon: null,
  },
  {
    text: "Admin",
    icon: <AdminPanelSettingsOutlined />,
  },
  {
    text: "Performance",
    icon: <TrendingUpOutlined />,
  },
];

const Sidebar = ({ user, drawerWidth, isNonMobile }) => {
  const { pathname } = useLocation(); // Grabs the url path/route (i.e. '/dashboard') that we're currently at.
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state) => state.global.isSidebarOpen);

  const theme = useTheme();
  const isMinWidth1000px = useMediaQuery("(min-width: 1000px)");

  const [active, setActive] = useState(""); // Determines what page we're currently at.

  // Updates the path value of 'active'.
  // Determines what page we're on.
  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  // At viewports below 1000px, sidebar is CLOSED by default.
  // This is for the benefit of mobile users.
  useEffect(() => {
    isMinWidth1000px
      ? dispatch(setIsSidebarOpen(true))
      : dispatch(setIsSidebarOpen(false));
  }, []);

  return (
    // Creating a <nav> component.
    // The "component" prop determines the Box's HTML component type.
    <Box component="nav">
      {/* SIDEBAR DRAWER CONTAINER */}
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen} // Determines whether the sidebar drawer is open or closed.
          onClose={() => dispatch(setIsSidebarOpen(false))} // Specifies what function to execute when closing the drawer.
          variant="persistent" // Drawer is always visible and overlays the content.
          anchor="left" // Specifies the drawer's position on the screen.
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
              boxSizing: "border-box",
              borderWidth: isNonMobile ? 0 : "5px",
              width: drawerWidth,
            },
          }}
        >
          <Box width="100%">
            {/*  */}
            {/* SIDEBAR'S MAIN LOGO + ChevronLeft button */}
            <Box m="1.5rem 2rem 2rem 3rem">
              <FlexBetween color={theme.palette.secondary.main}>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  gap="0.5rem"
                  width="90%"
                >
                  <Typography variant="h4" fontWeight="bold">
                    BizPortal
                  </Typography>
                </Box>
                {!isNonMobile && (
                  <IconButton
                    onClick={() => dispatch(setIsSidebarOpen(!isSidebarOpen))}
                  >
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>

            {/* SIDEBAR'S SUBHEADERS + LINKS */}
            <List>
              {/* Iterate through 'navItems' array */}
              {navItems.map(({ text, icon }) => {
                //
                // SUB-HEADERS
                // If 'icon' is a null, return a regular text subheader.
                if (!icon) {
                  return (
                    <Typography key={text} sx={{ m: "2.25rem 0 1rem 3rem" }}>
                      {text}
                    </Typography>
                  );
                }

                // LINKS
                // Else (if 'icon' is available), return a clickable <ListItem> component with the following hierarchy :-
                //  <ListItem>
                //    <ListItemButton>
                //      <ListItemIcon></ListItemIcon>
                //      <ListItemText></ListItemText>
                //    </ListItemButton>
                //    .....
                //  </ListItem>
                //
                const lcText = text.toLowerCase();
                return (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        navigate(`/${lcText}`);
                        setActive(lcText);
                        if (!isMinWidth1000px)
                          dispatch(setIsSidebarOpen(false));
                      }}
                      sx={{
                        backgroundColor:
                          active === lcText
                            ? theme.palette.secondary[300]
                            : "transparent",
                        color:
                          active === lcText
                            ? theme.palette.primary[600]
                            : theme.palette.secondary[100],
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          ml: "2rem",
                          color:
                            active === lcText
                              ? theme.palette.primary[600]
                              : theme.palette.secondary[200],
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText primary={text} />

                      {active === lcText && (
                        <ChevronRightOutlined sx={{ ml: "auto" }} />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>

          {/* CONTAINER FOR USER IMAGE + NAME + OCCUPATION + SETTINGS ICON */}
          <Box m="2rem 0">
            <Divider />

            <FlexBetween textTransform="none" gap="1rem" m="1.5rem 2rem 0 3rem">
              {/* USER IMAGE */}
              <Box
                component="img"
                alt="profile"
                src={profileImage}
                height="40px"
                width="40px"
                borderRadius="50%"
                sx={{ objectFit: "cover" }} // Image keeps its aspect ratio and fills given dimension.
              />

              {/* USER NAME + OCCUPATION */}
              <Box textAlign="left">
                <Typography
                  fontWeight="bold"
                  fontSize="0.9rem"
                  sx={{ color: theme.palette.secondary[100] }}
                >
                  {user.name}
                </Typography>
                <Typography
                  fontSize="0.8rem"
                  sx={{ color: theme.palette.secondary[200] }}
                >
                  {user.occupation}
                </Typography>
              </Box>

              {/* SETTINGS ICON */}
              <SettingsOutlined
                sx={{ color: theme.palette.secondary[300], fontSize: "25px" }}
              />
            </FlexBetween>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
