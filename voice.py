import speech_recognition as sr
import pyttsx3

# =========================
# INIT TEXT TO SPEECH
# =========================

engine = pyttsx3.init()

# =========================
# VOICE SETTINGS
# =========================

voices = engine.getProperty(
    "voices"
)

engine.setProperty(
    "voice",
    voices[0].id
)

engine.setProperty(
    "rate",
    180
)

# =========================
# SPEAK FUNCTION
# =========================

def speak(text):

    print(
        "AI:",
        text
    )

    engine.say(text)

    engine.runAndWait()

# =========================
# LISTEN FUNCTION
# =========================

def listen():

    recognizer = sr.Recognizer()

    with sr.Microphone() as source:

        try:

            recognizer.adjust_for_ambient_noise(
                source,
                duration=0.5
            )

            audio = recognizer.listen(
                source,
                timeout=5,
                phrase_time_limit=5
            )

        except:

            return ""

    try:

        text = recognizer.recognize_google(
            audio
        )

        print(
            "You said:",
            text
        )

        return text

    except:

        return ""