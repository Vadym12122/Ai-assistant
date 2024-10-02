import React, { useState } from "react";
import styles from "../GoogleAuth/GoogleAuth.module.scss";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const GoogleRegister: React.FC = () => {
    const [message, setMessage] = useState("");

    // Описуємо структуру токена
    interface GoogleJwtPayload {
        name: string;
        email: string;
        // Додаткові властивості, які можуть бути у токені
    }

    const handleSuccess = async (response: any) => {
        const decoded = jwtDecode<GoogleJwtPayload>(response.credential);
        const { name, email } = decoded;

        // Перевірка наявності користувача у базі
        const res = await fetch("http://localhost:3000/users?email=" + email);
        const existingUser = await res.json();

        if (existingUser.length === 0) {
            // Якщо користувач не існує, створюємо нового
            await fetch("http://localhost:3000/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: name, email }), // Додайте інші поля за потреби
            });
            setMessage("Реєстрація успішна!"); // Відображаємо повідомлення про успіх
        } else {
            setMessage("Користувач з таким email вже існує!"); // Повідомлення про існуючий обліковий запис
        }
    };

    const handleError = () => {
        setMessage("Сталася помилка при реєстрації!"); // Повідомлення про помилку
    };

    return (
        <div>
            <h2 className={styles.auth}>Реєстрація через Google</h2>
            <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
            {message && <p>{message}</p>}
        </div>
    );
};

export default GoogleRegister;
