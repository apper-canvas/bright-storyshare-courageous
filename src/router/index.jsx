import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/organisms/Layout";
import NewStory from "@/components/pages/NewStory";
import ChapterRead from "@/components/pages/ChapterRead";

// Lazy load all page components
const Discover = lazy(() => import("@/components/pages/Discover"));
const Library = lazy(() => import("@/components/pages/Library"));
const ReadingLists = lazy(() => import("@/components/pages/ReadingLists"));
const Write = lazy(() => import("@/components/pages/Write"));
const StoryDetail = lazy(() => import("@/components/pages/StoryDetail"));
const AuthorDashboard = lazy(() => import("@/components/pages/AuthorDashboard"));
const StoryEdit = lazy(() => import("@/components/pages/StoryEdit"));
const NotificationCenter = lazy(() => import("@/components/pages/NotificationCenter"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-surface">
    <div className="text-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-accent/30 rounded-full animate-spin" style={{animationDirection: "reverse", animationDuration: "1.5s"}}></div>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-display text-primary">Loading StoryShare</h3>
        <p className="text-sm text-text/70">Preparing your reading experience...</p>
      </div>
    </div>
  </div>
);

// Wrap components with Suspense
const withSuspense = (Component) => (props) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component {...props} />
  </Suspense>
);

const mainRoutes = [
  {
    path: "",
    index: true,
    element: withSuspense(Discover)
  },
  {
    path: "library",
    element: withSuspense(Library)
  },
{
    path: "reading-lists",
    element: withSuspense(ReadingLists)
  },
  {
    path: "write",
    element: withSuspense(Write)
  },
  {
    path: "write/new",
    element: <NewStory />
  },
  {
    path: "dashboard",
    element: withSuspense(AuthorDashboard)
  },
  {
    path: "story/:id",
    element: withSuspense(StoryDetail)
  },
  {
    path: "story/:storyId/chapter/:chapterId",
    element: <ChapterRead />
  },
  {
    path: "story/:id/edit",
    element: withSuspense(StoryEdit)
  },
  {
    path: "notifications",
    element: withSuspense(NotificationCenter)
  },
  {
    path: "*",
    element: withSuspense(NotFound)
  }
];

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: mainRoutes
  }
];

export const router = createBrowserRouter(routes);