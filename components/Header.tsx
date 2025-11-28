import React from 'react';
import { Shirt, BarChart3 } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-100 p-2 rounded-lg">
            <Shirt className="w-6 h-6 text-emerald-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">CleanLab <span className="text-emerald-600">Laundry Tracker</span></h1>
        </div>
        <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1 text-sm text-gray-500">
                <BarChart3 className="w-4 h-4" />
                <span>Analytics Ready</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-semibold text-sm">
                JS
            </div>
        </div>
      </div>
    </header>
  );
};