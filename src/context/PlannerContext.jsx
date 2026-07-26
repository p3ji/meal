import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_RECIPES, INITIAL_DAYS, INITIAL_FAMILY_MEMBERS } from '../data/initialData';
import confetti from 'canvas-confetti';

const PlannerContext = createContext();

export const getWeekInfo = (offset = 0) => {
  // Base starting date: Monday, July 27, 2026 (Month index 6 = July)
  const baseDate = new Date(2026, 6, 27);
  baseDate.setDate(baseDate.getDate() + offset * 7);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const daysInfo = [];
  for (let i = 0; i < 7; i++) {
    const current = new Date(baseDate);
    current.setDate(baseDate.getDate() + i);
    daysInfo.push({
      dayIndex: i,
      dayName: dayNames[i],
      dateNum: current.getDate().toString(),
      monthName: monthNames[current.getMonth()],
      fullDate: current.toISOString().split('T')[0]
    });
  }

  const startDate = daysInfo[0];
  const endDate = daysInfo[6];

  let rangeText = '';
  if (startDate.monthName === endDate.monthName) {
    rangeText = `${startDate.monthName} ${startDate.dateNum} – ${endDate.dateNum}`;
  } else {
    rangeText = `${startDate.monthName} ${startDate.dateNum} – ${endDate.monthName} ${endDate.dateNum}`;
  }

  return { daysInfo, rangeText };
};

export const PlannerProvider = ({ children }) => {
  // Active Navigation Tab: 'weekPlan', 'today', 'recipes', 'shoppingList', 'profile'
  const [activeTab, setActiveTab] = useState('weekPlan');

  // Week Offset (0 = July 27 - Aug 2)
  const [weekOffset, setWeekOffset] = useState(0);

  // Quick Printable Modal visibility
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Recipe Photo Scanner Modal visibility & Target Slot: { dayIndex, mealType }
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [scannerTargetSlot, setScannerTargetSlot] = useState(null);

  // Week Days Plan State
  const [weeklyPlan, setWeeklyPlan] = useState(() => {
    const saved = localStorage.getItem('family_kitchen_weekly_plan');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hasJuly27Pork = parsed.some((d) => d.meals?.dinner?.recipeId === 'rec-maple-curry-pork-chops');
        if (hasJuly27Pork) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_DAYS;
  });

  // Recipe Library State
  const [recipes, setRecipes] = useState(() => {
    const saved = localStorage.getItem('family_kitchen_recipes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hasMaplePork = parsed.some((r) => r.id === 'rec-maple-curry-pork-chops');
        if (hasMaplePork) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_RECIPES;
  });

  // Family Members State
  const [familyMembers, setFamilyMembers] = useState(() => {
    const saved = localStorage.getItem('family_kitchen_members');
    return saved ? JSON.parse(saved) : INITIAL_FAMILY_MEMBERS;
  });

  // Custom Shopping Items State
  const [customShopping, setCustomShopping] = useState(() => {
    const saved = localStorage.getItem('family_kitchen_custom_shopping');
    return saved ? JSON.parse(saved) : [];
  });

  // Checked Items State
  const [checkedItems, setCheckedItems] = useState(() => {
    const saved = localStorage.getItem('family_kitchen_checked');
    return saved ? JSON.parse(saved) : {};
  });

  // Selected Recipe for Modal View
  const [selectedRecipeModal, setSelectedRecipeModal] = useState(null);

  // Meal Edit Slot Modal State: { dayIndex, mealType, currentMeal }
  const [editingMealSlot, setEditingMealSlot] = useState(null);

  // Calculate current week info based on offset
  const currentWeekInfo = getWeekInfo(weekOffset);
  const weekRangeText = currentWeekInfo.rangeText;

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('family_kitchen_weekly_plan', JSON.stringify(weeklyPlan));
  }, [weeklyPlan]);

  useEffect(() => {
    localStorage.setItem('family_kitchen_recipes', JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem('family_kitchen_members', JSON.stringify(familyMembers));
  }, [familyMembers]);

  useEffect(() => {
    localStorage.setItem('family_kitchen_custom_shopping', JSON.stringify(customShopping));
  }, [customShopping]);

  useEffect(() => {
    localStorage.setItem('family_kitchen_checked', JSON.stringify(checkedItems));
  }, [checkedItems]);

  // Actions
  const handlePrevWeek = () => setWeekOffset((prev) => prev - 1);
  const handleNextWeek = () => setWeekOffset((prev) => prev + 1);
  const handleResetWeek = () => setWeekOffset(0);

  const openScanForSlot = (dayIndex, mealType) => {
    setScannerTargetSlot({ dayIndex, mealType });
    setIsScannerModalOpen(true);
  };

  const updateMealInPlan = (dayIndex, mealType, newMeal) => {
    setWeeklyPlan((prev) =>
      prev.map((day) => {
        if (day.dayIndex === dayIndex) {
          return {
            ...day,
            meals: {
              ...day.meals,
              [mealType]: newMeal
            }
          };
        }
        return day;
      })
    );
  };

  const toggleFavoriteMeal = (dayIndex, mealType) => {
    setWeeklyPlan((prev) =>
      prev.map((day) => {
        if (day.dayIndex === dayIndex) {
          const currentMeal = day.meals[mealType];
          if (!currentMeal) return day;
          return {
            ...day,
            meals: {
              ...day.meals,
              [mealType]: {
                ...currentMeal,
                favorite: !currentMeal.favorite
              }
            }
          };
        }
        return day;
      })
    );
  };

  const toggleRecipeFavorite = (recipeId) => {
    setRecipes((prev) =>
      prev.map((rec) => (rec.id === recipeId ? { ...rec, isFavorite: !rec.isFavorite } : rec))
    );
  };

  const addRecipe = (newRecipe) => {
    const recipeWithId = {
      ...newRecipe,
      id: `rec-${Date.now()}`
    };
    setRecipes((prev) => [recipeWithId, ...prev]);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    return recipeWithId;
  };

  const deleteRecipe = (recipeId) => {
    setRecipes((prev) => prev.filter((r) => r.id !== recipeId));
    if (selectedRecipeModal?.id === recipeId) {
      setSelectedRecipeModal(null);
    }
  };

  const addScannedRecipeAndAssign = (scannedRecipe, dayIndex = null, mealType = null) => {
    const recipeWithId = {
      ...scannedRecipe,
      id: `rec-scan-${Date.now()}`
    };
    setRecipes((prev) => [recipeWithId, ...prev]);

    if (dayIndex !== null && dayIndex !== undefined && mealType) {
      updateMealInPlan(dayIndex, mealType, {
        title: recipeWithId.title,
        cook: recipeWithId.defaultCook || 'Mom',
        recipeId: recipeWithId.id,
        favorite: true,
        imageEmoji: recipeWithId.imageEmoji || '🍲',
        recipeUrl: recipeWithId.recipeUrl || null
      });
    }

    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
  };

  const toggleShoppingCheck = (itemId) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const addCustomShoppingItem = (itemText, category = 'Pantry') => {
    if (!itemText.trim()) return;
    const newItem = {
      id: `custom-${Date.now()}`,
      name: itemText.trim(),
      amount: '1 item',
      category
    };
    setCustomShopping((prev) => [...prev, newItem]);
  };

  const removeCustomShoppingItem = (itemId) => {
    setCustomShopping((prev) => prev.filter((i) => i.id !== itemId));
  };

  const clearCheckedShopping = () => {
    setCheckedItems({});
  };

  const addFamilyMember = (member) => {
    const newMem = {
      ...member,
      id: `mem-${Date.now()}`
    };
    setFamilyMembers((prev) => [...prev, newMem]);
  };

  const resetAllData = () => {
    setWeeklyPlan(INITIAL_DAYS);
    setRecipes(INITIAL_RECIPES);
    setFamilyMembers(INITIAL_FAMILY_MEMBERS);
    setCustomShopping([]);
    setCheckedItems({});
    setWeekOffset(0);
  };

  return (
    <PlannerContext.Provider
      value={{
        activeTab,
        setActiveTab,
        weekOffset,
        setWeekOffset,
        handlePrevWeek,
        handleNextWeek,
        handleResetWeek,
        currentWeekInfo,
        weekRangeText,
        isPrintModalOpen,
        setIsPrintModalOpen,
        isScannerModalOpen,
        setIsScannerModalOpen,
        scannerTargetSlot,
        setScannerTargetSlot,
        openScanForSlot,
        weeklyPlan,
        recipes,
        familyMembers,
        customShopping,
        checkedItems,
        selectedRecipeModal,
        setSelectedRecipeModal,
        editingMealSlot,
        setEditingMealSlot,
        updateMealInPlan,
        toggleFavoriteMeal,
        toggleRecipeFavorite,
        addRecipe,
        deleteRecipe,
        addScannedRecipeAndAssign,
        toggleShoppingCheck,
        addCustomShoppingItem,
        removeCustomShoppingItem,
        clearCheckedShopping,
        addFamilyMember,
        resetAllData
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
};

export const usePlanner = () => {
  const context = useContext(PlannerContext);
  if (!context) {
    throw new Error('usePlanner must be used within a PlannerProvider');
  }
  return context;
};
