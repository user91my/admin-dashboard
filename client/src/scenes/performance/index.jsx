import React from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useGetUserPerformanceQuery } from "state/api";
import { useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import Header from "components/Header";
import CustomColumnMenu from "components/DataGridCustomColumnMenu";

const Performance = () => {
  const theme = useTheme();
  const isMinWidth1600px = useMediaQuery("(min-width: 1600px)");
  const isMinWidth1300px = useMediaQuery("(min-width: 1300px)");
  const isMinWidth1100px = useMediaQuery("(min-width: 1100px)");
  const isMinWidth1000px = useMediaQuery("(min-width: 1000px)");
  const isMinWidth750px = useMediaQuery("(min-width: 750px)");
  const isMinWidth525px = useMediaQuery("(min-width: 525px)");
  const isMinWidth450px = useMediaQuery("(min-width: 450px)");

  const isSidebarOpen = useSelector((state) => state.global.isSidebarOpen);

  // backend route:   "/management/performance/${id}"
  // data source:     "dataUser" & "dataAffiliateStat" from "server\data\index.js"
  // ------------------------------------------------------------------------------
  const userId = useSelector((state) => state.global.userId);
  const { data, isLoading } = useGetUserPerformanceQuery(userId);

  const columns = [
    {
      field: "_id", // field name (corresponding to the actual object document's field name)
      headerName: "ID", // column title
      flex: isMinWidth1300px && 1, // how much space each column will take
      width: !isMinWidth1300px && 220,
    },
    {
      field: "userId",
      headerName: "User ID",
      flex: isMinWidth1300px && 1,
      width: !isMinWidth1300px && 220,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: isMinWidth1300px && 1,
      width: !isMinWidth1300px && 220,
    },
    {
      field: "products",
      renderHeader: () => (
        // Takes precedence over the "headerName" property
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            lineHeight: "1.25rem",
          }}
        >
          <span># of&nbsp;</span>
          <span>Products</span>
        </div>
      ),
      // headerName: "# of Products",
      flex: isMinWidth1300px && 0.5,
      width: !isMinWidth1300px && 85,
      sortable: false, // When clicking header, column will not be sorted.
      renderCell: (params) => params.value.length,
    },
    {
      field: "cost",
      headerName: "Cost",
      flex: isMinWidth1300px && 1,
      width: !isMinWidth1300px && 100,
      renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
    },
  ];

  const newColumns = [...columns];
  newColumns.splice(2, 1); // removes "createdAt" column
  newColumns.splice(0, 1); // removes "_id" column
  newColumns.push(columns[0], columns[2]); // pushes "_id" & "createdAt" columns

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="PERFORMANCE"
        subtitle="Track your Affiliate Sales Performance Here"
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
          // The 'data' array is the payload from useGetUserPerformanceQuery().
          getRowId={(row) => row._id}
          // Rows is an array of document objects.
          // In this case, it is the 'data' array payload from useGetUserPerformanceQuery().
          rows={(data && data.sales) || []} // REQUIRED PROP
          columns={isMinWidth750px ? columns : newColumns} // REQUIRED PROP
          slots={{ columnMenu: CustomColumnMenu }} // Inserting the custom 'columnMenu' subcomponent ('CustomColumnMenu') into DataGrid component.
        />
      </Box>
    </Box>
  );
};

export default Performance;
