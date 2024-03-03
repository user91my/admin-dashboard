import React, { useMemo } from "react";
import { ResponsiveLine } from "@nivo/line";
import { useTheme, useMediaQuery } from "@mui/material";
import { useGetSalesQuery } from "state/api";
import { useSelector } from "react-redux";

const OverviewChart = ({ isDashboard = false, view }) => {
  const theme = useTheme();
  const isMinWidth1000px = useMediaQuery("(min-width: 1000px)");
  const isMinWidth525px = useMediaQuery("(min-width: 525px)");
  const isMinWidth450px = useMediaQuery("(min-width: 450px)");

  const monthMapObj = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12,
  };

  // backend route:   "/sales/sales"
  // data source:     "dataOverallStat" from "server\data\index.js"
  // ---------------------------------------------------------
  const { data, isLoading } = useGetSalesQuery();

  const mode = useSelector((state) => state.global.mode);

  // Data for the line charts (Sales and Units)
  // https://nivo.rocks/line/
  // Data structures for "totalSalesLine" and "totalUnitsLine" are
  // [ {...} , {...} ] RESPECTIVELY.
  const [totalSalesLine, totalUnitsLine] = useMemo(() => {
    if (!data) return [];

    const { monthlyData } = data;

    // Initial setup for "totalSalesLine" and "totalUnitsLine" objects.
    const totalSalesLine = {
      id: "totalSales",
      color: theme.palette.secondary.main,
      data: [],
    };
    const totalUnitsLine = {
      id: "totalUnits",
      color: theme.palette.secondary[600],
      data: [],
    };

    Object.values(monthlyData).reduce(
      (acc, { month, totalSales, totalUnits }) => {
        // Cumulatively add the sales and units figures respectively.
        const curSales = acc.sales + totalSales;
        const curUnits = acc.units + totalUnits;

        totalSalesLine.data = [
          ...totalSalesLine.data,
          { x: month, y: curSales },
        ];
        totalUnitsLine.data = [
          ...totalUnitsLine.data,
          { x: month, y: curUnits },
        ];

        return { sales: curSales, units: curUnits };
      },
      { sales: 0, units: 0 }
    );

    // returns [ [ {...} , {...} ] , [ {...} , {...} ] ]
    return [[totalSalesLine], [totalUnitsLine]];
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!data || isLoading) return "Loading";

  return (
    <ResponsiveLine
      data={view === "sales" ? totalSalesLine : totalUnitsLine}
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
      // Allows us to use the 'color' properties value inside 'formattedData' (specifically 'totalSalesLine' and 'totalUnitsLine' objects).
      // 'datum' represents every sub-object element inside the main 'totalSalesLine' and 'totalUnitsLine' objects.
      colors={{ datum: "color" }}
      margin={
        isDashboard
          ? isMinWidth450px
            ? { top: 15, right: 30, bottom: 50, left: 60 }
            : { top: 15, right: 20, bottom: 35, left: 60 }
          : { top: 15, right: 50, bottom: 50, left: 70 }
      }
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: false,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="catmullRom" // Curved graph line
      enableArea={isDashboard} // Whether or not to shade the area formed by the line graph.
      areaBaselineValue={100000} // The lower bound level (x-axis level) of the shaded area
      axisTop={null}
      axisRight={null}
      axisBottom={{
        // Shortens the labels on the x-axis (when in dashboard)
        format: (v) => {
          if (isDashboard)
            return isMinWidth450px ? v.slice(0, 3) : v.slice(0, 0);
          return isMinWidth1000px
            ? v
            : isMinWidth525px
            ? v.slice(0, 3)
            : monthMapObj[v];
        },
        tickSize: isMinWidth450px ? 5 : 0,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard
          ? "Total Revenue During The Year (Cumulative)"
          : "Month",
        legendOffset: isDashboard ? (isMinWidth450px ? 43 : 20) : 45,
        legendPosition: "middle",
      }}
      axisLeft={{
        tickValues: 5, // Determines the number of ticks on the y-axis.
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard
          ? ""
          : `Total ${view === "sales" ? "Revenue" : "Units"} for Year`,
        legendOffset: -65,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={
        !isDashboard
          ? [
              {
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 30,
                translateY: -40,
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]
          : undefined
      }
    />
  );
};

export default OverviewChart;
