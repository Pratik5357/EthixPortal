import React, { Suspense } from "react";
import { useAuth } from "../../context/AuthContext";

const ResearcherDashboard = React.lazy(() => import("./ResearcherDashboard"));
const ReviewerDashboard = React.lazy(() => import("./ReviewerDashboard"));
const AdminDashboard = React.lazy(() => import("./AdminDashboard"));
const ScrutinyDashboard = React.lazy(() => import("./ScrutinyDashboard"));

export default function Dashboard() {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case "researcher":
        return <ResearcherDashboard />;

      case "reviewer":
        return <ReviewerDashboard />;

      case "admin":
        return <AdminDashboard />;

      case "scrutiny":
        return <ScrutinyDashboard />;

      default:
        return (
          <div className="space-y-2">
            <h1 className="text-2xl">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome{user?.name ? `, ${user.name}` : ""}.
            </p>
          </div>
        );
    }
  };

  return (
    <Suspense
      fallback={
        <div className="py-12 text-muted-foreground">
          Loading dashboard…
        </div>
      }
    >
      {renderDashboard()}
    </Suspense>
  );
}