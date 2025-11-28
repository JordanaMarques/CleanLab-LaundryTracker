
import React, { useMemo } from 'react';
import { OrderRecord } from '../types';
import { Scale, ShoppingBag, Coins, Users, Banknote } from 'lucide-react';

interface SummaryCardsProps {
  data: OrderRecord[];
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ data }) => {
  const stats = useMemo(() => {
    let totalWeight = 0;
    let totalDeduction = 0;
    let totalPaid = 0;
    const uniqueCustomers = new Set();

    data.forEach(item => {
      // Parse Weight
      const weightClean = item.weight.replace(/[^0-9.]/g, '');
      totalWeight += parseFloat(weightClean) || 0;

      // Parse Deduction
      const deductionClean = item.totalDeduction.replace(/[^0-9.-]/g, '');
      totalDeduction += parseFloat(deductionClean) || 0;

      // Parse Total Paid
      const paidClean = item.clientTotalPaid.replace(/[^0-9.-]/g, '');
      totalPaid += parseFloat(paidClean) || 0;

      // Unique Customers
      if (item.customerName) uniqueCustomers.add(item.customerName);
    });

    return {
      totalWeight: totalWeight.toFixed(1),
      totalDeduction: totalDeduction.toFixed(2),
      totalPaid: totalPaid.toFixed(2),
      uniqueCustomers: uniqueCustomers.size,
      totalOrders: data.length
    };
  }, [data]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Scale className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Weight</p>
            <h4 className="text-2xl font-bold text-gray-900">{stats.totalWeight} kg</h4>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <ShoppingBag className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Orders</p>
            <h4 className="text-2xl font-bold text-gray-900">{stats.totalOrders}</h4>
          </div>
        </div>
      </div>

       <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-100 rounded-lg">
            <Banknote className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Paid</p>
            <h4 className="text-2xl font-bold text-gray-900">€{stats.totalPaid}</h4>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-100 rounded-lg">
            <Coins className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Deductions</p>
            <h4 className="text-2xl font-bold text-gray-900">€{stats.totalDeduction}</h4>
          </div>
        </div>
      </div>

       <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-100 rounded-lg">
            <Users className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Unique Clients</p>
            <h4 className="text-2xl font-bold text-gray-900">{stats.uniqueCustomers}</h4>
          </div>
        </div>
      </div>
    </div>
  );
};
