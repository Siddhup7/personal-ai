import {
    useState,
    useRef,
    useEffect
} from "react";

import Particles from "react-tsparticles";

function App() {

    const [message, setMessage] =
        useState("");

    const [chat, setChat] =
        useState([]);

    const [history, setHistory] =
        useState([]);

    const chatEndRef =
        useRef(null);

    // LOAD HISTORY

    useEffect(() => {

        const savedHistory =
            localStorage.getItem(
                "chatHistory"
            );

        if (savedHistory) {

            setHistory(
                JSON.parse(savedHistory)
            );
        }

    }, []);

    // SAVE HISTORY

    useEffect(() => {

        localStorage.setItem(
            "chatHistory",
            JSON.stringify(history)
        );

    }, [history]);

    // AUTO SCROLL

    useEffect(() => {

        chatEndRef.current
        ?.scrollIntoView({
            behavior: "smooth"
        });

    }, [chat]);

    // WAKE BACKEND

    useEffect(() => {

        fetch(
            "https://personal-ai-k3rx.onrender.com/"
        );

    }, []);

    // NEW CHAT

    function newChat() {

        if (chat.length > 0) {

            const alreadyExists =
                history.some(
                    item =>
                        JSON.stringify(
                            item.messages
                        ) === JSON.stringify(chat)
                );

            if (!alreadyExists) {

                const updatedHistory = [

                    {
                        title:
                        chat[0]?.text
                        ?.slice(0, 30) ||
                        "New Chat",

                        messages: chat
                    },

                    ...history
                ];

                setHistory(
                    updatedHistory
                );
            }
        }

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

        const typingMessage = {
            sender: "AI",
            text:
            "⚡ Initializing AI Brain..."
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

            // TYPING EFFECT

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
                            12
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

            // AI VOICE

            const speech =
                new SpeechSynthesisUtterance(
                    fullText
                );

            speech.lang = "en-US";

            speech.rate = 1;

            speech.pitch = 1;

            window.speechSynthesis.speak(
                speech
            );

            // AUTO SAVE CHAT

            setTimeout(() => {

                const currentFullChat = [

                    ...chat,

                    userMessage,

                    {
                        sender: "AI",
                        text: fullText
                    }
                ];

                const updatedHistory = [

                    {
                        title:
                        currentMessage
                        .slice(0, 30),

                        messages:
                        currentFullChat
                    },

                    ...history.filter(
                        item =>
                            item.title !==
                            currentMessage
                            .slice(0, 30)
                    )
                ];

                setHistory(
                    updatedHistory
                );

            }, 500);

        } catch (error) {

            setChat(prev =>
                prev.slice(0, -1)
            );

            setChat(prev => [

                ...prev,

                {
                    sender: "AI",

                    text:
                    "Backend connection failed."
                }
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
                position: "relative",
                overflow: "hidden",
                minHeight: "100vh"
            }}
        >

            {/* PARTICLES */}

            <Particles
                options={{
                    background: {
                        color: {
                            value: "#050816"
                        }
                    },

                    particles: {

                        number: {
                            value: 70
                        },

                        color: {
                            value: "#ffffff"
                        },

                        links: {
                            enable: true,
                            color: "#ffffff",
                            opacity: 0.08
                        },

                        move: {
                            enable: true,
                            speed: 1
                        },

                        size: {
                            value: 2
                        },

                        opacity: {
                            value: 0.3
                        }
                    }
                }}

                style={{
                    position: "absolute"
                }}
            />

            {/* MAIN UI */}

            <div
                style={{
                    position: "relative",

                    zIndex: 10,

                    display: "flex",

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
                        "1px solid rgba(255,255,255,0.08)",

                        padding: "20px",

                        overflowY: "auto"
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

                            borderRadius: "14px",

                            background:
                            "linear-gradient(45deg,#2563eb,#7c3aed)",

                            color: "white",

                            fontSize: "16px",

                            cursor: "pointer",

                            transition:
                            "0.3s"
                        }}
                    >
                        + New Chat
                    </button>

                    {/* HISTORY */}

                    <div
                        style={{
                            marginTop: "25px"
                        }}
                    >

                    {
                        history.map(
                        (item, index) => (

                            <div

                                key={index}

                                onClick={() =>
                                    setChat(
                                        item.messages
                                    )
                                }

                                style={{
                                    padding: "14px",

                                    marginBottom:
                                    "12px",

                                    background:
                                    "rgba(255,255,255,0.05)",

                                    border:
                                    "1px solid rgba(255,255,255,0.05)",

                                    borderRadius:
                                    "14px",

                                    cursor:
                                    "pointer",

                                    fontSize:
                                    "14px",

                                    backdropFilter:
                                    "blur(10px)"
                                }}
                            >

                                {item.title}

                            </div>
                        ))
                    }

                    </div>

                </div>

                {/* CHAT */}

                <div
                    style={{
                        flex: 1,

                        padding: "20px",

                        display: "flex",

                        justifyContent:
                        "center",

                        alignItems:
                        "center"
                    }}
                >

                    <div
                        style={{
                            width: "100%",

                            maxWidth: "950px",

                            background:
                            "rgba(24,24,24,0.7)",

                            backdropFilter:
                            "blur(16px)",

                            border:
                            "1px solid rgba(255,255,255,0.08)",

                            borderRadius:
                            "24px",

                            padding: "25px",

                            boxShadow:
                            "0px 0px 60px rgba(59,130,246,0.15)"
                        }}
                    >

                        {/* PREMIUM NAVBAR */}

                        <div
                            style={{
                                display: "flex",

                                justifyContent:
                                "space-between",

                                alignItems:
                                "center",

                                marginBottom:
                                "20px",

                                padding:
                                "12px 20px",

                                background:
                                "rgba(255,255,255,0.05)",

                                border:
                                "1px solid rgba(255,255,255,0.08)",

                                borderRadius:
                                "16px",

                                backdropFilter:
                                "blur(12px)"
                            }}
                        >

                            <div
                                style={{
                                    fontSize:
                                    "18px",

                                    fontWeight:
                                    "bold"
                                }}
                            >
                                ⚡ AI Dashboard
                            </div>

                            <div
                                style={{
                                    display:
                                    "flex",

                                    alignItems:
                                    "center",

                                    gap:
                                    "10px"
                                }}
                            >

                                <div
                                    style={{
                                        width:
                                        "10px",

                                        height:
                                        "10px",

                                        borderRadius:
                                        "50%",

                                        background:
                                        "#22c55e",

                                        boxShadow:
                                        "0px 0px 10px #22c55e"
                                    }}
                                ></div>

                                <span
                                    style={{
                                        fontSize:
                                        "14px",

                                        opacity:
                                        0.8
                                    }}
                                >
                                    AI Online
                                </span>

                            </div>

                        </div>

                        <h1
                            style={{
                                textAlign:
                                "center",

                                marginBottom:
                                "20px",

                                fontSize:
                                "52px",

                                background:
                                "linear-gradient(45deg,#60a5fa,#a78bfa,#22c55e)",

                                WebkitBackgroundClip:
                                "text",

                                WebkitTextFillColor:
                                "transparent"
                            }}
                        >
                            ⚡ Siddhu Personal AI
                        </h1>

                        {/* CHAT BOX */}

                        <div
                            style={{
                                height: "500px",

                                overflowY:
                                "auto",

                                background:
                                "rgba(17,17,17,0.7)",

                                borderRadius:
                                "20px",

                                padding:
                                "20px",

                                border:
                                "1px solid rgba(255,255,255,0.05)"
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
                                                : "rgba(255,255,255,0.06)",

                                                padding:
                                                "16px",

                                                borderRadius:
                                                "18px",

                                                maxWidth:
                                                "70%",

                                                boxShadow:
                                                "0px 0px 15px rgba(0,0,0,0.2)"
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

                        {/* INPUT */}

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

                                    padding:
                                    "18px",

                                    borderRadius:
                                    "16px",

                                    border:
                                    "1px solid rgba(255,255,255,0.05)",

                                    outline:
                                    "none",

                                    background:
                                    "rgba(255,255,255,0.05)",

                                    color:
                                    "white",

                                    fontSize:
                                    "16px",

                                    boxShadow:
                                    "0px 0px 15px rgba(37,99,235,0.2)"
                                }}
                            />

                            <button
                                onClick={startVoice}

                                style={{
                                    padding:
                                    "18px 22px",

                                    borderRadius:
                                    "16px",

                                    border:
                                    "none",

                                    background:
                                    "#16a34a",

                                    color:
                                    "white",

                                    cursor:
                                    "pointer",

                                    fontSize:
                                    "18px"
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
                                    "16px",

                                    border:
                                    "none",

                                    background:
                                    "linear-gradient(45deg,#2563eb,#7c3aed)",

                                    color:
                                    "white",

                                    cursor:
                                    "pointer",

                                    fontSize:
                                    "16px",

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

        </div>
    );
}

export default App;