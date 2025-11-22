import routesConfig from './routes.json';

const customFunctions = {};

/**
 * Get route configuration for a given path
 */
export const getRouteConfig = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Find exact match first
  if (routesConfig[normalizedPath]) {
    return routesConfig[normalizedPath];
  }
  
  // Find pattern matches and sort by specificity
  const matches = Object.entries(routesConfig)
    .filter(([pattern]) => matchesPattern(normalizedPath, pattern))
    .sort(([a], [b]) => getSpecificity(b) - getSpecificity(a));
  
  return matches[0]?.[1] || null;
};

/**
 * Check if a path matches a pattern
 */
export const matchesPattern = (path, pattern) => {
  // Exact match
  if (path === pattern) return true;
  
  // Parameter pattern (:id)
  if (pattern.includes(':')) {
    const pathParts = path.split('/');
    const patternParts = pattern.split('/');
    
    if (pathParts.length !== patternParts.length) return false;
    
    return patternParts.every((part, index) => 
      part.startsWith(':') || part === pathParts[index]
    );
  }
  
  // Wildcard patterns
  if (pattern.endsWith('/**/*')) {
    const base = pattern.replace('/**/*', '');
    return path.startsWith(base);
  }
  
  if (pattern.endsWith('/*')) {
    const base = pattern.replace('/*', '');
    const pathWithoutBase = path.replace(base, '');
    return path.startsWith(base) && !pathWithoutBase.includes('/');
  }
  
  return false;
};

/**
 * Calculate pattern specificity for sorting
 */
export const getSpecificity = (pattern) => {
  if (!pattern.includes('*') && !pattern.includes(':')) return 1000; // Exact
  if (pattern.includes(':')) return 500; // Parameters
  if (pattern.endsWith('/*')) return 200; // Single wildcard
  if (pattern.endsWith('/**/*')) return 100; // Multi-level wildcard
  return 0;
};

/**
 * Verify if user can access a route
 */
export const verifyRouteAccess = (config, user) => {
  if (!config?.allow) {
    return { allowed: true, redirectTo: null, excludeRedirectQuery: false, failed: [] };
  }
  
  const { when, redirectOnDeny, excludeRedirectQuery = false } = config.allow;
  const { conditions = [], operator = 'AND' } = when || {};
  
  const results = conditions.map(condition => {
    const { rule, label } = condition;
    
    switch (rule) {
      case 'public':
        return { passed: true, label };
      case 'authenticated':
        return { passed: user !== null, label };
      default:
        return { passed: false, label };
    }
  });
  
  let allowed;
  if (operator === 'OR') {
    allowed = results.some(r => r.passed);
  } else {
    allowed = results.every(r => r.passed);
  }
  
  const failed = results.filter(r => !r.passed).map(r => r.label);
  
  return {
    allowed,
    redirectTo: allowed ? null : (redirectOnDeny || null),
    excludeRedirectQuery,
    failed
  };
};
import routesConfig from './routes.json';

const customFunctions = {};

/**
 * Get route configuration for a given path
 */
export const getRouteConfig = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Find exact match first
  if (routesConfig[normalizedPath]) {
    return routesConfig[normalizedPath];
  }
  
  // Find pattern matches and sort by specificity
  const matches = Object.entries(routesConfig)
    .filter(([pattern]) => matchesPattern(normalizedPath, pattern))
    .sort(([a], [b]) => getSpecificity(b) - getSpecificity(a));
  
  return matches[0]?.[1] || null;
};

/**
 * Check if a path matches a pattern
 */
export const matchesPattern = (path, pattern) => {
  // Exact match
  if (path === pattern) return true;
  
  // Parameter pattern (:id)
  if (pattern.includes(':')) {
    const pathParts = path.split('/');
    const patternParts = pattern.split('/');
    
    if (pathParts.length !== patternParts.length) return false;
    
    return patternParts.every((part, index) => 
      part.startsWith(':') || part === pathParts[index]
    );
  }
  
  // Wildcard patterns
  if (pattern.endsWith('/**/*')) {
    const base = pattern.replace('/**/*', '');
    return path.startsWith(base);
  }
  
  if (pattern.endsWith('/*')) {
    const base = pattern.replace('/*', '');
    const pathWithoutBase = path.replace(base, '');
    return path.startsWith(base) && !pathWithoutBase.includes('/');
  }
  
  return false;
};

/**
 * Calculate pattern specificity for sorting
 */
export const getSpecificity = (pattern) => {
  if (!pattern.includes('*') && !pattern.includes(':')) return 1000; // Exact
  if (pattern.includes(':')) return 500; // Parameters
  if (pattern.endsWith('/*')) return 200; // Single wildcard
  if (pattern.endsWith('/**/*')) return 100; // Multi-level wildcard
  return 0;
};

/**
 * Verify if user can access a route
 */
export const verifyRouteAccess = (config, user) => {
  if (!config?.allow) {
    return { allowed: true, redirectTo: null, excludeRedirectQuery: false, failed: [] };
  }
  
  const { when, redirectOnDeny, excludeRedirectQuery = false } = config.allow;
  const { conditions = [], operator = 'AND' } = when || {};
  
  const results = conditions.map(condition => {
    const { rule, label } = condition;
    
    switch (rule) {
      case 'public':
        return { passed: true, label };
      case 'authenticated':
        return { passed: user !== null, label };
      default:
        return { passed: false, label };
    }
  });
  
  let allowed;
  if (operator === 'OR') {
    allowed = results.some(r => r.passed);
  } else {
    allowed = results.every(r => r.passed);
  }
  
  const failed = results.filter(r => !r.passed).map(r => r.label);
  
  return {
    allowed,
    redirectTo: allowed ? null : (redirectOnDeny || null),
    excludeRedirectQuery,
    failed
  };
};