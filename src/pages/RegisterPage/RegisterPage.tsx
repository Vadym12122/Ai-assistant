import React, { useState } from "react";
import styles from "../LoginForm/LoginForm.module.scss";
import { Link } from "react-router-dom";
import GoogleRegister from "../../components/GoogleRegister/GoogleRegister";

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [emailValid, setEmailValid] = useState<boolean>(true); // Стан для валідності email
    const [passwordValid, setPasswordValid] = useState<boolean>(true); // Стан для валідності паролю

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Валідація
        if (!username || !email || !password || !confirmPassword) {
            setError("Всі поля обов’язкові для заповнення");
            return;
        }

        if (password !== confirmPassword) {
            setError("Паролі не співпадають");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            setEmailValid(false);
            setError("Невірний формат електронної пошти.");
            return;
        }

        if (password.length < 6) {
            setError("Пароль має містити щонайменше 6 символів");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (!response.ok) {
                throw new Error("Помилка реєстрації. Спробуйте ще раз.");
            }

            window.location.href = "/";
        } catch (err) {
            setError("Помилка реєстрації. Спробуйте ще раз.");
        }
    };

    return (
        <div>
            <h2>Реєстрація</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input
                    type="text"
                    className={styles.form__input}
                    placeholder="Ім'я користувача"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    className={`${styles["form__input"]} ${
                        !emailValid ? styles["invalid"] : ""
                    }`}
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    className={styles.form__input}
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    className={styles.form__input}
                    placeholder="Підтвердження пароля"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                {error && <p>{error}</p>}

                <button type="submit" className={styles.form__button}>
                    Зареєструватися
                </button>

                <GoogleRegister />

                <p className={styles.form__redirect}>
                    Вже маєте акаунт?
                    <Link className={styles.form__link} to="/login">
                        Увійти
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;
