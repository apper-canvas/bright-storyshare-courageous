// CRITICAL: DO NOT MODIFY this implementation
// customFunctions MUST remain empty - custom functions NOT supported

const customFunctions = {}

export function getRouteConfig(path) {
  try {
import routes from './routes.json'
    
    // Find matching route using pattern matching
    const matchingRoutes = Object.entries(routes)
      .map(([pattern, config]) => ({
        pattern,
        config,
        specificity: getSpecificity(pattern),
        matches: matchesPattern(path, pattern)
      }))
      .filter(route => route.matches)
      .sort((a, b) => b.specificity - a.specificity)
    
    return matchingRoutes.length > 0 ? matchingRoutes[0].config : null
  } catch (error) {
    console.error('Failed to load route config:', error)
    return null
  }
}

export function verifyRouteAccess(config, user) {
  if (!config?.allow) {
    return { allowed: true, redirectTo: null, excludeRedirectQuery: false, failed: [] }
  }

  const { when, redirectOnDeny = '/login', excludeRedirectQuery = false } = config.allow
  
  if (!when?.conditions) {
    return { allowed: true, redirectTo: null, excludeRedirectQuery: false, failed: [] }
  }

  const failedConditions = []
  const conditionResults = when.conditions.map(condition => {
    const result = evaluateCondition(condition, user)
    if (!result) {
      failedConditions.push(condition.label || 'Unknown condition')
    }
    return result
  })

  const operator = when.operator || 'AND'
  const allowed = operator === 'OR' 
    ? conditionResults.some(result => result)
    : conditionResults.every(result => result)

  return {
    allowed,
    redirectTo: allowed ? null : redirectOnDeny,
    excludeRedirectQuery,
    failed: failedConditions
  }
}

function evaluateCondition(condition, user) {
  switch (condition.rule) {
    case 'public':
      return true
    case 'authenticated':
      return !!user
    default:
      console.warn(`Unknown rule: ${condition.rule}`)
      return false
  }
}

export function matchesPattern(path, pattern) {
  // Exact match
  if (path === pattern) return true
  
  // Parameter matching (:id, :slug, etc.)
  const patternParts = pattern.split('/')
  const pathParts = path.split('/')
  
  if (patternParts.length !== pathParts.length) {
    // Check wildcard patterns
    if (pattern.endsWith('/*')) {
      const basePattern = pattern.slice(0, -2)
      return path.startsWith(basePattern + '/')
    }
    if (pattern.endsWith('/**/*')) {
      const basePattern = pattern.slice(0, -5)
      return path.startsWith(basePattern + '/')
    }
    return false
  }
  
  return patternParts.every((part, index) => {
    return part.startsWith(':') || part === pathParts[index]
  })
}

export function getSpecificity(pattern) {
  let score = 0
  
  if (pattern.includes(':')) score += 1  // Parameters
  if (pattern.includes('*')) score += 0  // Wildcards (lowest)
  if (!pattern.includes(':') && !pattern.includes('*')) score += 2  // Exact paths (highest)
  
  score += pattern.split('/').length  // Longer paths = higher specificity
  
  return score
}