import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { createTheme, ThemeProvider } from "smarthr-ui";
import { IntlProvider } from "react-intl";
import 'smarthr-ui/smarthr-ui.css'


const theme = createTheme()

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <IntlProvider locale="en">
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </IntlProvider>
  </React.StrictMode>
);
