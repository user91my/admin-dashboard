import React from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useGetCustomersQuery } from "state/api";
import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector } from "react-redux";

const Customers = () => {
  const isSidebarOpen = useSelector((state) => state.global.isSidebarOpen);

  // backend route:   "/client/customers"
  // data source:     "dataUser" from "server\data\index.js"
  // ---------------------------------------------------------
  // 'data'- is the data grabbed from the server backend.
  // 'isLoading' - is a boolean (provided by RTK Query). It can be used to check
  //               whether the data has not reached the frontend yet.
  const { data, isLoading } = useGetCustomersQuery();

  const theme = useTheme();
  const isMinWidth1600px = useMediaQuery("(min-width: 1600px)");
  const isMinWidth1200px = useMediaQuery("(min-width: 1200px)");
  const isMinWidth1100px = useMediaQuery("(min-width: 1100px)");
  const isMinWidth1000px = useMediaQuery("(min-width: 1000px)");
  const isMinWidth750px = useMediaQuery("(min-width: 750px)");
  const isMinWidth650px = useMediaQuery("(min-width: 650px)");
  const isMinWidth525px = useMediaQuery("(min-width: 525px)");
  const isMinWidth450px = useMediaQuery("(min-width: 450px)");
  const isMinHeight1000px = useMediaQuery("(min-height: 1000px)");

  const excludedColumnFields1200px = ["_id", "role"];
  const excludedColumnFields750px = ["_id", "role", "country", "occupation"];

  const columns = [
    {
      field: "_id", // field name (corresponding to the actual object document's field name)
      headerName: "ID", // column title
      flex: 0.85, // how much space each column will take
    },
    {
      field: "name",
      headerName: "NAME",
      flex: isMinWidth650px ? 0.35 : isMinWidth525px ? 0.25 : undefined,
      width: isMinWidth525px ? undefined : 100, // implementing 'width' instead of 'flex' allows the data grid to overflow
    },
    {
      field: "email",
      headerName: "EMAIL",
      flex: isMinWidth650px ? 1 : isMinWidth525px ? 0.8 : undefined,
      width: isMinWidth525px ? undefined : 250,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: isMinWidth650px ? 0.65 : isMinWidth525px ? 0.65 : undefined,
      width: isMinWidth525px ? undefined : 175,
      // renderCell: (params) => {
      //   return params.value.replace(/^(\d{3})(\d{3})(\d{4})/, "($1)$2-$3"); // using regex to custom format 'params.value'.
      // },
    },
    {
      field: "country",
      headerName: "Country",
      flex: 0.3,
    },
    {
      field: "occupation",
      headerName: "Occupation",
      flex: 1,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 0.3,
    },
  ];

  return (
    <Box minWidth="330px" m="1.5rem 2.5rem">
      <Header
        title="CUSTOMERS"
        subtitle="List of Customers"
        display={isMinWidth525px ? undefined : "flex"}
        flexDirection={isMinWidth525px ? undefined : "column"}
        alignItems={isMinWidth525px ? undefined : "center"}
      />
      <Box
        mt="40px"
        height="75vh"
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
              : isMinWidth525px
              ? "85vw"
              : "100%"
            : isMinWidth1600px
            ? "93vw"
            : isMinWidth1000px
            ? "90vw"
            : isMinWidth750px
            ? "87.5vw"
            : isMinWidth450px
            ? "85vw"
            : "100%"
        }
        minWidth="300px"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <DataGrid
          loading={isLoading || !data}
          // Iterates through every object document in 'data' array.
          // Every object document is represented by 'row' variable.
          // The 'data' array is the payload from useGetCustomersQuery().
          getRowId={(row) => row._id}
          // Rows is an array of document objects.
          // In this case, it is the 'data' array payload from useGetCustomersQuery().
          rows={data || []} // REQUIRED PROP
          columns={
            isMinWidth1200px
              ? columns
              : isMinWidth750px
              ? columns.filter(
                  (column) => !excludedColumnFields1200px.includes(column.field)
                )
              : columns.filter(
                  (column) => !excludedColumnFields750px.includes(column.field)
                )
          } // REQUIRED PROP
        />
      </Box>
    </Box>
  );
};

export default Customers;
