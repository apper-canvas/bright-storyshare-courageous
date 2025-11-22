import React, { lazy, Suspense } from "react"
import { createBrowserRouter } from "react-router-dom"
import Layout from "@/components/organisms/Layout"

// Lazy load all page components
const Discover = lazy(() => import("@/components/pages/Discover"))
const Library = lazy(() => import("@/components/pages/Library"))
const Write = lazy(() => import("@/components/pages/Write"))
const StoryDetail = lazy(() => import("@/components/pages/StoryDetail"))
const ChapterRead = lazy(() => import("@/components/pages/ChapterRead"))
const NewStory = lazy(() => import("@/components/pages/NewStory"))
const StoryEdit = lazy(() => import("@/components/pages/StoryEdit"))
const NotFound = lazy(() => import("@/components/pages/NotFound"))

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
  {
    path: "",
    index: true,
    element: withSuspense(Discover)()
  },
  {
    path: "library",
    element: withSuspense(Library)()
  },
  {
    path: "write",
    element: withSuspense(Write)()
  },
  {
    path: "write/new",
    element: withSuspense(NewStory)()
  },
  {
    path: "story/:id",
    element: withSuspense(StoryDetail)()
  },
  {
    path: "story/:storyId/chapter/:chapterId",
    element: withSuspense(ChapterRead)()
  },
  {
    path: "story/:id/edit",
    element: withSuspense(StoryEdit)()
  },
  {
    path: "*",
    element: withSuspense(NotFound)()
  }
]

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: mainRoutes
  }
]

export const router = createBrowserRouter(routes)