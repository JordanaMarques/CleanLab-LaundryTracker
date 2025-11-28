
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { ResultsTable } from './components/ResultsTable';
import { StatsChart } from './components/StatsChart';
import { SummaryCards } from './components/SummaryCards';
import { analyzeImage } from './services/geminiService';
import { AppState, OrderRecord } from './types';
import { RefreshCcw, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [data, setData] = useState<OrderRecord[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    setAppState(AppState.ANALYZING);
    setErrorMsg(null);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        
        try {
          const results = await analyzeImage(base64Data);
          setData(prev => [...results, ...prev]);
          setAppState(AppState.SUCCESS);
        } catch (err) {
          console.error(err);
          setErrorMsg("Failed to extract data. Please ensure the text is legible.");
          setAppState(AppState.ERROR);
        }
      };
      reader.readAsDataURL(file);
    } catch (e) {
      setErrorMsg("Error reading file.");
      setAppState(AppState.ERROR);
    }
  }, []);

  const handleUpdate = (id: string, field: keyof OrderRecord, value: string) => {
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this order?')) {
      setData(prev => prev.filter(item => item.id !== id));
    }
  };

  const reset = () => {
    setAppState(AppState.IDLE);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen pb-12">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {appState === AppState.IDLE && (
          <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Track Customer Laundry Orders</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Effortlessly digitize your laundry operations. Just snap a photo of a bag tag or delivery note to automatically log customer names, addresses, weights, and service providers.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-8">
          <UploadZone onFileSelect={handleFileSelect} isProcessing={appState === AppState.ANALYZING} />

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 max-w-xl mx-auto w-full">
              <AlertCircle className="w-5 h-5" />
              {errorMsg}
              <button onClick={reset} className="ml-auto text-sm font-semibold hover:underline">Try Again</button>
            </div>
          )}

          {data.length > 0 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <SummaryCards data={data} />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-3">
                   <ResultsTable data={data} onUpdate={handleUpdate} onDelete={handleDelete} />
                </div>
                <div className="lg:col-span-3">
                    <StatsChart data={data} />
                </div>
              </div>

              <div className="flex justify-center pb-12">
                 <button 
                  onClick={reset}
                  className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors font-medium bg-white px-6 py-3 rounded-full shadow-sm border border-gray-200 hover:shadow-md"
                 >
                   <RefreshCcw className="w-4 h-4" />
                   Scan Another Photo
                 </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
