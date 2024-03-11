import React, { useEffect, useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useGetTransactionsQuery } from "state/api";
import Header from "components/Header";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";
import { useSelector } from "react-redux";

const Transactions = () => {
  const theme = useTheme();
  const isMinWidth1600px = useMediaQuery("(min-width: 1600px)");
  const isMinWidth1100px = useMediaQuery("(min-width: 1100px)");
  const isMinWidth1000px = useMediaQuery("(min-width: 1000px)");
  const isMinWidth950px = useMediaQuery("(min-width: 950px)");
  const isMinWidth750px = useMediaQuery("(min-width: 750px)");
  const isMinWidth650px = useMediaQuery("(min-width: 650px)");
  const isMinWidth525px = useMediaQuery("(min-width: 525px)");
  const isMinWidth450px = useMediaQuery("(min-width: 450px)");

  const excludedColumnFields1100px = ["createdAt"];

  const isSidebarOpen = useSelector((state) => state.global.isSidebarOpen);

  // Variable values (i.e. 'paginationModel.page', 'paginationModel.pageSize', 'sort', 'search') are to be sent
  // to the backend. Anytime any of these variable changes in value, an API request will be automatically made
  // to the server (as these variables are default params to 'useGetTransactionsQuery()'.
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // in MUI dataGrid, first page starts at 0.
    pageSize: 20,
  });
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [isLoadingData, setIsLoadingData] = useState(true);

  // backend route:   "/client/transactions"
  // data source:     "dataTransaction" from "server\data\index.js"
  // ---------------------------------------------------------------
  // 'data'- is the data grabbed from the server backend.
  // 'isLoading' - is a boolean (provided by RTK Query). It can be used to check
  //               whether the data has not reached the frontend yet.
  // NOTE: Any changes to any one of the params' value ('page', pageSize', 'sort', 'search')
  //       will automatically trigger the 'useGetTransactionsQuery()' API call to the backend.
  let { data, isLoading } = useGetTransactionsQuery({
    page: paginationModel.page,
    pageSize: paginationModel.pageSize,
    sort: JSON.stringify(sort),
    search,
  });

  useEffect(() => {
    if (data && !isLoading) setIsLoadingData(false);
  }, [data]);

  // Converting values in "cost" field of every "transaction" object into
  // 'Number' type.
  // This is to ensure that the numbers in the "cost" field will be properly
  // sorted (in a numerical manner, NOT lexicographically) in the datagrid
  // table.
  if (!isLoadingData) {
    const transactions = data["transactions"];
    const formattedTransactions = transactions.reduce((acc, transaction) => {
      const transactionObj = { ...transaction };
      transactionObj.cost = Number(transactionObj.cost);
      acc.push(transactionObj);
      return acc;
    }, []);
    data = { ...data };
    data.transactions = formattedTransactions;
    // console.log("data", data);
  }

  const columns = [
    {
      field: "_id", // field name (corresponding to the actual object document's field name)
      headerName: "ID", // column title
      flex: isMinWidth1100px ? 1 : undefined, // how much space each column will take
      width: isMinWidth1100px // implementing 'width' instead of 'flex' allows the table grid to overflow
        ? undefined
        : isSidebarOpen
        ? 200
        : isMinWidth950px
        ? 300
        : 215,
    },
    {
      field: "userId",
      headerName: "User ID",
      flex: isMinWidth1100px ? 1 : undefined,
      width: isMinWidth1100px
        ? undefined
        : isSidebarOpen
        ? 200
        : isMinWidth950px
        ? 300
        : 215,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
    },
    {
      field: "products",
      headerName: "# of Products",
      flex: isMinWidth1100px ? 0.5 : undefined,
      width: isMinWidth1100px ? undefined : 100,
      // Set 'sortable' to false because the products field is actually an array
      // of product IDs. Consequently, the sorting of the "# of Products" column
      // will not be in proper numerical order.
      sortable: false,
      renderCell: (params) => params.value.length,
    },
    {
      field: "cost",
      headerName: "Cost ($)",
      flex: isMinWidth1100px ? 0.5 : undefined,
      width: isMinWidth1100px ? undefined : 100,
      // Setting to "number" type is not needed as the cost field sorting
      // is done on the server-side.
      // See "server\controllers\client.js".
      // type: "number",
      renderCell: (params) => Number(params.value).toFixed(2),
    },
  ];

  const newColumns = [...columns];
  newColumns.splice(1, 2); // removes "userId" and "createdAt" columns
  newColumns.push(columns[1]); // pushes "userId" column

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="TRANSACTIONS"
        subtitle="Entire list of transactions"
        display={isMinWidth525px ? undefined : "flex"}
        flexDirection={isMinWidth525px ? undefined : "column"}
        alignItems={isMinWidth525px ? undefined : "center"}
      />
      {data || !isLoading ? (
        <Box
          height="80vh"
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
            // If true, loading overlay will be displayed.
            loading={isLoading || !data}
            //
            // Iterates through every object document ('row') in the 'data' array.
            // The 'data' array is the payload gotten from calling 'useGetTransactionsQuery()'.
            getRowId={(row) => row._id}
            //
            // BOTH 'rows' and 'columns' props are REQUIRED for DataGrid to work.
            // Rows is an array of document objects.
            // In this case, it is the 'data' array payload from useGetTransactionsQuery().
            rows={(data && data.transactions) || []}
            columns={
              isMinWidth1100px
                ? columns
                : isMinWidth650px
                ? columns.filter(
                    (column) =>
                      !excludedColumnFields1100px.includes(column.field)
                  )
                : newColumns
            }
            //
            // Additional props & settings needed for server-side pagination.
            // https://mui.com/x/react-data-grid/pagination/
            rowCount={(data && data.total) || 0} // Let DataGrid know the TOTAL number of rows (documents) are there.
            pagination // Enables pagination
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[20, 50, 100]} // Options users can choose as to the number of Rows per page.
            sortingMode="server" // Alternatively, this can be set to "client" so that the client will sort the data instead
            //
            // Structurally, the 'sortModel' is an array containing the object model. It should look like :-
            //        [ { field: "userId", sort: "desc" } ]
            // We destructure the 'sortModel' array in order extract the object model and ultimately send it back to the server.
            onSortModelChange={(sortModel) => {
              // When 'sortModel' array does not contain any object model
              // specifying a column field to sort (therefore 0 length).
              if (!sortModel.length) {
                // Setting 'sort' as an empty object will cause the document
                // objects to be sorted to their default sequencing
                // (i.e. neither ascending nor descending).
                setSort({});
                return;
              }
              setSort(...sortModel);
            }}
            density="compact" // Set the default for density selector as 'compact'.
            //
            // Inserting a Custom Subcomponent ('toolbar') into DataGrid component using 'slots' prop. Documentation :-
            // https://mui.com/x/react-data-grid/components/
            // List of object types accepted by 'slots' prop ('toolbar' in the current case) :-
            // https://mui.com/x/api/data-grid/data-grid/#slots
            slots={{ toolbar: DataGridCustomToolbar }} // Inserting the custom 'toolbar' subcomponent ('DataGridCustomToolbar') into DataGrid component.
            slotProps={{
              toolbar: { searchInput, setSearchInput, setSearch }, // Passing additional props into the 'toolbar' subcomponent.
            }}
          />
        </Box>
      ) : (
        <div>Loading...</div>
      )}
    </Box>
  );
};

export default Transactions;
