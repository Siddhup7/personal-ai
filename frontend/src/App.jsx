import {
    useState,
    useRef,
    useEffect
} from "react";

import Particles from "react-tsparticles";

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

            let currentText = "";

            const aiMessage = {

                sender:"AI",
                text:""
            };

            setChat(prev=>[
                ...prev,
                aiMessage
            ]);

            // TYPING EFFECT

            for(
                let i=0;
                i<fullText.length;
                i++
            ){

                currentText +=
                fullText[i];

                await new Promise(
                    resolve =>
                    setTimeout(
                        resolve,
                        8
                    )
                );

                setChat(prev=>{

                    const updated =
                    [...prev];

                    updated[
                        updated.length-1
                    ] = {

                        sender:"AI",
                        text:currentText
                    };

                    return updated;
                });
            }

            // VOICE

            const speech =
            new SpeechSynthesisUtterance(
                fullText
            );

            setIsSpeaking(true);

            speech.onend = () => {

                setIsSpeaking(false);
            };

            window.speechSynthesis.speak(
                speech
            );

            // SAVE CHAT

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
                    text:
                    "Backend failed."
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

        {/* PREMIUM LIGHTS */}

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
                minHeight:"100vh",
                overflow:"hidden"
            }}
        >

            {/* PARTICLES */}

            <Particles

                options={{

                    background:{
                        color:{
                            value:"#050816"
                        }
                    },

                    particles:{

                        number:{
                            value:70
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
                            value:0.3
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
                    minHeight:"100vh",
                    color:"white"
                }}
            >

                {/* SIDEBAR */}

                {
                    sidebarOpen && (

                    <div
                        className="
                        fadeIn
                        superCard
                        neonBorder
                        "

                        style={{
                            width:"290px",

                            padding:"24px",

                            overflowY:"auto",

                            borderRight:
                            "1px solid rgba(255,255,255,0.06)"
                        }}
                    >

                        <h2
                            className="floatSlow"

                            style={{
                                marginBottom:"24px",
                                fontSize:"38px",
                                fontWeight:"bold"
                            }}
                        >
                            🤖 Siddhu AI
                        </h2>

                        <button

                            onClick={newChat}

                            className="
                            superButton
                            "

                            style={{
                                width:"100%",

                                padding:"18px",

                                border:"none",

                                borderRadius:"20px",

                                background:
                                "linear-gradient(45deg,#2563eb,#7c3aed)",

                                color:"white",

                                fontSize:"17px",

                                cursor:"pointer",

                                display:"flex",

                                alignItems:"center",

                                justifyContent:"center",

                                gap:"10px",

                                boxShadow:
                                "0px 0px 25px rgba(59,130,246,0.25)"
                            }}
                        >

                            <FiPlus />

                            New Chat

                        </button>

                        {/* HISTORY */}

                        <div
                            style={{
                                marginTop:"30px"
                            }}
                        >

                        {
                            history.map(
                            (item,index)=>(

                                <div

                                    key={index}

                                    className="
                                    fadeIn
                                    superCard
                                    superButton
                                    "

                                    onClick={()=>
                                        setChat(
                                            item.messages
                                        )
                                    }

                                    style={{

                                        padding:"16px",

                                        marginBottom:"14px",

                                        borderRadius:"18px",

                                        cursor:"pointer",

                                        fontSize:"15px"
                                    }}
                                >

                                    {item.title}

                                </div>
                            ))
                        }

                        </div>

                    </div>
                    )
                }

                {/* CHAT AREA */}

                <div
                    style={{
                        flex:1,

                        display:"flex",

                        justifyContent:"center",

                        alignItems:"center",

                        padding:"25px"
                    }}
                >

                    <div
                        className="
                        superCard
                        neonBorder
                        "

                        style={{
                            width:"100%",

                            maxWidth:"1250px",

                            height:"94vh",

                            borderRadius:"34px",

                            display:"flex",

                            flexDirection:"column",

                            overflow:"hidden"
                        }}
                    >

                        {/* TOPBAR */}

                        <div
                            className="superInput"

                            style={{
                                padding:"24px",

                                display:"flex",

                                justifyContent:
                                "space-between",

                                alignItems:"center",

                                borderBottom:
                                "1px solid rgba(255,255,255,0.05)"
                            }}
                        >

                            <div
                                style={{
                                    display:"flex",
                                    alignItems:"center",
                                    gap:"15px"
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

                                        fontSize:"24px",

                                        width:"55px",

                                        height:"55px",

                                        borderRadius:"16px"
                                    }}
                                >

                                    <FiMenu />

                                </button>

                                <h1
                                    className="floatSlow"

                                    style={{
                                        fontSize:"56px",

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
                                    gap:"12px"
                                }}
                            >

                                <div
                                    style={{
                                        width:"12px",
                                        height:"12px",
                                        borderRadius:"50%",
                                        background:"#22c55e",

                                        boxShadow:
                                        "0px 0px 20px #22c55e"
                                    }}
                                ></div>

                                <span
                                    style={{
                                        fontSize:"16px"
                                    }}
                                >
                                    AI Online
                                </span>

                            </div>

                        </div>

                        {/* CHAT */}

                        <div
                            style={{
                                flex:1,

                                overflowY:"auto",

                                padding:"30px"
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
                                        textAlign:"center",
                                        marginTop:"120px"
                                    }}
                                >

                                    <h1
                                        style={{
                                            fontSize:"100px",
                                            marginBottom:"20px"
                                        }}
                                    >
                                        ⚡
                                    </h1>

                                    <h2
                                        style={{
                                            fontSize:"58px",
                                            marginBottom:"22px",
                                            fontWeight:"bold"
                                        }}
                                    >
                                        Premium AI Assistant
                                    </h2>

                                    <p
                                        style={{
                                            opacity:0.7,
                                            fontSize:"20px"
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

                                            marginBottom:"22px"
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
                                                : "rgba(255,255,255,0.06)",

                                                backdropFilter:
                                                "blur(18px)",

                                                border:
                                                "1px solid rgba(255,255,255,0.06)",

                                                padding:"20px",

                                                borderRadius:"24px",

                                                maxWidth:"75%",

                                                lineHeight:"1.8",

                                                fontSize:"17px",

                                                boxShadow:
                                                "0px 0px 25px rgba(255,255,255,0.04)"
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

                            {
                                isThinking && (

                                <div
                                    className="
                                    fadeIn
                                    superCard
                                    "

                                    style={{
                                        width:"230px",

                                        padding:"20px",

                                        borderRadius:"20px"
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
                                padding:"24px",

                                borderTop:
                                "1px solid rgba(255,255,255,0.05)"
                            }}
                        >

                            <div
                                style={{
                                    display:"flex",
                                    gap:"14px"
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

                                        padding:"22px",

                                        borderRadius:"24px",

                                        color:"white",

                                        outline:"none",

                                        fontSize:"17px",

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
                                        width:"70px",

                                        border:"none",

                                        borderRadius:"24px",

                                        color:"white",

                                        cursor:"pointer",

                                        fontSize:"24px"
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
                                        width:"70px",

                                        border:"none",

                                        borderRadius:"24px",

                                        background:
                                        isSpeaking
                                        ? "#dc2626"
                                        : "#16a34a",

                                        color:"white",

                                        cursor:"pointer",

                                        fontSize:"24px",

                                        boxShadow:
                                        "0px 0px 20px rgba(34,197,94,0.3)"
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
                                        width:"90px",

                                        border:"none",

                                        borderRadius:"24px",

                                        background:
                                        "linear-gradient(45deg,#2563eb,#7c3aed)",

                                        color:"white",

                                        cursor:"pointer",

                                        fontSize:"26px",

                                        boxShadow:
                                        "0px 0px 30px rgba(59,130,246,0.3)"
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