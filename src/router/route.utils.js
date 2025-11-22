/**
 * Route Pattern Matching and Access Verification
 * Supports exact paths, parameters (:id), and wildcards (/* and /***)
 */

// Custom functions object - MUST remain empty (not supported)
const customFunctions = {}

/**
 * Check if a path matches a route pattern
 * @param {string} path - The actual path
 * @param {string} pattern - The route pattern
 * @returns {boolean} - True if path matches pattern
 */
export const matchesPattern = (path, pattern) => {
  // Exact match
  if (path === pattern) return true
  
  // Convert pattern to regex
  let regexPattern = pattern
    .replace(/\*\*\/\*/g, '.*')  // /**/* becomes .*
    .replace(/\/\*/g, '/[^/]*')  // /* becomes /[^/]*
    .replace(/:\w+/g, '[^/]+')   // :param becomes [^/]+
  
  regexPattern = `^${regexPattern}$`
  const regex = new RegExp(regexPattern)
  
  return regex.test(path)
}

/**
 * Calculate pattern specificity for route prioritization
 * @param {string} pattern - The route pattern
 * @returns {number} - Specificity score (higher = more specific)
 */
export const getSpecificity = (pattern) => {
  let score = 0
  
  // Exact segments get highest score
  const segments = pattern.split('/')
  segments.forEach(segment => {
    if (segment === '') return
    if (segment === '*' || segment === '**/*') {
      score += 1  // Wildcards get lowest score
    } else if (segment.startsWith(':')) {
      score += 10 // Parameters get medium score
    } else {
      score += 100 // Exact segments get highest score
    }
  })
  
  return score
}

/**
 * Get route configuration for a given path
 * @param {string} path - The path to check
 * @returns {Object|null} - Route configuration or null
 */
export const getRouteConfig = (path) => {
  try {
    // Import routes configuration
    const routes = {
      "/": {
        "allow": {
          "when": {
            "conditions": [
              {
                "label": "Homepage is public",
                "rule": "public"
              }
            ],
            "operator": "OR"
          }
        }
      },
      "/login": {
        "allow": {
          "when": {
            "conditions": [
              {
                "label": "Login page is public",
                "rule": "public"
              }
            ]
          }
        }
      },
      "/signup": {
        "allow": {
          "when": {
            "conditions": [
              {
                "label": "Signup page is public", 
                "rule": "public"
              }
            ]
          }
        }
      },
      "/callback": {
        "allow": {
          "when": {
            "conditions": [
              {
                "label": "Auth callback is public",
                "rule": "public"
              }
            ]
          }
        }
      },
      "/error": {
        "allow": {
          "when": {
            "conditions": [
              {
                "label": "Error page is public",
                "rule": "public"
              }
            ]
          }
        }
      },
      "/reset-password/*": {
        "allow": {
          "when": {
            "conditions": [
              {
                "label": "Reset password is public",
                "rule": "public"
              }
            ]
          }
        }
      },
      "/prompt-password/*": {
        "allow": {
          "when": {
            "conditions": [
              {
                "label": "Prompt password is public",
                "rule": "public"
              }
            ]
          }
        }
      },
      "/write/*": {
        "allow": {
          "when": {
            "conditions": [
              {
                "label": "Writing requires authentication",
                "rule": "authenticated"
              }
            ]
          },
          "redirectOnDeny": "/login",
          "excludeRedirectQuery": false
        }
      },
      "/library": {
        "allow": {
          "when": {
            "conditions": [
              {
                "label": "Library requires authentication",
                "rule": "authenticated"
              }
            ]
          },
          "redirectOnDeny": "/login"
        }
      },
      "/reading-lists": {
        "allow": {
          "when": {
            "conditions": [
              {
                "label": "Reading lists require authentication",
                "rule": "authenticated"
              }
            ]
          },
          "redirectOnDeny": "/login"
        }
      },
      "/notifications": {
        "allow": {
          "when": {
            "conditions": [
              {
                "label": "Notifications require authentication",
                "rule": "authenticated"
              }
            ]
          },
          "redirectOnDeny": "/login"
        }
      },
      "/following": {
        "allow": {
          "when": {
            "conditions": [
              {
                "label": "Following page requires authentication",
                "rule": "authenticated"
              }
            ]
          },
          "redirectOnDeny": "/login"
        }
      }
    }

    // Find matching route with highest specificity
    const matchingRoutes = Object.entries(routes)
      .filter(([pattern]) => matchesPattern(path, pattern))
      .sort(([patternA], [patternB]) => getSpecificity(patternB) - getSpecificity(patternA))

    if (matchingRoutes.length > 0) {
      return matchingRoutes[0][1]
    }

    return null
  } catch (error) {
    console.error('Error loading route configuration:', error)
    return null
  }
}

/**
 * Verify if user has access to a route
 * @param {Object} config - Route configuration
 * @param {Object|null} user - Current user object
 * @returns {Object} - Access result
 */
export const verifyRouteAccess = (config, user) => {
  const result = {
    allowed: true,
    redirectTo: null,
    excludeRedirectQuery: false,
    failed: []
  }

  if (!config?.allow?.when?.conditions) {
    return result
  }

  const { conditions, operator = 'AND' } = config.allow.when
  const isAuthenticated = !!user

  let passedConditions = 0
  const failedConditions = []

  conditions.forEach(condition => {
    const { rule, label } = condition
    let passes = false

    switch (rule) {
      case 'public':
        passes = true
        break
      case 'authenticated':
        passes = isAuthenticated
        break
      default:
        passes = false
        break
    }

    if (passes) {
      passedConditions++
    } else {
      failedConditions.push(label || rule)
    }
  })

  // Determine if access is allowed based on operator
  if (operator === 'OR') {
    result.allowed = passedConditions > 0
  } else {
    result.allowed = passedConditions === conditions.length
  }

  if (!result.allowed) {
    result.failed = failedConditions
    result.redirectTo = config.allow.redirectOnDeny || null
    result.excludeRedirectQuery = config.allow.excludeRedirectQuery || false
  }

  return result
}