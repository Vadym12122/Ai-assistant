import React from "react";
import { GoogleLogin } from "@react-oauth/google"; // Імпортуємо компонент GoogleLogin
import { jwtDecode } from "jwt-decode"; // Для декодування токенів

const GoogleAuth: React.FC = () => {
    // Обробка успішного входу
    const handleSuccess = (response: any) => {
        const decoded = jwtDecode(response.credential);
        console.log("User Info:", decoded); // Інформація про користувача

        // Збереження токену в localStorage
        localStorage.setItem("token", response.credential);

        // Перенаправлення на головну сторінку після входу
        window.location.href = "/";
    };

    // Обробка помилки при вході
    const handleError = () => {
        console.error("Error during Google Sign-In");
    };

    return (
        <div>
            <h2>Увійти через Google</h2>
            <GoogleLogin
                onSuccess={handleSuccess} // Функція для обробки успішного входу
                onError={handleError} // Функція для обробки помилок
            />
        </div>
    );
};

export default GoogleAuth;
