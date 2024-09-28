import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import HomePage from "./pages/HomePage/HomePage";
import LoginForm from "./pages/LoginForm/LoginForm";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import GoogleAuth from "./components/GoogleAuth/GoogleAuth";
import "./index.scss";

const App: React.FC = () => {
    return (
        <GoogleOAuthProvider clientId="439834446069-e51er61hcv87ji7e2jtf66n0n9i51n3m.apps.googleusercontent.com">
            <Router>
                <div className="App">
                    <Routes>
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/" element={<HomePage />} />
                        <Route path="/auth/google" element={<GoogleAuth />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </div>
            </Router>
        </GoogleOAuthProvider>
    );
};

export default App;
