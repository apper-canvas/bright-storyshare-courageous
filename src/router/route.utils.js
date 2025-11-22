// Route configuration and access control utilities
import routesConfig from './routes.json'

const customFunctions = {}

/**
 * Get route configuration for a given path
 */
export const getRouteConfig = (path) => {
  const patterns = Object.keys(routesConfig)
  let bestMatch = null
  let highestSpecificity = -1

  for (const pattern of patterns) {
    if (matchesPattern(path, pattern)) {
      const specificity = getSpecificity(pattern)
      if (specificity > highestSpecificity) {
        highestSpecificity = specificity
        bestMatch = pattern
      }
    }
  }

  return bestMatch ? routesConfig[bestMatch] : null
}

/**
 * Check if a path matches a route pattern
 */
export const matchesPattern = (path, pattern) => {
  // Exact match
  if (path === pattern) return true

  // Pattern with parameters (:id, :slug, etc.)
  if (pattern.includes(':')) {
    const patternParts = pattern.split('/')
    const pathParts = path.split('/')
    
    if (patternParts.length !== pathParts.length) return false
    
    return patternParts.every((part, index) => {
      return part.startsWith(':') || part === pathParts[index]
    })
  }

  // Wildcard patterns
  if (pattern.endsWith('/**/*')) {
    const basePath = pattern.slice(0, -5) // Remove /**/*
    return path.startsWith(basePath)
  }

  if (pattern.endsWith('/*')) {
    const basePath = pattern.slice(0, -2) // Remove /*
    const pathAfterBase = path.slice(basePath.length)
    return path.startsWith(basePath) && !pathAfterBase.includes('/')
  }

  return false
}

/**
 * Get pattern specificity for routing priority
 */
export const getSpecificity = (pattern) => {
  let score = 0
  
  // Exact paths get highest priority
  if (!pattern.includes(':') && !pattern.includes('*')) {
    score += 1000
  }
  
  // Count path segments
  score += pattern.split('/').length * 10
  
  // Penalize wildcards
  if (pattern.includes('/**/*')) score -= 100
  if (pattern.includes('/*')) score -= 50
  
  // Penalize parameters but less than wildcards
  score -= (pattern.match(/:/g) || []).length * 10
  
  return score
}

/**
 * Verify if user has access to a route
 */
export const verifyRouteAccess = (routeConfig, user) => {
  if (!routeConfig?.allow) {
    return { allowed: true, redirectTo: null, excludeRedirectQuery: false, failed: [] }
  }

  const { when, redirectOnDeny = '/login', excludeRedirectQuery = false } = routeConfig.allow
  
  if (!when?.conditions) {
    return { allowed: true, redirectTo: null, excludeRedirectQuery: false, failed: [] }
  }

  const { conditions, operator = 'AND' } = when
  const results = conditions.map(condition => evaluateCondition(condition, user))
  
  let allowed = false
  if (operator === 'OR') {
    allowed = results.some(r => r.allowed)
  } else {
    allowed = results.every(r => r.allowed)
  }

  const failed = results.filter(r => !r.allowed).map(r => r.label)

  return {
    allowed,
    redirectTo: allowed ? null : redirectOnDeny,
    excludeRedirectQuery,
    failed
  }
}

/**
 * Evaluate a single access condition
 */
const evaluateCondition = (condition, user) => {
  const { rule, label } = condition

  switch (rule) {
    case 'public':
      return { allowed: true, label }
    
    case 'authenticated':
      return { 
        allowed: !!user && !!user.emailAddress, 
        label 
      }
    
    default:
      // Custom function support (currently disabled)
      if (customFunctions[rule]) {
        return { 
          allowed: customFunctions[rule](user), 
          label 
        }
      }
      return { allowed: false, label }
  }
}