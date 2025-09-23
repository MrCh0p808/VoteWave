import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout.tsx";
import DashboardHome from "./pages/DashboardHome";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardHome /> }, // 👈 default page
      { path: "mypolls", element: <div className="p-6">📊 My Polls Page</div> },
      { path: "toppolls", element: <div className="p-6">🔥 Top Polls Page</div> },
      { path: "repost", element: <div className="p-6">🔁 Repost Page</div> },
      { path: "analytics", element: <div className="p-6">📈 Analytics Page</div> },
      { path: "settings", element: <div className="p-6">⚙️ Settings Page</div> },
    ],
  },
]);

