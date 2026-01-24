import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";
import AppLayout from "../components/layout/AppLayout";
import Login from "../feature/auth/Login";
import Home from "../feature/home/Home";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../feature/dashboard/Dashboard";
import Documents from "../feature/documents/Documents";
import Register from "../feature/auth/Register";
import DocumentDetail from "@/feature/documents/DocumentDetail";
import ProposalWizard from "@/feature/proposals/ProposalWizard";

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> }
    ]
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/", element: <Home /> },
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/documents", element: <Documents /> },
          { path: "/proposals/new", element: <ProposalWizard /> },
          { path: "/proposals/:id/Edit", element: <ProposalWizard /> },
          { path: "/proposals/:id", element: <DocumentDetail /> },
          { path: "/documents/:id", element: <DocumentDetail /> },
        ]
      }
    ]
  }
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
