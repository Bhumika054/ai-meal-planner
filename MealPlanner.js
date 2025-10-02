import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Clock, Users, Zap } from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';
import axios from 'axios';

const MealPlanner = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState([]);
  const [mealPlans, setMealPlans] = useState({});
  const [availableMeals, setAvailableMeals] = useState([]);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  useEffect(() => {
    generateWeekDates();
    fetchAvailableMeals();
  }, [selectedDate]);

  useEffect(() => {
    if (weekDates.length > 0) {
      fetchWeekMealPlans();
    }
  }, [weekDates]);

  const generateWeekDates = () => {
    const startDate = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const dates = [];
    for (let i = 0; i < 7; i++) {
      dates.push(addDays(startDate, i));
    }
    setWeekDates(dates);
  };

  const fetchAvailableMeals = async () => {
    try {
      const response = await axios.get('/api/meals');
      setAvailableMeals(response.data);
    } catch (error) {
      console.error('Error fetching meals:', error);
    }
  };

  const fetchWeekMealPlans = async () => {
    try {
      const plans = {};
      for (const date of weekDates) {
        const dateStr = format(date, 'yyyy-MM-dd');
        const response = await axios.get(`/api/meal-plan/${dateStr}`);
        plans[dateStr] = response.data;
      }
      setMealPlans(plans);
    } catch (error) {
      console.error('Error fetching meal plans:', error);
    }
  };

  const addMealToPlan = async (mealId) => {
    if (!selectedSlot) return;

    try {
      await axios.post('/api/meal-plan', {
        date: selectedSlot.date,
        meal_type: selectedSlot.mealType,
        meal_id: mealId
      });
      
      setShowAddMeal(false);
      setSelectedSlot(null);
      fetchWeekMealPlans();
    } catch (error) {
      console.error('Error adding meal to plan:', error);
    }
  };

  const openAddMealDialog = (date, mealType) => {
    setSelectedSlot({ date: format(date, 'yyyy-MM-dd'), mealType });
    setShowAddMeal(true);
  };

  const getMealsForDateAndType = (date, mealType) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayPlans = mealPlans[dateStr] || [];
    return dayPlans.filter(plan => plan.meal_type === mealType);
  };

  return (
    <div>
      <div className="page-header mb-6">
        <h2>Meal Planner</h2>
        <p>Plan your meals for the week ahead</p>
      </div>

      <div className="card">
        <div className="planner-header">
          <h3>Week of {format(weekDates[0] || new Date(), 'MMM dd, yyyy')}</h3>
          <div className="week-navigation">
            <button 
              className="btn btn-secondary"
              onClick={() => setSelectedDate(addDays(selectedDate, -7))}
            >
              Previous Week
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => setSelectedDate(new Date())}
            >
              This Week
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => setSelectedDate(addDays(selectedDate, 7))}
            >
              Next Week
            </button>
          </div>
        </div>

        <div className="meal-planner-grid">
          <div className="grid-header">
            <div className="meal-type-header">Meal</div>
            {weekDates.map(date => (
              <div key={date.toISOString()} className="date-header">
                <div className="day-name">{format(date, 'EEE')}</div>
                <div className="date-number">{format(date, 'dd')}</div>
              </div>
            ))}
          </div>

          {mealTypes.map(mealType => (
            <div key={mealType} className="meal-row">
              <div className="meal-type-cell">{mealType}</div>
              {weekDates.map(date => {
                const meals = getMealsForDateAndType(date, mealType);
                return (
                  <div key={`${date.toISOString()}-${mealType}`} className="meal-cell">
                    {meals.length > 0 ? (
                      meals.map(meal => (
                        <div key={meal.id} className="planned-meal">
                          <div className="meal-name">{meal.name}</div>
                          <div className="meal-info">
                            <span>{meal.calories} cal</span>
                            <span>{meal.prep_time + meal.cook_time} min</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <button
                        className="add-meal-btn"
                        onClick={() => openAddMealDialog(date, mealType)}
                      >
                        <Plus size={16} />
                        Add Meal
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {showAddMeal && (
        <div className="modal-overlay" onClick={() => setShowAddMeal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Meal to {selectedSlot?.mealType}</h3>
              <button className="close-btn" onClick={() => setShowAddMeal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="meals-grid">
                {availableMeals
                  .filter(meal => !selectedSlot?.mealType || meal.category === selectedSlot.mealType)
                  .map(meal => (
                    <div key={meal.id} className="meal-option" onClick={() => addMealToPlan(meal.id)}>
                      <h4>{meal.name}</h4>
                      <p>{meal.description}</p>
                      <div className="meal-stats">
                        <div className="stat">
                          <Clock size={14} />
                          <span>{meal.prep_time + meal.cook_time} min</span>
                        </div>
                        <div className="stat">
                          <Users size={14} />
                          <span>{meal.servings} servings</span>
                        </div>
                        <div className="stat">
                          <Zap size={14} />
                          <span>{meal.calories} cal</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .page-header h2 {
          font-size: 32px;
          color: white;
          margin-bottom: 8px;
        }
        
        .page-header p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 18px;
        }

        .planner-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .planner-header h3 {
          font-size: 24px;
          color: #333;
          margin: 0;
        }

        .week-navigation {
          display: flex;
          gap: 8px;
        }

        .meal-planner-grid {
          border: 1px solid #e9ecef;
          border-radius: 8px;
          overflow: hidden;
        }

        .grid-header {
          display: grid;
          grid-template-columns: 120px repeat(7, 1fr);
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
        }

        .meal-type-header {
          padding: 16px;
          font-weight: 600;
          color: #333;
          border-right: 1px solid #e9ecef;
        }

        .date-header {
          padding: 16px;
          text-align: center;
          border-right: 1px solid #e9ecef;
        }

        .date-header:last-child {
          border-right: none;
        }

        .day-name {
          font-weight: 600;
          color: #333;
          margin-bottom: 4px;
        }

        .date-number {
          color: #666;
          font-size: 14px;
        }

        .meal-row {
          display: grid;
          grid-template-columns: 120px repeat(7, 1fr);
          border-bottom: 1px solid #e9ecef;
        }

        .meal-row:last-child {
          border-bottom: none;
        }

        .meal-type-cell {
          padding: 16px;
          font-weight: 600;
          color: #333;
          border-right: 1px solid #e9ecef;
          background: #fafafa;
        }

        .meal-cell {
          padding: 12px;
          border-right: 1px solid #e9ecef;
          min-height: 80px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .meal-cell:last-child {
          border-right: none;
        }

        .planned-meal {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 14px;
        }

        .meal-name {
          font-weight: 600;
          margin-bottom: 4px;
        }

        .meal-info {
          display: flex;
          gap: 12px;
          font-size: 12px;
          opacity: 0.9;
        }

        .add-meal-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 12px;
          border: 2px dashed #ccc;
          background: transparent;
          color: #666;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
        }

        .add-meal-btn:hover {
          border-color: #667eea;
          color: #667eea;
          background: rgba(102, 126, 234, 0.05);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal {
          background: white;
          border-radius: 12px;
          max-width: 800px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 24px 0;
          border-bottom: 1px solid #eee;
          margin-bottom: 24px;
        }

        .modal-header h3 {
          font-size: 20px;
          color: #333;
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #999;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn:hover {
          color: #333;
        }

        .modal-content {
          padding: 0 24px 24px;
        }

        .meals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 16px;
        }

        .meal-option {
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .meal-option:hover {
          border-color: #667eea;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
        }

        .meal-option h4 {
          font-size: 16px;
          color: #333;
          margin: 0 0 8px 0;
        }

        .meal-option p {
          color: #666;
          font-size: 14px;
          margin: 0 0 12px 0;
          line-height: 1.4;
        }

        .meal-stats {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #888;
          font-size: 12px;
        }

        @media (max-width: 768px) {
          .grid-header,
          .meal-row {
            grid-template-columns: 100px repeat(7, minmax(80px, 1fr));
          }
          
          .meal-type-cell,
          .meal-type-header {
            padding: 12px 8px;
            font-size: 14px;
          }
          
          .date-header {
            padding: 12px 4px;
          }
          
          .meal-cell {
            padding: 8px 4px;
            min-height: 60px;
          }
          
          .planned-meal {
            padding: 6px 8px;
            font-size: 12px;
          }
          
          .add-meal-btn {
            padding: 6px 8px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default MealPlanner;
