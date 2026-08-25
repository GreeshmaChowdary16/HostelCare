import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import { API_BASE_URL } from '../../../config';

const StudentMessMenu = () => {
    const [selectedDay, setSelectedDay] = useState('Monday');
    const [ratings, setRatings] = useState({ Breakfast: 0, Lunch: 0, Dinner: 0 });
    const [feedback, setFeedback] = useState({ Breakfast: '', Lunch: '', Dinner: '' });
    const [reviews, setReviews] = useState([]);
    const [menu, setMenu] = useState([]);
    const [statusMessage, setStatusMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [menuError, setMenuError] = useState('');

    const fetchMenuAndReviews = async () => {
        setLoading(true);
        setMenuError('');
        const token = localStorage.getItem('token');
        if (!token) return;

        const headers = { Authorization: `Bearer ${token}` };

        try {
            // Fetch Reviews
            const reviewsRes = await fetch(`${API_BASE_URL}/mess-reviews`, { headers });
            if (reviewsRes.ok) {
                const reviewsData = await reviewsRes.json();
                setReviews(reviewsData || []);
            }

            // Fetch Menu
            const menuRes = await fetch(`${API_BASE_URL}/mess-menu`, { headers });
            if (menuRes.ok) {
                const menuData = await menuRes.json();
                setMenu(menuData || []);
            } else {
                setMenuError('Failed to load weekly menu from database.');
            }
        } catch (error) {
            console.error('Error fetching mess menu data:', error);
            setMenuError('Could not connect to the server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchReviewsAndMenu = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const [revRes, menuRes] = await Promise.all([
                fetch(`${API_BASE_URL}/mess-reviews`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${API_BASE_URL}/mess-menu`, { headers: { Authorization: `Bearer ${token}` } })
            ]);

            if (revRes.ok) {
                const data = await revRes.json();
                setReviews(data || []);
            }
            if (menuRes.ok) {
                const menuData = await menuRes.json();
                if (menuData && Object.keys(menuData).length > 0) {
                    setMenu(menuData);
                }
            }
        } catch (error) {
            console.error('Error fetching reviews or menu:', error);
        }
    };

    useEffect(() => {
        fetchMenuAndReviews();
    }, []);

    const handleStarClick = (meal, value) => {
        setRatings((prev) => ({ ...prev, [meal]: value }));
    };

    const handleFeedbackChange = (meal, value) => {
        setFeedback((prev) => ({ ...prev, [meal]: value }));
    };

    const handleSubmit = async (meal) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login first');
            return;
        }

        if (!ratings[meal]) {
            alert('Please provide a rating before submitting.');
            return;
        }

        setLoading(true);
        setStatusMessage('');

        try {
            const response = await fetch(`${API_BASE_URL}/mess-reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    day: selectedDay,
                    meal,
                    rating: ratings[meal],
                    comment: feedback[meal]
                })
            });

            const data = await response.json();
            if (response.ok) {
                setStatusMessage('Review submitted successfully.');
                setFeedback((prev) => ({ ...prev, [meal]: '' }));
                setRatings((prev) => ({ ...prev, [meal]: 0 }));
                fetchMenuAndReviews();
            } else {
                setStatusMessage(data.message || 'Failed to submit review.');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            setStatusMessage('Server error while submitting review.');
        }

        setLoading(false);
    };

    const handleMarkComplete = async (reviewId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login first');
            return;
        }

        setLoading(true);
        setStatusMessage('');

        try {
            const response = await fetch(`${API_BASE_URL}/mess-reviews/${reviewId}/complete`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                setStatusMessage('Review marked complete.');
                fetchMenuAndReviews();
            } else {
                setStatusMessage(data.message || 'Failed to mark complete.');
            }
        } catch (error) {
            console.error('Error completing review:', error);
            setStatusMessage('Server error while updating review.');
        }

        setLoading(false);
    };

    const defaultWeeklyMenu = {
        Monday: { breakfast: 'Idli, Sambhar', lunch: 'Rice, Dal Tadka', dinner: 'Roti, Paneer' },
        Tuesday: { breakfast: 'Poha, Jalebi', lunch: 'Chole Bhature', dinner: 'Mix Veg, Paratha' },
        Wednesday: { breakfast: 'Upma, Chutney', lunch: 'Rajma Chawal', dinner: 'Aloo Gobi, Roti' },
        Thursday: { breakfast: 'Dosa, Chutney', lunch: 'Veg Biryani', dinner: 'Dal Fry, Rice' },
        Friday: { breakfast: 'Aloo Paratha', lunch: 'Kadai Paneer, Naan', dinner: 'Khichdi, Kadhi' },
        Saturday: { breakfast: 'Bread Butter', lunch: 'Pasta, Salad', dinner: 'Pav Bhaji' },
        Sunday: { breakfast: 'Poori Bhaji', lunch: 'Special Thali', dinner: 'Fried Rice, Manchurian' }
    };

    const getMenuForDay = (menuData, dayName) => {
        if (!menuData) return defaultWeeklyMenu[dayName] || { breakfast: 'Not Available', lunch: 'Not Available', dinner: 'Not Available' };
        if (Array.isArray(menuData)) {
            const found = menuData.find(item => item && item.day && item.day.toLowerCase() === dayName.toLowerCase());
            return found || defaultWeeklyMenu[dayName] || { breakfast: 'Not Available', lunch: 'Not Available', dinner: 'Not Available' };
        }
        if (typeof menuData === 'object') {
            const key = Object.keys(menuData).find(k => k.toLowerCase() === dayName.toLowerCase());
            if (key && menuData[key]) return menuData[key];
        }
        return defaultWeeklyMenu[dayName] || { breakfast: 'Not Available', lunch: 'Not Available', dinner: 'Not Available' };
    };

    const currentDayMenu = getMenuForDay(menu, selectedDay);


    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

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

                .feedback-card {
                    padding: 20px;
                    border: 1px solid #e3e6f0;
                    border-radius: 14px;
                    background: #ffffff;
                    box-shadow: 0 4px 16px rgba(16, 24, 40, 0.04);
                }

                .star-row {
                    display: flex;
                    gap: 5px;
                    margin-bottom: 10px;
                }

                .star-row i {
                    font-size: 18px;
                    cursor: pointer;
                }

                .star-row i.active { color: #f6c23e; }
                .star-row i.inactive { color: #d1d3e2; }

                .feedback-textarea {
                    width: 100%;
                    border: 1px solid #d1d3e2;
                    border-radius: 8px;
                    padding: 10px;
                    font-size: 14px;
                    resize: none;
                    min-height: 90px;
                    margin-bottom: 12px;
                }

                .feedback-button {
                    width: 100%;
                    background: #4e73df;
                    color: white;
                    border: none;
                    border-radius: 10px;
                    padding: 12px;
                    cursor: pointer;
                    font-weight: 700;
                }
                .feedback-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .reviews-card {
                    padding: 25px;
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 4px 18px rgba(0,0,0,0.05);
                }

                .review-item {
                    border-bottom: 1px solid #e9ecef;
                    padding: 18px 0;
                }

                .review-item:last-child { border-bottom: none; }
                .review-meta { display: flex; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
                .review-status {
                    font-size: 13px;
                    padding: 6px 10px;
                    border-radius: 999px;
                    font-weight: 700;
                }

                .review-status.Pending { background: #fff4e5; color: #d97706; }
                .review-status.Completed { background: #e9f7ef; color: #1cc88a; }

                .complete-button {
                    background: #1cc88a;
                    color: white;
                    border: none;
                    border-radius: 10px;
                    padding: 8px 14px;
                    cursor: pointer;
                    margin-top: 10px;
                }

                .message-banner {
                    padding: 16px;
                    background: #eef2ff;
                    border-radius: 12px;
                    color: #3730a3;
                    border: 1px solid #c7d2fe;
                    margin-bottom: 20px;
                    max-width: 800px;
                    margin: 0 auto 10px;
                }
            `}</style>

            <div className="student-mess-container">
                <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                    <h3 className="section-title"><i className="fas fa-calendar-check"></i> Select a Day</h3>
                    <div className="calendar-strip">
                        {daysOfWeek.map((day) => (
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

                {menuError ? (
                    <div style={{ padding: '20px', background: '#f8d7da', border: '1px solid #f5c6cb', color: '#721c24', borderRadius: '8px', textAlign: 'center', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                        <i className="fas fa-exclamation-circle" style={{ marginRight: '8px' }}></i>
                        {menuError}
                        <button type="button" onClick={fetchMenuAndReviews} style={{ background: '#721c24', color: 'white', border: 'none', padding: '5px 10px', marginLeft: '15px', borderRadius: '4px', cursor: 'pointer' }}>
                            Retry
                        </button>
                    </div>
                ) : (
                    <div className="menu-display-card">
                        <h3 style={{ fontSize: '28px', marginBottom: '30px' }}>
                            <i className="fas fa-utensils"></i> {selectedDay}'s Menu
                        </h3>

                        <div className="menu-item">
                            <div className="menu-label">Breakfast</div>
                            <div className="menu-value">{currentDayMenu.breakfast}</div>
                        </div>
                        <div className="menu-item">
                            <div className="menu-label">Lunch</div>
                            <div className="menu-value">{currentDayMenu.lunch}</div>
                        </div>
                        <div className="menu-item">
                            <div className="menu-label">Dinner</div>
                            <div className="menu-value">{currentDayMenu.dinner}</div>
                        </div>
                    </div>
                )}

                {statusMessage && <div className="message-banner">{statusMessage}</div>}

                <div className="popularity-container">
                    <h3 className="section-title"><i className="fas fa-comment-dots" style={{ color: '#4e73df' }}></i> Food Feedback</h3>
                    <p style={{ fontSize: '14px', color: '#858796', marginBottom: '20px' }}>Rate today's meals and share your experience with the mess committee.</p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                        {['Breakfast', 'Lunch', 'Dinner'].map((meal) => (
                            <div key={meal} className="feedback-card">
                                <div style={{ fontWeight: 700, fontSize: '16px', color: '#4e73df', marginBottom: '14px' }}>{meal}</div>
                                <div className="star-row">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <i
                                            key={star}
                                            className={`fas fa-star ${ratings[meal] >= star ? 'active' : 'inactive'}`}
                                            onClick={() => handleStarClick(meal, star)}
                                        ></i>
                                    ))}
                                </div>
                                <textarea
                                    className="feedback-textarea"
                                    placeholder={`Feedback for ${meal.toLowerCase()}...`}
                                    value={feedback[meal]}
                                    onChange={(e) => handleFeedbackChange(meal, e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="feedback-button"
                                    onClick={() => handleSubmit(meal)}
                                    disabled={loading || !!menuError}
                                >
                                    {loading ? 'Processing...' : 'Submit Feedback'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="reviews-card">
                    <h3 className="section-title"><i className="fas fa-book-open"></i> My Submitted Reviews</h3>
                    {reviews.length === 0 ? (
                        <p style={{ color: '#6c757d' }}>You have not submitted any mess reviews yet.</p>
                    ) : (
                        reviews.map((review) => (
                            <div key={review._id} className="review-item">
                                <div className="review-meta">
                                    <div>
                                        <strong>{review.day}</strong> • {review.meal}
                                    </div>
                                    <div className={`review-status ${review.status}`}>{review.status}</div>
                                </div>
                                <div style={{ margin: '10px 0' }}>
                                    <strong>Rating:</strong> {review.rating} / 5
                                </div>
                                <div style={{ color: '#5a5c69' }}>{review.comment || 'No comment provided.'}</div>
                                {review.status === 'Pending' && (
                                    <button
                                        type="button"
                                        className="complete-button"
                                        onClick={() => handleMarkComplete(review._id)}
                                        disabled={loading}
                                    >
                                        Mark Complete
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default StudentMessMenu;
