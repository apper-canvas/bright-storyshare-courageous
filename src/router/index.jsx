import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { getRouteConfig } from "@/router/route.utils";
import Layout from "@/components/organisms/Layout";
import Root from "@/layouts/Root";

// Lazy load components
const Discover = lazy(() => import('@/components/pages/Discover'))
const Login = lazy(() => import('@/components/pages/Login'))
const Signup = lazy(() => import('@/components/pages/Signup'))
const Library = lazy(() => import('@/components/pages/Library'))
const ReadingLists = lazy(() => import('@/components/pages/ReadingLists'))
const Following = lazy(() => import('@/components/pages/Following'))
const Write = lazy(() => import('@/components/pages/Write'))
const NewStory = lazy(() => import('@/components/pages/NewStory'))
const StoryEdit = lazy(() => import('@/components/pages/StoryEdit'))
const StoryDetail = lazy(() => import('@/components/pages/StoryDetail'))
const ChapterRead = lazy(() => import('@/components/pages/ChapterRead'))
const NotificationCenter = lazy(() => import('@/components/pages/NotificationCenter'))
const Callback = lazy(() => import('@/components/pages/Callback'))
const ErrorPage = lazy(() => import('@/components/pages/ErrorPage'))
const ResetPassword = lazy(() => import('@/components/pages/ResetPassword'))
const PromptPassword = lazy(() => import('@/components/pages/PromptPassword'))
const NotFound = lazy(() => import('@/components/pages/NotFound'))

// Loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin h-12 w-12 border-4 border-accent border-t-transparent rounded-full" />
  </div>
)

// createRoute helper
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
      {
        path: '/',
        element: <Layout />,
        children: [
          createRoute({
            index: true,
            element: <Discover />,
            title: 'Discover Stories'
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
            path: 'write/story/:id',
            element: <StoryEdit />,
            title: 'Edit Story'
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
            path: 'notifications',
            element: <NotificationCenter />,
            title: 'Notifications'
          })
        ]
      },
      // Auth routes (outside Layout)
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
        path: 'reset-password',
        element: <ResetPassword />,
        title: 'Reset Password'
      }),
      createRoute({
        path: 'prompt-password/:appId/:emailAddress/:provider',
        element: <PromptPassword />,
        title: 'Set Password'
      }),
      createRoute({
        path: '*',
        element: <NotFound />,
        title: 'Page Not Found'
      })
    ]
  }
])