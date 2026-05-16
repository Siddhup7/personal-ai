import mysql.connector
import os

db = mysql.connector.connect(
    host=os.getenv("MYSQL_HOST"),
    port=os.getenv("MYSQL_PORT"),
    user=os.getenv("MYSQL_USER"),
    password=os.getenv("MYSQL_PASSWORD"),
    database=os.getenv("MYSQL_DATABASE")
)

cursor = db.cursor()