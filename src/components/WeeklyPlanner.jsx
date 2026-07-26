import React from 'react';
import { usePlanner } from '../context/PlannerContext';
import { Heart, Edit3, Camera, ExternalLink, Printer, Sun, Moon } from 'lucide-react';

export const WeeklyPlanner = () => {
  const {
    weeklyPlan,
    currentWeekInfo,
    toggleFavoriteMeal,
    setEditingMealSlot,
    setSelectedRecipeModal,
    recipes,
    setIsPrintModalOpen,
    openScanForSlot
  } = usePlanner();

  const handleOpenMealDetail = (meal) => {
    if (!meal) return;
    const foundRecipe = recipes.find((r) => r.id === meal.recipeId || r.title === meal.title);
    if (foundRecipe) {
      setSelectedRecipeModal({
        ...foundRecipe,
        recipeUrl: meal.recipeUrl || foundRecipe.recipeUrl
      });
    } else {
      setSelectedRecipeModal({
        title: meal.title,
        category: 'Custom',
        defaultCook: meal.cook || 'Family',
        imageEmoji: meal.imageEmoji || '🍽️',
        recipeUrl: meal.recipeUrl || null,
        description: 'A delicious family meal.',
        ingredients: [{ name: 'Love & Spices', amount: 'Plenty', category: 'Pantry' }],
        instructions: ['Prepare ingredients with care', 'Cook until fragrant and serve hot!']
      });
    }
  };

  const handleEditClick = (e, dayIndex, mealType, meal) => {
    e.stopPropagation();
    setEditingMealSlot({ dayIndex, mealType, currentMeal: meal });
  };

  const handleScanSlotClick = (e, dayIndex, mealType) => {
    e.stopPropagation();
    openScanForSlot(dayIndex, mealType);
  };

  const handleHeartClick = (e, dayIndex, mealType) => {
    e.stopPropagation();
    toggleFavoriteMeal(dayIndex, mealType);
  };

  const handleOpenExternalUrl = (e, url) => {
    e.stopPropagation();
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="weekly-planner-wrapper">
      {/* Sub-toolbar */}
      <div className="planner-sub-toolbar">
        <span className="planner-view-info">
          📅 Showing meal plan for <strong>{currentWeekInfo.rangeText}</strong> (Ordered by Day)
        </span>
        <button className="btn-print-compact" onClick={() => setIsPrintModalOpen(true)}>
          <Printer size={16} />
          <span>Quick Printable Version</span>
        </button>
      </div>

      {/* 7 DAYS GRID LAYOUT (ORDERED BY DAY) */}
      <div className="days-planner-grid">
        {weeklyPlan.map((day, idx) => {
          const dateInfo = currentWeekInfo.daysInfo[idx] || day;
          return (
            <div key={`day-card-${day.dayIndex}`} className="day-planner-card">
              {/* DAY CARD HEADER */}
              <div className="day-card-header">
                <div className="day-header-title">
                  <span className="day-badge-name">{dateInfo.dayName}</span>
                  <span className="day-badge-date">{dateInfo.monthName} {dateInfo.dateNum}</span>
                </div>
                <div className="day-header-decor">
                  {idx === 0 ? '✨ Today' : '🌿'}
                </div>
              </div>

              {/* 3 MEAL SLOTS FOR THIS DAY */}
              <div className="day-meals-group">
                {/* 1. BREAKFAST */}
                {(() => {
                  const meal = day.meals.breakfast;
                  const foundRecipe = recipes.find((r) => r.id === meal?.recipeId || r.title === meal?.title);
                  const activeUrl = meal?.recipeUrl || foundRecipe?.recipeUrl;

                  return (
                    <div
                      className="slot-meal-row breakfast-slot"
                      onClick={() => handleOpenMealDetail(meal)}
                    >
                      <span className="slot-type-pill b-pill">🌅 Breakfast</span>

                      <div className="slot-meal-info">
                        <span className="slot-emoji">{meal?.imageEmoji || '🥞'}</span>
                        <div className="slot-text-block">
                          <strong className="slot-meal-title">{meal?.title || 'Add Breakfast'}</strong>
                          <span className="slot-cook-tag">👨‍🍳 {meal?.cook || 'Family'}</span>
                        </div>
                      </div>

                      <div className="slot-actions-group">
                        {activeUrl && (
                          <button
                            className="slot-action-btn url-btn"
                            onClick={(e) => handleOpenExternalUrl(e, activeUrl)}
                            title="Open Original Recipe Link"
                          >
                            <ExternalLink size={14} color="#2a9d8f" />
                          </button>
                        )}

                        <button
                          className="slot-action-btn scan-btn"
                          onClick={(e) => handleScanSlotClick(e, day.dayIndex, 'breakfast')}
                          title="📷 Scan recipe card into this slot"
                        >
                          <Camera size={14} color="#e07a5f" />
                        </button>

                        <button
                          className={`slot-action-btn heart-btn ${meal?.favorite ? 'is-fav' : ''}`}
                          onClick={(e) => handleHeartClick(e, day.dayIndex, 'breakfast')}
                          title="Toggle Favorite"
                        >
                          <Heart size={14} fill={meal?.favorite ? '#e63946' : 'none'} color={meal?.favorite ? '#e63946' : '#777'} />
                        </button>

                        <button
                          className="slot-action-btn edit-btn"
                          onClick={(e) => handleEditClick(e, day.dayIndex, 'breakfast', meal)}
                          title="Edit Meal"
                        >
                          <Edit3 size={14} color="#555" />
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* 2. LUNCH */}
                {(() => {
                  const meal = day.meals.lunch;
                  const foundRecipe = recipes.find((r) => r.id === meal?.recipeId || r.title === meal?.title);
                  const activeUrl = meal?.recipeUrl || foundRecipe?.recipeUrl;

                  return (
                    <div
                      className="slot-meal-row lunch-slot"
                      onClick={() => handleOpenMealDetail(meal)}
                    >
                      <span className="slot-type-pill l-pill">☀️ Lunch</span>

                      <div className="slot-meal-info">
                        <span className="slot-emoji">{meal?.imageEmoji || '🥪'}</span>
                        <div className="slot-text-block">
                          <strong className="slot-meal-title">{meal?.title || 'Add Lunch'}</strong>
                          <span className="slot-cook-tag">👨‍🍳 {meal?.cook || 'Family'}</span>
                        </div>
                      </div>

                      <div className="slot-actions-group">
                        {activeUrl && (
                          <button
                            className="slot-action-btn url-btn"
                            onClick={(e) => handleOpenExternalUrl(e, activeUrl)}
                            title="Open Original Recipe Link"
                          >
                            <ExternalLink size={14} color="#2a9d8f" />
                          </button>
                        )}

                        <button
                          className="slot-action-btn scan-btn"
                          onClick={(e) => handleScanSlotClick(e, day.dayIndex, 'lunch')}
                          title="📷 Scan recipe card into this slot"
                        >
                          <Camera size={14} color="#e07a5f" />
                        </button>

                        <button
                          className={`slot-action-btn heart-btn ${meal?.favorite ? 'is-fav' : ''}`}
                          onClick={(e) => handleHeartClick(e, day.dayIndex, 'lunch')}
                          title="Toggle Favorite"
                        >
                          <Heart size={14} fill={meal?.favorite ? '#e63946' : 'none'} color={meal?.favorite ? '#e63946' : '#777'} />
                        </button>

                        <button
                          className="slot-action-btn edit-btn"
                          onClick={(e) => handleEditClick(e, day.dayIndex, 'lunch', meal)}
                          title="Edit Meal"
                        >
                          <Edit3 size={14} color="#555" />
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* 3. DINNER */}
                {(() => {
                  const meal = day.meals.dinner;
                  const foundRecipe = recipes.find((r) => r.id === meal?.recipeId || r.title === meal?.title);
                  const activeUrl = meal?.recipeUrl || foundRecipe?.recipeUrl;

                  return (
                    <div
                      className="slot-meal-row dinner-slot"
                      onClick={() => handleOpenMealDetail(meal)}
                    >
                      <span className="slot-type-pill d-pill">🌙 Dinner</span>

                      <div className="slot-meal-info">
                        <span className="slot-emoji">{meal?.imageEmoji || '🍲'}</span>
                        <div className="slot-text-block">
                          <strong className="slot-meal-title">{meal?.title || 'Add Dinner'}</strong>
                          <span className="slot-cook-tag">👨‍🍳 {meal?.cook || 'Family'}</span>
                        </div>
                      </div>

                      <div className="slot-actions-group">
                        {activeUrl && (
                          <button
                            className="slot-action-btn url-btn"
                            onClick={(e) => handleOpenExternalUrl(e, activeUrl)}
                            title="Open Original Recipe Link"
                          >
                            <ExternalLink size={14} color="#2a9d8f" />
                          </button>
                        )}

                        <button
                          className="slot-action-btn scan-btn"
                          onClick={(e) => handleScanSlotClick(e, day.dayIndex, 'dinner')}
                          title="📷 Scan recipe card into this slot"
                        >
                          <Camera size={14} color="#e07a5f" />
                        </button>

                        <button
                          className={`slot-action-btn heart-btn ${meal?.favorite ? 'is-fav' : ''}`}
                          onClick={(e) => handleHeartClick(e, day.dayIndex, 'dinner')}
                          title="Toggle Favorite"
                        >
                          <Heart size={14} fill={meal?.favorite ? '#e63946' : 'none'} color={meal?.favorite ? '#e63946' : '#777'} />
                        </button>

                        <button
                          className="slot-action-btn edit-btn"
                          onClick={(e) => handleEditClick(e, day.dayIndex, 'dinner', meal)}
                          title="Edit Meal"
                        >
                          <Edit3 size={14} color="#555" />
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
