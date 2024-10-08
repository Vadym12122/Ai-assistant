import React, { useEffect, useState } from "react";
import styles from "../../pages/HomePage/HomePage.module.scss";

interface Conversation {
    id: string;
    title: string;
    timestamp: string;
    unreadMessages: number;
    messages: [];
}

interface ThreadsListProps {
    onSelectThread: (conversationId: string) => void;
    userId: string;
    onCreateNewThread: () => void;
}

const ThreadsList: React.FC<ThreadsListProps> = ({
    onSelectThread,
    userId,
    onCreateNewThread,
}) => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Запит до API для отримання бесід
        const fetchConversations = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3000/threads?userId=${userId}`
                );
                const data = await response.json();

                // Додаємо порожнє поле "messages" до бесід, які його не мають
                const updatedConversations = data.map((thread: any) => {
                    if (!thread.messages) {
                        thread.messages = [];
                    }
                    return thread;
                });

                setConversations(updatedConversations);
                setLoading(false);
            } catch (error) {
                console.error("Помилка отримання бесід:", error);
                setLoading(false);
            }
        };

        fetchConversations();
    }, [userId]);

    return (
        <div className={styles.homePage__threads}>
            {loading ? (
                <p>Завантаження бесід...</p>
            ) : (
                <ul className={styles.homePage__conversationsList}>
                    {conversations.map((conversation) => (
                        <li
                            key={conversation.id}
                            className={styles.homePage__conversationItem}
                            onClick={() => onSelectThread(conversation.id)}
                        >
                            <h2>{conversation.title}</h2>
                            <p>
                                Останнє повідомлення:{" "}
                                {new Date(
                                    conversation.timestamp
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
            <button
                onClick={onCreateNewThread}
                className={styles.homePage__newConversationButton}
            >
                Нова розмова
            </button>
        </div>
    );
};

export default ThreadsList;
