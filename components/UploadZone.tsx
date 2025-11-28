import React, { useRef } from 'react';
import { Upload, Camera, Image as ImageIcon } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect, isProcessing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-10 p-6">
      <div 
        onClick={!isProcessing ? triggerUpload : undefined}
        className={`
          border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300
          ${isProcessing ? 'border-gray-300 bg-gray-50 cursor-wait' : 'border-emerald-200 bg-white hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-50'}
        `}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileChange}
        />
        
        {isProcessing ? (
          <div className="flex flex-col items-center animate-pulse">
            <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
               <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-700">Analyzing Photo...</h3>
            <p className="text-gray-500 mt-2 text-sm">Reading customer details, address, and weight.</p>
          </div>
        ) : (
          <>
            <div className="h-20 w-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 relative group">
              <Camera className="w-8 h-8 text-emerald-600 absolute transition-all duration-300 group-hover:scale-110 opacity-100 group-hover:opacity-0" />
              <Upload className="w-8 h-8 text-emerald-600 absolute transition-all duration-300 scale-50 opacity-0 group-hover:scale-110 group-hover:opacity-100" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">Upload Photo</h3>
            <p className="text-gray-500 mb-6 max-w-xs">
              Take a photo of a laundry bag tag, delivery note, or receipt to extract order details.
            </p>

            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-8 rounded-full transition-colors flex items-center gap-2 shadow-md shadow-emerald-200">
              <ImageIcon className="w-5 h-5" />
              <span>Select Photo</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};