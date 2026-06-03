import React, { useState } from 'react';
import Header from '../../../components/Header';

const StudentMessMenu = () => {
    const [selectedDay, setSelectedDay] = useState('Monday');

    const weeklyMenu = {
        'Monday': { breakfast: 'Idli, Sambhar', lunch: 'Rice, Dal Tadka', dinner: 'Roti, Paneer' },
        'Tuesday': { breakfast: 'Poha, Jalebi', lunch: 'Chole Bhature', dinner: 'Mix Veg, Paratha' },
        'Wednesday': { breakfast: 'Upma, Chutney', lunch: 'Rajma Chawal', dinner: 'Aloo Gobi, Roti' },
        'Thursday': { breakfast: 'Dosa, Chutney', lunch: 'Veg Biryani', dinner: 'Dal Fry, Rice' },
        'Friday': { breakfast: 'Aloo Paratha', lunch: 'Kadai Paneer, Naan', dinner: 'Khichdi, Kadhi' },
        'Saturday': { breakfast: 'Bread Butter', lunch: 'Pasta, Salad', dinner: 'Pav Bhaji' },
        'Sunday': { breakfast: 'Poori Bhaji', lunch: 'Special Thali', dinner: 'Fried Rice, Manchurian' }
    };

    return (
        <>
            <Header title="Hostel Mess Menu" />
            <style>{`
                .student-mess-container {
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
                    font-size: 22px;
                    font-weight: 700;
                    color: #5a5c69;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                /* Calendar */
                .calendar-strip {
                    display: flex;
                    gap: 10px;
                    overflow-x: auto;
                    padding-bottom: 10px;
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
                }

                .day-card.active {
                    background: #4e73df;
                    color: white;
                }

                .day-name { font-weight: 700; font-size: 14px; }

                /* Menu Layout */
                .menu-display-card {
                    background: linear-gradient(135deg, #4e73df 0%, #224abe 100%);
                    color: white;
                    border-radius: 15px;
                    padding: 40px;
                    box-shadow: 0 10px 20px rgba(78, 115, 223, 0.2);
                    max-width: 800px;
                    margin: 0 auto;
                    width: 100%;
                }

                .menu-item {
                    margin-bottom: 25px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }

                .menu-item:last-child { border-bottom: none; }
                .menu-label { font-size: 14px; text-transform: uppercase; font-weight: 700; opacity: 0.8; margin-bottom: 5px; }
                .menu-value { font-size: 24px; font-weight: 600; }

                /* Popularity Insights */
                .popularity-container {
                    background: white;
                    border-radius: 15px;
                    padding: 25px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                    max-width: 800px;
                    margin: 0 auto;
                    width: 100%;
                }

                .popularity-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }

                .popularity-card {
                    padding: 20px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .bg-success-light { background: #e3fdf4; color: #1cc88a; border: 1px solid #c0ebd7; }
                .bg-danger-light { background: #fff5f5; color: #e74a3b; border: 1px solid #fbdada; }

                .popularity-icon {
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    background: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                }
            `}</style>

            <div className="student-mess-container">
                <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                    <h3 className="section-title"><i className="fas fa-calendar-check"></i> Select a Day</h3>
                    <div className="calendar-strip">
                        {Object.keys(weeklyMenu).map((day) => (
                            <div 
                                key={day} 
                                className={`day-card ${selectedDay === day ? 'active' : ''}`}
                                onClick={() => setSelectedDay(day)}
                            >
                                <div className="day-name">{day}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="menu-display-card">
                    <h3 style={{ fontSize: '28px', marginBottom: '30px' }}>
                        <i className="fas fa-utensils"></i> {selectedDay}'s Menu
                    </h3>
                    
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

                <div className="popularity-container">
                    <h3 className="section-title"><i className="fas fa-comment-dots" style={{ color: '#4e73df' }}></i> Food Feedback</h3>
                    <p style={{ fontSize: '14px', color: '#858796', marginBottom: '20px' }}>Rate today's meals and share your experience with the mess committee.</p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        {['Breakfast', 'Lunch', 'Dinner'].map(meal => (
                            <div key={meal} style={{ padding: '15px', border: '1px solid #e3e6f0', borderRadius: '12px', background: '#f8f9fc' }}>
                                <div style={{ fontWeight: 700, fontSize: '15px', color: '#4e73df', marginBottom: '10px' }}>{meal}</div>
                                <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <i key={star} className="fas fa-star" style={{ color: '#f6c23e', fontSize: '14px', cursor: 'pointer' }}></i>
                                    ))}
                                </div>
                                <textarea 
                                    placeholder={`Feedback for ${meal.toLowerCase()}...`}
                                    style={{ width: '100%', border: '1px solid #d1d3e2', borderRadius: '5px', padding: '8px', fontSize: '12px', resize: 'none', height: '60px' }}
                                ></textarea>
                                <button className="btn-sm" style={{ width: '100%', marginTop: '10px', background: '#4e73df', color: 'white', border: 'none', fontSize: '11px' }}>Submit</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudentMessMenu;
