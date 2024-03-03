// created using 'rafce' intellisense (ES7+ React/Redux/React-Native snippets extension)

import React from "react";
import FlexBetween from "components/FlexBetween";
import Header from "components/Header";
import {
  DownloadOutlined,
  Email,
  PointOfSale,
  PersonAdd,
  Traffic,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import BreakdownChart from "components/BreakdownChart";
import OverviewChart from "components/OverviewChart";
import { useGetDashboardQuery } from "state/api";
import StatBox from "components/StatBox";

const Dashboard = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1350px)");
  const isMinWidth700px = useMediaQuery("(min-width: 700px)");
  const isMinWidth530px = useMediaQuery("(min-width: 530px)");
  const isMinWidth450px = useMediaQuery("(min-width: 450px)");

  // backend route:   "/general/dashboard"
  // data source:     "dataTransaction" & "dataOverallStat" from "server\data\index.js"
  // -----------------------------------------------------------------------------------
  const { data, isLoading } = useGetDashboardQuery();

  const columns = [
    {
      field: "_id", // field name (corresponding to the actual object document's field name)
      headerName: "ID", // column title
      flex: 1, // how much space each column will take
    },
    {
      field: "userId",
      headerName: "User ID",
      flex: isMinWidth700px ? 1 : 2,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
    },
    {
      field: "products",
      headerName: "# of Products",
      flex: isMinWidth700px ? 0.5 : 0.65,
      sortable: false, // Clicking the column's header will not sort the column.
      renderCell: (params) => params.value.length,
    },
    {
      field: "cost",
      headerName: "Cost",
      flex: 1,
      // In order to be sorted properly (i.e. lowest dollar value to highest and vice versa),
      // 'params.value' must be set as a 'Number' as opposed to being a string.
      renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
    },
  ];

  const excludedColumnFields = ["_id", "createdAt"];

  return (
    <Box
      m={isNonMediumScreens ? "1.5rem 2.5rem" : "1rem 1.5rem"}
      minWidth="300px"
    >
      {/* Dashboard Header + Download reports button */}
      <FlexBetween flexDirection={isMinWidth530px ? "row" : "column"}>
        <Header
          title="DASHBOARD"
          subtitle="Overall performance at a glance"
          display={isMinWidth530px ? undefined : "flex"}
          flexDirection={isMinWidth530px ? undefined : "column"}
          alignItems={isMinWidth530px ? undefined : "center"}
        />
        <Box ml={isMinWidth530px ? "1.5rem" : 0}>
          <Button
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.alt,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "5px 10px",
              mt: isMinWidth530px ? 0 : "10px",
            }}
          >
            <DownloadOutlined sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </FlexBetween>

      {/* Statboxes + Line Graph + Transaction table + Pie Chart */}
      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)" // sets the number of columns and width of each column.
        gridAutoRows="140px" // sets the default size of each row in the grid.
        gap="20px" // gap between each column
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 4"
          gridRow={isMinWidth530px ? "span 2" : "span 4"}
          display="grid"
          gridTemplateColumns="repeat(2, 1fr)"
          gridAutoRows="140px"
          gap="20px"
        >
          <StatBox
            title="Total Customers"
            value={data && data.totalCustomers}
            increase="+4%" // mock percentage
            description="Since last year"
            gridColumn={isMinWidth530px ? "span 1" : "span 2"}
            icon={
              <Email
                sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
              />
            }
          />
          <StatBox
            title="Sales Today"
            value={data && data.todayStats.totalSales}
            increase="+5%" // mock percentage
            description="Since last week"
            gridColumn={isMinWidth530px ? "span 1" : "span 2"}
            icon={
              <PointOfSale
                sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
              />
            }
          />
          <StatBox
            title="Monthly Sales"
            value={data && data.thisMonthStats.totalSales}
            increase="+3.5%" // mock percentage
            description="Since last month"
            gridColumn={isMinWidth530px ? "span 1" : "span 2"}
            icon={
              <PersonAdd
                sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
              />
            }
          />
          <StatBox
            title="Yearly Sales"
            value={data && data.yearlySalesTotal}
            increase="+2%" // mock percentage
            description="Since last year"
            gridColumn={isMinWidth530px ? "span 1" : "span 2"}
            icon={
              <Traffic
                sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* Line Chart */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          <OverviewChart view="sales" isDashboard={true} />
        </Box>

        {/* ROW 2 */}
        {/* Transaction table */}
        <Box
          gridColumn="span 8"
          gridRow="span 3"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
              borderRadius: "5rem",
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
              backgroundColor: theme.palette.background.alt,
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
            //
            // Iterates through every object document ('row') in the 'data' array.
            // The 'data' array is the payload gotten from calling 'useGetDashboardQuery()'.
            getRowId={(row) => row._id}
            //
            // BOTH 'rows' and 'columns' props are REQUIRED for DataGrid to work.
            // Rows is an array of document objects.
            // In this case, it is the 'data' array payload from useGetDashboardQuery().
            rows={(data && data.transactions) || []}
            columns={
              isMinWidth700px
                ? columns
                : columns.filter(
                    (column) => !excludedColumnFields.includes(column.field)
                  )
            }
            density="compact" // Set the default for density selector as 'compact'.
          />
        </Box>

        {/* Pie Chart */}
        <Box
          gridColumn="span 4"
          gridRow="span 3"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="0.55rem"
          height={isMinWidth450px ? undefined : "515px"}
        >
          <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
            Sales By Category
          </Typography>
          <BreakdownChart isDashboard={true} />
          <Typography
            p="0 0.6rem"
            fontSize="0.8rem"
            sx={{ color: theme.palette.secondary[200] }}
          >
            Revenue breakdown of products by category this year.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
