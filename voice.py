import speech_recognition as sr
import pyttsx3
import requests
import threading

# =========================
# AI Voice Assistant
# =========================

BACKEND_URL = "http://127.0.0.1:8000/chat"

# Initialize text-to-speech engine
engine = pyttsx3.init()

# Voice settings
engine.setProperty("rate", 170)
engine.setProperty("volume", 1)

# Initialize recognizer
recognizer = sr.Recognizer()

# Prevent overlapping speech
speaking = False


def speak(text):
    global speaking

    speaking = True

    print(f"\nAI: {text}")

    engine.say(text)
    engine.runAndWait()

    speaking = False


def ask_ai(message):

    try:

        response = requests.post(
            BACKEND_URL,
            json={
                "message": message
            },
            timeout=120
        )

        data = response.json()

        return data.get("response", "No response from AI.")

    except Exception as e:

        return f"Backend Error: {str(e)}"


def listen():

    with sr.Microphone() as source:

        print("\n🎤 Listening...")

        recognizer.adjust_for_ambient_noise(source, duration=1)

        audio = recognizer.listen(source)

        text = recognizer.recognize_google(audio)

        return text


def main():

    print("=" * 50)
    print("🔥 Siddhu Personal Voice AI Started")
    print("Say 'exit' to stop")
    print("=" * 50)

    speak("Hello Siddhu. Your personal AI assistant is ready.")

    while True:

        try:

            user_text = listen()

            print(f"\nYou: {user_text}")

            if user_text.lower() in ["exit", "quit", "stop"]:

                speak("Shutting down. Goodbye Siddhu.")

                break

            ai_response = ask_ai(user_text)

            speak(ai_response)

        except sr.UnknownValueError:

            print("\nCould not understand audio.")

        except sr.RequestError:

            print("\nSpeech recognition service error.")

        except KeyboardInterrupt:

            print("\nExiting...")

            break

        except Exception as e:

            print(f"\nError: {str(e)}")


if __name__ == "__main__":

    main()