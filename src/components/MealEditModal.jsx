import React, { useState } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { ChefHat, Heart, Camera, ExternalLink, Clock, Users, Link as LinkIcon, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const MealEditModal = () => {
  const {
    editingMealSlot,
    setEditingMealSlot,
    updateMealInPlan,
    recipes,
    familyMembers,
    openScanForSlot
  } = usePlanner();

  if (!editingMealSlot) return null;

  const { dayIndex, mealType, currentMeal } = editingMealSlot;

  const foundRecipe = recipes.find((r) => r.id === currentMeal?.recipeId || r.title === currentMeal?.title);

  const [selectedRecipeId, setSelectedRecipeId] = useState(currentMeal?.recipeId || '');
  const [customTitle, setCustomTitle] = useState(currentMeal?.title || '');
  const [cook, setCook] = useState(currentMeal?.cook || 'Family');
  const [emoji, setEmoji] = useState(currentMeal?.imageEmoji || '🍱');
  const [recipeUrl, setRecipeUrl] = useState(currentMeal?.recipeUrl || foundRecipe?.recipeUrl || '');

  const handleSelectRecipe = (recId) => {
    setSelectedRecipeId(recId);
    const rec = recipes.find((r) => r.id === recId);
    if (rec) {
      setCustomTitle(rec.title);
      setCook(rec.defaultCook || 'Family');
      setEmoji(rec.imageEmoji || '🍱');
      if (rec.recipeUrl) setRecipeUrl(rec.recipeUrl);
    }
  };

  const handleScanClick = () => {
    setEditingMealSlot(null);
    openScanForSlot(dayIndex, mealType);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updatedMeal = {
      title: customTitle || 'Family Meal',
      cook: cook || 'Family',
      recipeId: selectedRecipeId || null,
      favorite: currentMeal?.favorite || false,
      imageEmoji: emoji || '🍽️',
      recipeUrl: recipeUrl.trim() || null
    };

    updateMealInPlan(dayIndex, mealType, updatedMeal);
    confetti({ particleCount: 25, spread: 40, origin: { y: 0.6 } });
    setEditingMealSlot(null);
  };

  return (
    <div className="modal-backdrop" onClick={() => setEditingMealSlot(null)}>
      <div className="modal-content cute-modal edit-meal-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            ✨ Edit {mealType.toUpperCase()}
          </h3>
          <button className="close-modal-btn" onClick={() => setEditingMealSlot(null)}>✕</button>
        </div>

        {/* QUICK ACTION: SCAN RECIPE CARD PHOTO DIRECTLY */}
        <div className="slot-scan-prompt-banner">
          <div className="prompt-text">
            <strong>📷 Snap / Upload Recipe Card</strong>
            <span>Pre-fills title, ingredients & instructions from photo!</span>
          </div>
          <button type="button" className="btn-slot-scan" onClick={handleScanClick}>
            <Camera size={16} />
            <span>Scan Photo</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="edit-meal-form" style={{ marginTop: '14px' }}>
          <div className="form-group">
            <label>Select from Recipe Library</label>
            <select
              value={selectedRecipeId}
              onChange={(e) => handleSelectRecipe(e.target.value)}
              className="recipe-dropdown"
            >
              <option value="">-- Choose a Recipe or Type Custom --</option>
              {recipes.map((rec) => (
                <option key={rec.id} value={rec.id}>
                  {rec.imageEmoji} {rec.title} ({rec.category})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Meal Title</label>
            <input
              type="text"
              required
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="e.g. Maple-Curry Pork Chops"
            />
          </div>

          <div className="form-group">
            <label>Recipe Website Link / URL (Optional)</label>
            <div className="input-with-icon">
              <LinkIcon size={16} color="#888" className="input-icon-left" />
              <input
                type="url"
                value={recipeUrl}
                onChange={(e) => setRecipeUrl(e.target.value)}
                placeholder="https://www.goodfood.ca/recipe/... or HelloFresh URL"
                className="input-padded-left"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Assigned Cook / Tag</label>
              <select value={cook} onChange={(e) => setCook(e.target.value)}>
                {familyMembers.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.icon} {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Meal Emoji Icon</label>
              <input
                type="text"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                placeholder="🥞"
              />
            </div>
          </div>

          <div className="modal-actions-row">
            <button type="button" className="btn-cancel" onClick={() => setEditingMealSlot(null)}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Save Meal ✨
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const RecipeDetailModal = () => {
  const { selectedRecipeModal, setSelectedRecipeModal, deleteRecipe } = usePlanner();

  if (!selectedRecipeModal) return null;

  const rec = selectedRecipeModal;

  const handleOpenExternalUrl = () => {
    if (rec.recipeUrl) {
      window.open(rec.recipeUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDeleteRecipeModal = () => {
    if (window.confirm(`Are you sure you want to delete "${rec.title}"?`)) {
      deleteRecipe(rec.id);
      setSelectedRecipeModal(null);
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setSelectedRecipeModal(null)}>
      <div className="modal-content cute-modal recipe-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="detail-modal-title">
            <span className="detail-emoji">{rec.imageEmoji || '🍲'}</span>
            <div>
              <h3>{rec.title}</h3>
              <span className="recipe-cat-badge">{rec.category}</span>
            </div>
          </div>
          <button className="close-modal-btn" onClick={() => setSelectedRecipeModal(null)}>✕</button>
        </div>

        <div className="recipe-detail-body">
          <p className="recipe-full-desc">{rec.description}</p>

          <div className="detail-meta-pills">
            <span><Clock size={15} /> Prep: {rec.prepTime || '15m'}</span>
            <span><ChefHat size={15} /> Cook: {rec.cookTime || '15m'}</span>
            <span><Users size={15} /> Serves {rec.servings || 4}</span>
          </div>

          {/* External Website Recipe Link Button */}
          {rec.recipeUrl && (
            <div className="external-link-banner">
              <div>
                <strong>🌐 Website Recipe Link Available</strong>
                <p>{rec.recipeUrl}</p>
              </div>
              <button className="btn-open-website-link" onClick={handleOpenExternalUrl}>
                <ExternalLink size={16} />
                <span>Open Recipe</span>
              </button>
            </div>
          )}

          {rec.ingredients && (
            <div className="detail-section">
              <h4>🛒 Ingredients</h4>
              <ul className="detail-ingredients-list">
                {rec.ingredients.map((ing, idx) => (
                  <li key={idx}>
                    <span className="bullet">✦</span> <strong>{ing.name}</strong> - <span>{ing.amount}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {rec.instructions && (
            <div className="detail-section">
              <h4>🔥 Cooking Instructions</h4>
              <ol className="detail-instructions-list">
                {rec.instructions.map((step, idx) => (
                  <li key={idx}>
                    <span className="step-num">{idx + 1}.</span> {step}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <div className="modal-actions-row" style={{ justifyContent: 'space-between' }}>
          {rec.id && (
            <button className="btn-delete-recipe" onClick={handleDeleteRecipeModal}>
              <Trash2 size={16} />
              <span>Delete Recipe</span>
            </button>
          )}

          <button className="btn-submit" onClick={() => setSelectedRecipeModal(null)}>
            Done ✨
          </button>
        </div>
      </div>
    </div>
  );
};
