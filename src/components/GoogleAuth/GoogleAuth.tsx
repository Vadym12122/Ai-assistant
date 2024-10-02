import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google"; // Імпортуємо компонент GoogleLogin
import { jwtDecode } from "jwt-decode"; // Для декодування токенів
import styles from "./GoogleAuth.module.scss";

const GoogleAuth: React.FC = () => {
    const [message, setMessage] = useState<string | null>(null);
    // Обробка успішного входу

    // Описуємо структуру токена
    interface GoogleJwtPayload {
        email: string;
        name: string;
        sub: string; // Google ID користувача
    }

    // Обробка успішного входу
    const handleSuccess = async (response: any) => {
        // Декодуємо токен Google
        const decoded = jwtDecode<GoogleJwtPayload>(response.credential);
        const { email, name, sub: googleId } = decoded;

        // Збереження даних користувача в локальне сховище (localStorage)
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", name);
        localStorage.setItem("googleId", googleId);

        setMessage(`Вітаємо, ${name}! Вхід успішний.`);
        window.location.href = "/"; // Перенаправлення на головну сторінку
    };

    // Обробка помилки при вході

    const handleError = () => {
        console.error("Error during Google Sign-In");
    };

    return (
        <div>
            <h2 className={styles.auth}>Увійти через Google</h2>

            <GoogleLogin
                onSuccess={handleSuccess} // Функція для обробки успішного входу
                onError={handleError} // Функція для обробки помилок
            />
            {message && <p>{message}</p>}
        </div>
    );
};

export default GoogleAuth;
