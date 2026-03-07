import { useEffect, useState } from 'react';

export default function AdminView() {
    const [activeTab, setActiveTab] = useState('visitors'); // 'visitors' or 'knowledge'
    const [visitors, setVisitors] = useState([]);
    const [knowledge, setKnowledge] = useState([]);
    const [editingItem, setEditingItem] = useState(null); // Item being edited
    const [newItem, setNewItem] = useState({ category: '', keywords: '', answer: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('adminAuth') === 'true');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(false);

    // Derived state for categories
    const categories = ['All', ...new Set(knowledge.map(k => k.category))].filter(Boolean);
    const filteredKnowledge = selectedCategory === 'All'
        ? knowledge
        : knowledge.filter(k => k.category === selectedCategory);

    const API_BASE = 'https://roman-production.up.railway.app';

    useEffect(() => {
        fetchVisitors();
        fetchKnowledge();
    }, []);

    const fetchVisitors = () => {
        fetch(`${API_BASE}/visitors`)
            .then(res => res.json())
            .then(data => setVisitors(data))
            .catch(err => console.error("Error fetching visitors:", err));
    };

    const fetchKnowledge = () => {
        fetch(`${API_BASE}/knowledge`)
            .then(res => res.json())
            .then(data => setKnowledge(data))
            .catch(err => console.error("Error fetching knowledge:", err));
    };

    const handleSaveKnowledge = () => {
        const item = editingItem || newItem;
        const method = editingItem ? 'PUT' : 'POST';
        const url = editingItem ? `${API_BASE}/knowledge/${editingItem.id}` : `${API_BASE}/knowledge`;

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    fetchKnowledge();
                    closeModal();
                } else {
                    alert("Failed to save: " + data.detail);
                }
            })
            .catch(err => console.error("Error saving knowledge:", err));
    };

    const handleDeleteKnowledge = (id) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;

        fetch(`${API_BASE}/knowledge/${id}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    fetchKnowledge();
                } else {
                    alert("Failed to delete");
                }
            });
    };

    const handleVideoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        fetch(`${API_BASE}/tour-upload`, {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    alert("Video uploaded successfully! The tour page will now show your video.");
                } else {
                    alert("Upload failed: " + data.detail);
                }
            })
            .catch(err => console.error("Error uploading video:", err));
    };

    const handleStatusUpdate = (id, newStatus) => {
        fetch(`${API_BASE}/visitors/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    // Optimistically update UI
                    setVisitors(visitors.map(v => v.id === id ? { ...v, status: newStatus } : v));
                } else {
                    console.error("Failed to update status");
                }
            })
            .catch(err => console.error("Error updating status:", err));
    };

    const StatusOptions = [
        { value: 'uncalled', color: 'white', label: 'Uncalled' },
        { value: 'interested', color: '#22c55e', label: 'Interested' }, // Green
        { value: 'not_interested', color: '#ef4444', label: 'Not Interested' }, // Red
        { value: 'pending', color: '#eab308', label: 'Pending' }, // Yellow
        { value: 'not_attended', color: '#3b82f6', label: 'Not Attended' } // Blue
    ];

    const openModal = (item = null) => {
        setEditingItem(item);
        if (!item) setNewItem({ category: '', keywords: '', answer: '' });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditingItem(null);
        setIsModalOpen(false);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'admin@rcet') {
            setIsAuthenticated(true);
            localStorage.setItem('adminAuth', 'true');
            setLoginError(false);
        } else {
            setLoginError(true);
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('adminAuth');
        setPassword('');
    };

    if (!isAuthenticated) {
        return (
            <div className="login-container glass-panel">
                <div className="login-card">
                    <h2>Admin Login</h2>
                    <p>Please enter the administrator password</p>
                    <form onSubmit={handleLogin}>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={loginError ? 'error' : ''}
                        />
                        {loginError && <p className="error-msg">Incorrect password. Please try again.</p>}
                        <button type="submit" className="login-btn">Login</button>
                    </form>
                </div>
                <style>{`
                    .login-container {
                        padding: 40px;
                        width: 400px;
                        text-align: center;
                    }
                    .login-card h2 {
                        color: var(--primary-color);
                        margin-bottom: 10px;
                    }
                    .login-card p {
                        color: var(--text-secondary);
                        margin-bottom: 25px;
                        font-size: 0.9rem;
                    }
                    .login-card form {
                        display: flex;
                        flex-direction: column;
                        gap: 15px;
                    }
                    .login-card input {
                        background: rgba(0,0,0,0.3);
                        border: 1px solid var(--glass-border);
                        padding: 12px;
                        border-radius: 8px;
                        color: white;
                        text-align: center;
                    }
                    .login-card input.error {
                        border-color: #ef4444;
                        box-shadow: 0 0 10px rgba(239, 68, 68, 0.2);
                    }
                    .error-msg {
                        color: #ef4444;
                        font-size: 0.8rem;
                        margin-top: -5px;
                    }
                    .login-btn {
                        background: var(--primary-color);
                        color: white;
                        border: none;
                        padding: 12px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: bold;
                        transition: all 0.3s;
                    }
                    .login-btn:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 5px 15px var(--primary-glow);
                    }
                `}</style>
            </div>
        );
    }

    // Filter Logic
    const isVisitorTab = activeTab !== 'knowledge';
    const filteredVisitors = activeTab === 'visitors'
        ? visitors
        : visitors.filter(v => (v.status || 'uncalled') === activeTab);

    return (
        <div className="admin-container glass-panel">
            <div className="admin-header">
                <h2><span style={{ color: 'var(--primary-color)' }}>Admin</span> Dashboard</h2>

                {/* Scrollable Tabs Container */}
                <div className="tabs-container">
                    <div className="tabs">
                        <button
                            className={`tab-btn ${activeTab === 'visitors' ? 'active' : ''}`}
                            onClick={() => setActiveTab('visitors')}
                        >
                            All Logs
                        </button>

                        {StatusOptions.map(opt => (
                            <button
                                key={opt.value}
                                className={`tab-btn ${activeTab === opt.value ? 'active' : ''}`}
                                onClick={() => setActiveTab(opt.value)}
                                style={activeTab === opt.value ? { backgroundColor: opt.color, color: opt.color === 'white' ? 'black' : 'white' } : {}}
                            >
                                {opt.label}
                            </button>
                        ))}

                        <div className="divider"></div>

                        <button
                            className={`tab-btn ${activeTab === 'knowledge' ? 'active' : ''}`}
                            onClick={() => setActiveTab('knowledge')}
                        >
                            Knowledge Base
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <label className="upload-btn">
                        Upload Tour Video
                        <input type="file" accept="video/*" onChange={handleVideoUpload} style={{ display: 'none' }} />
                    </label>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            <div className="content-area">
                {isVisitorTab ? (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>School</th>
                                    <th>Course</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredVisitors.length === 0 ? (
                                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No records found</td></tr>
                                ) : (
                                    filteredVisitors.map(v => (
                                        <tr key={v.id}>
                                            <td>{v.name}</td>
                                            <td>{v.phone}</td>
                                            <td>{v.school}</td>
                                            <td>{v.course ? v.course.toUpperCase() : '-'}</td>
                                            <td>
                                                <div className="status-radio-group">
                                                    {StatusOptions.map(opt => (
                                                        <label key={opt.value} className="status-radio-label" title={opt.label}>
                                                            <input
                                                                type="radio"
                                                                name={`status-${v.id}`}
                                                                value={opt.value}
                                                                checked={(v.status || 'uncalled') === opt.value}
                                                                onChange={() => handleStatusUpdate(v.id, opt.value)}
                                                            />
                                                            <span className="radio-custom" style={{ backgroundColor: opt.color }}></span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </td>
                                            <td>{new Date(v.date).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="knowledge-wrapper">
                        <div className="actions-bar">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="category-select"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <button className="add-btn" onClick={() => openModal()}>+ Add New Entry</button>
                        </div>
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th style={{ width: '15%' }}>Category</th>
                                        <th style={{ width: '25%' }}>Keywords</th>
                                        <th style={{ width: '45%' }}>Answer</th>
                                        <th style={{ width: '15%' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredKnowledge.length === 0 ? (
                                        <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No records found in Knowledge Base</td></tr>
                                    ) : (
                                        filteredKnowledge.map(k => (
                                            <tr key={k.id}>
                                                <td>{k.category}</td>
                                                <td><div className="truncate">{k.keywords}</div></td>
                                                <td><div className="truncate">{k.answer}</div></td>
                                                <td>
                                                    <button className="action-btn edit" onClick={() => openModal(k)}>✎</button>
                                                    <button className="action-btn delete" onClick={() => handleDeleteKnowledge(k.id)}>🗑</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal glass-panel">
                        <h3>{editingItem ? 'Edit Knowledge' : 'Add New Knowledge'}</h3>

                        <div className="form-group">
                            <label>Category (e.g., 'fees', 'hostel')</label>
                            <input
                                type="text"
                                value={editingItem ? editingItem.category : newItem.category}
                                onChange={e => editingItem
                                    ? setEditingItem({ ...editingItem, category: e.target.value })
                                    : setNewItem({ ...newItem, category: e.target.value })
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Keywords (space separated)</label>
                            <input
                                type="text"
                                placeholder="e.g. fees cost price"
                                value={editingItem ? editingItem.keywords : newItem.keywords}
                                onChange={e => editingItem
                                    ? setEditingItem({ ...editingItem, keywords: e.target.value })
                                    : setNewItem({ ...newItem, keywords: e.target.value })
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Answer</label>
                            <textarea
                                rows="4"
                                value={editingItem ? editingItem.answer : newItem.answer}
                                onChange={e => editingItem
                                    ? setEditingItem({ ...editingItem, answer: e.target.value })
                                    : setNewItem({ ...newItem, answer: e.target.value })
                                }
                            ></textarea>
                        </div>

                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={closeModal}>Cancel</button>
                            <button className="save-btn" onClick={handleSaveKnowledge}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .admin-container {
                    width: 95%;
                    max-width: 1200px;
                    height: 85vh;
                    padding: 30px;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    position: relative;
                }
                .admin-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid var(--glass-border);
                    padding-bottom: 15px;
                }
                .tabs-container {
                    overflow-x: auto;
                    max-width: 70%;
                }
                .tabs {
                    display: flex;
                    gap: 10px;
                    background: rgba(0,0,0,0.2);
                    padding: 5px;
                    border-radius: 10px;
                    align-items: center;
                    white-space: nowrap;
                }
                .divider {
                    width: 1px;
                    height: 20px;
                    background: rgba(255,255,255,0.2);
                    margin: 0 5px;
                }
                .tab-btn {
                    background: transparent;
                    border: none;
                    color: var(--text-secondary);
                    padding: 8px 16px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .tab-btn.active {
                    background: var(--primary-color);
                    color: white;
                }
                .content-area {
                    flex: 1;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }
                .knowledge-wrapper {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    gap: 15px;
                }
                .actions-bar {
                    display: flex;
                    justify-content: flex-end;
                }
                .add-btn {
                    background: var(--success-color);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: transform 0.2s;
                }
                .add-btn:hover {
                    transform: scale(1.05);
                }
                .table-wrapper {
                    overflow: auto;
                    flex: 1;
                    border: 1px solid var(--glass-border);
                    border-radius: 12px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    color: var(--text-primary);
                }
                th, td {
                    padding: 15px;
                    text-align: left;
                    border-bottom: 1px solid var(--glass-border);
                }
                th {
                    background: rgba(14, 165, 233, 0.2);
                    position: sticky;
                    top: 0;
                    backdrop-filter: blur(5px);
                    color: var(--primary-color);
                    z-index: 10;
                }
                tr:hover {
                    background: rgba(255,255,255,0.05);
                }
                .truncate {
                    max-width: 300px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .action-btn {
                    background: transparent;
                    border: 1px solid var(--glass-border);
                    color: white;
                    width: 30px;
                    height: 30px;
                    border-radius: 5px;
                    margin-right: 5px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .action-btn.edit:hover { background: var(--primary-color); border-color: var(--primary-color); }
                .action-btn.delete:hover { background: #ef4444; border-color: #ef4444; }

                /* Status Radio Buttons */
                .status-radio-group {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                }
                .status-radio-label {
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .status-radio-label input {
                    display: none;
                }
                .radio-custom {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    display: inline-block;
                    border: 2px solid transparent;
                    box-shadow: 0 0 5px rgba(0,0,0,0.5);
                    transition: transform 0.2s, border-color 0.2s;
                }
                .status-radio-label input:checked + .radio-custom {
                    transform: scale(1.2);
                    border-color: white;
                    box-shadow: 0 0 10px currentColor;
                }

                /* Modal Styles */
                .modal-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.7);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 100;
                    backdrop-filter: blur(5px);
                    border-radius: 20px;
                }
                .modal {
                    width: 500px;
                    padding: 30px;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    box-shadow: 0 0 40px rgba(0,0,0,0.5);
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }
                .form-group label {
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                }
                .form-group input, .form-group textarea {
                    background: rgba(0,0,0,0.3);
                    border: 1px solid var(--glass-border);
                    padding: 10px;
                    border-radius: 8px;
                    color: white;
                    font-family: inherit;
                }
                .form-group input:focus, .form-group textarea:focus {
                    border-color: var(--primary-color);
                    outline: none;
                }
                .modal-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    margin-top: 10px;
                }
                .cancel-btn {
                    padding: 10px 20px;
                    background: transparent;
                    border: 1px solid var(--glass-border);
                    color: var(--text-secondary);
                    border-radius: 8px;
                    cursor: pointer;
                }
                .save-btn {
                    padding: 10px 20px;
                    background: var(--primary-color);
                    border: none;
                    color: white;
                    border-radius: 8px;
                    cursor: pointer;
                }
                    box-shadow: 0 0 15px var(--primary-glow);
                }
                .upload-btn {
                    background: rgba(255,255,255,0.1);
                    border: 1px solid var(--glass-border);
                    color: white;
                    padding: 8px 16px;
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    transition: all 0.3s;
                    font-size: 0.9rem;
                }
                .upload-btn:hover {
                    background: rgba(255,255,255,0.2);
                }
                .category-select {
                    background: rgba(0,0,0,0.3);
                    color: white;
                    border: 1px solid var(--glass-border);
                    padding: 8px;
                    border-radius: 8px;
                    margin-right: 10px;
                    cursor: pointer;
                    min-width: 150px;
                }
                .category-select option {
                    background: #1e293b;
                }
                .logout-btn {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    color: #ef4444;
                    padding: 8px 16px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-size: 0.9rem;
                }
                .logout-btn:hover {
                    background: #ef4444;
                    color: white;
                }
            `}</style>
        </div>
    );
}
