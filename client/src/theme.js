// The sample color palette (below) is generated using "Tailwind Shades"
// vscode extension. Highlight the initial color base (i.e. #fb1b04 in this case)
// and then hit ; "ctrl+k ctrl+g".
// ------------------------------------------------------------------
// red: {
//    100: "#fed1cd", // very light red
//    200: "#fda49b",
//    300: "#fd7668", // light red
//    400: "#fc4936",
//    500: "#fb1b04", // red
//    600: "#c91603",
//    700: "#971002", // dark red
//    800: "#640b02", // very dark red
//    900: "#320501", // near black
// },

// color design tokens export
export const tokensDark = {
  grey: {
    0: "#ffffff", // white (manually adjusted)
    10: "#f6f6f6", // manually adjusted
    50: "#f0f0f0", // very light grey (manually adjusted)
    100: "#e0e0e0",
    200: "#c2c2c2", // light grey
    300: "#a3a3a3",
    400: "#858585", // grey
    500: "#666666",
    600: "#525252",
    700: "#3d3d3d", // very dark grey
    800: "#292929",
    900: "#141414",
    1000: "#000000", // black (manually adjusted)
  },
  primary: {
    // BLUE
    // -----
    100: "#d3d4de", // light greyish blue
    200: "#a6a9be",
    300: "#7a7f9d", // greyish blue
    400: "#4d547d",
    500: "#21295c", // dark greyish blue
    600: "#191F45", // very dark greyish blue (manually adjusted)
    700: "#141937",
    800: "#0d1025", // near black
    900: "#070812", // black
  },
  secondary: {
    // YELLOW
    // -------
    50: "#f0f0f0", // light grey (manually adjusted)
    100: "#fff6e0",
    200: "#ffedc2", // very light orangy yellow
    300: "#ffe3a3",
    400: "#ffda85", // light orangy yellow
    500: "#ffd166", // orangy yellow
    600: "#cca752",
    700: "#997d3d", // dark orangy yellow
    800: "#665429",
    900: "#332a14", // very dark orangy yellow
  },
};

// function that reverses the color palette
function reverseTokens(tokensDark) {
  const reversedTokens = {};
  // 'Object.entries(targetObj)' returns an array consisting of sub-arrays.
  // Each sub-array contains a key and value of 'targetObj'.
  // The structure of the returned array is as the following :-
  //     [ [key1, value1] , [key2, value2] , ... ]
  Object.entries(tokensDark).forEach(([key, val]) => {
    const keys = Object.keys(val); // [50, 100, 200, ...]
    const values = Object.values(val); // ["#f6f6f6", "#e7e7e7", ...]
    const length = keys.length;
    const reversedObj = {};
    for (let i = 0; i < length; i++) {
      reversedObj[keys[i]] = values[length - i - 1];
    }
    reversedTokens[key] = reversedObj;
  });
  return reversedTokens;
}
export const tokensLight = reverseTokens(tokensDark);

// mui theme settings
// https://mui.com/material-ui/customization/palette/
export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              ...tokensDark.primary,
              main: tokensDark.primary[400],
              light: tokensDark.primary[400],
            },
            secondary: {
              ...tokensDark.secondary,
              main: tokensDark.secondary[300],
            },
            neutral: {
              ...tokensDark.grey,
              main: tokensDark.grey[500],
            },
            background: {
              default: tokensDark.primary[600],
              alt: tokensDark.primary[500],
            },
          }
        : {
            // palette values for light mode
            primary: {
              ...tokensLight.primary,
              main: tokensDark.grey[50],
              light: tokensDark.grey[100],
            },
            secondary: {
              ...tokensLight.secondary,
              main: tokensDark.secondary[600],
              light: tokensDark.secondary[700],
            },
            neutral: {
              ...tokensLight.grey,
              main: tokensDark.grey[500],
            },
            background: {
              default: tokensDark.grey[0],
              alt: tokensDark.grey[50],
            },
          }),
    },
    typography: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};
