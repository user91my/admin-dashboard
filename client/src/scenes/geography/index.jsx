import React from "react";
import { Box, useTheme } from "@mui/material";
import { useGetGeographyQuery } from "state/api";
import Header from "components/Header";
import { ResponsiveChoropleth } from "@nivo/geo";
import { geoData } from "state/geoData";
import { useSelector } from "react-redux";

const Geography = () => {
  const theme = useTheme();
  const isSidebarOpen = useSelector((state) => state.global.isSidebarOpen);
  const mode = useSelector((state) => state.global.mode);

  // backend route:   "/client/geography"
  // data source:     "dataUser" from "server\data\index.js"
  // ---------------------------------------------------------
  const { data } = useGetGeographyQuery();

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="GEOGRAPHY" subtitle="Find where your users are located." />
      <Box
        mt="40px"
        width={isSidebarOpen ? "75vw" : "92.5vw"}
        height="75vh"
        border={`1px solid ${theme.palette.secondary[200]}`}
        borderRadius="4px"

        minWidth="1050px"
      >
        {data ? (
          <ResponsiveChoropleth
            data={data}
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
            features={geoData.features}
            margin={{ top: 0, right: 0, bottom: 0, left: -25 }}
            colors={mode === "dark" ? "RdBu" : "PRGn"} // Determines color scheme for map and legends.
            domain={[0, 60]} // Determines the min-max number range of the legends.
            unknownColor="#666666"
            label="properties.name"
            valueFormat=".2s"
            projectionScale={140}
            projectionTranslation={[0.45, 0.6]}
            projectionRotation={[0, 0, 0]}
            borderWidth={1.3}
            borderColor={mode === "dark" ? "#ffffff" : "#888888"}
            legends={[
              {
                anchor: "bottom-right",
                direction: "column",
                justify: true,
                translateX: -25,
                translateY: -125,
                itemsSpacing: 0,
                itemWidth: 94,
                itemHeight: 18,
                itemDirection: "left-to-right",
                itemTextColor: theme.palette.secondary[200],
                itemOpacity: 0.85,
                symbolSize: 18,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: theme.palette.secondary[50],
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

export default Geography;
