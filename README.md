# 🍽️ AI Meal Planner

A modern, AI-powered meal planning application built with React and Node.js. Plan your meals, discover new recipes, and get personalized AI suggestions based on your dietary preferences.

## ✨ Features

- 📚 **Meal Library**: Browse through a collection of delicious recipes
- 📅 **Weekly Meal Planner**: Plan your meals for the entire week
- 🤖 **AI Suggestions**: Get personalized meal recommendations based on your preferences
- ➕ **Add Custom Meals**: Create and save your own recipes
- 💾 **Local Database**: All data stored locally using SQLite
- 📱 **Responsive Design**: Works great on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation & Running

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Start the application:**
   ```bash
   npm start
   ```

This will start both the backend API (port 5000) and frontend React app (port 3000) simultaneously.

### Individual Commands

- **Start backend only:** `npm run dev:backend`
- **Start frontend only:** `npm run dev:frontend`
- **Build for production:** `npm run build`

## 🏗️ Project Structure

```
ai-meal-planner/
├── apps/
│   ├── backend/          # Node.js Express API
│   │   ├── server.js     # Main server file
│   │   ├── package.json  # Backend dependencies
│   │   └── meal_planner.db # SQLite database (auto-created)
│   └── frontend/         # React application
│       ├── src/
│       │   ├── components/  # React components
│       │   ├── App.js      # Main App component
│       │   └── index.js    # Entry point
│       └── package.json    # Frontend dependencies
├── package.json          # Root package.json with scripts
└── README.md
```

## 🎯 Usage

### 1. Meal Library
- Browse existing meals with detailed information
- View ingredients, instructions, and nutritional info
- Click on any meal to see full details

### 2. AI Suggestions
- Set your dietary restrictions and preferences
- Choose cuisine type and target calories
- Get personalized meal recommendations

### 3. Meal Planner
- Plan meals for the entire week
- Add meals to specific days and meal types
- Navigate between different weeks

### 4. Add New Meals
- Create custom recipes with detailed information
- Include ingredients, instructions, and nutritional data
- Categorize meals by type (Breakfast, Lunch, Dinner, etc.)

## 🛠️ API Endpoints

- `GET /api/meals` - Get all meals
- `GET /api/meals/:id` - Get specific meal
- `POST /api/meals` - Add new meal
- `POST /api/ai-suggestions` - Get AI meal suggestions
- `GET /api/meal-plan/:date` - Get meal plan for date
- `POST /api/meal-plan` - Add meal to plan
- `GET /api/health` - Health check

## 🎨 Technologies Used

### Frontend
- React 18
- React Router
- Axios for API calls
- Lucide React for icons
- date-fns for date handling
- Modern CSS with gradients and animations

### Backend
- Node.js
- Express.js
- SQLite3 for database
- CORS for cross-origin requests
- Body-parser for request parsing

## 🔧 Development

### Adding New Features

1. **Backend**: Add new routes in `apps/backend/server.js`
2. **Frontend**: Create new components in `apps/frontend/src/components/`
3. **Database**: Modify database schema in the server initialization

### Environment Variables

Create `apps/backend/.env` file:
```
PORT=5000
NODE_ENV=development
```

## 📝 Sample Data

The application comes with sample meals including:
- Grilled Chicken Salad
- Spaghetti Carbonara
- Avocado Toast

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🎉 Enjoy Your Meal Planning!

Start planning healthier, more organized meals with AI assistance. Happy cooking! 👨‍🍳👩‍🍳
