import React, { useState } from "react";
import styles from "./LoginForm.module.scss";
import GoogleAuth from "../../components/GoogleAuth/GoogleAuth";

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
            const response = await fetch("http://localhost:3000/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password, rememberMe }),
            });

            if (!response.ok) {
                throw new Error("Невірні облікові дані");
            }

            window.location.href = "/";

            // const data = await response.json();

            // console.log("Успішний вхід", data);
        } catch (err) {
            setError("Невірні облікові дані. Спробуйте ще раз.");
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
        </div>
    );
};

export default LoginForm;
