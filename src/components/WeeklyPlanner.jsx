import React from 'react';
import { usePlanner } from '../context/PlannerContext';
import { Heart, Edit3, Sun, Moon, Printer } from 'lucide-react';

export const WeeklyPlanner = () => {
  const {
    weeklyPlan,
    currentWeekInfo,
    toggleFavoriteMeal,
    setEditingMealSlot,
    setSelectedRecipeModal,
    recipes,
    setIsPrintModalOpen
  } = usePlanner();

  const handleOpenMealDetail = (meal) => {
    if (!meal) return;
    const foundRecipe = recipes.find((r) => r.id === meal.recipeId || r.title === meal.title);
    if (foundRecipe) {
      setSelectedRecipeModal(foundRecipe);
    } else {
      setSelectedRecipeModal({
        title: meal.title,
        category: 'Custom',
        defaultCook: meal.cook || 'Family',
        imageEmoji: meal.imageEmoji || '🍽️',
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

  const handleHeartClick = (e, dayIndex, mealType) => {
    e.stopPropagation();
    toggleFavoriteMeal(dayIndex, mealType);
  };

  return (
    <div className="weekly-planner-wrapper">
      {/* Sub-toolbar */}
      <div className="planner-sub-toolbar">
        <span className="planner-view-info">
          📅 Showing meal plan for <strong>{currentWeekInfo.rangeText}</strong>
        </span>
        <button className="btn-print-compact" onClick={() => setIsPrintModalOpen(true)}>
          <Printer size={16} />
          <span>Quick Printable Version</span>
        </button>
      </div>

      <div className="weekly-planner-container">
        {/* COLUMN 1: BREAKFAST (Sage Green Theme) */}
        <div className="meal-column breakfast-column">
          <div className="column-header breakfast-header">
            <div className="header-banner-ribbon">
              <span className="ribbon-text">BREAKFAST</span>
            </div>
            <div className="column-header-illustration">
              <div className="sun-decor"><Sun size={28} className="sun-spin" /></div>
              <div className="header-art teapot-art" title="Tea Kettle">
                <span className="art-emoji">🫖</span>
              </div>
              <div className="header-art family-art" title="Morning Table">
                <span className="art-emoji">👨‍👩‍👧</span>
              </div>
            </div>
          </div>

          <div className="column-meal-list">
            {weeklyPlan.map((day, idx) => {
              const meal = day.meals.breakfast;
              const dateInfo = currentWeekInfo.daysInfo[idx] || day;
              return (
                <div
                  key={`b-day-${day.dayIndex}`}
                  className="meal-row-card"
                  onClick={() => handleOpenMealDetail(meal)}
                >
                  <div className="day-badge">
                    <span className="day-name">{dateInfo.dayName}</span>
                    <span className="day-num">{dateInfo.dateNum}</span>
                  </div>

                  <div className="meal-info">
                    <div className="meal-emoji-icon">{meal?.imageEmoji || '🥞'}</div>
                    <div className="meal-text-group">
                      <span className="meal-title">{meal?.title || 'Add Breakfast'}</span>
                      <span className="cook-tag">({meal?.cook || 'Family'})</span>
                    </div>
                  </div>

                  <div className="meal-actions">
                    <button
                      className={`action-btn heart-btn ${meal?.favorite ? 'is-fav' : ''}`}
                      onClick={(e) => handleHeartClick(e, day.dayIndex, 'breakfast')}
                      title="Toggle Favorite"
                    >
                      <Heart size={16} fill={meal?.favorite ? '#e63946' : 'none'} color={meal?.favorite ? '#e63946' : '#777'} />
                    </button>
                    <button
                      className="action-btn edit-btn"
                      onClick={(e) => handleEditClick(e, day.dayIndex, 'breakfast', meal)}
                      title="Edit Meal"
                    >
                      <Edit3 size={15} color="#555" />
                    </button>
                    <div className="meal-thumb-box">
                      <span className="thumb-emoji">{meal?.imageEmoji || '🥞'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMN 2: LUNCH (Warm Sunny Orange Theme) */}
        <div className="meal-column lunch-column">
          <div className="column-header lunch-header">
            <div className="header-banner-ribbon ribbon-lunch">
              <span className="ribbon-text">LUNCH</span>
            </div>
            <div className="column-header-illustration">
              <div className="header-art bento-art" title="Bento Box">
                <span className="art-emoji">🍱</span>
              </div>
              <div className="header-art calcifer-art" title="Calcifer Flame">
                <span className="art-emoji calcifer-anim">🔥</span>
              </div>
              <div className="header-art picnic-art" title="Picnic Lawn">
                <span className="art-emoji">🧺</span>
              </div>
            </div>
          </div>

          <div className="column-meal-list">
            {weeklyPlan.map((day, idx) => {
              const meal = day.meals.lunch;
              const dateInfo = currentWeekInfo.daysInfo[idx] || day;
              return (
                <div
                  key={`l-day-${day.dayIndex}`}
                  className="meal-row-card"
                  onClick={() => handleOpenMealDetail(meal)}
                >
                  <div className="day-badge">
                    <span className="day-name">{dateInfo.dayName}</span>
                    <span className="day-num">{dateInfo.dateNum}</span>
                  </div>

                  <div className="meal-info">
                    <div className="meal-emoji-icon">{meal?.imageEmoji || '🍜'}</div>
                    <div className="meal-text-group">
                      <span className="meal-title">{meal?.title || 'Add Lunch'}</span>
                      <span className="cook-tag">({meal?.cook || 'Family'})</span>
                    </div>
                  </div>

                  <div className="meal-actions">
                    <button
                      className={`action-btn heart-btn ${meal?.favorite ? 'is-fav' : ''}`}
                      onClick={(e) => handleHeartClick(e, day.dayIndex, 'lunch')}
                      title="Toggle Favorite"
                    >
                      <Heart size={16} fill={meal?.favorite ? '#e63946' : 'none'} color={meal?.favorite ? '#e63946' : '#777'} />
                    </button>
                    <button
                      className="action-btn edit-btn"
                      onClick={(e) => handleEditClick(e, day.dayIndex, 'lunch', meal)}
                      title="Edit Meal"
                    >
                      <Edit3 size={15} color="#555" />
                    </button>
                    <div className="meal-thumb-box">
                      <span className="thumb-emoji">{meal?.imageEmoji || '🥪'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMN 3: DINNER (Cozy Twilight Night Blue Theme) */}
        <div className="meal-column dinner-column">
          <div className="column-header dinner-header">
            <div className="header-banner-ribbon ribbon-dinner">
              <span className="ribbon-text">DINNER</span>
            </div>
            <div className="column-header-illustration">
              <div className="moon-decor"><Moon size={22} className="moon-glow" /></div>
              <div className="header-art pot-art" title="Simmering Pot">
                <span className="art-emoji steam-anim">🍲</span>
              </div>
              <div className="header-art cozy-art" title="Cozy Dining">
                <span className="art-emoji">🥘</span>
              </div>
            </div>
          </div>

          <div className="column-meal-list">
            {weeklyPlan.map((day, idx) => {
              const meal = day.meals.dinner;
              const dateInfo = currentWeekInfo.daysInfo[idx] || day;
              return (
                <div
                  key={`d-day-${day.dayIndex}`}
                  className="meal-row-card"
                  onClick={() => handleOpenMealDetail(meal)}
                >
                  <div className="day-badge">
                    <span className="day-name">{dateInfo.dayName}</span>
                    <span className="day-num">{dateInfo.dateNum}</span>
                  </div>

                  <div className="meal-info">
                    <div className="meal-emoji-icon">{meal?.imageEmoji || '🍲'}</div>
                    <div className="meal-text-group">
                      <span className="meal-title">{meal?.title || 'Add Dinner'}</span>
                      <span className="cook-tag">({meal?.cook || 'Family'})</span>
                    </div>
                  </div>

                  <div className="meal-actions">
                    <button
                      className={`action-btn heart-btn ${meal?.favorite ? 'is-fav' : ''}`}
                      onClick={(e) => handleHeartClick(e, day.dayIndex, 'dinner')}
                      title="Toggle Favorite"
                    >
                      <Heart size={16} fill={meal?.favorite ? '#e63946' : 'none'} color={meal?.favorite ? '#e63946' : '#777'} />
                    </button>
                    <button
                      className="action-btn edit-btn"
                      onClick={(e) => handleEditClick(e, day.dayIndex, 'dinner', meal)}
                      title="Edit Meal"
                    >
                      <Edit3 size={15} color="#555" />
                    </button>
                    <div className="meal-thumb-box">
                      <span className="thumb-emoji">{meal?.imageEmoji || '🍲'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
