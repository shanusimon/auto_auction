import { createRoot } from "react-dom/client";
import "./index.css";
import { AppProviders } from "./hooks/providers/AppProviders.tsx";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <AppProviders>
    <App />
  </AppProviders>
);
