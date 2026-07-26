import React, { useState } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { CheckCircle2, Circle, Clock, Flame, Play, Pause, RotateCcw, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const TodayView = () => {
  const { weeklyPlan, currentWeekInfo, setSelectedRecipeModal, recipes } = usePlanner();

  // Get current day plan & date info
  const todayPlan = weeklyPlan[0]; // Monday (July 27)
  const todayDateInfo = currentWeekInfo.daysInfo[0];

  const [cookedStatus, setCookedStatus] = useState({
    breakfast: false,
    lunch: false,
    dinner: false
  });

  // Cooking Timer state
  const [timerSeconds, setTimerSeconds] = useState(600); // 10 mins default
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerIntervalId, setTimerIntervalId] = useState(null);

  const toggleCooked = (type) => {
    setCookedStatus((prev) => {
      const nextVal = !prev[type];
      if (nextVal) {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
      }
      return { ...prev, [type]: nextVal };
    });
  };

  const handleStartTimer = () => {
    if (timerRunning) {
      clearInterval(timerIntervalId);
      setTimerRunning(false);
    } else {
      setTimerRunning(true);
      const id = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(id);
            setTimerRunning(false);
            confetti({ particleCount: 100, spread: 80 });
            alert("⏰ Kitchen Timer: Cooking time is up! Bon Appétit! 🍲");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimerIntervalId(id);
    }
  };

  const handleResetTimer = () => {
    if (timerIntervalId) clearInterval(timerIntervalId);
    setTimerRunning(false);
    setTimerSeconds(600);
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleOpenRecipe = (meal) => {
    if (!meal) return;
    const found = recipes.find((r) => r.id === meal.recipeId || r.title === meal.title);
    if (found) setSelectedRecipeModal(found);
  };

  return (
    <div className="today-view-container">
      {/* Banner */}
      <div className="today-hero-card">
        <div className="today-hero-text">
          <span className="today-pill">☀️ TODAY'S MENU</span>
          <h2>{todayDateInfo?.dayName || todayPlan.dayName}, {todayDateInfo?.monthName} {todayDateInfo?.dateNum}</h2>
        </div>
        <div className="today-hero-illustration">
          <span className="hero-emoji calcifer-anim">🔥</span>
        </div>
      </div>

      {/* Meals Grid */}
      <div className="today-meals-grid">
        {/* BREAKFAST */}
        <div className={`today-meal-card breakfast-theme ${cookedStatus.breakfast ? 'cooked-done' : ''}`}>
          <div className="today-card-header">
            <span className="meal-type-label">🌅 Breakfast</span>
            <button
              className="cook-check-btn"
              onClick={() => toggleCooked('breakfast')}
              title="Mark as cooked"
            >
              {cookedStatus.breakfast ? (
                <CheckCircle2 size={24} color="#588157" fill="#b8d8b5" />
              ) : (
                <Circle size={24} color="#888" />
              )}
            </button>
          </div>

          <div className="today-card-body" onClick={() => handleOpenRecipe(todayPlan.meals.breakfast)}>
            <div className="today-meal-emoji">{todayPlan.meals.breakfast?.imageEmoji || '🥞'}</div>
            <div className="today-meal-details">
              <h3>{todayPlan.meals.breakfast?.title}</h3>
              <div className="cook-meta">
                <span className="chef-badge">👨‍🍳 Chef: <strong>{todayPlan.meals.breakfast?.cook}</strong></span>
              </div>
            </div>
            <ChevronRight size={20} color="#888" />
          </div>
        </div>

        {/* LUNCH */}
        <div className={`today-meal-card lunch-theme ${cookedStatus.lunch ? 'cooked-done' : ''}`}>
          <div className="today-card-header">
            <span className="meal-type-label">☀️ Lunch</span>
            <button
              className="cook-check-btn"
              onClick={() => toggleCooked('lunch')}
              title="Mark as cooked"
            >
              {cookedStatus.lunch ? (
                <CheckCircle2 size={24} color="#e07a5f" fill="#f9df9b" />
              ) : (
                <Circle size={24} color="#888" />
              )}
            </button>
          </div>

          <div className="today-card-body" onClick={() => handleOpenRecipe(todayPlan.meals.lunch)}>
            <div className="today-meal-emoji">{todayPlan.meals.lunch?.imageEmoji || '🍜'}</div>
            <div className="today-meal-details">
              <h3>{todayPlan.meals.lunch?.title}</h3>
              <div className="cook-meta">
                <span className="chef-badge">👨‍🍳 Chef: <strong>{todayPlan.meals.lunch?.cook}</strong></span>
              </div>
            </div>
            <ChevronRight size={20} color="#888" />
          </div>
        </div>

        {/* DINNER */}
        <div className={`today-meal-card dinner-theme ${cookedStatus.dinner ? 'cooked-done' : ''}`}>
          <div className="today-card-header">
            <span className="meal-type-label">🌙 Dinner</span>
            <button
              className="cook-check-btn"
              onClick={() => toggleCooked('dinner')}
              title="Mark as cooked"
            >
              {cookedStatus.dinner ? (
                <CheckCircle2 size={24} color="#3d405b" fill="#81b29a" />
              ) : (
                <Circle size={24} color="#888" />
              )}
            </button>
          </div>

          <div className="today-card-body" onClick={() => handleOpenRecipe(todayPlan.meals.dinner)}>
            <div className="today-meal-emoji">{todayPlan.meals.dinner?.imageEmoji || '🍲'}</div>
            <div className="today-meal-details">
              <h3>{todayPlan.meals.dinner?.title}</h3>
              <div className="cook-meta">
                <span className="chef-badge">👨‍🍳 Chef: <strong>{todayPlan.meals.dinner?.cook}</strong></span>
              </div>
            </div>
            <ChevronRight size={20} color="#888" />
          </div>
        </div>
      </div>

      {/* Family Kitchen Timer */}
      <div className="calcifer-timer-card">
        <div className="calcifer-timer-header">
          <Flame size={24} className="calcifer-flame-icon" color="#e07a5f" />
          <div>
            <h4>Family Kitchen Timer</h4>
            <p className="timer-sub">Set a timer for pork chops, baking, or simmering stew!</p>
          </div>
        </div>

        <div className="timer-display-row">
          <div className="timer-clock">{formatTimer(timerSeconds)}</div>
          
          <div className="timer-controls">
            <button className="timer-btn primary" onClick={handleStartTimer}>
              {timerRunning ? <Pause size={18} /> : <Play size={18} />}
              <span>{timerRunning ? 'Pause' : 'Start'}</span>
            </button>

            <button className="timer-btn secondary" onClick={handleResetTimer}>
              <RotateCcw size={18} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <div className="quick-presets">
          <button onClick={() => setTimerSeconds(180)}>3 min (Ramen)</button>
          <button onClick={() => setTimerSeconds(390)}>6.5 min (Soft Egg)</button>
          <button onClick={() => setTimerSeconds(900)}>15 min (Pancakes)</button>
          <button onClick={() => setTimerSeconds(1200)}>20 min (Pork Chops)</button>
          <button onClick={() => setTimerSeconds(1800)}>30 min (Stew)</button>
        </div>
      </div>
    </div>
  );
};
