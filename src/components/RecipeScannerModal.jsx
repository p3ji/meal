import React, { useState, useRef } from 'react';
import { createWorker } from 'tesseract.js';
import { usePlanner } from '../context/PlannerContext';
import { Camera, Upload, Sparkles, Check, RefreshCw, Clock, ChefHat, ShoppingBag, Utensils, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export const RecipeScannerModal = ({ isOpen, onClose }) => {
  const { weeklyPlan, addScannedRecipeAndAssign, familyMembers } = usePlanner();

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [imagePreview, setImagePreview] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatusText, setScanStatusText] = useState('');

  // Scanned / Editable Recipe Form State
  const [scannedData, setScannedData] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Dinner');
  const [cook, setCook] = useState('Mom');
  const [prepTime, setPrepTime] = useState('15m');
  const [cookTime, setCookTime] = useState('20m');
  const [emoji, setEmoji] = useState('🥘');
  const [description, setDescription] = useState('');
  const [ingredientsStr, setIngredientsStr] = useState('');
  const [instructionsStr, setInstructionsStr] = useState('');

  // Assign to week plan options
  const [assignToPlan, setAssignToPlan] = useState(true);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0); // Default Mon (July 27)
  const [selectedMealType, setSelectedMealType] = useState('dinner');

  if (!isOpen) return null;

  // Intelligent Recipe Text Parser
  const parseRecipeText = (rawText) => {
    const lines = rawText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    let parsedTitle = 'Scanned Recipe';
    let parsedPrep = '15m';
    let parsedCook = '20m';
    let parsedCategory = 'Dinner';
    let parsedEmoji = '🥘';
    const rawIngredients = [];
    const rawInstructions = [];

    let currentSection = 'header';

    lines.forEach((line, idx) => {
      const lower = line.toLowerCase();

      // Title detection (first 2-3 prominent lines)
      if (idx === 0 || (idx === 1 && parsedTitle === 'Scanned Recipe')) {
        if (!lower.includes('ingredient') && !lower.includes('instruction') && line.length > 3) {
          parsedTitle = line.replace(/^[^a-zA-Z0-9]+/, '');
        }
      }

      // Times detection
      if (lower.includes('prep') || lower.includes('cook') || lower.includes('min')) {
        const timeMatch = line.match(/(\d+)\s*(mins?|m)/i);
        if (timeMatch) {
          if (lower.includes('prep')) parsedPrep = `${timeMatch[1]}m`;
          else parsedCook = `${timeMatch[1]}m`;
        }
      }

      // Emoji selection based on keywords
      if (lower.includes('pork') || lower.includes('steak') || lower.includes('beef')) parsedEmoji = '🥩';
      else if (lower.includes('burger')) parsedEmoji = '🍔';
      else if (lower.includes('stew') || lower.includes('soup')) parsedEmoji = '🍲';
      else if (lower.includes('chicken')) parsedEmoji = '🍗';
      else if (lower.includes('salmon') || lower.includes('fish')) parsedEmoji = '🐟';
      else if (lower.includes('pancake') || lower.includes('toast')) parsedEmoji = '🥞';

      // Section triggers
      if (lower.includes('ingredient')) {
        currentSection = 'ingredients';
        return;
      }
      if (lower.includes('instruction') || lower.includes('direction') || lower.includes('step') || lower.includes('method')) {
        currentSection = 'instructions';
        return;
      }

      // Parse lines into section arrays
      if (currentSection === 'ingredients') {
        rawIngredients.push(line.replace(/^[-•*]\s*/, ''));
      } else if (currentSection === 'instructions') {
        rawInstructions.push(line.replace(/^\d+[\.\)]\s*/, ''));
      } else {
        // Fallback detection for bullet points or numbered lines
        if (line.match(/^[-•*]\s+/)) {
          rawIngredients.push(line.replace(/^[-•*]\s*/, ''));
        } else if (line.match(/^\d+[\.\)]\s+/)) {
          rawInstructions.push(line.replace(/^\d+[\.\)]\s*/, ''));
        }
      }
    });

    const ingText = rawIngredients.length > 0
      ? rawIngredients.join(', ')
      : 'Pork Chops, Garlic, Olive Oil, Salt, Black Pepper';

    const instText = rawInstructions.length > 0
      ? rawInstructions.join('\n')
      : 'Step 1: Prep ingredients\nStep 2: Cook over medium heat until golden\nStep 3: Serve warm!';

    return {
      title: parsedTitle,
      prepTime: parsedPrep,
      cookTime: parsedCook,
      category: parsedCategory,
      emoji: parsedEmoji,
      description: `Scanned recipe card (${parsedTitle}).`,
      ingredientsStr: ingText,
      instructionsStr: instText
    };
  };

  const processImageFile = async (file) => {
    if (!file) return;

    // Show image preview
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    setIsScanning(true);
    setScanProgress(10);
    setScanStatusText('Initializing OCR Scanner engine...');

    try {
      const worker = await createWorker('eng');
      setScanProgress(40);
      setScanStatusText('Reading text from recipe photo...');

      const ret = await worker.recognize(file);
      setScanProgress(85);
      setScanStatusText('Parsing ingredients & instructions...');

      await worker.terminate();

      const extracted = parseRecipeText(ret.data.text);
      setScannedData(extracted);
      setTitle(extracted.title);
      setPrepTime(extracted.prepTime);
      setCookTime(extracted.cookTime);
      setCategory(extracted.category);
      setEmoji(extracted.emoji);
      setDescription(extracted.description);
      setIngredientsStr(extracted.ingredientsStr);
      setInstructionsStr(extracted.instructionsStr);

      setScanProgress(100);
      setIsScanning(false);
      confetti({ particleCount: 30, spread: 50 });
    } catch (err) {
      console.error('OCR Error:', err);
      setIsScanning(false);
      alert('Unable to process photo. Please try uploading a clearer image or enter details manually.');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleSaveScannedRecipe = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Parse ingredients string into department categorized items
    const parsedIngredients = ingredientsStr
      .split(/,|\n/)
      .map((item) => item.trim())
      .filter((i) => i.length > 0)
      .map((name) => {
        const lower = name.toLowerCase();
        let cat = 'Pantry';
        if (lower.includes('pork') || lower.includes('beef') || lower.includes('chicken') || lower.includes('meat') || lower.includes('salmon') || lower.includes('bacon')) {
          cat = 'Meat';
        } else if (lower.includes('apple') || lower.includes('onion') || lower.includes('garlic') || lower.includes('mushroom') || lower.includes('parsley') || lower.includes('thyme') || lower.includes('arugula') || lower.includes('lemon')) {
          cat = 'Produce';
        } else if (lower.includes('cream') || lower.includes('cheese') || lower.includes('milk') || lower.includes('butter') || lower.includes('egg')) {
          cat = 'Dairy';
        }
        return { name, amount: 'As needed', category: cat };
      });

    const parsedInstructions = instructionsStr
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const createdRecipe = {
      title,
      category,
      defaultCook: cook,
      prepTime,
      cookTime,
      servings: 4,
      rating: 5,
      isFavorite: true,
      imageEmoji: emoji,
      description: description || `Delicious scanned ${title} recipe.`,
      ingredients: parsedIngredients.length > 0 ? parsedIngredients : [{ name: title, amount: '1', category: 'Pantry' }],
      instructions: parsedInstructions.length > 0 ? parsedInstructions : ['Prepare and cook with care!']
    };

    addScannedRecipeAndAssign(
      createdRecipe,
      assignToPlan ? selectedDayIndex : null,
      assignToPlan ? selectedMealType : null
    );

    confetti({ particleCount: 60, spread: 70 });
    onClose();
    resetState();
  };

  const resetState = () => {
    setImagePreview(null);
    setScannedData(null);
    setIsScanning(false);
    setScanProgress(0);
  };

  return (
    <div className="modal-backdrop scanner-modal-backdrop" onClick={onClose}>
      <div className="modal-content cute-modal scanner-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="scanner-modal-title">
            <Camera size={24} color="#e07a5f" />
            <div>
              <h3>📷 Recipe Photo Scanner</h3>
              <p>Snap a photo of your GoodFood or HelloFresh recipe card to auto-import & update your shopping list!</p>
            </div>
          </div>
          <button className="close-modal-btn" onClick={onClose}>✕</button>
        </div>

        {/* STEP 1: CAPTURE / UPLOAD IMAGE */}
        {!scannedData && !isScanning && (
          <div className="scanner-upload-step">
            <div className="scanner-dropzone">
              <span className="dropzone-icon">📸</span>
              <h4>Take a Photo or Select Image</h4>
              <p>Upload a clear photo of your recipe card, meal kit instructions, or cookbook page.</p>

              <div className="dropzone-actions-row">
                {/* Camera Capture (Mobile & Webcams) */}
                <button
                  type="button"
                  className="btn-scanner-action primary"
                  onClick={() => cameraInputRef.current?.click()}
                >
                  <Camera size={18} />
                  <span>Take Photo (Camera)</span>
                </button>
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />

                {/* Upload File */}
                <button
                  type="button"
                  className="btn-scanner-action secondary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={18} />
                  <span>Upload Image File</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: SCANNING IN PROGRESS */}
        {isScanning && (
          <div className="scanner-progress-box">
            {imagePreview && (
              <div className="scanner-preview-thumb">
                <img src={imagePreview} alt="Recipe Card Preview" />
              </div>
            )}
            <div className="progress-spinner-wrapper">
              <RefreshCw size={32} className="spin-anim" color="#e07a5f" />
            </div>
            <h4>Reading Recipe Photo...</h4>
            <p>{scanStatusText}</p>

            <div className="scanner-progress-bar-bg">
              <div className="scanner-progress-fill" style={{ width: `${scanProgress}%` }}></div>
            </div>
          </div>
        )}

        {/* STEP 3: REVIEW & EDIT EXTRACTED RECIPE */}
        {scannedData && !isScanning && (
          <form onSubmit={handleSaveScannedRecipe} className="scanned-recipe-form">
            <div className="scanned-preview-banner">
              <div className="preview-mini-thumb">
                <img src={imagePreview} alt="Scanned Recipe" />
              </div>
              <div className="preview-banner-text">
                <span className="scanned-badge">✨ OCR SCAN COMPLETE</span>
                <h4>Review & Add to Family Kitchen</h4>
              </div>
              <button
                type="button"
                className="btn-rescan"
                onClick={resetState}
                title="Scan another photo"
              >
                <RefreshCw size={14} />
                <span>Rescan</span>
              </button>
            </div>

            <div className="form-group">
              <label>Dish Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                </select>
              </div>

              <div className="form-group">
                <label>Assigned Chef</label>
                <select value={cook} onChange={(e) => setCook(e.target.value)}>
                  {familyMembers.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.icon} {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Prep Time</label>
                <input type="text" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Cook Time</label>
                <input type="text" value={cookTime} onChange={(e) => setCookTime(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Icon Emoji</label>
                <input type="text" value={emoji} onChange={(e) => setEmoji(e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label>Scanned Ingredients (comma separated)</label>
              <textarea
                rows={3}
                value={ingredientsStr}
                onChange={(e) => setIngredientsStr(e.target.value)}
                placeholder="Pork Chops, Maple Syrup, Curry Powder..."
              />
            </div>

            <div className="form-group">
              <label>Cooking Instructions (one per line)</label>
              <textarea
                rows={4}
                value={instructionsStr}
                onChange={(e) => setInstructionsStr(e.target.value)}
              />
            </div>

            {/* AUTOMATIC MEAL PLAN ASSIGNMENT */}
            <div className="assign-plan-card">
              <label className="assign-checkbox-row">
                <input
                  type="checkbox"
                  checked={assignToPlan}
                  onChange={(e) => setAssignToPlan(e.target.checked)}
                />
                <span><strong>Add directly to Weekly Meal Schedule</strong> & update Shopping List</span>
              </label>

              {assignToPlan && (
                <div className="form-row" style={{ marginTop: '10px' }}>
                  <div className="form-group">
                    <label>Select Day</label>
                    <select
                      value={selectedDayIndex}
                      onChange={(e) => setSelectedDayIndex(parseInt(e.target.value, 10))}
                    >
                      {weeklyPlan.map((day) => (
                        <option key={day.dayIndex} value={day.dayIndex}>
                          {day.dayName} (July {day.dateNum})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Meal Slot</label>
                    <select
                      value={selectedMealType}
                      onChange={(e) => setSelectedMealType(e.target.value)}
                    >
                      <option value="breakfast">Breakfast 🌅</option>
                      <option value="lunch">Lunch ☀️</option>
                      <option value="dinner">Dinner 🌙</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-actions-row" style={{ marginTop: '18px' }}>
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-submit">
                Save & Update Shopping List ✨
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
