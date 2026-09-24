import React, { useState } from 'react';
import { ArrowLeft, Home, ChevronRight, Check } from 'lucide-react';
import { useBetting } from '../context/BettingContext';

interface ProfileDetailsSubpageProps {
  onBack: () => void;
}

export const ProfileDetailsSubpage: React.FC<ProfileDetailsSubpageProps> = ({ onBack }) => {
  const { user, updateProfile, setActiveTab, showToast } = useBetting();
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState(user.username || '');

  const handleSaveUsername = () => {
    updateProfile({ username: usernameInput.trim() });
    setIsEditingUsername(false);
  };

  return (
    <div className="bg-[#141b24] text-white min-h-screen pb-20 select-none">
      {/* Red Top Header (Screenshot 3: ← Profile 🏠) */}
      <div className="sticky top-0 z-30 bg-[#de1a22] text-white px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-1 -ml-1 text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <h1 className="text-base font-bold tracking-tight">Profile</h1>
        </div>

        <button
          onClick={() => setActiveTab('sports')}
          className="p-1 text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <Home className="w-5 h-5 fill-white stroke-none" />
        </button>
      </div>

      {/* Avatar & Username Card (Screenshot 3) */}
      <div className="pt-6 pb-4 px-4 flex flex-col items-center border-b border-[#202a37]">
        <div className="text-sm font-semibold text-neutral-300 mb-3">
          {user.username || 'No username set'}
        </div>

        {/* Circular Avatar Photo */}
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/20 shadow-lg relative bg-neutral-800">
          <img
            src={user.avatarUrl || '/user_beach_avatar.jpg'}
            alt="Profile Avatar"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Change button in green font */}
        <button
          onClick={() => showToast('Avatar updated!')}
          className="mt-2 text-xs font-bold text-[#00df59] hover:underline"
        >
          Change
        </button>
      </div>

      {/* Information Rows (Exact items from Screenshot 3) */}
      <div className="divide-y divide-[#202a37] text-xs">
        {/* Username */}
        <div className="px-4 py-3.5 flex items-center justify-between hover:bg-[#1a232f] transition-colors">
          <span className="text-neutral-400 font-medium">Username</span>
          {isEditingUsername ? (
            <div className="flex items-center space-x-1.5">
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Enter username"
                className="bg-[#242f3d] text-white text-xs px-2 py-1 rounded border border-neutral-600 focus:outline-none focus:border-[#00df59]"
                autoFocus
              />
              <button
                onClick={handleSaveUsername}
                className="p-1 bg-[#00a826] rounded text-white"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => setIsEditingUsername(true)}
              className="flex items-center space-x-1 cursor-pointer group"
            >
              <span className="text-[#00df59] font-medium">
                {user.username || 'No username set'}
              </span>
              <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white" />
            </div>
          )}
        </div>

        {/* My Social Page */}
        <div className="px-4 py-3 flex items-center justify-between hover:bg-[#1a232f] transition-colors">
          <span className="text-neutral-300 font-medium">My Social Page</span>
          <button
            onClick={() => showToast('Social profile created')}
            className="bg-[#00a826] hover:bg-[#009221] text-white font-bold text-[11px] px-3 py-1 rounded-[3px] shadow-sm transition-transform active:scale-95"
          >
            Create
          </button>
        </div>

        {/* First Name */}
        <div className="px-4 py-3.5 flex items-center justify-between">
          <span className="text-neutral-400 font-medium">First Name</span>
          <span className="text-neutral-200 font-bold uppercase tracking-wide">
            {user.firstName || 'NOT SET'}
          </span>
        </div>

        {/* Last Name */}
        <div className="px-4 py-3.5 flex items-center justify-between">
          <span className="text-neutral-400 font-medium">Last Name</span>
          <span className="text-neutral-200 font-bold uppercase tracking-wide">
            {user.lastName || 'NOT SET'}
          </span>
        </div>

        {/* Date of Birth */}
        <div className="px-4 py-3.5 flex items-center justify-between">
          <span className="text-neutral-400 font-medium">Date of Birth</span>
          <span className="text-neutral-200 font-mono">
            {user.dateOfBirth || '15/05/1998'}
          </span>
        </div>

        {/* Phone Number */}
        <div 
          onClick={() => showToast('Registered phone cannot be modified online')}
          className="px-4 py-3.5 flex items-center justify-between cursor-pointer hover:bg-[#1a232f]"
        >
          <span className="text-neutral-400 font-medium">Phone Number</span>
          <div className="flex items-center space-x-1">
            <span className="text-[#00df59] font-mono font-bold">
              {user.phone || 'Not set'}
            </span>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
          </div>
        </div>

        {/* Location */}
        <div className="px-4 py-3.5 flex items-center justify-between">
          <span className="text-neutral-400 font-medium">Location</span>
          <div className="flex items-center space-x-1">
            <span className="text-[#00df59] font-medium">
              {user.location || 'Ghana'}
            </span>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
          </div>
        </div>

        {/* Email */}
        <div 
          onClick={() => showToast('Verification link sent to email')}
          className="px-4 py-3.5 flex items-center justify-between cursor-pointer hover:bg-[#1a232f]"
        >
          <span className="text-neutral-400 font-medium">Email</span>
          <div className="flex items-center space-x-1">
            <span className="text-[#00df59] font-medium">
              {user.isEmailVerified ? user.email : 'Verify Now'}
            </span>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
          </div>
        </div>
      </div>

      {/* Copyright Footer */}
      <div className="mt-12 px-4 text-center text-[11px] text-neutral-500">
        © 2026 SportyBet. All rights reserved.
      </div>
    </div>
  );
};
