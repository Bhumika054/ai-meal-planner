import React, { useState } from 'react';
import { Plus, Save } from 'lucide-react';
import axios from 'axios';

const AddMeal = () => {
  const [meal, setMeal] = useState({
    name: '',
    description: '',
    ingredients: '',
    instructions: '',
    category: 'Lunch',
    prep_time: '',
    cook_time: '',
    servings: '',
    calories: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMeal(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await axios.post('/api/meals', {
        ...meal,
        prep_time: parseInt(meal.prep_time) || 0,
        cook_time: parseInt(meal.cook_time) || 0,
        servings: parseInt(meal.servings) || 1,
        calories: parseInt(meal.calories) || 0
      });

      setSuccess(true);
      setMeal({
        name: '',
        description: '',
        ingredients: '',
        instructions: '',
        category: 'Lunch',
        prep_time: '',
        cook_time: '',
        servings: '',
        calories: ''
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error adding meal:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header mb-6">
        <h2>Add New Meal</h2>
        <p>Create a new meal recipe for your collection</p>
      </div>

      <div className="card">
        {success && (
          <div className="success-message mb-4">
            <p>✅ Meal added successfully!</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group full-width">
              <label className="form-label">Meal Name *</label>
              <input
                type="text"
                name="name"
                className="input"
                placeholder="Enter meal name"
                value={meal.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="textarea"
                placeholder="Brief description of the meal"
                value={meal.description}
                onChange={handleInputChange}
                rows="3"
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Ingredients *</label>
              <textarea
                name="ingredients"
                className="textarea"
                placeholder="List all ingredients (comma-separated or line-separated)"
                value={meal.ingredients}
                onChange={handleInputChange}
                rows="4"
                required
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Instructions *</label>
              <textarea
                name="instructions"
                className="textarea"
                placeholder="Step-by-step cooking instructions"
                value={meal.instructions}
                onChange={handleInputChange}
                rows="6"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                className="select"
                value={meal.category}
                onChange={handleInputChange}
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
                <option value="Dessert">Dessert</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Prep Time (minutes)</label>
              <input
                type="number"
                name="prep_time"
                className="input"
                placeholder="15"
                value={meal.prep_time}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cook Time (minutes)</label>
              <input
                type="number"
                name="cook_time"
                className="input"
                placeholder="30"
                value={meal.cook_time}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Servings</label>
              <input
                type="number"
                name="servings"
                className="input"
                placeholder="4"
                value={meal.servings}
                onChange={handleInputChange}
                min="1"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Calories (per serving)</label>
              <input
                type="number"
                name="calories"
                className="input"
                placeholder="350"
                value={meal.calories}
                onChange={handleInputChange}
                min="0"
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !meal.name || !meal.ingredients || !meal.instructions}
            >
              <Save size={20} />
              {loading ? 'Adding Meal...' : 'Add Meal'}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h3 className="mb-4">Tips for Adding Great Meals</h3>
        <div className="tips-grid">
          <div className="tip">
            <h4>📝 Clear Instructions</h4>
            <p>Write step-by-step instructions that are easy to follow. Number your steps for clarity.</p>
          </div>
          <div className="tip">
            <h4>🥘 Detailed Ingredients</h4>
            <p>Include quantities and preparation notes (e.g., "2 cups diced tomatoes", "1 onion, chopped").</p>
          </div>
          <div className="tip">
            <h4>⏱️ Accurate Timing</h4>
            <p>Provide realistic prep and cook times to help with meal planning.</p>
          </div>
          <div className="tip">
            <h4>🔥 Nutritional Info</h4>
            <p>Add calorie information to help with dietary planning and health goals.</p>
          </div>
        </div>
      </div>

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

        .success-message {
          background: #d4edda;
          color: #155724;
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid #c3e6cb;
        }

        .success-message p {
          margin: 0;
          font-weight: 600;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
        }

        .textarea {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 16px;
          font-family: inherit;
          resize: vertical;
          transition: border-color 0.2s;
        }

        .textarea:focus {
          outline: none;
          border-color: #667eea;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          padding-top: 20px;
          border-top: 1px solid #e9ecef;
        }

        .tips-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .tip {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .tip h4 {
          font-size: 16px;
          color: #333;
          margin: 0 0 8px 0;
        }

        .tip p {
          color: #666;
          margin: 0;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .form-actions {
            justify-content: stretch;
          }
          
          .form-actions .btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default AddMeal;
