import React, { useState } from "react";
import {
  FormControl,
  MenuItem,
  InputLabel,
  Box,
  Select,
  useMediaQuery,
} from "@mui/material";
import Header from "components/Header";
import OverviewChart from "components/OverviewChart";
import { useSelector } from "react-redux";

const Overview = () => {
  const [view, setView] = useState("units");

  const isMinWidth1600px = useMediaQuery("(min-width: 1600px)");
  const isMinWidth1100px = useMediaQuery("(min-width: 1100px)");
  const isMinWidth1000px = useMediaQuery("(min-width: 1000px)");
  const isMinWidth750px = useMediaQuery("(min-width: 750px)");
  const isMinWidth525px = useMediaQuery("(min-width: 525px)");

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
      minWidth="300px"
    >
      <Header
        title="OVERVIEW"
        subtitle="Overview of general revenue and profit"
        display={isMinWidth525px ? undefined : "flex"}
        flexDirection={isMinWidth525px ? undefined : "column"}
        alignItems={isMinWidth525px ? undefined : "center"}
      />
      <Box height="70vh">
        <FormControl sx={{ mt: "1rem", mb: "1rem" }}>
          <InputLabel>View</InputLabel>
          <Select
            value={view}
            onChange={(e) => setView(e.target.value)}
            label="View"
          >
            <MenuItem value="sales">Sales</MenuItem>
            <MenuItem value="units">Units</MenuItem>
          </Select>
        </FormControl>

        <OverviewChart view={view} />
      </Box>
    </Box>
  );
};

export default Overview;
