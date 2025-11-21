import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { getRouteConfig } from "./route.utils";
import Root from "@/layouts/Root";
import Layout from "@/components/organisms/Layout";

// Lazy load all page components
const Discover = lazy(() => import("@/components/pages/Discover"));
const Library = lazy(() => import("@/components/pages/Library"));
const ReadingLists = lazy(() => import("@/components/pages/ReadingLists"));
const Following = lazy(() => import("@/components/pages/Following"));
const Write = lazy(() => import("@/components/pages/Write"));
const NewStory = lazy(() => import("@/components/pages/NewStory"));
const StoryDetail = lazy(() => import("@/components/pages/StoryDetail"));
const ChapterRead = lazy(() => import("@/components/pages/ChapterRead"));
const StoryEdit = lazy(() => import("@/components/pages/StoryEdit"));
const NotificationCenter = lazy(() => import("@/components/pages/NotificationCenter"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));
const Login = lazy(() => import("@/components/pages/Login"));
const Signup = lazy(() => import("@/components/pages/Signup"));
const Callback = lazy(() => import("@/components/pages/Callback"));
const ErrorPage = lazy(() => import("@/components/pages/ErrorPage"));
const ResetPassword = lazy(() => import("@/components/pages/ResetPassword"));
const PromptPassword = lazy(() => import("@/components/pages/PromptPassword"));
const createRoute = ({
  path,
  index,
  element,
  access,
  children,
  ...meta
}) => {
  // Get config for this route
  let configPath;
  if (index) {
    configPath = "/";
  } else {
    configPath = path.startsWith('/') ? path : `/${path}`;
  }

  const config = getRouteConfig(configPath);
  const finalAccess = access || config?.allow;

  const route = {
    ...(index ? { index: true } : { path }),
    element: element ? <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  </div>}>{element}</Suspense> : element,
    handle: {
      access: finalAccess,
      ...meta,
    },
  };

  if (children && children.length > 0) {
    route.children = children;
  }

  return route;
};

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
        <p className="text-secondary font-ui">Preparing your reading experience...</p>
      </div>
    </div>
  </div>
)

// Wrap components with Suspense
const withSuspense = (Component) => (props) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component {...props} />
  </Suspense>
)

const mainRoutes = [
  createRoute({
    path: "",
    index: true,
    element: <Discover />
  }),
  createRoute({
    path: "library",
    element: <Library />
  }),
  createRoute({
    path: "reading-lists", 
    element: <ReadingLists />
  }),
  createRoute({
    path: "following",
    element: <Following />
  }),
  createRoute({
    path: "write",
    element: <Write />
  }),
  createRoute({
    path: "write/new",
    element: <NewStory />
  }),
  createRoute({
    path: "story/:id",
    element: <StoryDetail />
  }),
  createRoute({
    path: "story/:storyId/chapter/:chapterId",
    element: <ChapterRead />
  }),
  createRoute({
    path: "story/:id/edit",
    element: <StoryEdit />
  }),
  createRoute({
    path: "notifications",
    element: <NotificationCenter />
  }),
  createRoute({
    path: "*",
    element: <NotFound />
  })
]

const authRoutes = [
  createRoute({
    path: "login",
    element: <Login />
  }),
  createRoute({
    path: "signup", 
    element: <Signup />
  }),
  createRoute({
    path: "callback",
    element: <Callback />
  }),
  createRoute({
    path: "error",
    element: <ErrorPage />
  }),
  createRoute({
    path: "prompt-password/:appId/:emailAddress/:provider",
    element: <PromptPassword />
  }),
  createRoute({
    path: "reset-password/:appId/:fields",
    element: <ResetPassword />
  })
]

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: mainRoutes
      },
      ...authRoutes
    ]
  }
])