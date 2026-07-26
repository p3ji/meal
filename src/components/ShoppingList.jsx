import React, { useState } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { ShoppingBag, Plus, Check, Trash2, Share2, Printer } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ShoppingList = () => {
  const {
    weeklyPlan,
    recipes,
    customShopping,
    checkedItems,
    weekRangeText,
    setIsPrintModalOpen,
    toggleShoppingCheck,
    addCustomShoppingItem,
    removeCustomShoppingItem,
    clearCheckedShopping
  } = usePlanner();

  const [newItemText, setNewItemText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Pantry');

  // Aggregate ingredients from current week's meal plan
  const aggregatedIngredients = [];

  weeklyPlan.forEach((day) => {
    ['breakfast', 'lunch', 'dinner'].forEach((mealType) => {
      const meal = day.meals[mealType];
      if (meal?.recipeId || meal?.title) {
        const found = recipes.find((r) => r.id === meal.recipeId || r.title === meal.title);
        if (found && found.ingredients) {
          found.ingredients.forEach((ing) => {
            aggregatedIngredients.push({
              id: `week-${found.id}-${ing.name.toLowerCase().replace(/\s+/g, '-')}`,
              name: ing.name,
              amount: ing.amount,
              category: ing.category || 'Pantry',
              sourceMeal: meal.title
            });
          });
        }
      }
    });
  });

  // Deduplicate by item name
  const uniqueItemsMap = new Map();

  aggregatedIngredients.forEach((item) => {
    const key = item.name.toLowerCase();
    if (!uniqueItemsMap.has(key)) {
      uniqueItemsMap.set(key, item);
    }
  });

  // Add custom shopping items
  customShopping.forEach((item) => {
    const key = item.name.toLowerCase();
    if (!uniqueItemsMap.has(key)) {
      uniqueItemsMap.set(key, item);
    }
  });

  const allShoppingItems = Array.from(uniqueItemsMap.values());

  // Group by category
  const categories = ['Produce', 'Dairy', 'Pantry', 'Meat', 'Other'];
  const categoryIcons = {
    Produce: '🥬',
    Dairy: '🧈',
    Pantry: '🌾',
    Meat: '🥩',
    Other: '📦'
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    addCustomShoppingItem(newItemText, selectedCategory);
    setNewItemText('');
  };

  const handleClearChecked = () => {
    clearCheckedShopping();
    confetti({ particleCount: 30, spread: 40 });
  };

  const handleShareList = () => {
    const listText = allShoppingItems
      .map((i) => `- [${checkedItems[i.id] ? 'x' : ' '}] ${i.name} (${i.amount})`)
      .join('\n');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(`🛒 Family Kitchen Shopping List:\n\n${listText}`);
      alert("📋 Shopping list copied to clipboard! Share it with family!");
    }
  };

  const checkedCount = allShoppingItems.filter((i) => checkedItems[i.id]).length;

  return (
    <div className="shopping-list-container">
      {/* Header */}
      <div className="shopping-header">
        <div className="shopping-title-group">
          <span className="shopping-icon-badge">🛒</span>
          <div>
            <h2>Weekly Grocery Basket</h2>
            <p>Automatically calculated from your planned meals for <strong>{weekRangeText}</strong>.</p>
          </div>
        </div>

        <div className="shopping-actions">
          <button className="share-btn print-version-btn" onClick={() => setIsPrintModalOpen(true)} title="Quick Printable Version">
            <Printer size={16} />
            <span>Print List</span>
          </button>

          <button className="share-btn" onClick={handleShareList} title="Copy list to clipboard">
            <Share2 size={16} />
            <span>Share List</span>
          </button>

          {checkedCount > 0 && (
            <button className="clear-btn" onClick={handleClearChecked} title="Clear checked items">
              <Trash2 size={16} />
              <span>Clear Checked ({checkedCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Add Custom Item Row */}
      <form onSubmit={handleAddItem} className="add-item-form">
        <input
          type="text"
          placeholder="Add custom item (e.g. Snacks, Paper Towels, Juice)..."
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          className="add-item-input"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="add-item-select"
        >
          <option value="Produce">Produce 🥬</option>
          <option value="Dairy">Dairy 🧈</option>
          <option value="Pantry">Pantry 🌾</option>
          <option value="Meat">Meat 🥩</option>
          <option value="Other">Other 📦</option>
        </select>
        <button type="submit" className="add-item-btn">
          <Plus size={18} />
          <span>Add</span>
        </button>
      </form>

      {/* Shopping Categories List */}
      <div className="shopping-categories-grid">
        {categories.map((cat) => {
          const itemsInCat = allShoppingItems.filter((item) => (item.category || 'Pantry') === cat);
          if (itemsInCat.length === 0) return null;

          return (
            <div key={cat} className="shopping-cat-card">
              <div className="cat-card-header">
                <h3>
                  <span>{categoryIcons[cat]}</span> {cat}
                </h3>
                <span className="cat-count">{itemsInCat.length} items</span>
              </div>

              <div className="cat-items-list">
                {itemsInCat.map((item) => {
                  const isChecked = !!checkedItems[item.id];
                  return (
                    <div
                      key={item.id}
                      className={`shopping-item-row ${isChecked ? 'checked' : ''}`}
                      onClick={() => toggleShoppingCheck(item.id)}
                    >
                      <div className="checkbox-custom">
                        {isChecked && <Check size={14} color="#fff" />}
                      </div>

                      <div className="item-details">
                        <span className="item-name">{item.name}</span>
                        {item.amount && <span className="item-amount">({item.amount})</span>}
                      </div>

                      {item.id.startsWith('custom-') && (
                        <button
                          className="delete-custom-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeCustomShoppingItem(item.id);
                          }}
                          title="Remove item"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
