import React, { useState, useEffect, useRef } from 'react';
import { createWorker } from 'tesseract.js';
import { usePlanner } from '../context/PlannerContext';
import { Camera, Upload, Sparkles, Check, RefreshCw, Clipboard, Link as LinkIcon, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export const RecipeScannerModal = ({ isOpen, onClose }) => {
  const { weeklyPlan, addScannedRecipeAndAssign, familyMembers, scannerTargetSlot } = usePlanner();

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Active Tab: 'photo' or 'paste'
  const [activeTab, setActiveTab] = useState('photo');

  const [imagePreview, setImagePreview] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatusText, setScanStatusText] = useState('');

  // Paste Text Input
  const [rawPastedText, setRawPastedText] = useState('');

  // Scanned / Editable Recipe Form State
  const [scannedData, setScannedData] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Dinner');
  const [cook, setCook] = useState('Mom');
  const [prepTime, setPrepTime] = useState('15m');
  const [cookTime, setCookTime] = useState('20m');
  const [emoji, setEmoji] = useState('🥘');
  const [recipeUrl, setRecipeUrl] = useState('');
  const [description, setDescription] = useState('');
  const [ingredientsStr, setIngredientsStr] = useState('');
  const [instructionsStr, setInstructionsStr] = useState('');

  // Assign to week plan options
  const [assignToPlan, setAssignToPlan] = useState(true);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0); // Default Mon (July 27)
  const [selectedMealType, setSelectedMealType] = useState('dinner');

  useEffect(() => {
    if (scannerTargetSlot) {
      setSelectedDayIndex(scannerTargetSlot.dayIndex);
      setSelectedMealType(scannerTargetSlot.mealType);
      setAssignToPlan(true);
    }
  }, [scannerTargetSlot]);

  if (!isOpen) return null;

  // Intelligent Recipe Text Parser
  const parseRecipeText = (rawText) => {
    const lines = rawText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    let parsedTitle = '';
    let parsedPrep = '15m';
    let parsedCook = '20m';
    let parsedCategory = 'Dinner';
    let parsedEmoji = '🥘';
    const rawIngredients = [];
    const rawInstructions = [];

    let currentSection = 'header';

    lines.forEach((line, idx) => {
      const lower = line.toLowerCase();

      // Title detection (first non-header prominent line)
      if (!parsedTitle && !lower.includes('ingredient') && !lower.includes('instruction') && !lower.includes('goodfood') && !lower.includes('hellofresh')) {
        parsedTitle = line.replace(/^[^a-zA-Z0-9]+/, '');
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
      if (lower.includes('pork') || lower.includes('chop')) parsedEmoji = '🥩';
      else if (lower.includes('burger')) parsedEmoji = '🍔';
      else if (lower.includes('stew') || lower.includes('soup')) parsedEmoji = '🍲';
      else if (lower.includes('beef') || lower.includes('meatball')) parsedEmoji = '🧆';
      else if (lower.includes('chicken')) parsedEmoji = '🍗';
      else if (lower.includes('salmon') || lower.includes('fish')) parsedEmoji = '🐟';
      else if (lower.includes('pancake') || lower.includes('toast')) parsedEmoji = '🥞';

      // Section triggers
      if (lower.includes('ingredient')) {
        currentSection = 'ingredients';
        return;
      }
      if (lower.includes('instruction') || lower.includes('direction') || lower.includes('step') || lower.includes('method') || lower.includes('prep')) {
        currentSection = 'instructions';
        return;
      }

      // Parse lines into section arrays
      if (currentSection === 'ingredients') {
        rawIngredients.push(line.replace(/^[-•*]\s*/, ''));
      } else if (currentSection === 'instructions') {
        rawInstructions.push(line.replace(/^\d+[\.\)]\s*/, ''));
      } else {
        // Heuristic detection
        if (line.match(/^[-•*]\s+/)) {
          rawIngredients.push(line.replace(/^[-•*]\s*/, ''));
        } else if (line.match(/^\d+[\.\)]\s+/)) {
          rawInstructions.push(line.replace(/^\d+[\.\)]\s*/, ''));
        }
      }
    });

    const ingText = rawIngredients.length > 0
      ? rawIngredients.join(', ')
      : lines.slice(1, 6).join(', ');

    const instText = rawInstructions.length > 0
      ? rawInstructions.join('\n')
      : lines.slice(6).join('\n') || 'Step 1: Prep ingredients\nStep 2: Cook over medium heat until golden\nStep 3: Serve warm!';

    return {
      title: parsedTitle || 'New Scanned Dish',
      prepTime: parsedPrep,
      cookTime: parsedCook,
      category: parsedCategory,
      emoji: parsedEmoji,
      description: `Scanned recipe (${parsedTitle || 'Custom Dish'}).`,
      ingredientsStr: ingText,
      instructionsStr: instText
    };
  };

  // Image Contrast Enhancement Canvas Helper
  const preprocessImageForOCR = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Scale to optimal dimensions
        const maxDim = 1500;
        let scale = 1;
        if (img.width > maxDim || img.height > maxDim) {
          scale = Math.min(maxDim / img.width, maxDim / img.height);
        }
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Enhance contrast
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          const v = avg > 140 ? 255 : (avg < 80 ? 0 : avg);
          data[i] = v;
          data[i + 1] = v;
          data[i + 2] = v;
        }
        ctx.putImageData(imgData, 0, 0);

        canvas.toBlob((blob) => {
          resolve(blob || file);
        }, 'image/png');
      };
      img.onerror = () => resolve(file);
      img.src = url;
    });
  };

  const processImageFile = async (file) => {
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    setIsScanning(true);
    setScanProgress(15);
    setScanStatusText('Enhancing recipe photo contrast...');

    try {
      const processedBlob = await preprocessImageForOCR(file);
      setScanProgress(35);
      setScanStatusText('Reading text from recipe card...');

      const worker = await createWorker('eng');
      setScanProgress(60);

      const ret = await worker.recognize(processedBlob);
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
      // Open form anyway so user can type or paste easily
      const fallback = {
        title: 'New Scanned Recipe',
        prepTime: '15m',
        cookTime: '20m',
        category: 'Dinner',
        emoji: '🥩',
        description: 'Custom recipe.',
        ingredientsStr: '',
        instructionsStr: ''
      };
      setScannedData(fallback);
      setTitle(fallback.title);
      setIngredientsStr('');
      setInstructionsStr('');
    }
  };

  const handlePastedTextParse = (e) => {
    e.preventDefault();
    if (!rawPastedText.trim()) return;

    const extracted = parseRecipeText(rawPastedText);
    setScannedData(extracted);
    setTitle(extracted.title);
    setPrepTime(extracted.prepTime);
    setCookTime(extracted.cookTime);
    setCategory(extracted.category);
    setEmoji(extracted.emoji);
    setDescription(extracted.description);
    setIngredientsStr(extracted.ingredientsStr);
    setInstructionsStr(extracted.instructionsStr);

    confetti({ particleCount: 30, spread: 50 });
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
      recipeUrl: recipeUrl.trim() || null,
      description: description || `Delicious ${title} recipe.`,
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
    setRecipeUrl('');
    setRawPastedText('');
  };

  return (
    <div className="modal-backdrop scanner-modal-backdrop" onClick={onClose}>
      <div className="modal-content cute-modal scanner-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="scanner-modal-title">
            <Camera size={24} color="#e07a5f" />
            <div>
              <h3>📷 Recipe Photo & Text Importer</h3>
              <p>Snap a photo of your recipe card or paste text to auto-populate your recipe & shopping list!</p>
            </div>
          </div>
          <button className="close-modal-btn" onClick={onClose}>✕</button>
        </div>

        {/* MODE TAB SELECTOR (PHOTO vs COPY-PASTE) */}
        {!scannedData && !isScanning && (
          <div className="scanner-tab-selector">
            <button
              className={`scanner-tab-btn ${activeTab === 'photo' ? 'active' : ''}`}
              onClick={() => setActiveTab('photo')}
            >
              <Camera size={16} />
              <span>Snap / Upload Photo</span>
            </button>

            <button
              className={`scanner-tab-btn ${activeTab === 'paste' ? 'active' : ''}`}
              onClick={() => setActiveTab('paste')}
            >
              <Clipboard size={16} />
              <span>Paste Recipe Text</span>
            </button>
          </div>
        )}

        {/* STEP 1A: PHOTO UPLOAD TAB */}
        {!scannedData && !isScanning && activeTab === 'photo' && (
          <div className="scanner-upload-step">
            <div className="scanner-dropzone">
              <span className="dropzone-icon">📸</span>
              <h4>Take a Photo or Select Image</h4>
              <p>Upload a clear photo of your GoodFood or HelloFresh recipe card.</p>

              <div className="dropzone-actions-row">
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

        {/* STEP 1B: PASTE TEXT TAB */}
        {!scannedData && !isScanning && activeTab === 'paste' && (
          <form onSubmit={handlePastedTextParse} className="paste-text-step">
            <div className="form-group">
              <label>Paste Recipe Text (from email, website, or note)</label>
              <textarea
                rows={6}
                required
                placeholder="Paste recipe title, ingredients, and instructions here..."
                value={rawPastedText}
                onChange={(e) => setRawPastedText(e.target.value)}
                style={{ fontFamily: 'inherit' }}
              />
            </div>
            <button type="submit" className="btn-submit" style={{ width: '100%', padding: '12px' }}>
              <Sparkles size={18} />
              <span>Auto-Parse Recipe Text ✨</span>
            </button>
          </form>
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
            <h4>Processing Recipe...</h4>
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
              {imagePreview && (
                <div className="preview-mini-thumb">
                  <img src={imagePreview} alt="Scanned Recipe" />
                </div>
              )}
              <div className="preview-banner-text">
                <span className="scanned-badge">✨ RECIPE READY FOR REVIEW</span>
                <h4>Review & Add to Family Kitchen</h4>
              </div>
              <button
                type="button"
                className="btn-rescan"
                onClick={resetState}
                title="Start Over"
              >
                <RefreshCw size={14} />
                <span>Start Over</span>
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

            <div className="form-group">
              <label>Recipe Website Link / URL (Optional)</label>
              <div className="input-with-icon">
                <LinkIcon size={16} color="#888" className="input-icon-left" />
                <input
                  type="url"
                  value={recipeUrl}
                  onChange={(e) => setRecipeUrl(e.target.value)}
                  placeholder="https://www.goodfood.ca/recipe/... or HelloFresh link"
                  className="input-padded-left"
                />
              </div>
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
              <label>Ingredients (comma separated)</label>
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
