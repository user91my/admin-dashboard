import React from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { useGetAdminsQuery } from "state/api";
import { DataGrid } from "@mui/x-data-grid";
import Header from "components/Header";
import CustomColumnMenu from "components/DataGridCustomColumnMenu";
import { useSelector } from "react-redux";

const Admin = () => {
  const theme = useTheme();
  const isMinWidth1600px = useMediaQuery("(min-width: 1600px)");
  const isMinWidth1100px = useMediaQuery("(min-width: 1100px)");
  const isMinWidth1000px = useMediaQuery("(min-width: 1000px)");
  const isMinWidth750px = useMediaQuery("(min-width: 750px)");
  const isMinWidth525px = useMediaQuery("(min-width: 525px)");
  const isMinWidth450px = useMediaQuery("(min-width: 450px)");

  const excludedColumnFields1600px = ["role"];

  const isSidebarOpen = useSelector((state) => state.global.isSidebarOpen);

  // backend route:   "/management/admins"
  // data source:     "dataUser" from "server\data\index.js"
  // ----------------------------------------------------------------
  const { data, isLoading } = useGetAdminsQuery();

  const columns = [
    {
      field: "_id", // field name (corresponding to the actual object document's field name)
      headerName: "ID", // column title
      flex: isMinWidth1600px && 1, // how much space each column will take
      width: !isMinWidth1600px && 205,
    },
    {
      field: "name",
      headerName: "NAME",
      flex: isMinWidth1600px && 0.5,
      width: !isMinWidth1600px && 120,
    },
    {
      field: "email",
      headerName: "EMAIL",
      flex: isMinWidth1600px && 1,
      width: !isMinWidth1600px && 260,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: isMinWidth1600px && 0.5,
      width: !isMinWidth1600px && 150,
      // renderCell: (params) => {
      //   return params.value.replace(/^(\d{3})(\d{3})(\d{4})/, "($1)$2-$3"); // using regex to custom format 'params.value'.
      // },
    },
    {
      field: "country",
      headerName: "Country",
      flex: isMinWidth1600px && 0.4,
      width: !isMinWidth1600px && 62.5,
    },
    {
      field: "occupation",
      headerName: "Occupation",
      flex: isMinWidth1600px && 1,
      width: !isMinWidth1600px && 260,
    },
    {
      field: "role",
      headerName: "Role",
      flex: isMinWidth1600px && 0.5,
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="ADMINS"
        subtitle="Managing admins and list of admins"
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
            isMinWidth1600px
              ? columns
              : columns.filter(
                  (column) => !excludedColumnFields1600px.includes(column.field)
                )
          } // REQUIRED PROP
          slots={{ columnMenu: CustomColumnMenu }} // Inserting the custom 'columnMenu' subcomponent ('CustomColumnMenu') into DataGrid component.
        />
      </Box>
    </Box>
  );
};

export default Admin;
