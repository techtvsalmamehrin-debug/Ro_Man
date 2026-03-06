from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import sqlite3
import datetime
import os
import shutil

app = FastAPI()

# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
static_dir = os.path.join(os.path.dirname(__file__), "static")
if not os.path.exists(static_dir):
    os.makedirs(static_dir)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Database Setup
def init_db():
    try:
        conn = sqlite3.connect(os.path.join(os.path.dirname(__file__), 'roman.db'))
        c = conn.cursor()
        c.execute('''CREATE TABLE IF NOT EXISTS visitors
                     (id INTEGER PRIMARY KEY, name TEXT, phone TEXT, school TEXT, course TEXT, date TEXT)''')
        
        # Check if status column exists (Visitor Status)
        c.execute("PRAGMA table_info(visitors)")
        columns = [info[1] for info in c.fetchall()]
        if 'status' not in columns:
            c.execute("ALTER TABLE visitors ADD COLUMN status TEXT DEFAULT 'uncalled'")
        
        # Create knowledge base table
        c.execute('''CREATE TABLE IF NOT EXISTS knowledge_base
                     (id INTEGER PRIMARY KEY, category TEXT, keywords TEXT, answer TEXT)''')

        # Create site config table
        c.execute('''CREATE TABLE IF NOT EXISTS site_config
                     (key TEXT PRIMARY KEY, value TEXT)''')
                     
        # Seed default tour config if not exists
        c.execute("SELECT value FROM site_config WHERE key='tour_type'")
        if not c.fetchone():
            c.execute("INSERT INTO site_config (key, value) VALUES ('tour_type', 'youtube')")
            c.execute("INSERT INTO site_config (key, value) VALUES ('tour_url', 'https://www.youtube.com/embed/eUNFH9eqGXo?autoplay=1')")

        # Seed knowledge base only if empty
        c.execute("SELECT count(*) FROM knowledge_base")
        if c.fetchone()[0] == 0:
            seed_data = [
                # --- CONTACT ---
                ("contact", "contact phone email number call address reach", 
                 "Phone: 04885-271122 | Email: webteam@royalcet.ac.in"),
                ("location", "location address where place district state country map route", 
                 "We are located in Akkikavu, Thrissur, Kerala."),

                # --- KEY PEOPLE ---
                ("principal", "who principal head person in charge name", 
                 "The Principal is Dr. P. Suresh Venugopal."),
                ("ceo", "who ceo chief executive officer name", 
                 "Our CEO is Mr. V. P. Salim."),
                ("management", "management chairman secretary", 
                 "The General Secretary is Mr. K. M. Hyderali."),
                ("hod_cse", "who hod cse head computer science", 
                 "The HOD of CSE is Dr. Pradeep Kumar S P."),

                # --- DEPARTMENTS & PROGRAMS ---
                ("programs", "programs courses offered degrees study", 
                 "We offer B.Tech and M.Tech programs."),
                ("departments", "departments branches dept list", 
                 "Departments: AI & DS, Civil, CSE, EEE, ECE, Mechanical, and Applied Science."),
                ("admission_exam", "admission exam entrance keam exam score", 
                 "Admission is based on the KEAM entrance exam."),

                # --- ADMISSION & FEES ---
                ("fee_btech", "fee btech tuition cost price sem semester year", 
                 "B.Tech Fee: Gov/Merit quota starts at ₹8,000 - ₹75,000 depending on marks. Mgmt quota varies."),
                
                ("scholarship_top", "keam rank 1 10 100 first topper scholarship reward cse", 
                 "Amazing! Students with KEAM Rank under 100 get a 100% Tuition Fee Waiver at Royal CET. For CSE, your total fee would be effectively ₹0 for tuition!"),

                ("scholarship_merit", "keam rank 1000 2000 5000 merit scholarship scholarship", 
                 "For KEAM ranks under 5000, we offer merit scholarships ranging from 25% to 50% on tuition fees."),

                ("admission", "admission seat join apply process details", 
                 "For admission, you need a valid KEAM score. Please fill the Enquiry Form for a callback."),

                # --- FACILITIES ---
                ("hostel", "hostel accommodation stay room boys girls", 
                 "Yes, we have separate hostels for boys and girls."),
                ("transport", "transport bus route vehicle travel", 
                 "We provide college bus facilities covering major routes in Thrissur and Malappuram."),
                ("library", "library books reading central info", 
                 "We have a fully stocked Central Library."),
                ("placement", "placement jobs companies salary recruiters package", 
                 "Our Placement Cell (CSDCR) provides training and brings top companies for recruitment."),
                 
                # --- ROBOT PROJECT ---
                ("roman", "roman who are you robot bot name ai", 
                 "I am Ro-Man, your AI assistant for RCET. Ask me about courses or admissions!"),
                 
                 # --- SYLLABUS ---
                 ("syllabus", "syllabus curriculum learn subject topics",
                  "Our syllabus is as per KTU regulations. You can find detailed syllabus on the KTU website."),
                  
                # --- GENERIC / LOWER PRIORITY AT END ---
                ("established", "established founded year start old", 
                 "RCET was established in 2003."),
                ("campus", "campus area size acres land", 
                 "We have a vibrant 21-acre campus."),
                ("affiliation", "affiliation university ktu apj", 
                 "We are affiliated to APJ Abdul Kalam Technological University (KTU)."),
                ("approval", "approval aicte govt government", 
                 "Yes, we are approved by AICTE."),
                ("accreditation", "accreditation naac nba quality", 
                 "We are NAAC accredited (valid 2021–2026)."),
                ("college_type", "college type private government aided", 
                 "We are a private self-financing engineering college."),
                # 'about 'and 'college' added back here, but at end of list so specifics win ties
                ("about", "about college rcet mission vision intro description history info details", 
                 "RCET is a premier industry-oriented engineering college in Thrissur, established in 2003.")
            ]
            
            c.executemany("INSERT INTO knowledge_base (category, keywords, answer) VALUES (?, ?, ?)", seed_data)
            print(f"Knowledge base populated with {len(seed_data)} entries.")
        else:
            print("Knowledge base already initialized.")
            
        conn.commit()
        conn.close()
    except Exception as e:
        print("DB Init Error:", e)

# ... (existing code)

@app.get("/tour-config")
def get_tour_config():
    try:
        conn = sqlite3.connect(os.path.join(os.path.dirname(__file__), 'roman.db'))
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        c.execute("SELECT * FROM site_config")
        rows = c.fetchall()
        config = {row['key']: row['value'] for row in rows}
        conn.close()
        return config
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/tour-upload")
async def upload_tour_video(file: UploadFile = File(...)):
    try:
        file_location = os.path.join(static_dir, "tour_video.mp4")
        with open(file_location, "wb+") as file_object:
            shutil.copyfileobj(file.file, file_object)
        
        # Update DB config
        conn = sqlite3.connect(os.path.join(os.path.dirname(__file__), 'roman.db'))
        c = conn.cursor()
        c.execute("INSERT OR REPLACE INTO site_config (key, value) VALUES ('tour_type', 'local')")
        c.execute("INSERT OR REPLACE INTO site_config (key, value) VALUES ('tour_url', '/static/tour_video.mp4')")
        conn.commit()
        conn.close()
        
        return {"status": "success", "message": "Video uploaded successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


init_db()

class Visitor(BaseModel):
    name: str
    phone: str
    school: str = None
    course: str = None
    district: str = None

@app.get("/")
def read_root():
    return {"message": "Welcome to RO-MAN Backend"}

@app.post("/visitor")
def add_visitor(visitor: Visitor):
    try:
        conn = sqlite3.connect(os.path.join(os.path.dirname(__file__), 'roman.db'))
        c = conn.cursor()
        
        # Check if district column exists (Simple Migration)
        c.execute("PRAGMA table_info(visitors)")
        columns = [info[1] for info in c.fetchall()]
        if 'district' not in columns:
            c.execute("ALTER TABLE visitors ADD COLUMN district TEXT")
            
        c.execute("INSERT INTO visitors (name, phone, school, course, district, date) VALUES (?, ?, ?, ?, ?, ?)",
                  (visitor.name, visitor.phone, visitor.school, visitor.course, visitor.district, datetime.datetime.now().isoformat()))
        conn.commit()
        conn.close()
        return {"status": "success", "message": "Visitor added"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class KnowledgeItem(BaseModel):
    category: str
    keywords: str
    answer: str

@app.get("/knowledge")
def get_knowledge():
    print("DEBUG: Fetching knowledge...")
    try:
        conn = sqlite3.connect(os.path.join(os.path.dirname(__file__), 'roman.db'))
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        c.execute("SELECT * FROM knowledge_base")
        rows = c.fetchall()
        conn.close()
        return [dict(row) for row in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/knowledge")
def add_knowledge(item: KnowledgeItem):
    try:
        conn = sqlite3.connect(os.path.join(os.path.dirname(__file__), 'roman.db'))
        c = conn.cursor()
        c.execute("INSERT INTO knowledge_base (category, keywords, answer) VALUES (?, ?, ?)",
                  (item.category, item.keywords, item.answer))
        conn.commit()
        conn.close()
        return {"status": "success", "message": "Knowledge added"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/knowledge/{id}")
def update_knowledge(id: int, item: KnowledgeItem):
    try:
        conn = sqlite3.connect(os.path.join(os.path.dirname(__file__), 'roman.db'))
        c = conn.cursor()
        c.execute("UPDATE knowledge_base SET category=?, keywords=?, answer=? WHERE id=?",
                  (item.category, item.keywords, item.answer, id))
        conn.commit()
        conn.close()
        return {"status": "success", "message": "Knowledge updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/knowledge/{id}")
def delete_knowledge(id: int):
    try:
        conn = sqlite3.connect(os.path.join(os.path.dirname(__file__), 'roman.db'))
        c = conn.cursor()
        c.execute("DELETE FROM knowledge_base WHERE id=?", (id,))
        conn.commit()
        conn.close()
        return {"status": "success", "message": "Knowledge deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/query")
def query_robot(q: str):
    q = q.lower().strip()
    
    # --- Persona Context ---
    # The AI is an admission assistant for RCET.
    
    # Greetings
    greetings = ["hi", "hello", "hey", "greetings", "good morning", "good afternoon"]
    if any(q == greet for greet in greetings) or (any(q.startswith(greet) for greet in greetings) and len(q.split()) <= 2):
        return {"response": "Hello! I am the AI Admission Assistant for Royal College of Engineering and Technology (RCET), Thrissur. I can help you with questions about our courses, admissions, and campus facilities. How can I assist you today?"}

    try:
        conn = sqlite3.connect(os.path.join(os.path.dirname(__file__), 'roman.db'))
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        c.execute("SELECT * FROM knowledge_base")
        rows = c.fetchall()
        conn.close()
        
        best_match = None
        max_score = 0
        query_words = set(q.split())
        
        for row in rows:
            keywords = row['keywords'].lower().split()
            # Exact word matches
            matches = sum(3 for k in keywords if k in query_words)
            # Partial substring matches
            partials = sum(1 for k in keywords if k not in query_words and k in q)
            
            score = matches + partials
            if score > max_score:
                max_score = score
                best_match = row['answer']
        
        # --- Strict Info Rule ---
        # Only answer if there's a reasonably strong match in our knowledge base
        if best_match and max_score >= 3:
            return {"response": best_match}
        
        # Fallback for when info is not found
        else:
            return {"response": "Please contact the Royal College admission office for accurate details."}
            
    except Exception as e:
        print(f"Query Error: {e}")
        return {"response": "Please contact the Royal College admission office for accurate details."}

@app.get("/visitors")
def get_visitors():
    try:
        conn = sqlite3.connect(os.path.join(os.path.dirname(__file__), 'roman.db'))
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        
        # Check if status column exists, if not add it (Simple Migration)
        c.execute("PRAGMA table_info(visitors)")
        columns = [info[1] for info in c.fetchall()]
        if 'status' not in columns:
            c.execute("ALTER TABLE visitors ADD COLUMN status TEXT DEFAULT 'uncalled'")
            conn.commit()
            
        c.execute("SELECT * FROM visitors ORDER BY id DESC")
        rows = c.fetchall()
        conn.close()
        return [dict(row) for row in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class StatusUpdate(BaseModel):
    status: str

@app.put("/visitors/{id}/status")
def update_visitor_status(id: int, status_update: StatusUpdate):
    try:
        conn = sqlite3.connect(os.path.join(os.path.dirname(__file__), 'roman.db'))
        c = conn.cursor()
        c.execute("UPDATE visitors SET status = ? WHERE id = ?", (status_update.status, id))
        conn.commit()
        conn.close()
        return {"status": "success", "message": "Status updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

