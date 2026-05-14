import webbrowser
import os
import requests
import time

import pyautogui
import pytesseract

from PIL import Image
from googlesearch import search

# =========================
# TESSERACT PATH
# =========================

pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)

# =========================
# CREATE FOLDERS
# =========================

if not os.path.exists("notes"):

    os.makedirs("notes")

if not os.path.exists("screenshots"):

    os.makedirs("screenshots")

# =========================
# EXECUTE ACTION
# =========================

def execute_action(
    action,
    user_message
):

    if action is None:

        return None

    action = action.lower()

    # =========================
    # OPEN YOUTUBE
    # =========================

    if action == "open_youtube":

        webbrowser.open(
            "https://youtube.com"
        )

        return "Opening YouTube."

    # =========================
    # OPEN GOOGLE
    # =========================

    elif action == "open_google":

        webbrowser.open(
            "https://google.com"
        )

        return "Opening Google."

    # =========================
    # OPEN NOTEPAD
    # =========================

    elif action == "open_notepad":

        os.system("notepad")

        return "Opening Notepad."

    # =========================
    # OPEN CALCULATOR
    # =========================

    elif action == "open_calculator":

        os.system("calc")

        return "Opening Calculator."

    # =========================
    # WEB SEARCH
    # =========================

    elif action == "web_search":

        try:

            results = []

            for result in search(
                user_message,
                num_results=5
            ):

                results.append(result)

            if len(results) == 0:

                return (
                    "No search results found."
                )

            webbrowser.open(
                results[0]
            )

            return f"""
Top Search Results:

{chr(10).join(results)}

Opening first result in browser.
"""

        except Exception as e:

            return f"""
Search failed:
{str(e)}
"""

    # =========================
    # CREATE NOTE
    # =========================

    elif action == "create_note":

        try:

            topic = user_message.replace(
                "create a note about",
                ""
            ).strip()

            note_prompt = f"""
You are a professional educational note generator.

Create HIGH QUALITY STUDY NOTES.

TOPIC:
{topic}

STRICT RULES:
- ONLY discuss the topic
- NO personal comments
- NO unrelated discussions
- Use headings
- Use bullet points
- Include examples
- Make notes easy to study

FORMAT:

# Title

## Introduction

## Main Concepts

## Examples

## Advantages

## Conclusion
"""

            response = requests.post(
                "http://localhost:11434/api/generate",
                json={
                    "model": "phi3",
                    "prompt": note_prompt,
                    "stream": False
                }
            )

            data = response.json()

            note_content = data[
                "response"
            ]

            filename = (
                "notes/generated_note.txt"
            )

            with open(
                filename,
                "w",
                encoding="utf-8"
            ) as file:

                file.write(
                    note_content
                )

            os.startfile(filename)

            return (
                "Professional study note created successfully."
            )

        except Exception as e:

            return f"""
Failed to create note:
{str(e)}
"""

    # =========================
    # YOUTUBE SEARCH AUTOMATION
    # =========================

    elif action == "youtube_search":

        try:

            query = (
                user_message
                .replace(
                    "search youtube for",
                    ""
                )
                .strip()
            )

            webbrowser.open(
                "https://youtube.com"
            )

            time.sleep(5)

            pyautogui.write(
                query,
                interval=0.05
            )

            pyautogui.press(
                "enter"
            )

            return (
                f"Searching YouTube for {query}"
            )

        except Exception as e:

            return f"""
YouTube automation failed:
{str(e)}
"""

    # =========================
    # GOOGLE SEARCH AUTOMATION
    # =========================

    elif action == "google_search":

        try:

            query = (
                user_message
                .replace(
                    "search google for",
                    ""
                )
                .strip()
            )

            webbrowser.open(
                "https://google.com"
            )

            time.sleep(3)

            pyautogui.write(
                query,
                interval=0.05
            )

            pyautogui.press(
                "enter"
            )

            return (
                f"Searching Google for {query}"
            )

        except Exception as e:

            return f"""
Google automation failed:
{str(e)}
"""

    # =========================
    # TAKE SCREENSHOT
    # =========================

    elif action == "take_screenshot":

        try:

            filename = (
                "screenshots/screenshot.png"
            )

            screenshot = pyautogui.screenshot()

            screenshot.save(filename)

            os.startfile(filename)

            return (
                "Screenshot captured successfully."
            )

        except Exception as e:

            return f"""
Screenshot failed:
{str(e)}
"""

    # =========================
    # READ SCREEN TEXT
    # =========================

    elif action == "read_screen":

        try:

            filename = (
                "screenshots/screenshot.png"
            )

            screenshot = pyautogui.screenshot()

            screenshot.save(filename)

            image = Image.open(filename)

            extracted_text = (
                pytesseract.image_to_string(
                    image
                )
            )

            if extracted_text.strip() == "":

                return (
                    "No readable text detected on screen."
                )

            return f"""
Screen Text:

{extracted_text}
"""

        except Exception as e:

            return f"""
Screen reading failed:
{str(e)}
"""

    return None

# =========================
# RULE-BASED ACTION DETECTOR
# =========================

def detect_action(user_message):

    message = user_message.lower()

    # =========================
    # OPEN YOUTUBE
    # =========================

    if (
        "open youtube" in message
    ):

        return "open_youtube"

    # =========================
    # OPEN GOOGLE
    # =========================

    elif (
        "open google" in message
    ):

        return "open_google"

    # =========================
    # OPEN NOTEPAD
    # =========================

    elif (
        "open notepad" in message
    ):

        return "open_notepad"

    # =========================
    # OPEN CALCULATOR
    # =========================

    elif (
        "open calculator" in message
        or
        "launch calculator" in message
    ):

        return "open_calculator"

    # =========================
    # YOUTUBE SEARCH
    # =========================

    elif (
        "search youtube for"
        in message
    ):

        return "youtube_search"

    # =========================
    # GOOGLE SEARCH
    # =========================

    elif (
        "search google for"
        in message
    ):

        return "google_search"

    # =========================
    # TAKE SCREENSHOT
    # =========================

    elif (
        "take screenshot"
        in message
    ):

        return "take_screenshot"

    # =========================
    # READ SCREEN
    # =========================

    elif (
        "read screen"
        in message
        or
        "scan screen"
        in message
    ):

        return "read_screen"

    # =========================
    # CREATE NOTE
    # =========================

    elif (
        "create a note" in message
        or
        "write notes" in message
    ):

        return "create_note"

    # =========================
    # WEB SEARCH
    # =========================

    elif (
        "search" in message
        or
        "find" in message
    ):

        return "web_search"

    return None