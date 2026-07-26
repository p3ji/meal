import React, { useState } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { Search, Plus, Heart, Clock, Users, BookOpen, Camera, Sparkles } from 'lucide-react';

export const RecipeBook = () => {
  const { recipes, toggleRecipeFavorite, setSelectedRecipeModal, addRecipe, setIsScannerModalOpen } = usePlanner();

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // New Recipe Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Breakfast');
  const [newCook, setNewCook] = useState('Mom');
  const [newPrep, setNewPrep] = useState('15m');
  const [newCookTime, setNewCookTime] = useState('15m');
  const [newEmoji, setNewEmoji] = useState('🍱');
  const [newDesc, setNewDesc] = useState('');
  const [newIngredientsStr, setNewIngredientsStr] = useState('Eggs, Milk, Flour');
  const [newStepsStr, setNewStepsStr] = useState('Mix ingredients\nCook until done');

  const filteredRecipes = recipes.filter((rec) => {
    const matchesCategory =
      activeCategory === 'All'
        ? true
        : activeCategory === 'Favorites'
        ? rec.isFavorite
        : rec.category === activeCategory;

    const matchesSearch =
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleCreateRecipe = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const parsedIngredients = newIngredientsStr
      .split(',')
      .map((item) => ({ name: item.trim(), amount: 'As needed', category: 'Pantry' }))
      .filter((i) => i.name.length > 0);

    const parsedSteps = newStepsStr
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const created = {
      title: newTitle,
      category: newCategory,
      defaultCook: newCook,
      prepTime: newPrep,
      cookTime: newCookTime,
      servings: 4,
      rating: 5,
      isFavorite: true,
      imageEmoji: newEmoji,
      description: newDesc || 'Delicious family recipe.',
      ingredients: parsedIngredients.length > 0 ? parsedIngredients : [{ name: newTitle, amount: '1', category: 'Pantry' }],
      instructions: parsedSteps.length > 0 ? parsedSteps : ['Prepare and cook with love!']
    };

    addRecipe(created);
    setShowAddForm(false);
    // Reset form
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="recipe-book-container">
      {/* Top Controls */}
      <div className="recipe-book-header">
        <div className="recipe-title-group">
          <h2>📖 Family Kitchen Recipe Collection</h2>
          <p>Explore comforting family recipes, scan recipe card photos, or add your favorite dishes!</p>
        </div>

        <div className="recipe-header-actions">
          <button className="scan-recipe-btn" onClick={() => setIsScannerModalOpen(true)}>
            <Camera size={18} />
            <span>Scan Recipe Photo</span>
          </button>

          <button className="add-recipe-btn" onClick={() => setShowAddForm(true)}>
            <Plus size={18} />
            <span>Add New Recipe</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Pills */}
      <div className="recipe-filter-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" color="#888" />
          <input
            type="text"
            placeholder="Search recipes or ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-pills">
          {['All', 'Breakfast', 'Lunch', 'Dinner', 'Favorites'].map((cat) => (
            <button
              key={cat}
              className={`cat-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === 'Favorites' ? '❤️ Favorites' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="recipe-grid">
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe.id}
            className="recipe-card"
            onClick={() => setSelectedRecipeModal(recipe)}
          >
            <div className="recipe-card-top">
              <span className="recipe-emoji-badge">{recipe.imageEmoji || '🍲'}</span>
              <button
                className={`card-heart-btn ${recipe.isFavorite ? 'fav' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleRecipeFavorite(recipe.id);
                }}
                title="Favorite Recipe"
              >
                <Heart size={18} fill={recipe.isFavorite ? '#e63946' : 'none'} color={recipe.isFavorite ? '#e63946' : '#888'} />
              </button>
            </div>

            <div className="recipe-card-content">
              <span className="recipe-category-tag">{recipe.category}</span>
              <h3>{recipe.title}</h3>
              <p className="recipe-desc-short">{recipe.description}</p>

              <div className="recipe-meta-row">
                <span><Clock size={14} /> {recipe.prepTime} prep</span>
                <span><Users size={14} /> Serves {recipe.servings || 4}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD NEW RECIPE MODAL */}
      {showAddForm && (
        <div className="modal-backdrop" onClick={() => setShowAddForm(false)}>
          <div className="modal-content cute-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>✨ Add New Recipe</h3>
              <button className="close-modal-btn" onClick={() => setShowAddForm(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateRecipe} className="add-recipe-form">
              <div className="form-group">
                <label>Dish Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Maple Glazed Pork Chops"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Icon Emoji</label>
                  <input
                    type="text"
                    value={newEmoji}
                    onChange={(e) => setNewEmoji(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Prep Time</label>
                  <input type="text" value={newPrep} onChange={(e) => setNewPrep(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Cook Time</label>
                  <input type="text" value={newCookTime} onChange={(e) => setNewCookTime(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows={2}
                  placeholder="Short description of the meal..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Ingredients (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g., Pork Chops, Maple Syrup, Curry Powder"
                  value={newIngredientsStr}
                  onChange={(e) => setNewIngredientsStr(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Cooking Steps (one per line)</label>
                <textarea
                  rows={3}
                  placeholder="Step 1: Prep ingredients&#10;Step 2: Simmer over medium flame"
                  value={newStepsStr}
                  onChange={(e) => setNewStepsStr(e.target.value)}
                />
              </div>

              <div className="modal-actions-row">
                <button type="button" className="btn-cancel" onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Save Recipe ✨
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
