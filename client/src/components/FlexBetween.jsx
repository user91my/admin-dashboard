import { Box } from "@mui/material";
import { styled } from "@mui/system";

// styled components allows us to use styles/css
// in a component-like manner.
const FlexBetween = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export default FlexBetween;
