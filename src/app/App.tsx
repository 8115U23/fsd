import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ThemeProvider } from "./providers/theme-provider";

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="life-platform-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
