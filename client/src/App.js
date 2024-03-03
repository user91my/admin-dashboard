import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "theme";
import Layout from "scenes/layout";
import Dashboard from "scenes/dashboard";
import Products from "scenes/products";
import Customers from "scenes/customers";
import Transactions from "scenes/transactions";
import Geography from "scenes/geography";
import Overview from "scenes/overview";
import Daily from "scenes/daily";
import Monthly from "scenes/monthly";
import Breakdown from "scenes/breakdown";
import Admin from "scenes/admin";
import Performance from "scenes/performance";

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <div
      className="app"
      // style={{
      //   "& ::-webkit-scrollbar-track": {
      //     background: "#7a7f9d",
      //   },
      //   "& ::-webkit-scrollbar-thumb": {
      //     background: "#21295c",
      //   },
      //   "& ::-webkit-scrollbar-track:hover": {
      //     background: "#21295cb2",
      //   },
      // }}
    >
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            {/* Children routes nested within will have the */}
            {/* <Layout /> component as the main parent. */}
            {/* Therefore every child route page will have the */}
            {/* Navbar and the Sidebar. */}
            <Route element={<Layout />}>
              {/* The 'replace' attribute replaces the current entry in the history */}
              {/* stack with the new location specified in the 'to' prop. */}
              {/* i.e. If the user clicks the back button, they won't go back to the */}
              {/*      previous page ('/') that triggered the navigation to '/dashboard'. */}
              {/*      Instead, he'll be taken back to the page before the previous page. */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/geography" element={<Geography />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/daily" element={<Daily />} />
              <Route path="/monthly" element={<Monthly />} />
              <Route path="/breakdown" element={<Breakdown />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/performance" element={<Performance />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
