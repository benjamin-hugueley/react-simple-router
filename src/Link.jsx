import React from 'react';

/**
 * Link component that navigates to the given URL using history API
 * without causing a full page reload. It also triggers the popstate
 * event so the Router can handle route changes.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.to - The target URL path.
 * @param {React.ReactNode} props.children - The link content (text, elements).
 * @returns {React.JSX.Element} The rendered link element.
 */
const Link = ({ to, children }) => {
  const handleClick = (e) => {
    e.preventDefault(); // Prevent default link behavior (full page reload)
    window.history.pushState(null, '', to); // Update URL without reloading

    // Manually trigger the `popstate` event to notify the Router of the change
    const popStateEvent = new PopStateEvent('popstate');
    window.dispatchEvent(popStateEvent);
  };

  return (
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  );
};

export default Link;
