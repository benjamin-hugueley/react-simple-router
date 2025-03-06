import React from 'react'

import Link from './components/Link';
import Router from './components/Router';
import Route from './components/Route';

import Home from './screens/Home';
import Login from './screens/Login';

const App = () => (
  <>
    <header>
      <Link to="/login">Login</Link>
    </header>
    <main>
      <Router>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
      </Router>
    </main>
    <footer>
      <p>&copy; 2024 Commit Desk LLC. All rights reserved.</p>
    </footer>
  </>
)

export default App;
