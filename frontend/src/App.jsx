import {
    useState,
    useRef,
    useEffect
} from "react";

import Particles from "@tsparticles/react";

import {
    loadSlim
} from "@tsparticles/slim";

import ReactMarkdown
from "react-markdown";

import {

    FiSend,
    FiMic,
    FiPlus,
    FiPaperclip,
    FiVolume2,
    FiMenu

} from "react-icons/fi";

function App() {

    const [message, setMessage] =
    useState("");

    const [chat, setChat] =
    useState([]);

    const [history, setHistory] =
    useState([]);

    const [sidebarOpen, setSidebarOpen] =
    useState(true);

    const [isSpeaking, setIsSpeaking] =
    useState(false);

    const [isThinking, setIsThinking] =
    useState(false);

    const chatEndRef =
    useRef(null);

    // PARTICLES

    const particlesInit =
    async (engine) => {

        await loadSlim(engine);
    };

    // LOAD HISTORY

    useEffect(() => {

        const savedHistory =
        localStorage.getItem(
            "chatHistory"
        );

        if(savedHistory){

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
            behavior:"smooth"
        });

    }, [chat]);

    // WAKE BACKEND

    useEffect(() => {

        fetch(
            "https://personal-ai-k3rx.onrender.com/"
        );

    }, []);

    // NEW CHAT

    function newChat(){

        setChat([]);
    }

    // SEND MESSAGE

    async function sendMessage(){

        if(message.trim()===""){
            return;
        }

        const userMessage = {

            sender:"You",
            text:message
        };

        setChat(prev=>[
            ...prev,
            userMessage
        ]);

        const currentMessage =
        message;

        setMessage("");

        setIsThinking(true);

        try{

            const response =
            await fetch(
                "https://personal-ai-k3rx.onrender.com/chat",
                {
                    method:"POST",

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body:JSON.stringify({
                        message:
                        currentMessage
                    })
                }
            );

            const data =
            await response.json();

            setIsThinking(false);

            const fullText =
            data.response;

            setChat(prev=>[
                ...prev,
                {
                    sender:"AI",
                    text:fullText
                }
            ]);

            const updatedHistory = [

                {
                    title:
                    currentMessage
                    .slice(0,30),

                    messages:[
                        ...chat,
                        userMessage,
                        {
                            sender:"AI",
                            text:fullText
                        }
                    ]
                },

                ...history
            ];

            setHistory(updatedHistory);

        }catch(error){

            setIsThinking(false);

            setChat(prev=>[
                ...prev,
                {
                    sender:"AI",
                    text:"Backend failed."
                }
            ]);
        }
    }

    // ENTER KEY

    function handleEnter(event){

        if(event.key==="Enter"){

            sendMessage();
        }
    }

    // VOICE INPUT

    function startVoice(){

        const recognition =
        new window.webkitSpeechRecognition();

        recognition.lang="en-US";

        recognition.onresult =
        function(event){

            const text =
            event.results[0][0]
            .transcript;

            setMessage(text);
        };

        recognition.start();
    }

    return(

        <>

        {/* LIGHTS */}

        <div className="lightGlow light1"></div>
        <div className="lightGlow light2"></div>
        <div className="lightGlow light3"></div>

        {/* AURORA */}

        <div className="aurora aurora1"></div>
        <div className="aurora aurora2"></div>
        <div className="aurora aurora3"></div>

        <div
            style={{
                position:"relative",
                height:"100dvh",
                overflow:"hidden"
            }}
        >

            {/* PARTICLES */}

            <Particles

                id="tsparticles"

                init={particlesInit}

                options={{

                    background:{
                        color:{
                            value:"#050816"
                        }
                    },

                    particles:{

                        number:{
                            value:55
                        },

                        color:{
                            value:"#ffffff"
                        },

                        links:{
                            enable:true,
                            opacity:0.08,
                            color:"#ffffff"
                        },

                        move:{
                            enable:true,
                            speed:1
                        },

                        size:{
                            value:2
                        },

                        opacity:{
                            value:0.25
                        }
                    }
                }}
            />

            {/* MAIN */}

            <div
                style={{
                    position:"relative",
                    zIndex:10,
                    display:"flex",
                    width:"100%",
                    height:"100dvh",
                    color:"white",
                    overflow:"hidden"
                }}
            >

                {/* SIDEBAR */}

                <div
                    className="
                    fadeIn
                    superCard
                    neonBorder
                    "

                    style={{

                        width:
                        sidebarOpen
                        ? "280px"
                        : "0px",

                        flexShrink:0,

                        padding:
                        sidebarOpen
                        ? "18px"
                        : "0px",

                        overflow:"hidden",

                        transition:"0.3s"
                    }}
                >

                    {
                        sidebarOpen && (

                        <>

                        <h2
                            className="floatSlow"

                            style={{
                                marginBottom:"20px",
                                fontSize:"26px",
                                fontWeight:"bold"
                            }}
                        >
                            🤖 Siddhu AI
                        </h2>

                        <button

                            onClick={newChat}

                            className="superButton"

                            style={{
                                width:"100%",
                                padding:"14px",
                                border:"none",
                                borderRadius:"18px",

                                background:
                                "linear-gradient(45deg,#2563eb,#7c3aed)",

                                color:"white",
                                fontSize:"15px",
                                cursor:"pointer",

                                display:"flex",
                                alignItems:"center",
                                justifyContent:"center",
                                gap:"10px"
                            }}
                        >

                            <FiPlus />

                            New Chat

                        </button>

                        {/* HISTORY */}

                        <div
                            style={{
                                marginTop:"20px"
                            }}
                        >

                            {
                                history.map(
                                (item,index)=>(

                                    <div

                                        key={index}

                                        onClick={()=>
                                            setChat(
                                                item.messages
                                            )
                                        }

                                        className="
                                        superCard
                                        superButton
                                        "

                                        style={{
                                            padding:"14px",
                                            borderRadius:"16px",
                                            marginBottom:"12px",
                                            cursor:"pointer",
                                            fontSize:"14px"
                                        }}
                                    >

                                        {item.title}

                                    </div>
                                ))
                            }

                        </div>

                        </>
                        )
                    }

                </div>

                {/* CHAT AREA */}

                <div
                    style={{
                        flex:1,
                        display:"flex",
                        justifyContent:"center",
                        padding:"8px",
                        overflow:"hidden"
                    }}
                >

                    <div
                        className="
                        superCard
                        neonBorder
                        "

                        style={{

                            flex:1,
                            width:"100%",
                            maxWidth:"100%",
                            minWidth:0,
                            height:"100%",

                            borderRadius:"32px",

                            display:"flex",

                            flexDirection:"column",

                            overflow:"hidden",

                            transition:"0.3s",

                            boxShadow:
                            "0px 0px 40px rgba(59,130,246,0.08)"
                        }}
                    >

                        {/* TOPBAR */}

                        <div
                            className="superInput"

                            style={{
                                padding:"16px",

                                display:"flex",

                                justifyContent:
                                "space-between",

                                alignItems:"center",

                                flexShrink:0
                            }}
                        >

                            <div
                                style={{
                                    display:"flex",
                                    alignItems:"center",
                                    gap:"14px"
                                }}
                            >

                                <button

                                    onClick={()=>
                                        setSidebarOpen(
                                            !sidebarOpen
                                        )
                                    }

                                    className="superButton"

                                    style={{
                                        background:
                                        "rgba(255,255,255,0.05)",

                                        border:"none",

                                        color:"white",

                                        cursor:"pointer",

                                        fontSize:"20px",

                                        width:"48px",

                                        height:"48px",

                                        borderRadius:"14px"
                                    }}
                                >

                                    <FiMenu />

                                </button>

                                <h1
                                    className="floatSlow"

                                    style={{
                                        fontSize:"34px",

                                        fontWeight:"bold",

                                        background:
                                        "linear-gradient(45deg,#60a5fa,#a78bfa,#22c55e)",

                                        WebkitBackgroundClip:
                                        "text",

                                        WebkitTextFillColor:
                                        "transparent"
                                    }}
                                >
                                    ⚡ Siddhu AI
                                </h1>

                            </div>

                            <div
                                style={{
                                    display:"flex",
                                    alignItems:"center",
                                    gap:"10px"
                                }}
                            >

                                <div
                                    style={{
                                        width:"10px",
                                        height:"10px",
                                        borderRadius:"50%",
                                        background:"#22c55e",

                                        boxShadow:
                                        "0px 0px 14px #22c55e"
                                    }}
                                ></div>

                                <span>
                                    Online
                                </span>

                            </div>

                        </div>

                        {/* CHAT */}

                        <div
                            style={{
                                flex:1,
                                display:"flex",
                                flexDirection:"column",
                                overflowY:"auto",
                                overflowX:"hidden",
                                padding:"28px"
                            }}
                        >

                            {
                                chat.length===0 && (

                                <div
                                    className="
                                    fadeIn
                                    floatSlow
                                    "

                                    style={{
                                        flex:1,
                                        display:"flex",
                                        flexDirection:"column",
                                        justifyContent:"center",
                                        alignItems:"center",
                                        textAlign:"center"
                                    }}
                                >

                                    <h1
                                        style={{
                                            fontSize:"60px",
                                            marginBottom:"14px"
                                        }}
                                    >
                                        ⚡
                                    </h1>

                                    <h2
                                        style={{
                                            fontSize:"42px",
                                            marginBottom:"16px"
                                        }}
                                    >
                                        Premium AI Assistant
                                    </h2>

                                    <p
                                        style={{
                                            opacity:0.7,
                                            fontSize:"18px"
                                        }}
                                    >
                                        Ask anything. Build anything.
                                    </p>

                                </div>
                                )
                            }

                            {
                                chat.map(
                                (msg,index)=>(

                                    <div

                                        key={index}

                                        className="fadeIn"

                                        style={{
                                            display:"flex",

                                            justifyContent:
                                            msg.sender==="You"
                                            ? "flex-end"
                                            : "flex-start",

                                            marginBottom:"18px"
                                        }}
                                    >

                                        <div
                                            className="
                                            superMessage
                                            "

                                            style={{
                                                background:
                                                msg.sender==="You"
                                                ? "linear-gradient(45deg,#2563eb,#7c3aed)"
                                                : "rgba(255,255,255,0.05)",

                                                backdropFilter:
                                                "blur(18px)",

                                                border:
                                                "1px solid rgba(255,255,255,0.06)",

                                                padding:"16px",

                                                borderRadius:"20px",

                                                maxWidth:"72%",

                                                lineHeight:"1.7",

                                                fontSize:"15px",

                                                overflowWrap:"break-word"
                                            }}
                                        >

                                            <b>
                                                {msg.sender}
                                            </b>

                                            <br />

                                            <ReactMarkdown>
                                                {msg.text}
                                            </ReactMarkdown>

                                        </div>

                                    </div>
                                ))
                            }

                            {
                                isThinking && (

                                <div
                                    className="
                                    fadeIn
                                    superCard
                                    "

                                    style={{
                                        width:"190px",
                                        padding:"16px",
                                        borderRadius:"18px"
                                    }}
                                >

                                    🤖 AI Thinking...

                                </div>
                                )
                            }

                            <div
                                ref={chatEndRef}
                            ></div>

                        </div>

                        {/* INPUT */}

                        <div
                            className="superInput"

                            style={{
                                padding:"16px",
                                flexShrink:0
                            }}
                        >

                            <div
                                style={{
                                    display:"flex",
                                    gap:"10px"
                                }}
                            >

                                <input

                                    type="text"

                                    placeholder=
                                    "Ask anything..."

                                    value={message}

                                    onChange={(e)=>
                                        setMessage(
                                            e.target.value
                                        )
                                    }

                                    onKeyDown={
                                        handleEnter
                                    }

                                    className="superInput"

                                    style={{
                                        flex:1,

                                        padding:"16px",

                                        borderRadius:"20px",

                                        color:"white",

                                        outline:"none",

                                        fontSize:"15px",

                                        background:
                                        "rgba(255,255,255,0.04)"
                                    }}
                                />

                                <button
                                    className="
                                    superButton
                                    superCard
                                    "

                                    style={{
                                        width:"56px",
                                        minWidth:"56px",

                                        border:"none",

                                        borderRadius:"18px",

                                        color:"white",

                                        cursor:"pointer",

                                        fontSize:"20px"
                                    }}
                                >

                                    <FiPaperclip />

                                </button>

                                <button

                                    onClick={startVoice}

                                    className="
                                    superButton
                                    "

                                    style={{
                                        width:"56px",
                                        minWidth:"56px",

                                        border:"none",

                                        borderRadius:"18px",

                                        background:
                                        isSpeaking
                                        ? "#dc2626"
                                        : "#16a34a",

                                        color:"white",

                                        cursor:"pointer",

                                        fontSize:"20px"
                                    }}
                                >

                                    {
                                        isSpeaking
                                        ? <FiVolume2 />
                                        : <FiMic />
                                    }

                                </button>

                                <button

                                    onClick={sendMessage}

                                    className="
                                    superButton
                                    "

                                    style={{
                                        width:"68px",
                                        minWidth:"68px",

                                        border:"none",

                                        borderRadius:"18px",

                                        background:
                                        "linear-gradient(45deg,#2563eb,#7c3aed)",

                                        color:"white",

                                        cursor:"pointer",

                                        fontSize:"22px"
                                    }}
                                >

                                    <FiSend />

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

        </>
    );
}

export default App;