import React, { lazy, Suspense } from "react"
import { createBrowserRouter } from "react-router-dom"
import { getRouteConfig } from "./route.utils"
import Root from "@/layouts/Root"
import Layout from "@/components/organisms/Layout"

// Lazy load all page components
const Discover = lazy(() => import("@/components/pages/Discover"))
const StoryDetail = lazy(() => import("@/components/pages/StoryDetail"))
const ChapterRead = lazy(() => import("@/components/pages/ChapterRead"))
const Write = lazy(() => import("@/components/pages/Write"))
const NewStory = lazy(() => import("@/components/pages/NewStory"))
const StoryEdit = lazy(() => import("@/components/pages/StoryEdit"))
const Library = lazy(() => import("@/components/pages/Library"))
const ReadingLists = lazy(() => import("@/components/pages/ReadingLists"))
const NotificationCenter = lazy(() => import("@/components/pages/NotificationCenter"))
const Following = lazy(() => import("@/components/pages/Following"))
const Login = lazy(() => import("@/components/pages/Login"))
const Signup = lazy(() => import("@/components/pages/Signup"))
const Callback = lazy(() => import("@/components/pages/Callback"))
const ErrorPage = lazy(() => import("@/components/pages/ErrorPage"))
const ResetPassword = lazy(() => import("@/components/pages/ResetPassword"))
const PromptPassword = lazy(() => import("@/components/pages/PromptPassword"))
const NotFound = lazy(() => import("@/components/pages/NotFound"))

// Loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin h-12 w-12 border-4 border-accent border-t-transparent rounded-full" />
  </div>
)

// createRoute helper for access control and lazy loading
const createRoute = ({ path, index, element, access, children, ...meta }) => {
  // Determine config path (handle index routes)
  const configPath = index ? "/" : (path?.startsWith('/') ? path : `/${path}`)
  
  // Get route config and merge with explicit access
  const config = getRouteConfig(configPath)
  const finalAccess = access || config?.allow
  
  // Return route object with Suspense wrapper and access in handle
  return {
    ...(index ? { index: true } : { path }),
    element: element ? <Suspense fallback={<LoadingSpinner />}>{element}</Suspense> : element,
    handle: { access: finalAccess, ...meta },
    ...(children && { children })
  }
}

// Router configuration
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />, // Root layout with auth orchestration - NO createRoute wrapper
    children: [
      {
        path: '/',
        element: <Layout />, // App layout - NO createRoute wrapper
        children: [
          // Public routes
          createRoute({
            index: true,
            element: <Discover />,
            title: 'Discover Stories'
          }),
          createRoute({
            path: 'discover',
            element: <Discover />,
            title: 'Discover Stories'
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
          
          // Protected routes (access controlled by routes.json)
          createRoute({
            path: 'write',
            element: <Write />,
            title: 'My Stories'
          }),
          createRoute({
            path: 'write/new',
            element: <NewStory />,
            title: 'Create New Story'
          }),
          createRoute({
            path: 'write/:id',
            element: <StoryEdit />,
            title: 'Edit Story'
          }),
          createRoute({
            path: 'library',
            element: <Library />,
            title: 'My Library'
          }),
          createRoute({
            path: 'reading-lists',
            element: <ReadingLists />,
            title: 'Reading Lists'
          }),
          createRoute({
            path: 'notifications',
            element: <NotificationCenter />,
            title: 'Notifications'
          }),
          createRoute({
            path: 'following',
            element: <Following />,
            title: 'Following'
          }),
        ]
      },
      
      // Authentication routes (outside main layout)
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
        title: 'Authentication Error'
      }),
      createRoute({
        path: 'reset-password/:appId/:fields',
        element: <ResetPassword />,
        title: 'Reset Password'
      }),
      createRoute({
        path: 'prompt-password/:appId/:emailAddress/:provider',
        element: <PromptPassword />,
        title: 'Set Password'
      }),
      
      // Catch all route
      createRoute({
        path: '*',
        element: <NotFound />,
        title: 'Page Not Found'
      }),
    ]
  }
])