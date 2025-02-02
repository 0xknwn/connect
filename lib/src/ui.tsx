import { createRoot } from "react-dom/client";
import { InjectedReact } from "@0xknwn/connect-ui";

export const injectUI = async () => {
  const app = document.createElement("div");
  app.setAttribute("id", "app");
  document.body.prepend(app);
  const root = createRoot(app);
  root.render(<InjectedReact />);
};
