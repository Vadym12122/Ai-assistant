import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HomePage.module.scss";

interface Conversation {
    id: string;
    title: string;
    lastMessageTime: string;
    unreadMessages: number;
}

const HomePage: React.FC = () => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    const userId = localStorage.getItem("userId");

    if (!userId) {
        navigate("/login");
        return;
    }

    useEffect(() => {
        // Запит до API для отримання бесід
        const fetchConversations = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3000/threads?userId=${userId}`
                );
                const data = await response.json();
                setConversations(data);
                setLoading(false);
            } catch (error) {
                console.error("Помилка отримання бесід:", error);
                setLoading(false);
            }
        };

        fetchConversations();
    }, [navigate]);

    const handleConversationClick = (conversationId: string) => {
        // Перенаправлення на сторінку чату для певної бесіди
        navigate(`/chat/${conversationId}`);
    };

    const handleNewConversation = () => {
        // Створення нової бесіди
        navigate("/chat/new");
    };

    const handleLogout = () => {
        // Очистити токен із localStorage
        localStorage.removeItem("token");

        // Повернутися на сторінку входу після виходу
        navigate("/login");
    };

    return (
        <div className={styles.homePage}>
            <header className={styles.homePage__header}>
                <h1>AI Chat</h1>
                <button onClick={handleLogout}>Вийти</button>
            </header>
            <div className={styles.homePage__content}>
                {loading ? (
                    <p>Завантаження бесід...</p>
                ) : (
                    <ul className={styles.homePage__conversationsList}>
                        {conversations.map((conversation) => (
                            <li
                                key={conversation.id}
                                className={styles.homePage__conversationItem}
                                onClick={() =>
                                    handleConversationClick(conversation.id)
                                }
                            >
                                <h2>{conversation.title}</h2>
                                <p>
                                    Останнє повідомлення:{" "}
                                    {new Date(
                                        conversation.lastMessageTime
                                    ).toLocaleDateString()}
                                </p>
                                {conversation.unreadMessages > 0 && (
                                    <span className={styles.unreadBadge}>
                                        {conversation.unreadMessages}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <button
                onClick={handleNewConversation}
                className={styles.homePage__newConversationButton}
            >
                Нова розмова
            </button>
        </div>
    );
};

export default HomePage;
