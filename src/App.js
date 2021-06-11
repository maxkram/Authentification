import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SiteHeader from "./components/SiteHeader";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import "./App.css";
import createAuth0Client from "@auth0/auth0-spa-js";

useEffect(() => {
  initAuth0();

  async function initAuth0() {
    const auth0 = await createAuth0Client({
      domain: "maxkram.auth0.com",
      client_id: "QVfF3pEhiBNNSruOWWnf2phnuWrkTRTV",
      redirect_uri: window.location.origin,
    });
    setAuth0Client(auth0);

    // handle redirect when user comes back
    if (
      window.location.search.includes("code=") &&
      window.location.search.includes("state=")
    ) {
      try {
        await auth0.handleRedirectCallback();
      } catch (err) {
        alert(err);
      }

      window.location.replace(window.location.pathname);
    }

    // is a user authenticated
    const isAuthenticated = await auth0.isAuthenticated();
    setIsAuthenticated(isAuthenticated);

    // go grab the user
    if (isAuthenticated) {
      const user = await auth0.getUser();
      setUser(user);
    }

    setIsLoading(false);
  }
}, []);

export default function App() {
  return (
    <Router>
      <div className='app'>
        {/* site header */}
        <SiteHeader />

        {/* routes */}
        <Switch>
          <Route path='/dashboard'>
            <Dashboard />
          </Route>
          <Route path='/' exact={true}>
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
