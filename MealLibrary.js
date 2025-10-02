import React, { useState, useEffect } from 'react';
import { Clock, Users, Zap } from 'lucide-react';
import axios from 'axios';

const MealLibrary = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState(null);

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const response = await axios.get('/api/meals');
      setMeals(response.data);
    } catch (error) {
      console.error('Error fetching meals:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header mb-6">
        <h2>Meal Library</h2>
        <p>Browse through our collection of delicious and healthy meals</p>
      </div>

      <div className="grid grid-3">
        {meals.map((meal) => (
          <div key={meal.id} className="meal-card" onClick={() => setSelectedMeal(meal)}>
            <div className="meal-header">
              <h3>{meal.name}</h3>
              <span className="meal-category">{meal.category}</span>
            </div>
            <p className="meal-description">{meal.description}</p>
            <div className="meal-stats">
              <div className="stat">
                <Clock size={16} />
                <span>{meal.prep_time + meal.cook_time} min</span>
              </div>
              <div className="stat">
                <Users size={16} />
                <span>{meal.servings} servings</span>
              </div>
              <div className="stat">
                <Zap size={16} />
                <span>{meal.calories} cal</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedMeal && (
        <div className="modal-overlay" onClick={() => setSelectedMeal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedMeal.name}</h3>
              <button className="close-btn" onClick={() => setSelectedMeal(null)}>×</button>
            </div>
            <div className="modal-content">
              <p className="meal-description">{selectedMeal.description}</p>
              
              <div className="meal-details">
                <div className="detail-section">
                  <h4>Ingredients</h4>
                  <p>{selectedMeal.ingredients}</p>
                </div>
                
                <div className="detail-section">
                  <h4>Instructions</h4>
                  <p>{selectedMeal.instructions}</p>
                </div>
                
                <div className="meal-stats">
                  <div className="stat">
                    <Clock size={16} />
                    <span>Prep: {selectedMeal.prep_time} min</span>
                  </div>
                  <div className="stat">
                    <Clock size={16} />
                    <span>Cook: {selectedMeal.cook_time} min</span>
                  </div>
                  <div className="stat">
                    <Users size={16} />
                    <span>{selectedMeal.servings} servings</span>
                  </div>
                  <div className="stat">
                    <Zap size={16} />
                    <span>{selectedMeal.calories} calories</span>
                  </div>
                </div>
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

        .meal-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .meal-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .meal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .meal-header h3 {
          font-size: 20px;
          color: #333;
          margin: 0;
        }

        .meal-category {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .meal-description {
          color: #666;
          margin-bottom: 16px;
          line-height: 1.5;
        }

        .meal-stats {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #888;
          font-size: 14px;
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
          max-width: 600px;
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
          font-size: 24px;
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

        .detail-section {
          margin-bottom: 24px;
        }

        .detail-section h4 {
          font-size: 18px;
          color: #333;
          margin-bottom: 8px;
        }

        .detail-section p {
          color: #666;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};

export default MealLibrary;
