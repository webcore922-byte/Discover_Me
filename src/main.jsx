import { ThemeProvider } from "@material-tailwind/react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { setupApiInterceptor } from "./utils/apiInterceptor";
setupApiInterceptor();
createRoot(document.getElementById("root")).render(<BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>);
