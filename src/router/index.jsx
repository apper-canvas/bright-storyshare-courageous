import React, { lazy, Suspense } from "react"
import { createBrowserRouter } from "react-router-dom"
import Layout from "@/components/organisms/Layout"

// Lazy load all page components
const Discover = lazy(() => import("@/components/pages/Discover"))
const Library = lazy(() => import("@/components/pages/Library"))
const ReadingLists = lazy(() => import("@/components/pages/ReadingLists"))
const Following = lazy(() => import("@/components/pages/Following"))
const Write = lazy(() => import("@/components/pages/Write"))
const StoryDetail = lazy(() => import("@/components/pages/StoryDetail"))
const ChapterRead = lazy(() => import("@/components/pages/ChapterRead"))
const NewStory = lazy(() => import("@/components/pages/NewStory"))
const StoryEdit = lazy(() => import("@/components/pages/StoryEdit"))
const NotificationCenter = lazy(() => import("@/components/pages/NotificationCenter"))
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
    path: "reading-lists",
    element: withSuspense(ReadingLists)()
  },
{
    path: "following",
    element: withSuspense(Following)()
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
    path: "notifications",
    element: (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-4">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      </div>}>
        <NotificationCenter />
      </Suspense>
    )
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