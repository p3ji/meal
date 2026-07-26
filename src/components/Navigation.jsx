import React from 'react';
import { usePlanner } from '../context/PlannerContext';
import { Calendar, Utensils, BookOpen, ShoppingBag, User } from 'lucide-react';

export const Navigation = () => {
  const { activeTab, setActiveTab } = usePlanner();

  const navItems = [
    { id: 'today', label: 'Today', icon: Calendar, color: '#e07a5f' },
    { id: 'weekPlan', label: 'Week Plan', icon: Utensils, color: '#f4a261' },
    { id: 'recipes', label: 'Recipes', icon: BookOpen, color: '#81b29a' },
    { id: 'shoppingList', label: 'Shopping List', icon: ShoppingBag, color: '#2a9d8f' },
    { id: 'profile', label: 'Profile', icon: User, color: '#3d405b' }
  ];

  return (
    <nav className="ghibli-nav-bar">
      <div className="nav-items-container">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`ghibli-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="nav-icon-wrapper" style={{ color: isActive ? item.color : 'inherit' }}>
                <IconComponent size={22} />
              </div>
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
