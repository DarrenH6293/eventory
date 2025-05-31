'use client';

import { useState } from 'react';

const tabs = ['Account', 'Privacy', 'Preferences', 'Notifications', 'Email'];

export default function ProfileSettingsPage() {
  const [activeTab, setActiveTab] = useState<string>('Account');

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>

      <nav className="flex space-x-4 mb-6 border-b pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${
              activeTab === tab ? 'bg-blue-600 text-white' : 'bg-black-200 text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="bg-black p-6 rounded shadow">
        {activeTab === 'Account' && (
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Username</label>
              <input type="text" placeholder="Enter new username" className="border px-3 py-2 w-full rounded" />
            </div>
            <div>
              <label className="block font-medium mb-1">Email</label>
              <input type="email" placeholder="Enter new email" className="border px-3 py-2 w-full rounded" />
            </div>
            <div>
              <button className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                Delete Account
              </button>
            </div>
          </div>
        )}

        {activeTab === 'Privacy' && (
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="form-checkbox" />
              <span>Make profile private</span>
            </label>
          </div>
        )}

        {activeTab === 'Preferences' && (
          <div className="space-y-4">
            <label className="block font-medium mb-1">Appearance Theme</label>
            <select className="border px-3 py-2 w-full rounded bg-black text-white">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>
        )}

        {activeTab === 'Notifications' && (
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="form-checkbox" />
              <span>Email</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="form-checkbox" />
              <span>Push Notifications</span>
            </label>
          </div>
        )}

        {activeTab === 'Email' && (
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="form-checkbox" />
              <span>New Followers</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="form-checkbox" />
              <span>Platform Updates</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
