Live site URL :-
https://admin-dashboard-client-seven.vercel.app/dashboard

## OVERVIEW

- An admin dashboard app with tables and graphs.
- There are buttons throughout the application that are merely placeholders (i.e. just for visual appearance) and have no functionality.

## KNOWN ISSUES/LIMITATIONS

### Transactions search Bar ("URL/transactions") :-

- Inputs in the search bar will only be matched to data in the "User ID" and "Cost" columns (see "getTransactions()" in "server\controllers\client.js")

### Choropleth Map ("URL/geography") :-

- The map in "/geography" route has very limited interactivity (i.e. no zoom-in/zoom-out and no dynamic scrolling) unlike proper map applications like leaflet-js.
