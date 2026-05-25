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

            const data = await response.json();

            const aiMessage = {
                sender: "AI",
                text: data.response
            };

            setChat(prev => [...prev, aiMessage]);

        } catch (error) {

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
                background: "#0f0f0f",
                minHeight: "100vh",
                color: "white",
                fontFamily: "Arial",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px"
            }}
        >

            <div
                style={{
                    width: "100%",
                    maxWidth: "900px",
                    background: "#181818",
                    borderRadius: "20px",
                    padding: "25px",
                    boxShadow: "0px 0px 30px rgba(0,0,0,0.5)"
                }}
            >

                <h1
                    style={{
                        textAlign: "center",
                        marginBottom: "20px",
                        fontSize: "45px"
                    }}
                >
                    🔥 Siddhu Personal AI
                </h1>

                <div
                    style={{
                        height: "500px",
                        overflowY: "auto",
                        background: "#111",
                        borderRadius: "15px",
                        padding: "20px",
                        border: "1px solid #333"
                    }}
                >

                    {
                        chat.map((msg, index) => (

                            <div
                                key={index}
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        msg.sender === "You"
                                        ? "flex-end"
                                        : "flex-start",

                                    marginBottom: "15px"
                                }}
                            >

                                <div
                                    style={{
                                        background:
                                            msg.sender === "You"
                                            ? "#2563eb"
                                            : "#2a2a2a",

                                        padding: "15px",
                                        borderRadius: "15px",
                                        maxWidth: "70%",
                                        fontSize: "18px",
                                        lineHeight: "1.5"
                                    }}
                                >

                                    <b>{msg.sender}</b>

                                    <br />

                                    {msg.text}

                                </div>

                            </div>
                        ))
                    }

                </div>

                <div
                    style={{
                        display: "flex",
                        marginTop: "20px",
                        gap: "10px"
                    }}
                >

                    <input
                        type="text"
                        placeholder="Ask anything..."
                        value={message}
                        onChange={(e) =>
                            setMessage(e.target.value)
                        }
                        onKeyDown={handleEnter}

                        style={{
                            flex: 1,
                            padding: "18px",
                            borderRadius: "15px",
                            border: "none",
                            outline: "none",
                            background: "#222",
                            color: "white",
                            fontSize: "17px"
                        }}
                    />

                    <button
                        onClick={sendMessage}

                        style={{
                            padding: "18px 28px",
                            borderRadius: "15px",
                            border: "none",
                            background: "#2563eb",
                            color: "white",
                            fontSize: "17px",
                            cursor: "pointer"
                        }}
                    >
                        Send
                    </button>

                </div>

            </div>

        </div>
    );
}

export default App;