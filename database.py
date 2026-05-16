import mysql.connector
import os

# =========================
# MYSQL CONNECTION
# =========================

db = mysql.connector.connect(
    host=os.getenv("MYSQL_HOST", "localhost"),
    user=os.getenv("MYSQL_USER", "root"),
    password=os.getenv("MYSQL_PASSWORD", "Siddhu*2006"),
    database=os.getenv("MYSQL_DATABASE", "personal_ai")
)

cursor = db.cursor()

# =========================
# CREATE MEMORY TABLE
# =========================

cursor.execute("""

CREATE TABLE IF NOT EXISTS memory (

    id INT AUTO_INCREMENT PRIMARY KEY,

    user_message TEXT,

    ai_response TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

)

""")

db.commit()