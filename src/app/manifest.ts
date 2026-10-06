import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "¡Habla! — Learn Mexican Spanish",
    short_name: "¡Habla!",
    description: "A structured Spanish course with real vocabulary, explicit grammar, listening and spaced repetition.",
    start_url: "/",
    display: "standalone",
    background_color: "#fdf8f0",
    theme_color: "#0a7c82",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
