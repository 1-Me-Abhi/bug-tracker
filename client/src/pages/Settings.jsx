import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { HiOutlineUser, HiOutlineMail, HiOutlineShieldCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="p-6 max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-xl font-bold text-white mb-6">Settings</h1>

      <div className="bg-dark-800/60 rounded-2xl border border-dark-600/30 p-6 space-y-6">
        <h2 className="text-sm font-semibold text-white">Profile</h2>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-accent-cyan flex items-center justify-center text-2xl font-bold text-dark-900">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">{user?.name}</h3>
            <p className="text-sm text-dark-300">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 px-4 py-3 bg-dark-700/50 rounded-xl">
            <HiOutlineUser className="w-5 h-5 text-dark-400" />
            <div>
              <p className="text-xs text-dark-400">Full Name</p>
              <p className="text-sm text-white">{user?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-3 bg-dark-700/50 rounded-xl">
            <HiOutlineMail className="w-5 h-5 text-dark-400" />
            <div>
              <p className="text-xs text-dark-400">Email</p>
              <p className="text-sm text-white">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-3 bg-dark-700/50 rounded-xl">
            <HiOutlineShieldCheck className="w-5 h-5 text-dark-400" />
            <div>
              <p className="text-xs text-dark-400">Role</p>
              <p className="text-sm text-white capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
