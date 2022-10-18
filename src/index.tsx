import * as React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

const rootElement: HTMLDivElement = document.createElement("div");
rootElement.id = "root";
document.body.appendChild(rootElement);

const root = createRoot(rootElement);
root.render(<App />);
