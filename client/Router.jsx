import React from "react";
import { Routes, Route } from "react-router-dom";
import DashBoard from "./src/Page/LandingPage/Dashboard.jsx";
import LayOut from "./src/components/LayOut/LayOut.jsx";

import PrivateRoute from "./src/components/ProtectRoute/PrivateRoute.jsx";

import EmailForPassword from "./src/Page/EmailForPasswrod/EmailForPassword.jsx";
import PasswordUpdater from "./src/Page/PassworedUpdate/PasswordUpdater.jsx";
import PageNotFound from "./src/Page/PageNotFound/PageNotFound.jsx";
import PublicOnlyRoute from "./src/components/ProtectRoute/PublicOnlyRoute.jsx";
import Home from "./src/Page/Home/Home.jsx";

function Routing() {
  return (
    <Routes>
      <Route
        path="/emailforpassword"
        element={
          <LayOut showFooter={true} showHeader={true}>
            <EmailForPassword />
          </LayOut>
        }
      />
      <Route
        path="/reset-password/:userId"
        element={
          <LayOut showFooter={true} showHeader={true}>
            <PasswordUpdater />
          </LayOut>
        }
      />


      <Route
        path="/signupLogIn"
        element={
          <PublicOnlyRoute>
            <LayOut showFooter={true} showHeader={true}>
              <DashBoard />
            </LayOut>
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/"
        element={
          <PublicOnlyRoute>
            <LayOut showFooter={true} showHeader={true}>
              <DashBoard />
            </LayOut>
          </PublicOnlyRoute>
        }
      />
      <Route element={<PrivateRoute />}>
        <Route
          path="*"
          element={
            <LayOut showFooter={true} showHeader={true}>
              <PageNotFound />
            </LayOut>
          }
        />
              <Route
        path="/home"
        element={
            <LayOut showFooter={true} showHeader={true}>
              <Home />
            </LayOut>
        }
      />
      </Route>
    </Routes>
  );
}

export default Routing;
