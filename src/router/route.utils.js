import routesConfig from './routes.json'

// CRITICAL: Custom functions are NOT supported
const customFunctions = {}

/**
 * Get route configuration for a given path
 */
export const getRouteConfig = (path) => {
  // Direct match first
  if (routesConfig[path]) {
    return routesConfig[path]
  }

  // Pattern matching for dynamic routes
  const patterns = Object.keys(routesConfig)
  const matches = []

  for (const pattern of patterns) {
    if (matchesPattern(path, pattern)) {
      matches.push({
        pattern,
        config: routesConfig[pattern],
        specificity: getSpecificity(pattern)
      })
    }
  }

  // Return most specific match
  if (matches.length > 0) {
    matches.sort((a, b) => b.specificity - a.specificity)
    return matches[0].config
  }

  return null
}

/**
 * Check if a path matches a pattern
 */
export const matchesPattern = (path, pattern) => {
  // Exact match
  if (path === pattern) return true

  // Convert pattern to regex
  const regexPattern = pattern
    .replace(/:\w+/g, '[^/]+')      // :id -> [^/]+
    .replace(/\/\*\*/g, '(/.*)?')   // /** -> (/.*)? 
    .replace(/\/\*/g, '/[^/]*')     // /* -> /[^/]*
    .replace(/\*/g, '.*')           // * -> .*

  const regex = new RegExp(`^${regexPattern}$`)
  return regex.test(path)
}

/**
 * Calculate pattern specificity for sorting
 */
export const getSpecificity = (pattern) => {
  let score = 0
  
  // Exact paths get highest score
  if (!pattern.includes(':') && !pattern.includes('*')) {
    score += 1000
  }
  
  // Count path segments
  score += pattern.split('/').length * 10
  
  // Parameter segments get medium score
  score += (pattern.match(/:\w+/g) || []).length * 5
  
  // Wildcard segments get lowest score
  score -= (pattern.match(/\*/g) || []).length * 20
  
  return score
}

/**
 * Verify if user has access to route
 */
export const verifyRouteAccess = (config, user) => {
  const result = {
    allowed: true,
    redirectTo: null,
    excludeRedirectQuery: false,
    failed: []
  }

  if (!config?.allow?.when?.conditions) {
    return result // No restrictions
  }

  const { conditions, operator = 'AND' } = config.allow.when
  const passed = []
  const failed = []

  for (const condition of conditions) {
    let conditionResult = false

    switch (condition.rule) {
      case 'public':
        conditionResult = true
        break
      case 'authenticated':
        conditionResult = user !== null
        break
      default:
        conditionResult = false
    }

    if (conditionResult) {
      passed.push(condition.label)
    } else {
      failed.push(condition.label)
    }
  }

  // Evaluate based on operator
  if (operator === 'OR') {
    result.allowed = passed.length > 0
  } else { // AND
    result.allowed = failed.length === 0
  }

  if (!result.allowed) {
    result.redirectTo = config.allow.redirectOnDeny || '/login'
    result.excludeRedirectQuery = config.allow.excludeRedirectQuery || false
    result.failed = failed
  }

  return result
}