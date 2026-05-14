import requests
import time

from voice import (
    listen,
    speak
)

# =========================
# BACKEND URL
# =========================

BACKEND_URL = (
    "http://127.0.0.1:8000/chat"
)

# =========================
# WAKE WORDS
# =========================

WAKE_WORDS = [

    "brain",
    "hey brain",
    "hi brain",
    "hello brain"

]

# =========================
# START
# =========================

print(
    "AI Assistant Started..."
)

print(
    "Say: Brain"
)

# =========================
# MAIN LOOP
# =========================

while True:

    # WAIT FOR WAKE WORD

    text = listen()

    if text == "":

        continue

    text_lower = text.lower()

    print(
        "Heard:",
        text_lower
    )

    # =========================
    # WAKE WORD DETECTION
    # =========================

    if any(
        wake_word in text_lower
        for wake_word in WAKE_WORDS
    ):

        print(
            "Wake word detected!"
        )

        speak(
            "Yes?"
        )

        # =========================
        # CONVERSATION MODE
        # =========================

        while True:

            command = listen()

            if command == "":

                continue

            command_lower = (
                command.lower()
            )

            print(
                "Command:",
                command
            )

            # =========================
            # EXIT CONVERSATION
            # =========================

            if (
                "stop" in command_lower
                or
                "bye" in command_lower
                or
                "exit" in command_lower
            ):

                speak(
                    "Okay."
                )

                break

            # =========================
            # SEND TO BACKEND
            # =========================

            try:

                response = requests.post(
                    BACKEND_URL,
                    json={
                        "message":
                        command
                    }
                )

                data = response.json()

                ai_response = data[
                    "response"
                ]

                print(
                    "AI:",
                    ai_response
                )

                speak(
                    ai_response
                )

            except Exception as e:

                print(
                    "Error:",
                    str(e)
                )

                speak(
                    "Backend connection failed."
                )

            # SMALL DELAY

            time.sleep(1)