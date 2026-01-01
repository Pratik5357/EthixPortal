import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";
import AppLayout from "../components/layout/AppLayout";
import Login from "../feature/auth/Login";
import Home from "../feature/home/Home";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../feature/dashboard/Dashboard";
import Documents from "../feature/documents/Documents";
import CreateProposal from "../feature/proposals/CreateProposal";
import ProposalDetail from "../feature/proposals/ProposalDetail";
import Register from "../feature/auth/Register";
import DocumentDetail from "@/feature/documents/DocumentDetail";

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
          { path: "/proposals/new", element: <CreateProposal /> },
          { path: "/proposals/:id", element: <ProposalDetail /> },
          { path: "/documents/:id", element: <DocumentDetail /> },
        ]
      }
    ]
  }
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
