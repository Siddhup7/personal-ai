import { useState } from "react"

export default function App() {

  const [message, setMessage] =
    useState("")

  const [messages, setMessages] =
    useState([])

  // =========================
  // SEND MESSAGE
  // =========================

  async function sendMessage() {

    if (!message.trim()) {

      return
    }

    // USER MESSAGE

    const userMessage = {

      role: "user",
      text: message
    }

    setMessages(prev => [

      ...prev,
      userMessage

    ])

    const currentMessage =
      message

    setMessage("")

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
        )

      const data =
        await response.json()

      // AI MESSAGE

      const aiMessage = {

        role: "ai",
        text: data.response
      }

      setMessages(prev => [

        ...prev,
        aiMessage

      ])

    } catch (error) {

      console.log(error)

      setMessages(prev => [

        ...prev,

        {
          role: "ai",
          text:
          "Backend connection failed."
        }

      ])
    }
  }

  return (

    <div className="
      min-h-screen
      bg-black
      text-white
      flex
    ">

      {/* SIDEBAR */}

      <div className="
        w-72
        border-r
        border-zinc-800
        bg-zinc-950
        p-4
      ">

        <h1 className="
          text-3xl
          font-bold
          mb-6
        ">

          🧠 Brain AI

        </h1>

        <div className="
          bg-zinc-900
          rounded-2xl
          p-4
          mb-4
        ">

          Llama 3 Connected 🚀

        </div>

      </div>

      {/* MAIN CHAT */}

      <div className="
        flex-1
        flex
        flex-col
      ">

        {/* HEADER */}

        <div className="
          border-b
          border-zinc-800
          p-4
          text-xl
          font-semibold
        ">

          Brain Assistant

        </div>

        {/* CHAT AREA */}

        <div className="
          flex-1
          overflow-y-auto
          p-6
          space-y-4
        ">

          {messages.map((msg, index) => (

            <div
              key={index}

              className={

                msg.role === "user"

                ?

                "flex justify-end"

                :

                "flex justify-start"
              }
            >

              <div className={

                msg.role === "user"

                ?

                `
                bg-blue-600
                px-5
                py-3
                rounded-2xl
                max-w-2xl
                `

                :

                `
                bg-zinc-900
                px-5
                py-3
                rounded-2xl
                max-w-2xl
                `
              }>

                {msg.text}

              </div>

            </div>

          ))}

        </div>

        {/* INPUT AREA */}

        <div className="
          border-t
          border-zinc-800
          p-4
          flex
          gap-3
        ">

          <input

            type="text"

            value={message}

            onChange={(e) =>
              setMessage(e.target.value)
            }

            onKeyDown={(e) => {

              if (e.key === "Enter") {

                sendMessage()
              }
            }}

            placeholder="
              Message Brain...
            "

            className="
              flex-1
              bg-zinc-900
              border
              border-zinc-700
              rounded-2xl
              px-5
              py-4
              outline-none
            "
          />

          <button

            onClick={sendMessage}

            className="
              bg-blue-600
              hover:bg-blue-700
              transition
              px-6
              rounded-2xl
            "
          >

            Send

          </button>

        </div>

      </div>

    </div>
  )
}