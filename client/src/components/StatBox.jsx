import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import FlexBetween from "./FlexBetween";
import { Description } from "@mui/icons-material";

const StatBox = ({ title, value, increase, icon, description, gridColumn }) => {
  const theme = useTheme();
  return (
    <Box
      gridColumn={gridColumn}
      gridRow="span 1"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      p="1.25rem 1rem"
      flex="1 1 100%" // Specifies flex properties by order: flex-grow, flex-shrink, flex-basis.
      backgroundColor={theme.palette.background.alt}
      borderRadius="0.55rem"
    >
      {/* Title and Icon */}
      <FlexBetween>
        <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
          {title}
        </Typography>
        {icon}
      </FlexBetween>

      {/* Value */}
      <Typography
        variant="h3"
        fontWeight="600"
        sx={{ color: theme.palette.secondary[200] }}
      >
        {value}
      </Typography>

      {/* Percentage increase and description */}
      <FlexBetween gap="1rem">
        <Typography
          variant="h5"
          fontStyle="italic"
          sx={{ color: theme.palette.secondary.light }}
        >
          {increase}
        </Typography>
        <Typography>{description}</Typography>
      </FlexBetween>
    </Box>
  );
};

export default StatBox;
