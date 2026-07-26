import React, { useState } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { Users, Plus, RefreshCw, Heart, Award, ShieldCheck } from 'lucide-react';

export const FamilyProfiles = () => {
  const { familyMembers, addFamilyMember, resetAllData } = usePlanner();

  const [showAddMember, setShowAddMember] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Helper');
  const [icon, setIcon] = useState('🌟');
  const [color, setColor] = useState('#81b29a');

  const handleAddMemberSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    addFamilyMember({ name, role, icon, color });
    setName('');
    setShowAddMember(false);
  };

  const handleResetConfirm = () => {
    if (window.confirm("Reset all meal plans and recipes back to Ghibli Kitchen initial defaults?")) {
      resetAllData();
      alert("✨ Ghibli Kitchen has been reset to default initial state!");
    }
  };

  return (
    <div className="family-profile-container">
      {/* Header */}
      <div className="profile-header-card">
        <div className="profile-hero-text">
          <span className="profile-badge">🏡 FAMILY KITCHEN</span>
          <h2>Family Members & Roles</h2>
          <p>Assign cooking turns, manage dietary tags, and customize avatar colors!</p>
        </div>
      </div>

      {/* Family Cards Grid */}
      <div className="family-cards-grid">
        {familyMembers.map((member) => (
          <div key={member.id} className="family-card" style={{ borderColor: member.color }}>
            <div className="avatar-circle" style={{ backgroundColor: member.color }}>
              <span>{member.icon || '👤'}</span>
            </div>
            <div className="family-card-info">
              <h3>{member.name}</h3>
              <span className="role-tag" style={{ backgroundColor: `${member.color}22`, color: member.color }}>
                {member.role || 'Family Member'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="profile-actions-bar">
        <button className="btn-add-family" onClick={() => setShowAddMember(true)}>
          <Plus size={18} />
          <span>Add Family Member</span>
        </button>

        <button className="btn-reset-demo" onClick={handleResetConfirm}>
          <RefreshCw size={16} />
          <span>Reset Sample Data</span>
        </button>
      </div>

      {/* ADD MEMBER MODAL */}
      {showAddMember && (
        <div className="modal-backdrop" onClick={() => setShowAddMember(false)}>
          <div className="modal-content cute-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🌸 Add Family Member</h3>
              <button className="close-modal-btn" onClick={() => setShowAddMember(false)}>✕</button>
            </div>

            <form onSubmit={handleAddMemberSubmit} className="add-member-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grandma, Uncle Alex"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Kitchen Role</label>
                <input
                  type="text"
                  placeholder="e.g. Baker, Taste Tester, Chef"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Avatar Emoji</label>
                  <select value={icon} onChange={(e) => setIcon(e.target.value)}>
                    <option value="🌸">🌸 Flower</option>
                    <option value="👨‍🍳">👨‍🍳 Chef</option>
                    <option value="🐥">🐥 Chick</option>
                    <option value="👑">👑 Crown</option>
                    <option value="🐱">🐱 Cat</option>
                    <option value="🐻">🐻 Bear</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Tag Color</label>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    style={{ height: '40px', padding: '2px', cursor: 'pointer' }}
                  />
                </div>
              </div>

              <div className="modal-actions-row">
                <button type="button" className="btn-cancel" onClick={() => setShowAddMember(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Add Member ✨
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
