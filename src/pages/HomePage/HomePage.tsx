import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GoogleAuth from "../../components/GoogleAuth/GoogleAuth";

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Очистити токен із localStorage
        localStorage.removeItem("token");

        // Повернутися на сторінку входу після виходу
        navigate("/login");
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Вітаємо на головній сторінці!</h1>
            <p>Ви успішно увійшли в систему через Google.</p>
            <button
                onClick={handleLogout}
                style={{
                    padding: "10px 20px",
                    fontSize: "16px",
                    cursor: "pointer",
                }}
            >
                Вийти
            </button>
        </div>
    );
};

export default HomePage;
