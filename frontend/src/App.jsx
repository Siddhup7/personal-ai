import {
    useState,
    useRef,
    useEffect
} from "react";

function App() {

    const [message, setMessage] =
        useState("");

    const [chat, setChat] =
        useState([]);

    const chatEndRef =
        useRef(null);

    // AUTO SCROLL
    useEffect(() => {

        chatEndRef.current
        ?.scrollIntoView({
            behavior: "smooth"
        });

    }, [chat]);

    // NEW CHAT
    function newChat() {

        setChat([]);
    }

    // SEND MESSAGE
    async function sendMessage() {

        if (message.trim() === "") {
            return;
        }

        const userMessage = {
            sender: "You",
            text: message
        };

        setChat(prev => [
            ...prev,
            userMessage
        ]);

        const currentMessage =
            message;

        setMessage("");

        // TYPING
        const typingMessage = {
            sender: "AI",
            text: "Typing..."
        };

        setChat(prev => [
            ...prev,
            typingMessage
        ]);

        try {

            const response =
                await fetch(
                    "https://personal-ai-k3rx.onrender.com/chat",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                            "application/json"
                        },

                        body: JSON.stringify({
                            message:
                            currentMessage
                        })
                    }
                );

            const data =
                await response.json();

            // REMOVE TYPING
            setChat(prev =>
                prev.slice(0, -1)
            );

            // AI TYPING EFFECT
            const fullText =
                data.response;

            let currentText = "";

            const aiMessage = {
                sender: "AI",
                text: ""
            };

            setChat(prev => [
                ...prev,
                aiMessage
            ]);

            for (
                let i = 0;
                i < fullText.length;
                i++
            ) {

                currentText +=
                    fullText[i];

                await new Promise(
                    resolve =>
                        setTimeout(
                            resolve,
                            15
                        )
                );

                setChat(prev => {

                    const updated =
                        [...prev];

                    updated[
                        updated.length - 1
                    ] = {
                        sender: "AI",
                        text: currentText
                    };

                    return updated;
                });
            }

        } catch (error) {

            setChat(prev =>
                prev.slice(0, -1)
            );

            const errorMessage = {
                sender: "AI",
                text:
                "Backend connection failed."
            };

            setChat(prev => [
                ...prev,
                errorMessage
            ]);
        }
    }

    // ENTER KEY
    function handleEnter(event) {

        if (event.key === "Enter") {

            sendMessage();
        }
    }

    // VOICE INPUT
    function startVoice() {

        const recognition =
            new window.webkitSpeechRecognition();

        recognition.lang = "en-US";

        recognition.onresult =
        function(event) {

            const text =
                event.results[0][0]
                .transcript;

            setMessage(text);
        };

        recognition.start();
    }

    return (

        <div
            style={{
                display: "flex",

                background:
                "linear-gradient(to bottom right,#050816,#111827,#0f172a)",

                minHeight: "100vh",

                color: "white",

                fontFamily: "Arial"
            }}
        >

            {/* SIDEBAR */}

            <div
                style={{
                    width: "260px",

                    background:
                    "rgba(17,17,17,0.8)",

                    backdropFilter:
                    "blur(12px)",

                    borderRight:
                    "1px solid rgba(255,255,255,0.1)",

                    padding: "20px"
                }}
            >

                <h2>
                    🤖 Siddhu AI
                </h2>

                <button
                    onClick={newChat}

                    style={{
                        width: "100%",

                        padding: "15px",

                        marginTop: "20px",

                        border: "none",

                        borderRadius: "12px",

                        background:
                        "linear-gradient(45deg,#2563eb,#7c3aed)",

                        color: "white",

                        fontSize: "16px",

                        cursor: "pointer",

                        transition: "0.3s"
                    }}
                >
                    + New Chat
                </button>

            </div>

            {/* MAIN CHAT */}

            <div
                style={{
                    flex: 1,

                    padding: "20px",

                    display: "flex",

                    justifyContent: "center",

                    alignItems: "center"
                }}
            >

                <div
                    style={{
                        width: "100%",

                        maxWidth: "900px",

                        background:
                        "rgba(24,24,24,0.7)",

                        backdropFilter:
                        "blur(12px)",

                        border:
                        "1px solid rgba(255,255,255,0.1)",

                        borderRadius: "20px",

                        padding: "25px",

                        boxShadow:
                        "0px 0px 40px rgba(0,0,0,0.5)"
                    }}
                >

                    <h1
                        style={{
                            textAlign: "center",

                            marginBottom: "20px",

                            fontSize: "48px",

                            background:
                            "linear-gradient(45deg,#60a5fa,#a78bfa,#22c55e)",

                            WebkitBackgroundClip:
                            "text",

                            WebkitTextFillColor:
                            "transparent",

                            fontWeight: "bold",

                            letterSpacing: "2px"
                        }}
                    >
                        ⚡ Siddhu Personal AI
                    </h1>

                    <div
                        style={{
                            height: "500px",

                            overflowY: "auto",

                            background:
                            "rgba(17,17,17,0.7)",

                            borderRadius: "15px",

                            padding: "20px",

                            border:
                            "1px solid rgba(255,255,255,0.1)"
                        }}
                    >

                        {
                            chat.map(
                            (msg, index) => (

                                <div
                                    key={index}

                                    style={{
                                        display:
                                        "flex",

                                        justifyContent:
                                        msg.sender === "You"
                                        ? "flex-end"
                                        : "flex-start",

                                        marginBottom:
                                        "15px"
                                    }}
                                >

                                    <div
                                        style={{
                                            background:
                                            msg.sender === "You"
                                            ? "linear-gradient(45deg,#2563eb,#7c3aed)"
                                            : "#2a2a2a",

                                            padding:
                                            "15px",

                                            borderRadius:
                                            "15px",

                                            maxWidth:
                                            "70%",

                                            fontSize:
                                            "18px",

                                            lineHeight:
                                            "1.5"
                                        }}
                                    >

                                        <b>
                                            {msg.sender}
                                        </b>

                                        <br />

                                        {msg.text}

                                    </div>

                                </div>
                            ))
                        }

                        <div
                            ref={chatEndRef}
                        ></div>

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

                            placeholder=
                            "Ask anything..."

                            value={message}

                            onChange={(e) =>
                                setMessage(
                                    e.target.value
                                )
                            }

                            onKeyDown={
                                handleEnter
                            }

                            style={{
                                flex: 1,

                                padding: "18px",

                                borderRadius:
                                "15px",

                                border: "none",

                                outline: "none",

                                background:
                                "#222",

                                color: "white",

                                fontSize: "17px"
                            }}
                        />

                        <button
                            onClick={startVoice}

                            style={{
                                padding:
                                "18px 22px",

                                borderRadius:
                                "15px",

                                border: "none",

                                background:
                                "#16a34a",

                                color: "white",

                                fontSize:
                                "18px",

                                cursor:
                                "pointer",

                                transition:
                                "0.3s"
                            }}
                        >
                            🎤
                        </button>

                        <button
                            onClick={sendMessage}

                            style={{
                                padding:
                                "18px 28px",

                                borderRadius:
                                "15px",

                                border: "none",

                                background:
                                "linear-gradient(45deg,#2563eb,#7c3aed)",

                                color: "white",

                                fontSize:
                                "17px",

                                cursor:
                                "pointer",

                                transition:
                                "0.3s"
                            }}
                        >
                            Send
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default App;