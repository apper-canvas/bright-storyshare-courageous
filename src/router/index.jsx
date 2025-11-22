import React, { lazy, Suspense } from "react"
import { createBrowserRouter } from "react-router-dom"
import { getRouteConfig } from './route.utils'
import Root from '@/layouts/Root'
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
const Login = lazy(() => import("@/components/pages/Login"))
const Signup = lazy(() => import("@/components/pages/Signup"))
const Callback = lazy(() => import("@/components/pages/Callback"))
const ErrorPage = lazy(() => import("@/components/pages/ErrorPage"))

// Loading fallback component
const LoadingSpinner = () => (
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

// createRoute helper
const createRoute = ({ path, index, element, access, children, ...meta }) => {
  const configPath = index ? "/" : (path?.startsWith('/') ? path : `/${path}`)
  const config = getRouteConfig(configPath)
  const finalAccess = access || config?.allow
  
  return {
    ...(index ? { index: true } : { path }),
    element: element ? <Suspense fallback={<LoadingSpinner />}>{element}</Suspense> : element,
    handle: { access: finalAccess, ...meta },
    ...(children && { children })
  }
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      // Auth routes
      createRoute({
        path: 'login',
        element: <Login />,
        title: 'Login'
      }),
      createRoute({
        path: 'signup', 
        element: <Signup />,
        title: 'Sign Up'
      }),
      createRoute({
        path: 'callback',
        element: <Callback />,
        title: 'Authentication Callback'
      }),
      createRoute({
        path: 'error',
        element: <ErrorPage />,
        title: 'Error'
      }),
      
      // Main app with Layout
      {
        path: '',
        element: <Layout />,
        children: [
          createRoute({
            index: true,
            element: <Discover />,
            title: 'Discover'
          }),
          createRoute({
            path: 'library',
            element: <Library />,
            title: 'Library'
          }),
          createRoute({
            path: 'reading-lists',
            element: <ReadingLists />,
            title: 'Reading Lists'
          }),
          createRoute({
            path: 'following',
            element: <Following />,
            title: 'Following'
          }),
          createRoute({
            path: 'write',
            element: <Write />,
            title: 'Write'
          }),
          createRoute({
            path: 'write/new',
            element: <NewStory />,
            title: 'New Story'
          }),
          createRoute({
            path: 'story/:id',
            element: <StoryDetail />,
            title: 'Story Details'
          }),
          createRoute({
            path: 'story/:storyId/chapter/:chapterId',
            element: <ChapterRead />,
            title: 'Read Chapter'
          }),
          createRoute({
            path: 'story/:id/edit',
            element: <StoryEdit />,
            title: 'Edit Story'
          }),
          createRoute({
            path: 'notifications',
            element: <NotificationCenter />,
            title: 'Notifications'
          }),
          createRoute({
            path: '*',
            element: <NotFound />,
            title: 'Not Found'
          })
        ]
      }
    ]
  }
])