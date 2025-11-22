import React, { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { getRouteConfig } from './route.utils'
import Root from '@/layouts/Root'
import Layout from '@/components/organisms/Layout'

// Lazy load components
const Discover = lazy(() => import('@/components/pages/Discover'))
const Write = lazy(() => import('@/components/pages/Write'))
const StoryDetail = lazy(() => import('@/components/pages/StoryDetail'))
const Library = lazy(() => import('@/components/pages/Library'))
const ReadingLists = lazy(() => import('@/components/pages/ReadingLists'))
const NotFound = lazy(() => import('@/components/pages/NotFound'))
const NewStory = lazy(() => import('@/components/pages/NewStory'))
const StoryEdit = lazy(() => import('@/components/pages/StoryEdit'))
const ChapterRead = lazy(() => import('@/components/pages/ChapterRead'))
const NotificationCenter = lazy(() => import('@/components/pages/NotificationCenter'))
const Following = lazy(() => import('@/components/pages/Following'))

// Authentication pages
const Login = lazy(() => import('@/components/pages/Login'))
const Signup = lazy(() => import('@/components/pages/Signup'))
const Callback = lazy(() => import('@/components/pages/Callback'))
const ErrorPage = lazy(() => import('@/components/pages/ErrorPage'))
const ResetPassword = lazy(() => import('@/components/pages/ResetPassword'))
const PromptPassword = lazy(() => import('@/components/pages/PromptPassword'))

// Loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full" />
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
          // Public routes
          createRoute({
            index: true,
            element: <Discover />,
            title: 'Discover Stories'
          }),
          
          // Story routes
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
          
          // Writing routes (protected)
          createRoute({
            path: 'write',
            element: <Write />,
            title: 'Write'
          }),
          createRoute({
            path: 'write/new',
            element: <NewStory />,
            title: 'Create New Story'
          }),
          createRoute({
            path: 'write/edit/:id',
            element: <StoryEdit />,
            title: 'Edit Story'
          }),
          
          // User library routes (protected)
          createRoute({
            path: 'library',
            element: <Library />,
            title: 'Your Library'
          }),
          createRoute({
            path: 'reading-lists',
            element: <ReadingLists />,
            title: 'Reading Lists'
          }),
          
          // Social routes (protected)
          createRoute({
            path: 'notifications',
            element: <NotificationCenter />,
            title: 'Notifications'
          }),
          createRoute({
            path: 'following',
            element: <Following />,
            title: 'Following'
          })
        ]
      },
      
      // Authentication routes (public)
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
        path: 'reset-password/:appId/:fields',
        element: <ResetPassword />,
        title: 'Reset Password'
      }),
      createRoute({
        path: 'prompt-password/:appId/:emailAddress/:provider',
        element: <PromptPassword />,
        title: 'Prompt Password'
      }),
      
      // 404 Not Found
      createRoute({
        path: '*',
        element: <NotFound />,
        title: 'Page Not Found'
      })
    ]
  }
])