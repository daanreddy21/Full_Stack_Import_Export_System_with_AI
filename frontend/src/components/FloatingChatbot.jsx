import { useState } from "react";
import { FaRobot, FaTimes } from "react-icons/fa";
import API from "../services/api";
export default function FloatingChatbot() {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [chat, setChat] = useState([
            {
                type: "bot",
                text:
                `Hello 👋
        I am your Import Export AI Assistant.
        I can help you with:
        • Duty calculation
        • OCR workflow
        • HSN classification
        • Validation issues
        • Analytics
        • Shipment tracking
        Ask me anything about the software.`
            }
        ]);
    const sendMessage = async () => {
        if (!message.trim()) return;
        const userMessage = {
            type: "user",
            text: message
        };
        setChat(prev => [
            ...prev,
            userMessage
        ]);
        setLoading(true);
        try {
            const response = await API.post(
                "/api/chat",
                {
                    message
                }
            );
            const botMessage = {
                type: "bot",
                text: response.data.reply
            };
            setChat(prev => [
                ...prev,
                botMessage
            ]);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
        setMessage("");
    };
    return (
        <>
            <button
                onClick={() => setOpen(!open)}
                className="fixed bottom-6 right-6 bg-black text-white p-5 rounded-full shadow-2xl z-50 hover:scale-110 transition"
            >
                {
                    open
                    ? <FaTimes size={24} />
                    : <FaRobot size={24} />
                }
            </button>
            {
                open && (
                    <div className="fixed bottom-24 right-6 w-[380px] h-[550px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
                        <div className="bg-black text-white p-4 flex items-center gap-3">
                            <FaRobot />
                            <h2 className="font-bold">AI Assistant</h2>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto bg-gray-100 space-y-4">
                            {
                                chat.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${
                                            msg.type === "user"
                                            ? "justify-end"
                                            : "justify-start"
                                        }`}
                                    >
                                        <div
                                            className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                                                msg.type === "user"
                                                ? "bg-black text-white"
                                                : "bg-white shadow"
                                            }`}
                                        >
                                            <div className="whitespace-pre-line">
                                                {msg.text}
                                                </div>
                                        </div>
                                    </div>
                                ))
                            }
                            {
                                loading && (
                                    <div className="flex justify-start">
                                        <div className="bg-white shadow px-4 py-3 rounded-2xl">
                                            Typing...
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                        <div className="p-4 border-t flex gap-3">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) =>
                                    setMessage(e.target.value)
                                }
                                placeholder="Ask about software..."
                                className="flex-1 border rounded-xl px-4 py-3 outline-none"
                            />
                            <button
                                onClick={sendMessage}
                                className="bg-black text-white px-5 rounded-xl"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                )
            }
        </>
    );
}