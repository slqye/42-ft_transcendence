import os
import psycopg2
from psycopg2.extras import RealDictCursor

def extract_data():
    try:
        conn = psycopg2.connect(
            host='postgres',
            database=os.getenv('POSTGRES_DB'),
            user=os.getenv('POSTGRES_USER'),
            password=os.getenv('POSTGRES_PASSWORD'),
            port=5432
        )
        print(f"Connected to the database : {os.getenv('POSTGRES_DB')} with user : {os.getenv('POSTGRES_USER')}")
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("SELECT * FROM users;")
        rows = cursor.fetchall()
        for row in rows:
            print(row)
        print("Data extracted successfully")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    extract_data() 