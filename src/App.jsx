import React from 'react';
import { PlannerProvider, usePlanner } from './context/PlannerContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { WeeklyPlanner } from './components/WeeklyPlanner';
import { TodayView } from './components/TodayView';
import { RecipeBook } from './components/RecipeBook';
import { ShoppingList } from './components/ShoppingList';
import { FamilyProfiles } from './components/FamilyProfiles';
import { MealEditModal, RecipeDetailModal } from './components/MealEditModal';
import { PrintableModal } from './components/PrintableModal';
import { PwaInstallBanner } from './components/PwaInstallBanner';

import './styles/global.css';
import './styles/components.css';

const MainContent = () => {
  const { activeTab } = usePlanner();

  return (
    <main className="app-main-content">
      {activeTab === 'weekPlan' && <WeeklyPlanner />}
      {activeTab === 'today' && <TodayView />}
      {activeTab === 'recipes' && <RecipeBook />}
      {activeTab === 'shoppingList' && <ShoppingList />}
      {activeTab === 'profile' && <FamilyProfiles />}
    </main>
  );
};

const AppModals = () => {
  const { isPrintModalOpen, setIsPrintModalOpen } = usePlanner();

  return (
    <>
      <MealEditModal />
      <RecipeDetailModal />
      <PrintableModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />
    </>
  );
};

export function App() {
  return (
    <PlannerProvider>
      <div className="app-root">
        <PwaInstallBanner />
        <Header />
        <MainContent />
        <Navigation />
        <AppModals />
      </div>
    </PlannerProvider>
  );
}

export default App;
