import sqlite3
import os

def update_kb():
    db_path = os.path.join(os.path.dirname(__file__), 'roman.db')
    conn = sqlite3.connect(db_path)
    c = conn.cursor()

    # Clear existing knowledge base to ensure strict adherence to new data
    c.execute("DELETE FROM knowledge_base")

    seed_data = [
        # --- CONTACT & LOCATION ---
        ("contact", "contact phone email number call address reach", 
         "You can contact the Royal College admission office at 04885-271122 or email us at webteam@royalcet.ac.in."),
        ("location", "location address where place district state country map route", 
         "Royal College of Engineering and Technology (RCET) is located in Akkikavu, Thrissur, Kerala."),

        # --- KEY PEOPLE ---
        ("principal", "who principal head person in charge name", 
         "The Principal of RCET is Dr. P. Suresh Venugopal."),
        ("ceo", "who ceo chief executive officer name", 
         "Our CEO is Mr. V. P. Salim."),
        ("management", "management chairman secretary president", 
         "The President is Mr. U Hussain Mohammed and the General Secretary is Mr. K. M. Hyderali."),

        # --- DEPARTMENTS & PROGRAMS ---
        ("programs", "programs courses offered degrees study btech mtech", 
         "RCET offers undergraduate (B.Tech) and postgraduate (M.Tech) programs. B.Tech specializations include AI & DS, Civil, CSE, EEE, ECE, Mechanical, and Cyber Security."),
        ("departments", "departments branches dept list", 
         "Our departments include Artificial Intelligence and Data Science, Civil Engineering, Computer Science and Engineering, Electrical and Electronics Engineering, Electronics and Communication Engineering, Mechanical Engineering, and Applied Science."),
        
        # --- ADMISSION ---
        ("admission_process", "admission seat join apply process details", 
         "Admission to B.Tech programs is based on the KEAM entrance exam. For management seats, selection is based on a rank list giving equal weightage to KEAM marks and plus-two marks."),
        ("admission_eligibility", "eligibility requirement qualify marks keam 10", 
         "Candidates must be listed in the KEAM Rank List and achieve a minimum of 10 marks in both Paper I and Paper II of the KEAM exam."),
        ("admission_dates", "admission dates keam 2026 registration exam results", 
         "Tentative KEAM 2026 dates: Registration from Jan 5 to Jan 31, 2026. Examination from April 13 to April 25, 2026. Results expected by July 1, 2026."),
        
        # --- FEES ---
        ("fees_btech", "fee btech tuition cost price total", 
         "The fees for UG (B.Tech) programs generally range between ₹4.02 Lakhs and ₹5.02 Lakhs. Specific courses like CSE and AI & DS are around ₹5.02 Lakhs."),
        ("fees_mtech", "fee mtech tuition cost postgraduate", 
         "The fees for PG (M.Tech) programs are approximately ₹1 Lakh for the entire duration."),

        # --- SCHOLARSHIPS ---
        ("scholarship_topper", "keam rank 100 first topper scholarship 100% waiver", 
         "Students with a KEAM Rank under 100 are eligible for a 100% Tuition Fee Waiver at Royal CET."),
        ("scholarship_merit", "scholarship merit rank 5000", 
         "We offer merit scholarships ranging from 25% to 50% on tuition fees for students with KEAM ranks under 5000."),

        # --- FACILITIES ---
        ("hostel", "hostel accommodation stay room boys girls", 
         "RCET provides separate hostel facilities for both boys and girls."),
        ("transport", "transport bus route vehicle travel", 
         "College bus facilities are available covering major routes in Thrissur and Malappuram."),
        ("placement", "placement jobs companies recruitment package", 
         "Our Placement Cell (CSDCR) provides training and brings top companies for campus recruitment."),
        ("library", "library books central info reading", 
         "We have a fully stocked Central Library for our students."),

        # --- GENERAL ---
        ("about", "about college rcet mission vision description history", 
         "Royal College of Engineering and Technology (RCET), established in 2003, is a premier industry-oriented engineering college in Thrissur affiliated to APJ Abdul Kalam Technological University (KTU) and approved by AICTE."),
        ("accreditation", "accreditation naac nba quality", 
         "RCET is NAAC accredited and maintains high marks for quality in technical education.")
    ]

    c.executemany("INSERT INTO knowledge_base (category, keywords, answer) VALUES (?, ?, ?)", seed_data)
    conn.commit()
    conn.close()
    print(f"Knowledge base updated with {len(seed_data)} entries.")

if __name__ == "__main__":
    update_kb()
