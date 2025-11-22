import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { getRouteConfig } from "./route.utils";
import Root from "@/layouts/Root";
import Layout from "@/components/organisms/Layout";
// Lazy load page components
const Discover = lazy(() => import("@/components/pages/Discover"))
const Library = lazy(() => import("@/components/pages/Library"))
const Write = lazy(() => import("@/components/pages/Write"))
const NewStory = lazy(() => import("@/components/pages/NewStory"))
const StoryDetail = lazy(() => import("@/components/pages/StoryDetail"))
const StoryEdit = lazy(() => import("@/components/pages/StoryEdit"))
const ChapterRead = lazy(() => import("@/components/pages/ChapterRead"))
const NotFound = lazy(() => import("@/components/pages/NotFound"))

// Authentication pages
const Login = lazy(() => import("@/pages/Login"))
const Signup = lazy(() => import("@/pages/Signup"))
const Callback = lazy(() => import("@/pages/Callback"))
const ErrorPage = lazy(() => import("@/pages/ErrorPage"))
const ResetPassword = lazy(() => import("@/pages/ResetPassword"))
const PromptPassword = lazy(() => import("@/pages/PromptPassword"))

// Loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full" />
  </div>
)

// createRoute helper function
const createRoute = ({ path, index, element, access, children, ...meta }) => {
  const configPath = index ? "/" : (path.startsWith('/') ? path : `/${path}`)
  const config = getRouteConfig(configPath)
  const finalAccess = access || config?.allow
  
  return {
    ...(index ? { index: true } : { path }),
    element: element ? <Suspense fallback={<LoadingSpinner />}>{element}</Suspense> : element,
    handle: { access: finalAccess, ...meta },
    ...(children && { children })
  }
}

// Suspense wrapper for consistency
const withSuspense = (Component) => () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Component />
  </Suspense>
)

// Router configuration
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />, // Root layout with authentication
    children: [
      {
        path: '/',
        element: <Layout />, // Main app layout
        children: [
          // Public routes
          createRoute({
            index: true,
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
            title: 'Reading Chapter'
          }),
          
          // Protected routes (access controlled by routes.json)
          createRoute({
            path: 'library',
            element: <Library />,
            title: 'My Library'
          }),
          createRoute({
            path: 'write',
            element: <Write />,
            title: 'My Stories'
          }),
          createRoute({
            path: 'write/new',
            element: <NewStory />,
            title: 'New Story'
          }),
          createRoute({
            path: 'story/:id/edit',
            element: <StoryEdit />,
            title: 'Edit Story'
          }),
          
          // Catch all for 404
          createRoute({
            path: '*',
            element: <NotFound />,
            title: 'Page Not Found'
          })
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
      })
    ]
  }
])
