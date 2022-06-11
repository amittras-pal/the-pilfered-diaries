import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter } from "react-router-dom";
import { NotificationsProvider } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <MantineProvider
        withNormalizeCSS
        withGlobalStyles
        defaultProps={{
          Button: { color: "orange" },
          Modal: {
            overlayBlur: 5,
            overlayColor: "#ABABAB",
            overlayOpacity: 0.5,
            overflow: "inside",
          },
          Drawer: {
            overlayBlur: 5,
            overlayColor: "#ABABAB",
            overlayOpacity: 0.5,
            overflow: "inside",
          },
          ScrollArea: {
            type: "scroll",
            scrollbarSize: 6,
            scrollHideDelay: 1500,
          },
        }}
        emotionOptions={{ key: "tpd" }}>
        <NotificationsProvider>
          <ModalsProvider>
            <App />
          </ModalsProvider>
        </NotificationsProvider>
      </MantineProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
