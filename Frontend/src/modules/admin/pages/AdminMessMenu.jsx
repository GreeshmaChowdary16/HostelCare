import React, { useState } from 'react';
import Header from '../../../components/Header';

const AdminMessMenu = () => {
    const [selectedDay, setSelectedDay] = useState('Monday');
    const [isEditing, setIsEditing] = useState(false);

    const [weeklyMenu, setWeeklyMenu] = useState({
        'Monday': { breakfast: 'Idli, Sambhar', lunch: 'Rice, Dal Tadka', dinner: 'Roti, Paneer' },
        'Tuesday': { breakfast: 'Poha, Jalebi', lunch: 'Chole Bhature', dinner: 'Mix Veg, Paratha' },
        'Wednesday': { breakfast: 'Upma, Chutney', lunch: 'Rajma Chawal', dinner: 'Aloo Gobi, Roti' },
        'Thursday': { breakfast: 'Dosa, Chutney', lunch: 'Veg Biryani', dinner: 'Dal Fry, Rice' },
        'Friday': { breakfast: 'Aloo Paratha', lunch: 'Kadai Paneer, Naan', dinner: 'Khichdi, Kadhi' },
        'Saturday': { breakfast: 'Bread Butter', lunch: 'Pasta, Salad', dinner: 'Pav Bhaji' },
        'Sunday': { breakfast: 'Poori Bhaji', lunch: 'Special Thali', dinner: 'Fried Rice, Manchurian' }
    });

    const [editForm, setEditForm] = useState({ breakfast: '', lunch: '', dinner: '' });

    const handleEditClick = () => {
        setEditForm(weeklyMenu[selectedDay]);
        setIsEditing(true);
    };

    const handleSave = () => {
        setWeeklyMenu({ ...weeklyMenu, [selectedDay]: editForm });
        setIsEditing(false);
    };

    return (
        <>
            <Header title="Mess & Food Management" />
            <style>{`
                .admin-mess-container {
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

                /* Mini Calendar */
                .calendar-strip {
                    display: flex;
                    gap: 10px;
                    overflow-x: auto;
                    padding-bottom: 10px;
                    margin-bottom: 10px;
                }

                .day-card {
                    min-width: 100px;
                    padding: 15px;
                    background: white;
                    border-radius: 12px;
                    text-align: center;
                    cursor: pointer;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                    transition: all 0.2s;
                    border: 2px solid transparent;
                }

                .day-card.active {
                    background: #4e73df;
                    color: white;
                    border-color: #4e73df;
                }

                /* Food Section */
                .food-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                }

                .menu-card {
                    background: linear-gradient(135deg, #4e73df 0%, #224abe 100%);
                    color: white;
                    border-radius: 15px;
                    padding: 30px;
                    position: relative;
                    overflow: hidden;
                }

                .menu-item {
                    margin-bottom: 15px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }

                .menu-label { font-size: 11px; text-transform: uppercase; font-weight: 700; opacity: 0.8; }
                .menu-value { font-size: 18px; font-weight: 600; margin-top: 3px; }

                /* Insights Section */
                .insights-card {
                    background: white;
                    border-radius: 15px;
                    padding: 25px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                }

                .mess-grid {
                    display: grid;
                    grid-template-columns: 1.2fr 1fr;
                    gap: 40px;
                }

                .mess-column-title {
                    font-size: 16px;
                    font-weight: 700;
                    color: #5a5c69;
                    margin-bottom: 15px;
                    border-bottom: 2px solid #eaecf4;
                    padding-bottom: 8px;
                }

                .request-box {
                    background: #f8f9fc;
                    padding: 20px;
                    border-radius: 10px;
                    border-left: 5px solid #4e73df;
                    margin-bottom: 15px;
                }

                .feedback-item {
                    padding: 12px 20px;
                    border-radius: 10px;
                    margin-bottom: 12px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .feedback-good { background: #e3fdf4; color: #1cc88a; border-left: 5px solid #1cc88a; }
                .feedback-bad { background: #fff5f5; color: #e74a3b; border-left: 5px solid #e74a3b; }

                /* Detailed Table Section */
                .detailed-reviews-card {
                    background: white;
                    border-radius: 15px;
                    padding: 25px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
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

                .detailed-table tr:hover { background: #fcfdfe; }

                .hostel-badge {
                    padding: 3px 8px;
                    border-radius: 4px;
                    font-size: 11px;
                    font-weight: 700;
                    background: #eaecf4;
                    color: #5a5c69;
                }

                /* Update Form */
                .update-card {
                    background: white;
                    border-radius: 15px;
                    padding: 25px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                }

                .form-group label { display: block; font-size: 11px; font-weight: 700; color: #858796; margin-bottom: 5px; text-transform: uppercase; }
                .form-group input { 
                    width: 100%; 
                    padding: 10px; 
                    border: 1px solid #d1d3e2; 
                    border-radius: 8px; 
                    margin-bottom: 15px;
                }

                .btn-save {
                    background: #1cc88a;
                    color: white;
                    border: none;
                    padding: 12px;
                    border-radius: 8px;
                    font-weight: 700;
                    cursor: pointer;
                    width: 100%;
                }

                @media (max-width: 992px) {
                    .food-grid, .mess-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>

            <div className="admin-mess-container">
                {/* Insights Section (As requested in image) */}
                {/* Food Feedback Section */}
                <div className="detailed-reviews-card" style={{ borderLeft: '5px solid #4e73df', marginBottom: '30px' }}>
                    <h3 className="section-title">
                        <i className="fas fa-comments" style={{ color: '#4e73df' }}></i>
                        Hostel-wide Meal Feedback Summary
                    </h3>
                    <p style={{ fontSize: '13px', color: '#858796', marginBottom: '20px' }}>Aggregated feedback from all hostel wings for today's meals.</p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                        {[
                            { meal: 'Breakfast', rating: '3.9/5', comments: 'Generally positive. Hostel B requested more fruit options.', count: 156 },
                            { meal: 'Lunch', rating: '4.3/5', comments: 'Excellent response for Special Thali. Minimal wastage.', count: 312 },
                            { meal: 'Dinner', rating: '3.6/5', comments: 'Paneer quantity was sufficient, but spice levels varied.', count: 245 }
                        ].map((item, idx) => (
                            <div key={idx} style={{ padding: '15px', borderRadius: '12px', background: '#f8f9fc', border: '1px solid #e3e6f0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <div style={{ fontWeight: 700, color: '#4e73df' }}>{item.meal}</div>
                                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#f6c23e' }}>
                                        <i className="fas fa-star"></i> {item.rating}
                                    </div>
                                </div>
                                <p style={{ fontSize: '12px', color: '#5a5c69', marginBottom: '10px', height: '35px', overflow: 'hidden' }}>{item.comments}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#858796', borderTop: '1px solid #eaecf4', paddingTop: '8px' }}>
                                    <span><i className="fas fa-users"></i> {item.count} Responses</span>
                                    <span style={{ fontWeight: 600, color: '#1cc88a' }}>Actioned</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Calendar Section */}
                <div>
                    <h3 className="section-title"><i className="fas fa-calendar-alt"></i> Weekly Menu Schedule</h3>
                    <div className="calendar-strip">
                        {Object.keys(weeklyMenu).map((day) => (
                            <div 
                                key={day} 
                                className={`day-card ${selectedDay === day ? 'active' : ''}`}
                                onClick={() => { setSelectedDay(day); setIsEditing(false); }}
                            >
                                <div style={{ fontWeight: 700, fontSize: '14px' }}>{day}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="food-grid">
                    <div className="menu-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 className="section-title" style={{ color: 'white', margin: 0 }}>
                                <i className="fas fa-utensils"></i> {selectedDay}'s Menu
                            </h3>
                            <button 
                                onClick={handleEditClick}
                                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '5px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' }}
                            >
                                <i className="fas fa-edit"></i> Edit
                            </button>
                        </div>
                        <div className="menu-item">
                            <div className="menu-label">Breakfast</div>
                            <div className="menu-value">{weeklyMenu[selectedDay].breakfast}</div>
                        </div>
                        <div className="menu-item">
                            <div className="menu-label">Lunch</div>
                            <div className="menu-value">{weeklyMenu[selectedDay].lunch}</div>
                        </div>
                        <div className="menu-item">
                            <div className="menu-label">Dinner</div>
                            <div className="menu-value">{weeklyMenu[selectedDay].dinner}</div>
                        </div>
                    </div>

                    <div className="update-card">
                        <h3 className="section-title">
                            <i className="fas fa-sync-alt" style={{ color: '#4e73df' }}></i>
                            Update {selectedDay} Menu
                        </h3>
                        <div className="form-group">
                            <label>Breakfast</label>
                            <input 
                                type="text" 
                                value={isEditing ? editForm.breakfast : weeklyMenu[selectedDay].breakfast} 
                                onChange={(e) => { setIsEditing(true); setEditForm({ ...editForm, breakfast: e.target.value }); }}
                            />
                        </div>
                        <div className="form-group">
                            <label>Lunch</label>
                            <input 
                                type="text" 
                                value={isEditing ? editForm.lunch : weeklyMenu[selectedDay].lunch} 
                                onChange={(e) => { setIsEditing(true); setEditForm({ ...editForm, lunch: e.target.value }); }}
                            />
                        </div>
                        <div className="form-group">
                            <label>Dinner</label>
                            <input 
                                type="text" 
                                value={isEditing ? editForm.dinner : weeklyMenu[selectedDay].dinner} 
                                onChange={(e) => { setIsEditing(true); setEditForm({ ...editForm, dinner: e.target.value }); }}
                            />
                        </div>
                        <button className="btn-save" onClick={handleSave} disabled={!isEditing} style={{ opacity: isEditing ? 1 : 0.6 }}>
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminMessMenu;
