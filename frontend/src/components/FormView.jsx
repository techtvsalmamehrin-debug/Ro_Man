import { useState } from 'react';

export default function FormView({ navigateTo }) {

    const districts = [
        "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam", "Idukki", "Ernakulam",
        "Thrissur", "Palakkad", "Malappuram", "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
    ];

    const schoolsDb = {
        "Thrissur": [
            "Govt Model Boys HSS Thrissur", "Govt Model Girls HSS Thrissur", "Sacred Heart CGHSS Thrissur",
            "St. Thomas HSS Thrissur", "Vivekodayam BHSS Thrissur", "Chaldean Syrian HSS Thrissur",
            "CMS HSS Thrissur", "Holy Family CGHSS Thrissur", "St. Clare's CGHSS Thrissur",
            "Mar Thoma Girls HSS Thrissur", "St. Mary's HSS Ollur", "Don Bosco HSS Mannuthy",
            "Bharatiya Vidya Bhavan Thrissur", "Matha HSS Mannampetta", "St. Antony's HSS Ammadam",
            "Govt HSS Peringottukara", "SN HSS Kanimangalam", "Govt HSS Villadam", "St. Aloysius HSS Elthuruth"
        ],
        "Malappuram": [
            "MSP HSS Malappuram", "Govt Boys HSS Manjeri", "Govt Girls HSS Manjeri", "St. Gemma's HSS Malappuram",
            "Jawahar Navodaya Vidyalaya Malappuram", "Govt Girls HSS Malappuram", "PKMM HSS Edarikkode",
            "SSM HSS Thayala", "Navamukunda HSS Thirunavaya", "GVHSS Kondotty", "IUHSS Parappur",
            "Govt HSS Tuvvur", "Govt HSS Mankada", "MES HSS Mampad", "Pptmy HSS Cherur"
        ],
        "Palakkad": [
            "PMG HSS Palakkad", "Moyan's Girls HSS Palakkad", "Victoria College HSS Palakkad",
            "Basel Evangelical Mission HSS", "Kanikkamata Convent HSS", "St. Thomas HSS Olavakkode",
            "Govt HSS Big Bazar", "Govt HSS Koduvayur", "Kalladi HSS Kumaramputhur", "MNKM HSS Chittur",
            "Vyasa Vidya Peethom HSS", "Bharatiya Vidya Bhavan Palakkad"
        ],
        "Ernakulam": [
            "St. Teresa's CGHSS Ernakulam", "Maharaja's College HSS", "Govt HSS Ernakulam", "Govt Girls HSS Ernakulam",
            "St. Albert's HSS Ernakulam", "St. Mary's CGHSS Ernakulam", "LMCC HSS Pachalam", "Santa Cruz HSS Fort Kochi",
            "Rama Varma Union HSS Cherai", "SN HSS Moothakunnam", "Vidyodaya School Thevakkal", "Rajagiri HSS Kalamassery"
        ],
        "Kozhikode": [
            "Govt Ganapat HSS Kozhikode", "Zamorin's HSS Kozhikode", "Providence Girls HSS Kozhikode",
            "St. Joseph's Boys HSS Kozhikode", "St. Joseph's Anglo Indian Girls HSS", "BEM Girls HSS Kozhikode",
            "GVHSS Meinchanda", "Medical College Campus HSS", "NGO Quarters HSS", "Silver Hills HSS", "Presentation HSS"
        ],
        "Kollam": [
            "Govt. Model Boys HSS Kollam", "Krist Raj HSS Kollam", "St. Aloysius HSS Kollam", "Vimala Hrabaya HSS for Girls",
            "Sree Narayana Trust HSS", "Meenakshi Vilasam HSS", "Trinity Lyceum HSS"
        ],
        "Thiruvananthapuram": [
            "SMV Govt Model HSS", "Govt Model Boys HSS Thycaud", "St. Joseph's HSS Thiruvananthapuram",
            "St. Mary's HSS Pattom", "Cotton Hill Govt Girls HSS", "Carmel Girls HSS", "Arya Central School"
        ],
        "Alappuzha": [
            "Govt Model HSS Ambalappuzha", "Leo XIII HSS Alappuzha", "St. Joseph's GHSS Alappuzha", "SDV Boys HSS",
            "Lajanathul Muhammadiya HSS", "TD HSS Alappuzha"
        ],
        "Kottayam": [
            "CMS College HSS Kottayam", "Mt. Carmel HSS Kottayam", "Baker Memorial Girls HSS", "St. Joseph's HSS Mannanam",
            "Don Bosco HSS Puthuppally", "Girideepam Bethany HSS"
        ],
        "Idukki": [
            "St. George HSS Kattappana", "Govt HSS Thodupuzha", "St. Joseph's HSS Karimannoor", "St. Mary's HSS Arakulam",
            "Ossanam HSS Kattappana"
        ],
        "Wayanad": [
            "Govt HSS Mananthavady", "St. Mary's College HSS Sulthan Bathery", "WMO Imam Gazzali HSS",
            "Govt HSS Meenangadi", "Sarvodya HSS Eachome"
        ],
        "Kannur": [
            "Govt Town HSS Kannur", "St. Michael's AIHSS Kannur", "St. Teresa's AIHSS Kannur", "Chovva HSS Kannur",
            "Seethi Sahib HSS Taliparamba", "Kadambur HSS"
        ],
        "Kasaragod": [
            "Govt HSS Kasaragod", "TI HSS Naimarmoola", "Durga HSS Kanhangad", "Chattanchal HSS",
            "HHSIBS HSS Edneer"
        ],
        "Pathanamthitta": [
            "Catholicate HSS Pathanamthitta", "St. Mary's HSS Kozhencherry", "Mar Thoma HSS Pathanamthitta",
            "SC HSS Ranni", "Govt HSS Konni"
        ]
    };

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        school: '',
        course: '',
        district: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://roman-production.up.railway.app/visitor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setSubmitted(true);
                setTimeout(() => {
                    setSubmitted(false);
                    setFormData({ name: '', phone: '', school: '', course: '', district: '' });
                    if (navigateTo) navigateTo('home');
                }, 2000);
            } else {
                alert('Connection error. Please try again.');
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert('Failed to connect to the robot brain.');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const suggestedSchools = formData.district ? (schoolsDb[formData.district] || []) : [];

    return (
        <div className="form-container glass-panel">
            <h2><span style={{ color: 'var(--primary-color)' }}>Visitor</span> Details</h2>

            <div className="form-content-scroll">
                <p className="subtitle">Let us stay in touch with you.</p>

                {submitted ? (
                    <div className="success-message">
                        <h3>Thank you!</h3>
                        <p>We have recorded your details.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input name="name" type="text" onChange={handleChange} required placeholder="Enter your name" />
                        </div>

                        <div className="form-group">
                            <label>Contact Number</label>
                            <input name="phone" type="tel" onChange={handleChange} required placeholder="Enter mobile number" />
                        </div>

                        <div className="form-group">
                            <label>District</label>
                            <select name="district" onChange={handleChange} required value={formData.district}>
                                <option value="">Select District</option>
                                {districts.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Previous School</label>
                            <input
                                name="school"
                                type="text"
                                list="school-suggestions"
                                onChange={handleChange}
                                placeholder="Type or select school"
                                autoComplete="off"
                            />
                            <datalist id="school-suggestions">
                                {suggestedSchools.map(s => <option key={s} value={s} />)}
                            </datalist>
                        </div>

                        <div className="form-group">
                            <label>Preferred Course</label>
                            <select name="course" onChange={handleChange}>
                                <option value="">Select a course...</option>
                                <option value="cs">Computer Science Engineering</option>
                                <option value="ec">Electronics and Communication Engineering</option>
                                <option value="me">Mechanical Engineering</option>
                                <option value="cv">Civil Engineering</option>
                                <option value="ai">Artificial Intelligence and Data Science Engineering</option>
                                <option value="cs-cy">Cyber Security Engineering</option>
                            </select>
                        </div>

                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '20px' }}>Submit Details</button>
                    </form>
                )}
            </div>

            <style>{`
        .form-container {
          width: 90%;
          max-width: 500px;
          height: 80vh;
          padding: 30px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          animation: fade-in 0.5s ease-out;
        }

        .form-content-scroll {
          overflow-y: auto;
          flex: 1;
          padding-right: 15px;
        }

        .form-content-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .form-content-scroll::-webkit-scrollbar-thumb {
          background: var(--primary-color);
          border-radius: 3px;
        }

        .subtitle {
          color: var(--text-secondary);
          margin-bottom: 20px;
        }
        .form-group {
          margin-bottom: 15px;
        }
        label {
          display: block;
          margin-bottom: 5px;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        input, select {
          width: 100%;
          padding: 10px;
          border-radius: 10px;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid var(--glass-border);
          color: white;
          font-family: inherit;
        }
        input:focus, select:focus {
          outline: none;
          border-color: var(--primary-color);
        }
        .success-message {
          text-align: center;
          padding: 40px 0;
          color: var(--success-color);
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
