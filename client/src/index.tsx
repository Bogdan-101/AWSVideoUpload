import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LoginForm } from "./components/LoginForm";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { BaseLayout } from "./layouts/BaseLayout";
import { Home } from "./pages/Home";
import { Videos } from "./pages/Videos";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// TODO: add themes here
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <Router>
        <BaseLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<LoginForm mode="signup" />} />
            <Route path="/login" element={<LoginForm mode="login" />} />
            <Route
              path="/videos"
              element={
                <ProtectedRoute>
                  <Videos />
                </ProtectedRoute>
              }
            />
          </Routes>
      </BaseLayout>
      <ToastContainer />
      </Router>
  </React.StrictMode>
);
