import React from "react";
import { Box, useMediaQuery } from "@mui/material";
import Header from "components/Header";
import BreakdownChart from "components/BreakdownChart";
import { useSelector } from "react-redux";

const Breakdown = () => {
  const isMinWidth1600px = useMediaQuery("(min-width: 1600px)");
  const isMinWidth1100px = useMediaQuery("(min-width: 1100px)");
  const isMinWidth1000px = useMediaQuery("(min-width: 1000px)");
  const isMinWidth750px = useMediaQuery("(min-width: 750px)");
  const isMinWidth525px = useMediaQuery("(min-width: 525px)");
  const isMinWidth400px = useMediaQuery("(min-width: 400px)");

  const isSidebarOpen = useSelector((state) => state.global.isSidebarOpen);

  return (
    <Box
      m="1.5rem 2rem"
      width={
        isSidebarOpen
          ? isMinWidth1600px
            ? "80vw"
            : isMinWidth1100px
            ? "72.5vw"
            : isMinWidth1000px
            ? "70vw"
            : isMinWidth750px
            ? "87.5vw"
            : "85vw"
          : isMinWidth1600px
          ? "93vw"
          : isMinWidth1000px
          ? "90vw"
          : isMinWidth750px
          ? "87.5vw"
          : "85vw"
      }
    >
      <Header
        title="BREAKDOWN"
        subtitle="Breakdown of Sales By Category"
        display={isMinWidth525px ? undefined : "flex"}
        flexDirection={isMinWidth525px ? undefined : "column"}
        alignItems={isMinWidth525px ? undefined : "center"}
      />
      <Box mt="40px" height="70vh">
        <BreakdownChart />
      </Box>
    </Box>
  );
};

export default Breakdown;
