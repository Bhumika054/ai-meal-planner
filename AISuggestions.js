import React, { useState } from 'react';
import { Sparkles, Clock, Users, Zap } from 'lucide-react';
import axios from 'axios';

const AISuggestions = () => {
  const [preferences, setPreferences] = useState({
    dietary_restrictions: '',
    cuisine_preference: '',
    meal_type: '',
    target_calories: ''
  });
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getSuggestions = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/ai-suggestions', preferences);
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header mb-6">
        <h2>AI Meal Suggestions</h2>
        <p>Get personalized meal recommendations based on your preferences</p>
      </div>

      <div className="card mb-6">
        <h3 className="mb-4">Tell us your preferences</h3>
        
        <div className="grid grid-2 mb-4">
          <div>
            <label className="form-label">Dietary Restrictions</label>
            <input
              type="text"
              name="dietary_restrictions"
              className="input"
              placeholder="e.g., vegetarian, gluten-free, dairy-free"
              value={preferences.dietary_restrictions}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <label className="form-label">Cuisine Preference</label>
            <input
              type="text"
              name="cuisine_preference"
              className="input"
              placeholder="e.g., Italian, Asian, Mediterranean"
              value={preferences.cuisine_preference}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <label className="form-label">Meal Type</label>
            <select
              name="meal_type"
              className="select"
              value={preferences.meal_type}
              onChange={handleInputChange}
            >
              <option value="">Any meal type</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snack">Snack</option>
            </select>
          </div>
          
          <div>
            <label className="form-label">Target Calories (max)</label>
            <input
              type="number"
              name="target_calories"
              className="input"
              placeholder="e.g., 500"
              value={preferences.target_calories}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <button
          className="btn btn-primary"
          onClick={getSuggestions}
          disabled={loading}
        >
          <Sparkles size={20} />
          {loading ? 'Getting Suggestions...' : 'Get AI Suggestions'}
        </button>
      </div>

      {suggestions && (
        <div className="card">
          <h3 className="mb-4">{suggestions.message}</h3>
          
          {suggestions.meals.length > 0 ? (
            <div className="grid grid-2">
              {suggestions.meals.map((meal) => (
                <div key={meal.id} className="suggestion-card">
                  <div className="meal-header">
                    <h4>{meal.name}</h4>
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
                  <div className="suggestion-actions">
                    <button className="btn btn-secondary">View Recipe</button>
                    <button className="btn btn-primary">Add to Plan</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-suggestions">
              <p>No meals found matching your preferences. Try adjusting your criteria.</p>
            </div>
          )}
          
          {suggestions.preferences_used && (
            <div className="preferences-summary">
              <h4>Preferences used:</h4>
              <div className="preference-tags">
                {suggestions.preferences_used.dietary_restrictions && (
                  <span className="tag">🥗 {suggestions.preferences_used.dietary_restrictions}</span>
                )}
                {suggestions.preferences_used.cuisine_preference && (
                  <span className="tag">🍽️ {suggestions.preferences_used.cuisine_preference}</span>
                )}
                {suggestions.preferences_used.meal_type && (
                  <span className="tag">⏰ {suggestions.preferences_used.meal_type}</span>
                )}
                {suggestions.preferences_used.target_calories && (
                  <span className="tag">🔥 Max {suggestions.preferences_used.target_calories} cal</span>
                )}
              </div>
            </div>
          )}
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

        .form-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
        }

        .suggestion-card {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          border: 1px solid #e9ecef;
        }

        .meal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .meal-header h4 {
          font-size: 18px;
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
          margin-bottom: 16px;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #888;
          font-size: 14px;
        }

        .suggestion-actions {
          display: flex;
          gap: 12px;
        }

        .suggestion-actions .btn {
          flex: 1;
          justify-content: center;
        }

        .no-suggestions {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .preferences-summary {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid #eee;
        }

        .preferences-summary h4 {
          margin-bottom: 12px;
          color: #333;
        }

        .preference-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .tag {
          background: #e9ecef;
          color: #495057;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default AISuggestions;
