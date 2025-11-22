const customFunctions = {}

export function getRouteConfig(path) {
  try {
    const response = fetch('/src/router/routes.json')
    const routes = response.json()
    
    const matchingRoute = findMatchingRoute(routes, path)
    return matchingRoute?.config || null
  } catch (error) {
    console.error('Failed to load route config:', error)
    return null
  }
}

export function verifyRouteAccess(config, user) {
  if (!config?.allow) {
    return { allowed: true, redirectTo: null, excludeRedirectQuery: false, failed: [] }
  }

  const { when, redirectOnDeny, excludeRedirectQuery = false } = config.allow
  const conditions = when?.conditions || []
  const operator = when?.operator || 'AND'
  
  const results = conditions.map(condition => {
    const result = evaluateCondition(condition, user)
    return { ...result, label: condition.label }
  })

  let allowed
  if (operator === 'OR') {
    allowed = results.some(r => r.success)
  } else {
    allowed = results.every(r => r.success)
  }

  return {
    allowed,
    redirectTo: allowed ? null : redirectOnDeny || null,
    excludeRedirectQuery,
    failed: results.filter(r => !r.success).map(r => r.label)
  }
}

function findMatchingRoute(routes, path) {
  const routeEntries = Object.entries(routes).map(([pattern, config]) => ({
    pattern,
    config,
    specificity: getSpecificity(pattern)
  }))

  const matchingRoutes = routeEntries
    .filter(route => matchesPattern(path, route.pattern))
    .sort((a, b) => b.specificity - a.specificity)

  return matchingRoutes[0] || null
}

export function matchesPattern(path, pattern) {
  if (pattern === path) return true

  const patternParts = pattern.split('/')
  const pathParts = path.split('/')

  if (pattern.endsWith('/**/*')) {
    const baseParts = patternParts.slice(0, -2)
    return pathParts.length >= baseParts.length && 
           baseParts.every((part, i) => part === pathParts[i] || part.startsWith(':'))
  }

  if (pattern.endsWith('/*')) {
    const baseParts = patternParts.slice(0, -1)
    return pathParts.length === baseParts.length + 1 &&
           baseParts.every((part, i) => part === pathParts[i] || part.startsWith(':'))
  }

  if (patternParts.length !== pathParts.length) return false

  return patternParts.every((part, i) => 
    part === pathParts[i] || part.startsWith(':')
  )
}

export function getSpecificity(pattern) {
  const parts = pattern.split('/')
  let score = 0
  
  for (const part of parts) {
    if (part === '**' || part === '*') {
      score += 1
    } else if (part.startsWith(':')) {
      score += 10
    } else {
      score += 100
    }
  }
  
  return score
}

function evaluateCondition(condition, user) {
  const { rule } = condition
  
  switch (rule) {
    case 'public':
      return { success: true }
    case 'authenticated':
      return { success: user !== null }
    default:
      return { success: false }
  }
}