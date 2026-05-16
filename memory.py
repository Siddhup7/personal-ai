from database import cursor, db

# =========================
# CREATE PROFILE TABLE
# =========================

cursor.execute("""

CREATE TABLE IF NOT EXISTS profile_memory (

    id INT AUTO_INCREMENT PRIMARY KEY,

    memory_key VARCHAR(255),

    memory_value TEXT

)

""")

db.commit()

# =========================
# SAVE PROFILE MEMORY
# =========================

def save_profile_memory(user_message):

    message = user_message.lower()

    # SAVE NAME
    if "my name is" in message:

        name = message.split(
            "my name is"
        )[-1].strip()

        cursor.execute("""
            INSERT INTO profile_memory
            (memory_key, memory_value)
            VALUES (%s, %s)
        """, (
            "name",
            name
        ))

        db.commit()

    # SAVE FAVORITE LANGUAGE
    elif "favorite language is" in message:

        language = message.split(
            "favorite language is"
        )[-1].strip()

        cursor.execute("""
            INSERT INTO profile_memory
            (memory_key, memory_value)
            VALUES (%s, %s)
        """, (
            "favorite_language",
            language
        ))

        db.commit()

    # SAVE GOAL
    elif "my goal is" in message:

        goal = message.split(
            "my goal is"
        )[-1].strip()

        cursor.execute("""
            INSERT INTO profile_memory
            (memory_key, memory_value)
            VALUES (%s, %s)
        """, (
            "goal",
            goal
        ))

        db.commit()

# =========================
# LOAD PROFILE MEMORY
# =========================

def load_profile_memory():

    cursor.execute("""
        SELECT memory_key, memory_value
        FROM profile_memory
    """)

    rows = cursor.fetchall()

    memory_text = ""

    for row in rows:

        memory_text += f"""
{row[0]} : {row[1]}
"""

    return memory_text

# =========================
# SAVE CONVERSATION
# =========================

def save_conversation(
    user_message,
    ai_response
):

    cursor.execute("""
        INSERT INTO memory
        (user_message, ai_response)
        VALUES (%s, %s)
    """, (
        user_message,
        ai_response
    ))

    db.commit()

# =========================
# LOAD RECENT CONVERSATIONS
# =========================

def load_recent_conversations():

    cursor.execute("""
        SELECT user_message, ai_response
        FROM memory
        ORDER BY id DESC
        LIMIT 5
    """)

    rows = cursor.fetchall()

    conversation_text = ""

    for row in reversed(rows):

        conversation_text += f"""

User: {row[0]}
AI: {row[1]}
"""

    return conversation_text