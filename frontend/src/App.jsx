import { useState } from "react";

function App() {

    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);

    async function sendMessage() {

        if (message.trim() === "") {
            return;
        }

        const userMessage = {
            sender: "You",
            text: message
        };

        setChat(prev => [...prev, userMessage]);

        const currentMessage = message;

        setMessage("");

        try {

            const response = await fetch(
                "https://personal-ai-k3rx.onrender.com/chat",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        message: currentMessage
                    })
                }
            );

            // SAFE RESPONSE
            const text = await response.text();

            console.log(text);

            let data;

            try {

                data = JSON.parse(text);

            } catch {

                data = {
                    response: text
                };
            }

            const aiMessage = {
                sender: "AI",
                text: data.response || "No response from AI"
            };

            setChat(prev => [...prev, aiMessage]);

        } catch (error) {

            console.log(error);

            const errorMessage = {
                sender: "AI",
                text: "Backend connection failed."
            };

            setChat(prev => [...prev, errorMessage]);
        }
    }

    function handleEnter(event) {

        if (event.key === "Enter") {
            sendMessage();
        }
    }

    return (

        <div
            style={{
                backgroundColor: "black",
                color: "white",
                minHeight: "100vh",
                padding: "20px",
                fontFamily: "Arial"
            }}
        >

            <h1
                style={{
                    textAlign: "center"
                }}
            >
                🔥 Siddhu Personal AI
            </h1>

            <div
                style={{
                    border: "1px solid #444",
                    borderRadius: "10px",
                    padding: "20px",
                    height: "500px",
                    overflowY: "auto",
                    backgroundColor: "#111",
                    marginBottom: "20px"
                }}
            >

                {
                    chat.map((msg, index) => (

                        <p key={index}>
                            <b>{msg.sender}:</b> {msg.text}
                        </p>
                    ))
                }

            </div>

            <div
                style={{
                    display: "flex",
                    gap: "10px"
                }}
            >

                <input
                    type="text"
                    placeholder="Ask anything..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleEnter}
                    style={{
                        flex: 1,
                        padding: "15px",
                        borderRadius: "10px",
                        border: "1px solid #555",
                        backgroundColor: "#1e1e1e",
                        color: "white",
                        fontSize: "16px"
                    }}
                />

                <button
                    onClick={sendMessage}
                    style={{
                        padding: "15px 25px",
                        backgroundColor: "#2563eb",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer"
                    }}
                >
                    Send
                </button>

            </div>

        </div>
    );
}

export default App;