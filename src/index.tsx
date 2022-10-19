import * as React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

const rootElement: HTMLDivElement = document.createElement("div");
document.body.appendChild(rootElement);

const root = createRoot(rootElement);
rootElement.id = "root";
root.render(<App />);
