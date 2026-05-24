import React from "react";
import ReactDOM from "react-dom/client";
import { getCurrentWindow } from "@tauri-apps/api/window";
import RecordingOverlay from "./RecordingOverlay";
import SpeakingOverlay from "./SpeakingOverlay";
import "@/i18n";

const windowLabel = getCurrentWindow().label;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {windowLabel === "speaking_overlay" ? <SpeakingOverlay /> : <RecordingOverlay />}
  </React.StrictMode>,
);
