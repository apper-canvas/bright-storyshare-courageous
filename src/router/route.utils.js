import routesConfig from './routes.json';

// Custom functions object - MUST remain empty
const customFunctions = {};

/**
 * Get route configuration for a given path
 * @param {string} path - The route path to check
 * @returns {Object|null} - Route configuration or null if not found
 */
export const getRouteConfig = (path) => {
  const patterns = Object.keys(routesConfig);
  
  // Find matching patterns and sort by specificity (most specific first)
  const matches = patterns
    .filter(pattern => matchesPattern(path, pattern))
    .sort((a, b) => getSpecificity(b) - getSpecificity(a));
  
  // Return the most specific match
  return matches.length > 0 ? routesConfig[matches[0]] : null;
};

/**
 * Check if a path matches a route pattern
 * @param {string} path - The actual path
 * @param {string} pattern - The route pattern
 * @returns {boolean} - True if the path matches the pattern
 */
export const matchesPattern = (path, pattern) => {
  // Exact match
  if (path === pattern) return true;
  
  // Wildcard matches
  if (pattern.endsWith('/**/*')) {
    const basePath = pattern.slice(0, -5); // Remove '/**/*'
    return path.startsWith(basePath);
  }
  
  if (pattern.endsWith('/*')) {
    const basePath = pattern.slice(0, -2); // Remove '/*'
    const pathSegments = path.split('/');
    const patternSegments = basePath.split('/');
    
    // Check if path starts with the base pattern and has exactly one more segment
    return pathSegments.length === patternSegments.length + 1 && 
           path.startsWith(basePath);
  }
  
  // Parameter matching (e.g., /story/:id)
  const pathSegments = path.split('/');
  const patternSegments = pattern.split('/');
  
  if (pathSegments.length !== patternSegments.length) return false;
  
  for (let i = 0; i < patternSegments.length; i++) {
    const patternSegment = patternSegments[i];
    const pathSegment = pathSegments[i];
    
    // Skip parameter segments (start with :)
    if (patternSegment.startsWith(':')) continue;
    
    // Exact segment match required for non-parameters
    if (patternSegment !== pathSegment) return false;
  }
  
  return true;
};

/**
 * Calculate specificity score for a route pattern
 * Higher scores are more specific
 * @param {string} pattern - The route pattern
 * @returns {number} - Specificity score
 */
export const getSpecificity = (pattern) => {
  let score = 0;
  
  // Exact paths get highest score
  if (!pattern.includes(':') && !pattern.includes('*')) {
    score += 1000;
  }
  
  // Count path segments (more segments = more specific)
  score += (pattern.split('/').length - 1) * 100;
  
  // Parameters are less specific than exact matches
  const paramCount = (pattern.match(/:/g) || []).length;
  score += paramCount * 10;
  
  // Wildcards are least specific
  if (pattern.includes('/**/*')) score -= 500;
  else if (pattern.includes('/*')) score -= 250;
  
  return score;
};

/**
 * Verify if a user can access a route based on its configuration
 * @param {Object} config - Route configuration
 * @param {Object} user - User object (null if not authenticated)
 * @returns {Object} - Access check result
 */
export const verifyRouteAccess = (config, user) => {
  const result = {
    allowed: false,
    redirectTo: null,
    excludeRedirectQuery: false,
    failed: []
  };

  // If no config, deny access
  if (!config || !config.allow) {
    result.failed.push('No route configuration found');
    return result;
  }

  const { allow } = config;
  const { when, redirectOnDeny, excludeRedirectQuery } = allow;

  if (!when || !when.conditions) {
    result.failed.push('Invalid route configuration');
    return result;
  }

  const { conditions, operator = 'AND' } = when;
  const results = conditions.map(condition => evaluateCondition(condition, user));

  // Apply operator logic
  if (operator.toUpperCase() === 'OR') {
    result.allowed = results.some(r => r.passed);
    result.failed = results.filter(r => !r.passed).map(r => r.label);
  } else {
    // Default to AND
    result.allowed = results.every(r => r.passed);
    result.failed = results.filter(r => !r.passed).map(r => r.label);
  }

  // Set redirect info if access denied
  if (!result.allowed && redirectOnDeny) {
    result.redirectTo = redirectOnDeny;
    result.excludeRedirectQuery = excludeRedirectQuery || false;
  }

  return result;
};

/**
 * Evaluate a single condition
 * @param {Object} condition - The condition to evaluate
 * @param {Object} user - User object
 * @returns {Object} - Evaluation result
 */
const evaluateCondition = (condition, user) => {
  const { label, rule } = condition;

  switch (rule) {
    case 'public':
      return { passed: true, label };

    case 'authenticated':
      return {
        passed: user !== null && user !== undefined,
        label: label || 'User must be authenticated'
      };

    default:
      return {
        passed: false,
        label: `Unknown rule: ${rule}`
      };
  }
};