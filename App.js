import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ChefHat, Calendar, Sparkles, BookOpen } from 'lucide-react';
import MealLibrary from './components/MealLibrary';
import MealPlanner from './components/MealPlanner';
import AISuggestions from './components/AISuggestions';
import AddMeal from './components/AddMeal';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('library');

  const navigation = [
    { id: 'library', label: 'Meal Library', icon: BookOpen, component: MealLibrary },
    { id: 'planner', label: 'Meal Planner', icon: Calendar, component: MealPlanner },
    { id: 'ai', label: 'AI Suggestions', icon: Sparkles, component: AISuggestions },
    { id: 'add', label: 'Add Meal', icon: ChefHat, component: AddMeal },
  ];

  const ActiveComponent = navigation.find(nav => nav.id === activeTab)?.component || MealLibrary;

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <ChefHat size={32} />
              <h1>AI Meal Planner</h1>
            </div>
            <nav className="nav-tabs">
              {navigation.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  className={`nav-tab ${activeTab === id ? 'active' : ''}`}
                  onClick={() => setActiveTab(id)}
                >
                  <Icon size={20} />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <ActiveComponent />
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>&copy; 2024 AI Meal Planner. Made with ❤️ for healthy eating.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
