import { RouterProvider } from "react-router-dom";
import { router } from "./routes.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
