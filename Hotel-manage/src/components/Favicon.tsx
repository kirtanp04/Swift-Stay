import ReactDOMServer from "react-dom/server";
import { FaviconIcon } from "src/assets/iconify";

const setFavicon = () => {
  const svgString = ReactDOMServer.renderToString(<FaviconIcon />);
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("link");
  link.rel = "icon";
  link.href = url;
  link.type = "image/svg+xml";

  const head = document.querySelector("head");
  const existingLink = head!.querySelector('link[rel="icon"]');

  if (existingLink) {
    head!.removeChild(existingLink);
  }

  head!.appendChild(link);
};

export default setFavicon;
