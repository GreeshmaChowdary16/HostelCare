import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import { API_BASE_URL } from '../../../config';

const RectorMessMenu = () => {
    const [selectedDay, setSelectedDay] = useState('Monday');
    const [reviews, setReviews] = useState([]);
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Editing states for the selected day
    const [editBreakfast, setEditBreakfast] = useState('');
    const [editLunch, setEditLunch] = useState('');
    const [editDinner, setEditDinner] = useState('');
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');
    const [saveStatusType, setSaveStatusType] = useState('success');

    const fetchMenuAndReviews = async () => {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authorization token missing. Please log in again.');
            setLoading(false);
            return;
        }

        const headers = { 'Authorization': `Bearer ${token}` };

        try {
            // Fetch Reviews
            const reviewsRes = await fetch(`${API_BASE_URL}/mess-reviews`, { headers });
            let reviewsData = [];
            if (reviewsRes.ok) {
                reviewsData = await reviewsRes.json();
            }

            // Fetch Menu
            const menuRes = await fetch(`${API_BASE_URL}/mess-menu`, { headers });
            let menuData = [];
            if (menuRes.ok) {
                menuData = await menuRes.json();
            }

            setReviews(reviewsData || []);
            setMenu(menuData || []);
        } catch (err) {
            console.error('Error fetching mess menu data:', err);
            setError('Could not connect to the server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenuAndReviews();
    }, []);

    // Sync editing inputs when selectedDay or menu data changes
    const currentDayMenu = menu.find(
        (item) => item.day.toLowerCase() === selectedDay.toLowerCase()
    ) || { breakfast: '', lunch: '', dinner: '' };

    useEffect(() => {
        setEditBreakfast(currentDayMenu.breakfast || '');
        setEditLunch(currentDayMenu.lunch || '');
        setEditDinner(currentDayMenu.dinner || '');
        setSaveStatus('');
    }, [selectedDay, menu]);

    // Handle single day update
    const handleSaveMenu = async () => {
        setSaving(true);
        setSaveStatus('');
        const token = localStorage.getItem('token');
        if (!token) {
            setSaveStatusType('error');
            setSaveStatus('Authorization missing.');
            setSaving(false);
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/mess-menu`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    day: selectedDay,
                    breakfast: editBreakfast,
                    lunch: editLunch,
                    dinner: editDinner
                })
            });

            if (res.ok) {
                setSaveStatusType('success');
                setSaveStatus(`Menu for ${selectedDay} saved successfully!`);
                
                // Refresh local menu states
                const menuRes = await fetch(`${API_BASE_URL}/mess-menu`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (menuRes.ok) {
                    const menuData = await menuRes.json();
                    setMenu(menuData || []);
                }
            } else {
                const data = await res.json();
                setSaveStatusType('error');
                setSaveStatus(data.message || 'Failed to update menu.');
            }
        } catch (err) {
            console.error('Error saving menu:', err);
            setSaveStatusType('error');
            setSaveStatus('Network error while saving menu updates.');
        } finally {
            setSaving(false);
        }
    };

    // Calculate dynamic stats for selected day
    const selectedDayReviews = reviews.filter(
        (r) => r.day && r.day.toLowerCase() === selectedDay.toLowerCase()
    );

    const getMealStats = (mealName) => {
        const mealReviews = selectedDayReviews.filter(
            (r) => r.meal && r.meal.toLowerCase() === mealName.toLowerCase()
        );
        const count = mealReviews.length;
        const sum = mealReviews.reduce((acc, curr) => acc + curr.rating, 0);
        const average = count > 0 ? (sum / count).toFixed(1) : 'N/A';
        
        const commentWithText = mealReviews.find(r => r.comment && r.comment.trim() !== '');
        const sampleComment = commentWithText ? commentWithText.comment : 'No specific comments submitted yet.';

        return { average, count, sampleComment };
    };

    const breakfastStats = getMealStats('Breakfast');
    const lunchStats = getMealStats('Lunch');
    const dinnerStats = getMealStats('Dinner');

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    return (
        <>
            <Header title="Hostel Mess Overview" />
            <style>{`
                .rector-mess-container {
                    padding: 30px;
                    max-width: 1600px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    gap: 30px;
                    background: #f8f9fc;
                    min-height: 100vh;
                }

                .section-title {
                    font-size: 20px;
                    font-weight: 700;
                    color: #5a5c69;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .detailed-reviews-card {
                    background: white;
                    border-radius: 15px;
                    padding: 25px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                    border-left: 5px solid #1cc88a;
                }

                .detailed-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 15px;
                }

                .detailed-table th {
                    text-align: left;
                    padding: 15px;
                    background: #f8f9fc;
                    color: #858796;
                    font-size: 11px;
                    text-transform: uppercase;
                    font-weight: 800;
                    border-bottom: 2px solid #eaecf4;
                }

                .detailed-table td {
                    padding: 15px;
                    border-bottom: 1px solid #eaecf4;
                    font-size: 14px;
                    color: #5a5c69;
                }

                /* Menu Card */
                .menu-card {
                    background: white;
                    border-radius: 15px;
                    padding: 30px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                    max-width: 800px;
                    margin: 0 auto;
                    width: 100%;
                }

                .menu-item {
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid #f8f9fc;
                }

                .menu-label { font-size: 11px; text-transform: uppercase; font-weight: 800; color: #858796; }
                
                .menu-input {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #d1d3e2;
                    border-radius: 6px;
                    font-size: 15px;
                    color: #5a5c69;
                    margin-top: 5px;
                    outline: none;
                }
                .menu-input:focus {
                    border-color: #1cc88a;
                }

                .calendar-strip { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 10px; margin-bottom: 10px; }
                .day-card { min-width: 90px; padding: 12px; background: white; border-radius: 10px; text-align: center; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.05); border: 2px solid transparent; }
                .day-card.active { background: #1cc88a; color: white; }

                .btn-refresh {
                    background: #4e73df;
                    color: white;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                }
                .btn-refresh:disabled {
                    opacity: 0.6;
                }
                .btn-save {
                    background: #1cc88a;
                    color: white;
                    border: none;
                    padding: 12px 25px;
                    border-radius: 6px;
                    font-weight: 700;
                    cursor: pointer;
                    width: 100%;
                    font-size: 15px;
                }
                .btn-save:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                .status-alert {
                    padding: 12px;
                    border-radius: 6px;
                    margin-bottom: 20px;
                    font-size: 14px;
                    font-weight: 600;
                }
                .status-alert.success {
                    background: #d4edda;
                    color: #155724;
                    border: 1px solid #c3e6cb;
                }
                .status-alert.error {
                    background: #f8d7da;
                    color: #721c24;
                    border: 1px solid #f5c6cb;
                }
            `}</style>

            <div className="rector-mess-container">
                {/* Header Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                    <button type="button" disabled={loading} onClick={fetchMenuAndReviews} className="btn-refresh">
                        <i className={`fas fa-sync ${loading ? 'fa-spin' : ''}`} style={{ marginRight: '5px' }}></i>
                        Refresh Overview
                    </button>
                </div>

                {error && (
                    <div style={{ padding: '15px', background: '#f8d7da', border: '1px solid #f5c6cb', color: '#721c24', borderRadius: '8px', textAlign: 'center' }}>
                        <i className="fas fa-exclamation-circle" style={{ marginRight: '8px' }}></i>
                        {error}
                        <button type="button" onClick={fetchMenuAndReviews} style={{ background: '#721c24', color: 'white', border: 'none', padding: '5px 10px', marginLeft: '15px', borderRadius: '4px', cursor: 'pointer' }}>
                            Retry
                        </button>
                    </div>
                )}

                {/* Food Feedback Section */}
                <div className="detailed-reviews-card" style={{ borderLeft: '5px solid #4e73df', marginBottom: '30px' }}>
                    <h3 className="section-title">
                        <i className="fas fa-comments" style={{ color: '#4e73df' }}></i>
                        {selectedDay}'s Meal Feedback Summary
                    </h3>
                    <p style={{ fontSize: '13px', color: '#858796', marginBottom: '20px' }}>
                        Summary of student feedback calculated dynamically from database submissions.
                    </p>
                    
                    {loading ? (
                        <div style={{ padding: '30px 0', textAlign: 'center', color: '#858796' }}>
                            <i className="fas fa-spinner fa-spin fa-2x" style={{ marginBottom: '10px' }}></i>
                            <p>Calculating feedback stats...</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                            {[
                                { meal: 'Breakfast', stats: breakfastStats },
                                { meal: 'Lunch', stats: lunchStats },
                                { meal: 'Dinner', stats: dinnerStats }
                            ].map((item, idx) => (
                                <div key={idx} style={{ padding: '15px', borderRadius: '12px', background: '#f8f9fc', border: '1px solid #e3e6f0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                        <div style={{ fontWeight: 700, color: '#4e73df' }}>{item.meal}</div>
                                        <div style={{ fontSize: '12px', fontWeight: 600, color: item.stats.average !== 'N/A' ? '#f6c23e' : '#858796' }}>
                                            <i className="fas fa-star"></i> {item.stats.average}
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '12px', color: '#5a5c69', marginBottom: '10px', height: '35px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {item.stats.sampleComment}
                                    </p>
                                    <div style={{ fontSize: '11px', color: '#858796', borderTop: '1px solid #eaecf4', paddingTop: '8px' }}>
                                        <i className="fas fa-users"></i> {item.stats.count} Student Response{item.stats.count !== 1 ? 's' : ''}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                    <h3 className="section-title"><i className="fas fa-calendar-alt" style={{ color: '#1cc88a' }}></i> Weekly Menu Overview</h3>
                    <div className="calendar-strip">
                        {daysOfWeek.map((day) => (
                            <div 
                                key={day} 
                                className={`day-card ${selectedDay === day ? 'active' : ''}`}
                                onClick={() => setSelectedDay(day)}
                            >
                                <div style={{ fontWeight: 700, fontSize: '13px' }}>{day}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="menu-card">
                    <h3 className="section-title" style={{ color: '#1cc88a' }}>
                        <i className="fas fa-clipboard-list"></i> Edit {selectedDay}'s Menu
                    </h3>

                    {saveStatus && (
                        <div className={`status-alert ${saveStatusType}`}>
                            <i className={`fas ${saveStatusType === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`} style={{ marginRight: '8px' }}></i>
                            {saveStatus}
                        </div>
                    )}

                    <div className="menu-item">
                        <div className="menu-label">Breakfast</div>
                        <input 
                            type="text" 
                            className="menu-input"
                            value={editBreakfast}
                            placeholder="Enter breakfast items..."
                            onChange={(e) => setEditBreakfast(e.target.value)}
                        />
                    </div>
                    <div className="menu-item">
                        <div className="menu-label">Lunch</div>
                        <input 
                            type="text" 
                            className="menu-input"
                            value={editLunch}
                            placeholder="Enter lunch items..."
                            onChange={(e) => setEditLunch(e.target.value)}
                        />
                    </div>
                    <div className="menu-item">
                        <div className="menu-label">Dinner</div>
                        <input 
                            type="text" 
                            className="menu-input"
                            value={editDinner}
                            placeholder="Enter dinner items..."
                            onChange={(e) => setEditDinner(e.target.value)}
                        />
                    </div>

                    <button 
                        type="button"
                        disabled={saving || loading}
                        className="btn-save"
                        onClick={handleSaveMenu}
                    >
                        <i className="fas fa-save" style={{ marginRight: '8px' }}></i>
                        {saving ? 'Saving updates...' : `Save ${selectedDay}'s Menu`}
                    </button>
                </div>

                {/* Detailed Student Reviews for Selected Day */}
                {!loading && (
                    <div className="detailed-reviews-card">
                        <h3 className="section-title">
                            <i className="fas fa-clipboard-list" style={{ color: '#1cc88a' }}></i>
                            Detailed Student Reviews ({selectedDay})
                        </h3>
                        {selectedDayReviews.length === 0 ? (
                            <div style={{ padding: '20px', textAlign: 'center', color: '#858796' }}>
                                No detailed reviews logged for {selectedDay}.
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table className="detailed-table">
                                    <thead>
                                        <tr style={{ textAlign: 'left' }}>
                                            <th>Student</th>
                                            <th>Meal</th>
                                            <th>Rating</th>
                                            <th>Comment</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedDayReviews.map((rev) => (
                                            <tr key={rev._id} style={{ borderBottom: '1px solid #eaecf4' }}>
                                                <td style={{ fontWeight: 600 }}>{rev.student?.name || 'Anonymous Student'}</td>
                                                <td><strong>{rev.meal}</strong></td>
                                                <td style={{ color: '#f6c23e', fontWeight: 700 }}>
                                                    <i className="fas fa-star"></i> {rev.rating}/5
                                                </td>
                                                <td>{rev.comment || <em style={{ color: '#858796' }}>No comment provided</em>}</td>
                                                <td>{new Date(rev.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default RectorMessMenu;
