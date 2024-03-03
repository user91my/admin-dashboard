import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// 'createApi' creates an API slice with RTK.
// It takes an object with configuration options as an argument.
export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }), // Locally, REACT_APP_BASE_URL is gotten from "client\.env.local".
  reducerPath: "adminApi", // Specifies the path name where the API data will be stored. See 'client\src\index.js' ('reducer' property in 'configureStore').
  tagTypes: [
    "User",
    "Products",
    "Customers",
    "Transactions",
    "Geography",
    "Sales",
    "Admins",
    "Performance",
    "Dashboard,",
  ], // Defines the types of entities (i.e. "User") that the API endpoints can return. Enhances caching and invalidation logic on response data.
  endpoints: (build) => ({
    getUser: build.query({
      query: (id) => `general/user/${id}`,
      providesTags: ["User"], // Related to "User" tagTypes.
    }),
    getProducts: build.query({
      query: () => `client/products`,
      providesTags: ["Products"], // Related to "Products" tagTypes.
    }),
    getCustomers: build.query({
      query: () => `client/customers`,
      providesTags: ["Customers"], // Related to "Customers" tagTypes.
    }),
    getTransactions: build.query({
      query: ({ page, pageSize, sort, search }) => ({
        url: "client/transactions",
        method: "GET",
        params: { page, pageSize, sort, search },
      }),
      providesTags: ["Transactions"], // Related to "Transactions" tagTypes.
    }),
    getGeography: build.query({
      query: () => "client/geography",
      providesTags: ["Geography"], // Related to "Geography" tagTypes.
    }),
    getSales: build.query({
      query: () => "sales/sales",
      providesTags: ["Sales"], // Related to "Sales" tagTypes.
    }),
    getAdmins: build.query({
      query: () => "management/admins",
      providesTags: ["Admins"], // Related to "Admins" tagTypes.
    }),
    getUserPerformance: build.query({
      query: (id) => `management/performance/${id}`,
      providesTags: ["Performance"], // Related to "Performance" tagTypes.
    }),
    getDashboard: build.query({
      query: () => "general/dashboard",
      providesTags: ["Dashboard"], // Related to "Dashboard" tagTypes.
    }),
  }),
});

// For Example,
// 'useGetUserQuery' is derived from 'getUser' in 'endpoints' (see 'api' above).
// 'getUser' is fitted with the prefix of 'use' and suffix of 'Query'.
export const {
  useGetUserQuery,
  useGetProductsQuery,
  useGetCustomersQuery,
  useGetTransactionsQuery,
  useGetGeographyQuery,
  useGetSalesQuery,
  useGetAdminsQuery,
  useGetUserPerformanceQuery,
  useGetDashboardQuery,
} = api;
