import React from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "components/Navbar";
import Sidebar from "components/Sidebar";
import { useGetUserQuery } from "state/api";
import hexToRgba from "hex-to-rgba";
import { setIsSidebarOpen } from "state";

const Layout = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.global.userId);
  const isSidebarOpen = useSelector((state) => state.global.isSidebarOpen);
  const mode = useSelector((state) => state.global.mode);

  const theme = useTheme();
  const background =
    mode === "dark" ? theme.palette.primary[600] : theme.palette.neutral[400];
  const isNonMobile = useMediaQuery("(min-width: 1000px)");
  const isMinWidth1000px = useMediaQuery("(min-width: 1000px)");

  // backend route:   "/general/user/${id}"
  // data source:     "dataUser" from "server\data\index.js"
  // ---------------------------------------------------------
  const { data } = useGetUserQuery(userId); // Destructuring the 'data' payload from the API call made by 'useGetUserQuery(userId)'.

  return (
    <Box
      // When display is on a desktop (i.e. isNonMobile), child components are
      // placed in a row. Whereas on smaller screen (i.e. !isNonMobile), they
      // will be placed on top of each other (i.e. each component will take up
      // a whole width on its own).
      display={isNonMobile ? "flex" : "block"}
      width="100%"
      height="100%"
    >
      <Sidebar
        user={data || {}} // Returns an empty object if 'data' is undefined.
        isNonMobile={isNonMobile}
        drawerWidth="250px"
      />

      {/* Blur overlay appears if sidebar is open and viewport width is */}
      {/* below 1000px */}
      {isSidebarOpen && !isMinWidth1000px && (
        <Box
          position="fixed"
          top="0"
          width="100vw"
          height="100vh"
          sx={{
            zIndex: 10,
            background: hexToRgba(background, 0.5),
            backdropFilter: "blur(1px)",
          }}
          onClick={() => dispatch(setIsSidebarOpen(false))}
        ></Box>
      )}

      {/* 'flexGrow' specifies how much the item will grow relative to the */}
      {/* rest of the flexible items inside the same container. */}
      {/* 'flexGrow={1}' effectively means that the 'Box' will take up as much */}
      {/* remaining space as it can. (Note that the other item in the same */}
      {/* container as 'Box' is the above 'Sidebar' which has a 250px width) */}
      <Box flexGrow={1} position="relative" top="64px">
        <Navbar
          user={data || {}} // Returns an empty object if 'data' is undefined.
        />

        {/* 'Outlet' is a React Router placeholder */}
        {/* where different components are rendered */}
        {/* based on the current route. */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
