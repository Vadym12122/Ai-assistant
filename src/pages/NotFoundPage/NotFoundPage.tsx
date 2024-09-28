import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    const goHome = () => {
        navigate("/"); // Перенаправляє на головну сторінку
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>404 - Сторінку не знайдено</h1>
            <p>На жаль, сторінка, яку ви шукаєте, не існує.</p>
            <button
                onClick={goHome}
                style={{
                    padding: "10px 20px",
                    fontSize: "16px",
                    cursor: "pointer",
                }}
            >
                Повернутися на головну
            </button>
        </div>
    );
};

export default NotFoundPage;
