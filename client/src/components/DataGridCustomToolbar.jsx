import React from "react";
import { Search } from "@mui/icons-material";
import {
  IconButton,
  TextField,
  InputAdornment,
  useMediaQuery,
} from "@mui/material";
import {
  GridToolbarDensitySelector,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
} from "@mui/x-data-grid";
import FlexBetween from "./FlexBetween";

const DataGridCustomToolbar = ({ searchInput, setSearchInput, setSearch }) => {
  const isMinWidth525px = useMediaQuery("(min-width: 525px)");
  const flexColumnProperties = isMinWidth525px
    ? undefined
    : {
        display: "flex",
        flexDirection: "column",
        padding: "1rem",
      };

  return (
    <GridToolbarContainer>
      <FlexBetween width="100%" {...flexColumnProperties}>
        <FlexBetween>
          <GridToolbarColumnsButton />
          <GridToolbarDensitySelector />
          <GridToolbarExport />
        </FlexBetween>

        <TextField
          label="Search <User ID & Cost only>"
          sx={{
            mb: "0.5rem",
            ml: isMinWidth525px && "4rem",
            width: "15rem",
          }}
          onChange={(e) => setSearchInput(e.target.value)}
          value={searchInput}
          variant="standard"
          InputProps={{
            // Customizing the 'TextField' with adornment.
            // The 'endAdornment' prop allows you to add an element, such
            // (e.g. an icon or a button), at the end of the input field.
            // (see also: 'startAdornment').
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    setSearch(searchInput);
                    setSearchInput("");
                  }}
                >
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </FlexBetween>
    </GridToolbarContainer>
  );
};

export default DataGridCustomToolbar;
