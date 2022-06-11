import React from "react";
import { Route, Routes } from "react-router-dom";
import NotFound from "../components/NotFound";
import Home from "../pages/Home/Home";
import Profile from "../pages/Profile/Profile";
import StoryDetails from "../pages/Stories/StoryDetails";
import RouteGuard from "./RouteGuard";

const RouterOutlet: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/story/:id" element={<StoryDetails />} />
      <Route
        path="/profile"
        element={
          <RouteGuard>
            <Profile />
          </RouteGuard>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RouterOutlet;
