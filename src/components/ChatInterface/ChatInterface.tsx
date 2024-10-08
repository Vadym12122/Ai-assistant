import React, { useState, useEffect, useRef } from "react";
import styles from "./ChatInterface.module.scss";

interface Message {
    id: string;
    sender: "user" | "ai";
    content: string;
    type: "text" | "image";
    timestamp: string;
    messages: [];
}

interface chatInterfaceProps {
    threadId: string; // ID вибраної бесіди
}

const ChatInterface: React.FC<chatInterfaceProps> = ({ threadId }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState<string>(""); // Введене нове повідомлення

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // Завантаження повідомлень для конкретної бесіди
        const fetchMessages = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    `http://localhost:3000/threads/${threadId}`
                );
                const data = await response.json();

                if (data && data.messages) {
                    setMessages(data.messages); // Встановлюємо повідомлення для бесіди
                } else {
                    setMessages([]);
                }

                setLoading(false);
            } catch (err) {
                setError("Помилка завантаження повідомлень.");
                setLoading(false);
            }
        };

        fetchMessages();
    }, [threadId]);

    // Автоскрол до останнього повідомлення
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Обробка відправки нового повідомлення
    const handleSendMessage = async () => {
        if (newMessage.trim() === "") return; // цей код блокує можливість відправити порожнє повідомлення

        const newMessageObj: Message = {
            id: `${Date.now() + 1}`, // Генерація ID для нового повідомлення
            sender: "user",
            content: newMessage,
            type: "text",
            timestamp: new Date().toISOString(),
            messages: [],
        };

        try {
            // Додаємо нове повідомлення до відповідної бесіди
            const updatedMessages = [...messages, newMessageObj];
            setMessages(updatedMessages);
            setNewMessage(""); // Очищуємо поле після відправки

            // Оновлюємо повідомлення у db.json
            await fetch(`http://localhost:3000/threads/${threadId}`, {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({ messages: updatedMessages }),
            });
        } catch (error) {
            console.error("Помилка відправки повідомлення:", error);
        }

        // Симуляція відповіді від AI (для тестування)
        setTimeout(() => {
            const aiMessage: Message = {
                id: `${Date.now() + 1}`,
                sender: "ai",
                content: "Це відповідь AI на ваше повідомлення.",
                type: "text",
                timestamp: new Date().toISOString(),
                messages: [],
            };

            setMessages((prevMessages) => [...prevMessages, aiMessage]);
        }, 1000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    return (
        <div className={styles.chatInterface}>
            <div className={styles.chatInterface__messages}>
                {loading ? (
                    <p>Завантаження повідомлень...</p>
                ) : error ? (
                    <p>error</p>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message.id}
                            className={
                                message.sender === "user"
                                    ? styles.chatInterface__userMessage
                                    : styles.chatInterface__aiMessage
                            }
                        >
                            {message.type === "text" ? (
                                <p>{message.content}</p>
                            ) : (
                                <div>Початок бесіди</div>
                            )}
                            <span className={styles.chatInterface__timestamp}>
                                {new Date(message.timestamp).toLocaleString()}
                            </span>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef}></div>
            </div>
            <div className={styles.chatInterface__input}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyUp={handleKeyPress}
                    placeholder="Напишіть повідомлення..."
                />
            </div>
        </div>
    );
};

export default ChatInterface;
