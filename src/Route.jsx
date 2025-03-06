import React from 'react';

/**
 * Route component that declares a route for the Router.
 * It does not render anything on its own but passes the
 * `path` and `component` props to the Router for matching and rendering.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.path - The URL path for the route.
 * @param {React.ComponentType} props.component - The component to be rendered for this route.
 * @returns {null} This component does not render anything on its own.
 */
const Route = ({ path, component }) => {
  // This component does not render anything directly
  return null;
};

export default Route;
