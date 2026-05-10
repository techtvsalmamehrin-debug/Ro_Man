import sqlite3
import os

db_path = 'c:/Users/Sreethu/Desktop/Ro_Man/backend/roman.db'

def check_and_seed():
    try:
        conn = sqlite3.connect(db_path)
        c = conn.cursor()
        
        # Check if table exists
        c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='knowledge_base'")
        if not c.fetchone():
            print("Table 'knowledge_base' does not exist. Please run the backend server once to create it.")
            return

        c.execute("SELECT count(*) FROM knowledge_base")
        count = c.fetchone()[0]
        print(f"Knowledge Base Row Count: {count}")
        
        print("\n--- SAMPLE ENTRIES ---")
        c.execute("SELECT category, answer FROM knowledge_base WHERE category IN ('principal', 'fee_cse', 'location')")
        rows = c.fetchall()
        for r in rows:
            print(f"[{r[0]}] {r[1][:100]}...")
            
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

check_and_seed()
