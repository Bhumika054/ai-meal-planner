const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize SQLite database
const dbPath = path.join(__dirname, 'meal_planner.db');
const db = new sqlite3.Database(dbPath);

// Create tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS meals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    ingredients TEXT,
    instructions TEXT,
    category TEXT,
    prep_time INTEGER,
    cook_time INTEGER,
    servings INTEGER,
    calories INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS meal_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    meal_type TEXT NOT NULL,
    meal_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (meal_id) REFERENCES meals (id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS user_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dietary_restrictions TEXT,
    favorite_cuisines TEXT,
    disliked_ingredients TEXT,
    target_calories INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Sample meal data
const sampleMeals = [
  {
    name: "Grilled Chicken Salad",
    description: "Fresh mixed greens with grilled chicken breast",
    ingredients: "Mixed greens, chicken breast, cherry tomatoes, cucumber, olive oil, lemon juice",
    instructions: "1. Grill chicken breast. 2. Mix greens and vegetables. 3. Slice chicken and add to salad. 4. Dress with olive oil and lemon juice.",
    category: "Lunch",
    prep_time: 15,
    cook_time: 20,
    servings: 2,
    calories: 350
  },
  {
    name: "Spaghetti Carbonara",
    description: "Classic Italian pasta with eggs, cheese, and pancetta",
    ingredients: "Spaghetti, eggs, parmesan cheese, pancetta, black pepper, olive oil",
    instructions: "1. Cook spaghetti. 2. Fry pancetta. 3. Mix eggs and cheese. 4. Combine all ingredients while pasta is hot.",
    category: "Dinner",
    prep_time: 10,
    cook_time: 15,
    servings: 4,
    calories: 520
  },
  {
    name: "Avocado Toast",
    description: "Healthy breakfast with avocado on whole grain bread",
    ingredients: "Whole grain bread, avocado, lime juice, salt, pepper, cherry tomatoes",
    instructions: "1. Toast bread. 2. Mash avocado with lime juice. 3. Spread on toast. 4. Top with tomatoes and seasonings.",
    category: "Breakfast",
    prep_time: 5,
    cook_time: 2,
    servings: 1,
    calories: 280
  }
];

// Insert sample data
db.serialize(() => {
  const stmt = db.prepare(`INSERT OR IGNORE INTO meals (name, description, ingredients, instructions, category, prep_time, cook_time, servings, calories) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  sampleMeals.forEach(meal => {
    stmt.run(meal.name, meal.description, meal.ingredients, meal.instructions, meal.category, meal.prep_time, meal.cook_time, meal.servings, meal.calories);
  });
  stmt.finalize();
});

// Routes

// Get all meals
app.get('/api/meals', (req, res) => {
  db.all("SELECT * FROM meals ORDER BY created_at DESC", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get meal by ID
app.get('/api/meals/:id', (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM meals WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Meal not found' });
      return;
    }
    res.json(row);
  });
});

// Add new meal
app.post('/api/meals', (req, res) => {
  const { name, description, ingredients, instructions, category, prep_time, cook_time, servings, calories } = req.body;
  
  if (!name || !ingredients || !instructions) {
    res.status(400).json({ error: 'Name, ingredients, and instructions are required' });
    return;
  }

  db.run(
    `INSERT INTO meals (name, description, ingredients, instructions, category, prep_time, cook_time, servings, calories) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, description, ingredients, instructions, category, prep_time, cook_time, servings, calories],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: 'Meal added successfully' });
    }
  );
});

// Get AI meal suggestions
app.post('/api/ai-suggestions', (req, res) => {
  const { dietary_restrictions, cuisine_preference, meal_type, target_calories } = req.body;
  
  // Simple AI-like logic for meal suggestions
  let query = "SELECT * FROM meals WHERE 1=1";
  let params = [];
  
  if (meal_type) {
    query += " AND category = ?";
    params.push(meal_type);
  }
  
  if (target_calories) {
    query += " AND calories <= ?";
    params.push(target_calories);
  }
  
  query += " ORDER BY RANDOM() LIMIT 3";
  
  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    // Add AI-generated suggestions message
    const suggestions = {
      message: "Here are some AI-generated meal suggestions based on your preferences:",
      meals: rows,
      preferences_used: {
        dietary_restrictions,
        cuisine_preference,
        meal_type,
        target_calories
      }
    };
    
    res.json(suggestions);
  });
});

// Get meal plan for a specific date
app.get('/api/meal-plan/:date', (req, res) => {
  const { date } = req.params;
  
  db.all(`
    SELECT mp.*, m.name, m.description, m.calories, m.prep_time, m.cook_time
    FROM meal_plans mp
    JOIN meals m ON mp.meal_id = m.id
    WHERE mp.date = ?
    ORDER BY mp.meal_type
  `, [date], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add meal to meal plan
app.post('/api/meal-plan', (req, res) => {
  const { date, meal_type, meal_id } = req.body;
  
  if (!date || !meal_type || !meal_id) {
    res.status(400).json({ error: 'Date, meal type, and meal ID are required' });
    return;
  }

  db.run(
    `INSERT INTO meal_plans (date, meal_type, meal_id) VALUES (?, ?, ?)`,
    [date, meal_type, meal_id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: 'Meal added to plan successfully' });
    }
  );
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AI Meal Planner API is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AI Meal Planner API running on port ${PORT}`);
  console.log(`📊 Database: ${dbPath}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('📊 Database connection closed.');
    }
    process.exit(0);
  });
});
