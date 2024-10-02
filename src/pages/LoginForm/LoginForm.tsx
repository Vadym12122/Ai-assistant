import React, { useState } from "react";
import styles from "./LoginForm.module.scss";
import GoogleAuth from "../../components/GoogleAuth/GoogleAuth";
import { Link } from "react-router-dom";

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [emailValid, setEmailValid] = useState<boolean>(true); // Стан для валідності email
    const [passwordValid, setPasswordValid] = useState<boolean>(true); // Стан для валідності паролю

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let valid = true;

        if (!email || !password) {
            setEmailValid(false);
            valid = false;
        } else {
            setEmailValid(true);
        }

        if (!password) {
            setPasswordValid(false);
            valid = false;
        } else {
            setPasswordValid(true);
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            setEmailValid(false);
            setError("Невірний формат електронної пошти.");
            return;
        }

        if (!valid) {
            setError("Будь ласка, заповніть всі поля!");
            return;
        }

        try {
            // Перевірка, чи існує користувач з таким email
            const res = await fetch(
                `http://localhost:3000/users?email=${email}&password=${password}`
            );
            const existingUser = await res.json();

            if (existingUser.length > 0) {
                // Якщо користувач знайдений, перевіряємо чи пароль збігається
                const user = existingUser[0];

                if (user.password === password || user.email === email) {
                    // Користувач з цими даними існує, вхід успішний

                    window.location.href = "/";
                }
            } else {
                setError("Такого користувача немає!");
                return;
            }
        } catch (error) {
            console.error("Помилка під час входу:", error);
            alert("Сталася помилка при вході.");
        }

        setEmail("");
        setPassword("");
        setError("");
    };

    return (
        <div>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input
                    placeholder="Email"
                    className={`${styles["form__input"]} ${
                        !emailValid ? styles["invalid"] : ""
                    }`}
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    placeholder="Password"
                    className={`${styles["form__input"]} ${
                        !passwordValid ? styles["invalid"] : ""
                    }`}
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <label className={styles.form__label}>
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Запам'ятати мене</span>
                </label>

                {error && <p className={styles.errorMessage}>{error}</p>}

                <button className={styles.form__button} type="submit">
                    Увійти
                </button>
            </form>

            <GoogleAuth />

            <p className={styles.form__redirect}>
                Немає акаунту?
                <Link className={styles.form__link} to="/register">
                    Зареєструватися
                </Link>
            </p>
        </div>
    );
};

export default LoginForm;
