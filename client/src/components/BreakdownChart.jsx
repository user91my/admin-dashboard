import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useGetSalesQuery } from "state/api";
import { useSelector } from "react-redux";

const BreakdownChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const isMinHeight900px = useMediaQuery("(min-height: 900px)");
  const isMinWidth600px = useMediaQuery("(min-width: 600px)");
  const isMinWidth450px = useMediaQuery("(min-width: 450px)");
  const isMinWidth525px = useMediaQuery("(min-width: 525px)");

  // backend route:   "/sales/sales"
  // data source:     "dataOverallStat" from "server\data\index.js"
  // ---------------------------------------------------------------
  const { data, isLoading } = useGetSalesQuery();
  const mode = useSelector((state) => state.global.mode);

  if (!data || isLoading) return "Loading...";

  const colors = [
    theme.palette.secondary[500],
    theme.palette.secondary[300],
    theme.palette.secondary[300],
    theme.palette.secondary[500],
  ];

  // Data for the pie chart
  // https://nivo.rocks/pie/
  // 'formattedData' structure is [ {…}, {…}, {…}, {…} ]
  const formattedData = Object.entries(data.salesByCategory).map(
    ([category, sales], i) => ({
      id: category,
      label: category,
      value: sales,
      color: colors[i],
    })
  );

  return (
    <Box
      height={isDashboard ? (isMinWidth450px ? "300px" : "400px") : "100%"}
      width={undefined}
      minHeight={isDashboard ? "325px" : "525px"}
      minWidth={isDashboard ? "325px" : "300px"}
      position="relative"
    >
      {/* Pie Chart Element */}
      {/* https://nivo.rocks/pie/ */}
      <ResponsivePie
        data={formattedData}
        // Nivo's theming guide :-
        // https://nivo.rocks/guides/theming/
        theme={{
          axis: {
            domain: {
              line: {
                stroke: theme.palette.secondary[200],
              },
            },
            legend: {
              text: {
                fill: theme.palette.secondary[200],
              },
            },
            ticks: {
              line: {
                stroke: theme.palette.secondary[200],
                strokeWidth: 1,
              },
              text: {
                fill: theme.palette.secondary[200],
              },
            },
          },
          legends: {
            text: {
              fill: theme.palette.secondary[200],
            },
          },
          tooltip: {
            container: {
              color: mode === "dark" ? theme.palette.primary.main : "#888888",
            },
          },
        }}
        colors={{ datum: "data.color" }}
        margin={
          isDashboard
            ? { top: 40, right: 80, bottom: 100, left: 50 }
            : isMinWidth525px
            ? { top: 40, right: 110, bottom: 90, left: 110 }
            : { top: 0, right: 25, bottom: 120, left: 25 }
        }
        sortByValue={true} // sort table basing on how big the values are.
        innerRadius={isMinWidth600px ? 0.45 : isMinWidth525px ? 0.375 : 0.3}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        enableArcLinkLabels={!isDashboard && isMinWidth525px}
        arcLinkLabelsTextOffset={isMinWidth525px ? 6 : 0} // distance between label and label line
        arcLinkLabelsTextColor={theme.palette.secondary[200]}
        arcLinkLabelsThickness={isMinWidth525px ? 2 : 0} // thickness of label line
        arcLinkLabelsStraightLength={isMinWidth525px ? 15 : 0} // length of label line
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        legends={[
          {
            anchor: "bottom",
            direction: isMinWidth450px ? "row" : "column",
            justify: false,
            translateX: isDashboard ? (isMinWidth450px ? 30 : 85) : 0,
            translateY: isDashboard ? (isMinWidth450px ? 50 : 70) : 90,
            itemsSpacing: 5,
            itemWidth: 85,
            itemHeight: 18,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: theme.palette.primary[500],
                },
              },
            ],
          },
        ]}
      />

      {/* Total sales figure at center of pie chart */}
      <Box
        position="absolute"
        top="50%"
        left="50%"
        color={theme.palette.secondary[400]}
        textAlign="center"
        pointerEvents="none"
        sx={{
          transform: isDashboard
            ? "translate(-75%, -170%)" // translate(x,y)
            : isMinWidth600px
            ? "translate(-50%, -140%)"
            : isMinWidth525px
            ? "translate(-50%, -105%)"
            : isMinWidth450px
            ? "translate(-50%, -175%)"
            : isMinHeight900px
            ? "translate(-50%, 275%)"
            : "translate(-50%, -595%)",
        }}
      >
        {!isDashboard && (
          <Box
            display="flex"
            flexDirection={isMinWidth600px ? "flex" : "column"}
            // mt={isMinWidth600px ? undefined : isMinWidth525px ? "-50px" : "-85px"}
            gap="3px"
          >
            <Typography variant="h6">Total :</Typography>
            <Typography variant="h6">${data.yearlySalesTotal}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BreakdownChart;
