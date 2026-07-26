import React, { useState } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { Printer, Check, X, Calendar, ShoppingBag, Utensils } from 'lucide-react';

export const PrintableModal = ({ isOpen, onClose }) => {
  const { weeklyPlan, recipes, weekRangeText, customShopping } = usePlanner();
  const [includeGrocery, setIncludeGrocery] = useState(true);
  const [includeRecipes, setIncludeRecipes] = useState(true);

  if (!isOpen) return null;

  // Aggregate ingredients for grocery list printout
  const aggregatedIngredients = [];
  weeklyPlan.forEach((day) => {
    ['breakfast', 'lunch', 'dinner'].forEach((mealType) => {
      const meal = day.meals[mealType];
      if (meal?.recipeId || meal?.title) {
        const found = recipes.find((r) => r.id === meal.recipeId || r.title === meal.title);
        if (found && found.ingredients) {
          found.ingredients.forEach((ing) => {
            aggregatedIngredients.push({
              name: ing.name,
              amount: ing.amount,
              category: ing.category || 'Pantry'
            });
          });
        }
      }
    });
  });

  // Deduplicate ingredients by name
  const uniqueItemsMap = new Map();
  aggregatedIngredients.forEach((item) => {
    const key = item.name.toLowerCase();
    if (!uniqueItemsMap.has(key)) {
      uniqueItemsMap.set(key, item);
    }
  });

  customShopping.forEach((item) => {
    const key = item.name.toLowerCase();
    if (!uniqueItemsMap.has(key)) {
      uniqueItemsMap.set(key, item);
    }
  });

  const allShoppingItems = Array.from(uniqueItemsMap.values());
  const categories = ['Meat', 'Produce', 'Dairy', 'Pantry', 'Other'];

  // Collect unique dinners for quick recipe notes
  const dinnerRecipes = weeklyPlan
    .map((day) => {
      const dinnerMeal = day.meals.dinner;
      return recipes.find((r) => r.id === dinnerMeal?.recipeId || r.title === dinnerMeal?.title);
    })
    .filter((r, idx, self) => r && self.findIndex((t) => t.id === r.id) === idx);

  const handleTriggerPrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop print-modal-backdrop" onClick={onClose}>
      <div className="modal-content cute-modal print-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Screen Toolbar Controls */}
        <div className="print-modal-header no-print">
          <div className="print-header-title">
            <Printer size={24} color="#e07a5f" />
            <div>
              <h3>🖨️ Quick Printable Version</h3>
              <p>Print or export a clean, high-contrast weekly menu & shopping list.</p>
            </div>
          </div>
          <button className="close-modal-btn" onClick={onClose}>✕</button>
        </div>

        {/* Options Bar */}
        <div className="print-options-bar no-print">
          <label className="print-option-checkbox">
            <input
              type="checkbox"
              checked={includeGrocery}
              onChange={(e) => setIncludeGrocery(e.target.checked)}
            />
            <span>Include Grocery List</span>
          </label>

          <label className="print-option-checkbox">
            <input
              type="checkbox"
              checked={includeRecipes}
              onChange={(e) => setIncludeRecipes(e.target.checked)}
            />
            <span>Include Featured Dinner Recipes</span>
          </label>

          <button className="btn-trigger-print" onClick={handleTriggerPrint}>
            <Printer size={18} />
            <span>Print Now</span>
          </button>
        </div>

        {/* PRINTABLE DOCUMENT BODY */}
        <div className="printable-document" id="printable-area">
          <header className="printable-header">
            <div className="printable-brand">
              <span className="printable-logo-icon">🏡</span>
              <div>
                <h1>FAMILY KITCHEN</h1>
                <span className="printable-sub">WEEKLY MEAL PLAN & GROCERY GUIDE</span>
              </div>
            </div>
            <div className="printable-date-badge">
              <span>WEEK OF:</span>
              <strong>{weekRangeText}</strong>
            </div>
          </header>

          {/* 1. WEEKLY MEAL PLAN TABLE */}
          <section className="printable-section">
            <h2 className="printable-section-title">
              <Utensils size={18} /> <span>Weekly Meal Schedule</span>
            </h2>
            <table className="printable-menu-table">
              <thead>
                <tr>
                  <th style={{ width: '12%' }}>Day</th>
                  <th style={{ width: '29%' }}>🌅 Breakfast</th>
                  <th style={{ width: '29%' }}>☀️ Lunch</th>
                  <th style={{ width: '30%' }}>🌙 Dinner</th>
                </tr>
              </thead>
              <tbody>
                {weeklyPlan.map((day) => (
                  <tr key={`print-day-${day.dayIndex}`}>
                    <td className="day-cell">
                      <strong>{day.dayName}</strong>
                      <span className="date-sub">{day.dateNum}</span>
                    </td>
                    <td>
                      <div className="print-meal-item">
                        <span>{day.meals.breakfast?.imageEmoji || '🥞'}</span>
                        <div>
                          <strong>{day.meals.breakfast?.title || '—'}</strong>
                          <span className="cook-sub">({day.meals.breakfast?.cook || 'Family'})</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="print-meal-item">
                        <span>{day.meals.lunch?.imageEmoji || '🥪'}</span>
                        <div>
                          <strong>{day.meals.lunch?.title || '—'}</strong>
                          <span className="cook-sub">({day.meals.lunch?.cook || 'Family'})</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="print-meal-item highlight-dinner">
                        <span>{day.meals.dinner?.imageEmoji || '🍲'}</span>
                        <div>
                          <strong>{day.meals.dinner?.title || '—'}</strong>
                          <span className="cook-sub">({day.meals.dinner?.cook || 'Family'})</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* 2. CATEGORIZED GROCERY SHOPPING LIST */}
          {includeGrocery && (
            <section className="printable-section">
              <h2 className="printable-section-title">
                <ShoppingBag size={18} /> <span>Grocery Checklist ({weekRangeText})</span>
              </h2>
              <div className="printable-grocery-grid">
                {categories.map((cat) => {
                  const itemsInCat = allShoppingItems.filter((i) => (i.category || 'Pantry') === cat);
                  if (itemsInCat.length === 0) return null;
                  return (
                    <div key={`print-cat-${cat}`} className="printable-grocery-category">
                      <h3>{cat}</h3>
                      <ul>
                        {itemsInCat.map((item, idx) => (
                          <li key={idx}>
                            <span className="print-box"></span>
                            <span className="item-txt">{item.name}</span>
                            {item.amount && <span className="item-qty">({item.amount})</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* 3. FEATURED DINNER RECIPES SUMMARY */}
          {includeRecipes && dinnerRecipes.length > 0 && (
            <section className="printable-section printable-page-break">
              <h2 className="printable-section-title">
                <Calendar size={18} /> <span>Featured Dinners & Quick Instructions</span>
              </h2>
              <div className="printable-recipes-grid">
                {dinnerRecipes.map((rec) => (
                  <div key={rec.id} className="printable-recipe-card">
                    <div className="rec-card-head">
                      <h3>{rec.imageEmoji} {rec.title}</h3>
                      <span className="rec-time">Prep {rec.prepTime} • Cook {rec.cookTime}</span>
                    </div>
                    <p className="rec-desc">{rec.description}</p>
                    <div className="rec-details">
                      <div>
                        <strong>Ingredients:</strong>
                        <p>{rec.ingredients?.map((i) => `${i.name} (${i.amount})`).join(', ')}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <footer className="printable-footer">
            <p>Printed from <strong>Family Kitchen</strong> • Healthy & Delicious Family Meals</p>
          </footer>
        </div>

        {/* Modal Bottom Actions */}
        <div className="modal-actions-row no-print" style={{ marginTop: '16px' }}>
          <button className="btn-cancel" onClick={onClose}>Close</button>
          <button className="btn-submit" onClick={handleTriggerPrint}>
            <Printer size={16} /> Print Document 🖨️
          </button>
        </div>
      </div>
    </div>
  );
};
