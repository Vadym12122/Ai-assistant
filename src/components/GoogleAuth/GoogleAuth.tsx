import React from "react";
import { GoogleLogin } from "@react-oauth/google"; // Імпортуємо компонент GoogleLogin
import { jwtDecode } from "jwt-decode"; // Для декодування токенів
import styles from "./GoogleAuth.module.scss";

const GoogleAuth: React.FC = () => {
    // Обробка успішного входу

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
        }

        // Збереження токену в localStorage
        localStorage.setItem("token", response.credential);

        // Перенаправлення на головну сторінку після успішного входу
        window.location.href = "/";
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
        </div>
    );
};

export default GoogleAuth;
