import React from 'react';
import { usePlanner } from '../context/PlannerContext';
import { Printer, ChevronLeft, ChevronRight, Utensils } from 'lucide-react';

export const Header = () => {
  const {
    weekRangeText,
    handlePrevWeek,
    handleNextWeek,
    handleResetWeek,
    setIsPrintModalOpen
  } = usePlanner();

  return (
    <header className="ghibli-header-container">
      {/* Soot Sprites Floating Background Elements */}
      <div className="soot-sprite soot-1" title="Kitchen Helper Sprite">
        <div className="soot-eye left"></div>
        <div className="soot-eye right"></div>
      </div>
      <div className="soot-sprite soot-2" title="Kitchen Helper Sprite">
        <div className="soot-eye left"></div>
        <div className="soot-eye right"></div>
      </div>

      {/* Main Title Banner */}
      <div className="ghibli-title-wrapper">
        <div className="ghibli-wreath-left">🌿</div>
        <div className="ghibli-title-box">
          <div className="totoro-icon-badge" title="Family Kitchen">
            <div className="totoro-ears"><span></span><span></span></div>
            <div className="totoro-face">
              <span className="totoro-eye"></span>
              <span className="totoro-nose"></span>
              <span className="totoro-eye"></span>
            </div>
          </div>
          <h1 className="ghibli-main-title">FAMILY KITCHEN</h1>
          <p className="ghibli-subtitle">Family Meal Planner & Recipe Collection</p>
        </div>
        <div className="ghibli-wreath-right">🌿</div>
      </div>

      {/* Week Selector Bar & Quick Print Action */}
      <div className="header-controls-row">
        <div className="weekly-plan-selector-bar">
          <button className="nav-arrow-btn" onClick={handlePrevWeek} title="Previous Week">
            <ChevronLeft size={20} />
          </button>

          <div className="weekly-plan-badge" onClick={handleResetWeek} title="Click to reset to July 27 week">
            <span className="badge-icon calcifer-icon">🔥</span>
            <span className="badge-icon tree-icon">🌳</span>
            <span className="weekly-plan-title-text">
              WEEKLY PLAN: <strong className="week-dates-highlight">{weekRangeText}</strong>
            </span>
            <span className="badge-icon pine-icon">🌲</span>
            <span className="badge-icon hill-icon">🏞️</span>
          </div>

          <button className="nav-arrow-btn" onClick={handleNextWeek} title="Next Week">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Quick Printable Version Button */}
        <button
          className="quick-print-header-btn"
          onClick={() => setIsPrintModalOpen(true)}
          title="Open Quick Printable Version"
        >
          <Printer size={18} />
          <span>Quick Printable Version</span>
        </button>
      </div>
    </header>
  );
};
