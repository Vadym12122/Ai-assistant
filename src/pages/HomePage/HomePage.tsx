import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThreadsList from "../../components/ThreadsList/ThreadsList.tsx";
import ChatInterface from "../../components/ChatInterface/ChatInterface.tsx";
import styles from "./HomePage.module.scss";

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedThreadId, setSelectedThreadId] = useState<string | null>(
        null
    ); // Стежимо за вибраною бесідою
    const [threads, setThreads] = useState<any[]>([]);

    const userId = localStorage.getItem("userId");

    if (!userId) {
        navigate("/login");
        return null; // Якщо немає userId, перенаправляємо на сторінку входу
    }

    // Функція для вибору бесіди
    const handleSelectThread = (conversationId: string) => {
        setSelectedThreadId(conversationId);
    };

    const handleNewConversation = () => {
        // Створення нової бесіди
        createNewThread();
        navigate("/chat/new");
    };

    const handleLogout = () => {
        // Очистити токен із localStorage
        localStorage.removeItem("token");

        // Повернутися на сторінку входу після виходу
        navigate("/login");
    };

    const createNewThread = async () => {
        const newThread = {
            id: `${Date.now()}`,
            title: `Нова бесіда ${threads.length + 1}`, // Назва нової бесіди
            timestamp: new Date().toISOString(),
            unreadMessages: 0,
            userId: userId, // додай цей userId щоб новий thread був прив'язаний до користувача
            messages: [],
        };

        try {
            // Запит на створення нової бесіди у db.json
            const response = await fetch("http://localhost:3000/threads", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newThread),
            });

            if (!response.ok) {
                throw new Error("Не вдалося створити нову бесіду.");
            }

            const createdThread = await response.json();
            setThreads((prev) => [...prev, createdThread]); // Оновлюємо список бесід
        } catch (error) {
            console.error("Помилка створення нової бесіди:", error);
        }
    };

    return (
        <div className={styles.homePage}>
            <header className={styles.homePage__header}>
                <h1>AI Chat</h1>
                <button onClick={handleLogout}>Вийти</button>
            </header>
            <div className={styles.homePage__wrapper}>
                <div className={styles.homePage__threadsList}>
                    <ThreadsList
                        onSelectThread={handleSelectThread}
                        userId={userId}
                        onCreateNewThread={handleNewConversation}
                    />
                </div>
                <div className={styles.homePage__chatInterface}>
                    {selectedThreadId ? (
                        <ChatInterface threadId={selectedThreadId} />
                    ) : (
                        <p>
                            Виберіть бесіду або створіть нову, щоб почати
                            спілкування.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
