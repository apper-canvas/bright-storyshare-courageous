import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { getRouteConfig } from "@/router/route.utils";
import Layout from "@/components/organisms/Layout";
import Root from "@/layouts/Root";

// Lazy load components
const Discover = lazy(() => import('@/components/pages/Discover'))
const Library = lazy(() => import('@/components/pages/Library'))
const ReadingLists = lazy(() => import('@/components/pages/ReadingLists'))
const Following = lazy(() => import('@/components/pages/Following'))
const NotificationCenter = lazy(() => import('@/components/pages/NotificationCenter'))
const Write = lazy(() => import('@/components/pages/Write'))
const StoryDetail = lazy(() => import('@/components/pages/StoryDetail'))
const StoryEdit = lazy(() => import('@/components/pages/StoryEdit'))
const NewStory = lazy(() => import('@/components/pages/NewStory'))
const ChapterRead = lazy(() => import('@/components/pages/ChapterRead'))
const Login = lazy(() => import('@/components/pages/Login'))
const Signup = lazy(() => import('@/components/pages/Signup'))
const Callback = lazy(() => import('@/components/pages/Callback'))
const ErrorPage = lazy(() => import('@/components/pages/ErrorPage'))
const NotFound = lazy(() => import('@/components/pages/NotFound'))
const PromptPassword = lazy(() => import('@/components/pages/PromptPassword'))
const ResetPassword = lazy(() => import('@/components/pages/ResetPassword'))

// Loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin h-12 w-12 border-4 border-accent border-t-transparent rounded-full" />
  </div>
)

// Create route helper
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

// Router configuration
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      // Authentication routes (no layout)
      createRoute({
        index: true,
        element: <Login />,
        title: 'Login'
      }),
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
      createRoute({
        path: 'prompt-password/:appId/:emailAddress/:provider',
        element: <PromptPassword />,
        title: 'Set Password'
      }),
      createRoute({
        path: 'reset-password/:appId/:fields',
        element: <ResetPassword />,
        title: 'Reset Password'
      }),
      
      // Main app routes with Layout wrapper
      {
        path: 'discover',
        element: <Layout />,
        children: [
          createRoute({
            index: true,
            element: <Discover />,
            title: 'Discover Stories'
          })
        ]
      },
      {
        path: 'library',
        element: <Layout />,
        children: [
          createRoute({
            index: true,
            element: <Library />,
            title: 'My Library'
          })
        ]
      },
      {
        path: 'reading-lists',
        element: <Layout />,
        children: [
          createRoute({
            index: true,
            element: <ReadingLists />,
            title: 'Reading Lists'
          })
        ]
      },
      {
        path: 'following',
        element: <Layout />,
        children: [
          createRoute({
            index: true,
            element: <Following />,
            title: 'Following'
          })
        ]
      },
      {
        path: 'notifications',
        element: <Layout />,
        children: [
          createRoute({
            index: true,
            element: <NotificationCenter />,
            title: 'Notifications'
          })
        ]
      },
      {
        path: 'write',
        element: <Layout />,
        children: [
          createRoute({
            index: true,
            element: <Write />,
            title: 'Write'
          }),
          createRoute({
            path: 'new',
            element: <NewStory />,
            title: 'New Story'
          }),
          createRoute({
            path: ':storyId/edit',
            element: <StoryEdit />,
            title: 'Edit Story'
          })
        ]
      },
      {
        path: 'story',
        element: <Layout />,
        children: [
          createRoute({
            path: ':storyId',
            element: <StoryDetail />,
            title: 'Story Details'
          }),
          createRoute({
            path: ':storyId/chapter/:chapterId',
            element: <ChapterRead />,
            title: 'Reading'
          })
        ]
      },
      
      // 404 route
      createRoute({
        path: '*',
        element: <NotFound />,
        title: 'Page Not Found'
      })
]
  }
])