import React, { useState, useEffect } from 'react';

/**
 * A custom Router component for client-side navigation.
 *
 * Features:
 * - Supports dynamic path segments (e.g., `/users/:id`).
 * - Parses query parameters and handles repeated parameters (e.g., `?color=red&color=blue`).
 * - Processes hash fragments (`#fragment`) and scrolls to matching elements.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - Expected to be Route components defining paths and components to render.
 * @returns {React.ReactElement} The rendered component for the matched route or a 404 message if no route matches.
 */
const Router = ({ children }) => {
  /**
   * The current matched route details.
   * @typedef {Object} CurrentRoute
   * @property {string} route - The matched route path (e.g., `/users/:id`).
   * @property {React.ComponentType} component - The React component to render for the matched route.
   * @property {Object} path - Parsed dynamic path parameters (e.g., `{ id: "123" }`).
   * @property {Object} query - Parsed query parameters. If a parameter has multiple values, it's an array.
   * @property {string} fragment - The current hash fragment (e.g., `section1` for `#section1`).
   */
  const [currentRoute, setCurrentRoute] = useState({});

  useEffect(() => {
    /**
     * Handles route changes by:
     * - Parsing the URL path, query string, and hash fragment.
     * - Matching the URL against the defined routes.
     * - Extracting dynamic path parameters, query parameters, and the fragment.
     */
    const handleRouteChange = () => {
      const currentPath = window.location.pathname;
      const currentSearch = window.location.search;
      const currentHash = window.location.hash;

      // Sanitize the path
      const sanitizedPath =
        currentPath.endsWith('/') && currentPath !== '/'
          ? currentPath.slice(0, -1)
          : currentPath;

      // Replace the browser URL if the sanitized path differs
      if (sanitizedPath !== currentPath) {
        window.history.replaceState(
          null,
          '',
          `${sanitizedPath}${currentSearch}${currentHash}`
        );
      }

      // Match the sanitized path against the routes
      const matchedRoute = React.Children.toArray(children).find(({ props: { path } }) => {
        // Root path
        if (path === '/') return sanitizedPath === '/';

        // Dynamic segments
        if (path.includes('/:')) {
          const pathParts = path.split('/').filter(Boolean);
          const sanitizedParts = sanitizedPath.split('/').filter(Boolean);
          if (pathParts.length !== sanitizedParts.length) return false;
          return pathParts.every((part, index) => part.startsWith(':') || part === sanitizedParts[index]);
        }

        // Catch-all paths
        if (path.endsWith('/*')) {
          const basePath = path.slice(0, -2);
          return (
            sanitizedPath.startsWith(basePath) &&
            (sanitizedPath === basePath || sanitizedPath[basePath.length] === '/')
          );
        }

        // Exact match
        return path.endsWith('/')
          ? path.slice(0, -1) === sanitizedPath
          : path === sanitizedPath;
      });

      if (matchedRoute) {
        const dynamicParams = {};
        if (matchedRoute.props.path.includes('/:')) {
          const pathParts = matchedRoute.props.path.split('/').filter(Boolean);
          const sanitizedParts = sanitizedPath.split('/').filter(Boolean);
          pathParts.forEach((part, index) => {
            if (part.startsWith(':')) {
              dynamicParams[part.slice(1)] = sanitizedParts[index];
            }
          });
        }

        const searchParams = new URLSearchParams(currentSearch);
        const queryObject = {};
        for (let [key, value] of searchParams.entries()) {
          if (queryObject[key] !== undefined) {
            queryObject[key] = Array.isArray(queryObject[key])
              ? [...queryObject[key], value]
              : [queryObject[key], value];
          } else {
            queryObject[key] = value;
          }
        }

        const parsedFragment = currentHash.startsWith('#') ? currentHash.slice(1) : currentHash;

        if (
          matchedRoute.props.path !== currentRoute?.route ||
          parsedFragment !== currentRoute?.fragment
        ) {
          setCurrentRoute({
            route: matchedRoute.props.path,
            component: matchedRoute.props.component,
            path: dynamicParams,
            query: queryObject,
            fragment: parsedFragment,
          });
        }
      }
    };

    // Run on mount and listen for changes
    handleRouteChange();
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);

    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, [currentRoute, children]);

  useEffect(() => {
    if (currentRoute.fragment) {
      const el = document.getElementById(currentRoute.fragment);
      if (el) el.scrollIntoView();
    }
  }, [currentRoute.fragment]);

  const RenderedComponent =
    currentRoute?.component || (() => <div>404 - Page Not Found</div>);

  return (
    <RenderedComponent
      path={currentRoute.path || {}}
      query={currentRoute.query || {}}
      fragment={currentRoute.fragment || ''}
    />
  );
};

export default Router;
