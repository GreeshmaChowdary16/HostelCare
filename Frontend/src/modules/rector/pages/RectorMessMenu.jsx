import React, { useState } from 'react';
import Header from '../../../components/Header';

const RectorMessMenu = () => {
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

                /* Insights Section */
                .insights-card {
                    background: white;
                    border-radius: 15px;
                    padding: 25px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                    border-top: 5px solid #1cc88a;
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
                    border-left: 5px solid #1cc88a;
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
                .menu-value { font-size: 20px; font-weight: 600; color: #5a5c69; margin-top: 5px; }

                .calendar-strip { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 10px; margin-bottom: 10px; }
                .day-card { min-width: 90px; padding: 12px; background: white; border-radius: 10px; text-align: center; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.05); border: 2px solid transparent; }
                .day-card.active { background: #1cc88a; color: white; }

                /* Detailed Table Section */
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

                .hostel-badge {
                    padding: 3px 8px;
                    border-radius: 4px;
                    font-size: 11px;
                    font-weight: 700;
                    background: #e3fdf4;
                    color: #1cc88a;
                }
            `}</style>

            <div className="rector-mess-container">
                {/* Insights Section */}
                {/* Food Feedback Section */}
                <div className="detailed-reviews-card" style={{ borderLeft: '5px solid #4e73df', marginBottom: '30px' }}>
                    <h3 className="section-title">
                        <i className="fas fa-comments" style={{ color: '#4e73df' }}></i>
                        Today's Meal Feedback Summary
                    </h3>
                    <p style={{ fontSize: '13px', color: '#858796', marginBottom: '20px' }}>Summary of student feedback received for today's meals.</p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                        {[
                            { meal: 'Breakfast', rating: '3.8/5', comments: 'Students liked the Poha, but suggested more spice.', count: 42 },
                            { meal: 'Lunch', rating: '4.2/5', comments: 'Chole Bhature was a hit. High student satisfaction.', count: 85 },
                            { meal: 'Dinner', rating: '3.5/5', comments: 'Paratha was slightly dry. Need more curd/chutney.', count: 38 }
                        ].map((item, idx) => (
                            <div key={idx} style={{ padding: '15px', borderRadius: '12px', background: '#f8f9fc', border: '1px solid #e3e6f0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <div style={{ fontWeight: 700, color: '#4e73df' }}>{item.meal}</div>
                                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#f6c23e' }}>
                                        <i className="fas fa-star"></i> {item.rating}
                                    </div>
                                </div>
                                <p style={{ fontSize: '12px', color: '#5a5c69', marginBottom: '10px', height: '35px', overflow: 'hidden' }}>{item.comments}</p>
                                <div style={{ fontSize: '11px', color: '#858796', borderTop: '1px solid #eaecf4', paddingTop: '8px' }}>
                                    <i className="fas fa-users"></i> {item.count} Student Responses
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                    <h3 className="section-title"><i className="fas fa-calendar-alt" style={{ color: '#1cc88a' }}></i> Weekly Menu Overview</h3>
                    <div className="calendar-strip">
                        {Object.keys(weeklyMenu).map((day) => (
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
                        <i className="fas fa-clipboard-list"></i> {selectedDay}'s Menu Details
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
            </div>
        </>
    );
};

export default RectorMessMenu;
