import React, { useMemo } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Header from "components/Header";
import { ResponsiveLine } from "@nivo/line";
import { useGetSalesQuery } from "state/api";
import { useSelector } from "react-redux";

const Monthly = () => {
  const theme = useTheme();
  const isMinWidth1600px = useMediaQuery("(min-width: 1600px)");
  const isMinWidth1100px = useMediaQuery("(min-width: 1100px)");
  const isMinWidth1000px = useMediaQuery("(min-width: 1000px)");
  const isMinWidth750px = useMediaQuery("(min-width: 750px)");
  const isMinWidth525px = useMediaQuery("(min-width: 525px)");

  const mode = useSelector((state) => state.global.mode);
  const isSidebarOpen = useSelector((state) => state.global.isSidebarOpen);

  // backend route:   "/sales/sales"
  // data source:     "dataOverallStat" from "server\data\index.js"
  // ----------------------------------------------------------------
  const { data } = useGetSalesQuery();

  // Data for the line charts (Sales and Units)
  // https://nivo.rocks/line/
  // 'formattedData' structure is [ {...} , {...} ]
  const formattedData = useMemo(() => {
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

    Object.values(monthlyData).forEach(({ month, totalSales, totalUnits }) => {
      // {id: 'totalSales', color: '#ffe3a3', data: Array(12)}
      totalSalesLine.data = [
        ...totalSalesLine.data,
        { x: month, y: totalSales },
      ];
      // {id: 'totalUnits', color: '#cca752', data: Array(12)}
      totalUnitsLine.data = [
        ...totalUnitsLine.data,
        { x: month, y: totalUnits },
      ];
    });

    // [ {...} , {...} ]
    const formattedData = [totalSalesLine, totalUnitsLine];

    // returns [ {...} , {...} ]
    return formattedData;
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box
      m="1.5rem 2.5rem"
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
            : "85vw"
          : isMinWidth1600px
          ? "93vw"
          : isMinWidth1000px
          ? "90vw"
          : isMinWidth750px
          ? "87.5vw"
          : "85vw"
      }
    >
      <Header
        title="MONTHLY SALES"
        subtitle="Chart of monthly sales"
        display={isMinWidth525px ? undefined : "flex"}
        flexDirection={isMinWidth525px ? undefined : "column"}
        alignItems={isMinWidth525px ? undefined : "center"}
      />
      <Box height="75vh">
        {data ? (
          // Line Chart Element
          // https://nivo.rocks/line/
          <ResponsiveLine
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
                  color:
                    mode === "dark" ? theme.palette.primary.main : "#888888",
                },
              },
            }}
            // Allows us to use the 'color' properties value inside 'formattedData' (specifically 'totalSalesLine' and 'totalUnitsLine' objects).
            // 'datum' represents every sub-object element inside the main 'totalSalesLine' and 'totalUnitsLine' objects.
            colors={{ datum: "color" }}
            margin={{ top: 50, right: 50, bottom: 70, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: false,
              reverse: false,
            }}
            yFormat=" >-.2f"
            // curve="catmullRom" // Curved graph line
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 90,
              legend: "Month",
              legendOffset: 60,
              legendPosition: "middle",
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Total",
              legendOffset: -50,
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
            legends={[
              {
                anchor: "top-right",
                direction: "column",
                justify: false,
                translateX: 50,
                translateY: 0,
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
            ]}
          />
        ) : (
          <>Loading...</>
        )}
      </Box>
    </Box>
  );
};

export default Monthly;
