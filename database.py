import mysql.connector

# =========================
# MYSQL CONNECTION
# =========================

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Siddhu*2006",
    database="personal_ai"
)

cursor = db.cursor()