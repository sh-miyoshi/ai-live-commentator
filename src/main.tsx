import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { createTheme, ThemeProvider } from "smarthr-ui";
import 'smarthr-ui/smarthr-ui.css'

const theme = createTheme()

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
