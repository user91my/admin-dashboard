import React, { useMemo, useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Header from "components/Header";
import { ResponsiveLine } from "@nivo/line";
import { useGetSalesQuery } from "state/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // This css import is required for "react-datepicker"
import { useSelector } from "react-redux";

const Daily = () => {
  const theme = useTheme();
  const isMinWidth1600px = useMediaQuery("(min-width: 1600px)");
  const isMinWidth1100px = useMediaQuery("(min-width: 1100px)");
  const isMinWidth1000px = useMediaQuery("(min-width: 1000px)");
  const isMinWidth750px = useMediaQuery("(min-width: 750px)");
  const isMinWidth625px = useMediaQuery("(min-width: 625px)");
  const isMinWidth525px = useMediaQuery("(min-width: 525px)");

  const [startDate, setStartDate] = useState(new Date("2023-05-01"));
  const [endDate, setEndDate] = useState(
    isMinWidth525px ? new Date("2023-05-31") : new Date("2023-05-15")
  );

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

    const { dailyData } = data;

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

    Object.values(dailyData).forEach(({ date, totalSales, totalUnits }) => {
      const dateFormatted = new Date(date);

      // 'dateFormatted' has to be equal or between "startDate" and "endDate".
      if (dateFormatted >= startDate && dateFormatted <= endDate) {
        // Grabs the string portion of the date after the dash ("-").
        // (e.g. "2021-01-02" becomes "01-02")
        const splitDate = date.substring(date.indexOf("-") + 1);

        // {id: 'totalSales', color: '#ffe3a3', data: Array(30)}
        totalSalesLine.data = [
          ...totalSalesLine.data,
          { x: splitDate, y: totalSales },
        ];
        // {id: 'totalUnits', color: '#cca752', data: Array(30)}
        totalUnitsLine.data = [
          ...totalUnitsLine.data,
          { x: splitDate, y: totalUnits },
        ];
      }
    });

    // [ {...} , {...} ]
    const formattedData = [totalSalesLine, totalUnitsLine];

    // returns [ {...} , {...} ]
    return formattedData;
  }, [data, startDate, endDate]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box
      m="1.5rem 2rem"
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
      minWidth="300px"
    >
      <Header
        title="DAILY SALES"
        subtitle="Chart of daily sales"
        display={isMinWidth525px ? undefined : "flex"}
        flexDirection={isMinWidth525px ? undefined : "column"}
        alignItems={isMinWidth525px ? undefined : "center"}
      />
      <Box mt="1.25rem" height="75vh">
        <Box
          display="flex"
          flexDirection={isMinWidth525px ? "flex" : "column"}
          justifyContent={isMinWidth525px ? "flex-end" : undefined}
          alignItems={isMinWidth525px ? undefined : "center"}
          gap="0.2rem"
        >
          From&nbsp;
          <Box>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
            />
          </Box>
          &nbsp;to&nbsp;
          <Box>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
            />
          </Box>
        </Box>

        {data ? (
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
            curve="catmullRom" // Curved graph line
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: isMinWidth625px ? 5 : 0,
              tickPadding: 5,
              tickRotation: 90, // x-axis ticks rotated
              legend: "Days",
              legendOffset: isMinWidth625px ? 60 : 25,
              legendPosition: "middle",
              format: (v) => {
                if (!isMinWidth625px) return "";
                return v;
              },
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
            pointSize={isMinWidth625px ? 10 : 5}
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

export default Daily;
