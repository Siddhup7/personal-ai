# =========================
# CLEAN AI RESPONSES
# =========================

def clean_response(text):

    # REMOVE COMMON ROBOTIC PHRASES

    unwanted_phrases = [

        "As an AI",
        "As your AI assistant",
        "ethical considerations",
        "responsible programming",
        "privacy considerations",
        "privacy policies",
        "ethical responsibility",
        "I am here to assist",
        "when handling sensitive information",
        "it is important to ensure",
        "responsible AI",
        "AI assistant dedicated",
        "maintaining privacy",
        "technology discussions",
        "ethical discussions",
        "important to remember",
        "it is crucial",
        "today's discussion",
        "fruitful dialogue"

    ]

    # REMOVE PHRASES

    for phrase in unwanted_phrases:

        text = text.replace(
            phrase,
            ""
        )

    # REMOVE EXTRA SPACES

    text = " ".join(
        text.split()
    )

    # SHORTEN OVERLY LONG RESPONSES

    sentences = text.split(".")

    if len(sentences) > 6:

        text = ".".join(
            sentences[:6]
        ) + "."

    return text.strip()