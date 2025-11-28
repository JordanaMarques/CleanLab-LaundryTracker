
import React, { useState, useMemo } from 'react';
import { OrderRecord } from '../types';
import { Download, MapPin, Search, Trash2, Edit2, Check, X, Box, CreditCard, Scale, Calendar, DollarSign, Store } from 'lucide-react';

interface ResultsTableProps {
  data: OrderRecord[];
  onUpdate: (id: string, field: keyof OrderRecord, value: string) => void;
  onDelete: (id: string) => void;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ data, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<OrderRecord>>({});

  const filteredData = data.filter(item => 
    item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.laundryService.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group data by laundry service
  const groupedData = useMemo(() => {
    const groups: Record<string, OrderRecord[]> = {};
    filteredData.forEach(item => {
        const service = item.laundryService || 'Unassigned';
        if (!groups[service]) groups[service] = [];
        groups[service].push(item);
    });
    return groups;
  }, [filteredData]);

  const startEdit = (record: OrderRecord) => {
    setEditingId(record.id);
    setEditForm(record);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = () => {
    if (editingId && editForm) {
      Object.keys(editForm).forEach((key) => {
        const k = key as keyof OrderRecord;
        if (editForm[k] !== undefined) {
          onUpdate(editingId, k, editForm[k] as string);
        }
      });
      setEditingId(null);
    }
  };

  const handleChange = (field: keyof OrderRecord, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const downloadCSV = () => {
    const headers = [
      "Laundry Service", "Date", "Customer Name", "Address", "Order #",
      "Item Desc", "Quantity", "Weight", 
      "Client Paid", "Shipping", "Discount Amt", "Discount %",
      "Shopify Payout", "Shopify Fee", "Payout Date",
      "Wash Deduction", "Others Ded.", "Total Ded."
    ];
    
    const csvContent = [
      headers.join(","),
      ...data.map(row => [
        `"${row.laundryService}"`,
        row.date,
        `"${row.customerName}"`,
        `"${row.address}"`,
        row.orderNumber,
        `"${row.itemDescription}"`,
        row.itemQuantity,
        row.weight,
        row.clientTotalPaid,
        row.shippingPrice,
        row.discountAmount,
        row.discountPercentage,
        row.shopifyPayout,
        row.shopifyFee,
        row.payoutDate,
        row.washDeductionKgs,
        row.othersDeduction,
        row.totalDeduction
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "cleanlab_full_export.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (data.length === 0) return null;

  return (
    <div className="flex flex-col gap-6">
      {/* Table Toolbar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search service, customer..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <span className="text-xs text-gray-500 font-medium">
                {filteredData.length} records found
            </span>
            <button 
            onClick={downloadCSV}
            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors"
            >
            <Download className="w-4 h-4" />
            Export CSV
            </button>
        </div>
      </div>

      {/* Render a table for each Laundry Service Group */}
      {Object.entries(groupedData).map(([service, records]) => (
        <div key={service} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
            <Store className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-gray-900">{service}</h3>
            <span className="bg-gray-200 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full">
              {records.length} orders
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-white border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap bg-gray-50/50 w-[150px]">Laundry Service</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Customer</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Address</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Item Details</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Weight</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Client Paid</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Shopify Payout</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Wash Ded.</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Total Ded.</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.map((row) => {
                  const isEditing = editingId === row.id;

                  if (isEditing) {
                    return (
                      <tr key={row.id} className="bg-emerald-50">
                        <td className="px-2 py-4 align-top min-w-[120px]">
                            <input className="w-full p-1 border rounded text-xs" placeholder="Service" value={editForm.laundryService} onChange={e => handleChange('laundryService', e.target.value)} />
                        </td>
                        <td className="px-2 py-4 align-top min-w-[150px]">
                            <div className="space-y-1">
                                <input className="w-full p-1 border rounded text-xs" placeholder="Date" value={editForm.date} onChange={e => handleChange('date', e.target.value)} />
                                <input className="w-full p-1 border rounded text-xs font-bold" placeholder="Customer" value={editForm.customerName} onChange={e => handleChange('customerName', e.target.value)} />
                                <input className="w-full p-1 border rounded text-xs" placeholder="Order #" value={editForm.orderNumber} onChange={e => handleChange('orderNumber', e.target.value)} />
                            </div>
                        </td>
                        <td className="px-2 py-4 align-top min-w-[200px]">
                            <textarea rows={2} className="w-full p-1 border rounded text-xs" placeholder="Address" value={editForm.address} onChange={e => handleChange('address', e.target.value)} />
                        </td>
                        <td className="px-2 py-4 align-top min-w-[120px]">
                            <div className="space-y-1">
                                <input className="w-full p-1 border rounded text-xs" placeholder="Desc" value={editForm.itemDescription} onChange={e => handleChange('itemDescription', e.target.value)} />
                                <input className="w-full p-1 border rounded text-xs" placeholder="Qty" value={editForm.itemQuantity} onChange={e => handleChange('itemQuantity', e.target.value)} />
                            </div>
                        </td>
                        <td className="px-2 py-4 align-top min-w-[80px]">
                            <input className="w-full p-1 border rounded text-xs" placeholder="Weight" value={editForm.weight} onChange={e => handleChange('weight', e.target.value)} />
                        </td>
                        <td className="px-2 py-4 align-top min-w-[100px]">
                             <input className="w-full p-1 border rounded text-right text-xs" placeholder="Total Paid" value={editForm.clientTotalPaid} onChange={e => handleChange('clientTotalPaid', e.target.value)} />
                        </td>
                        <td className="px-2 py-4 align-top min-w-[100px]">
                            <input className="w-full p-1 border rounded text-right text-xs" placeholder="Payout" value={editForm.shopifyPayout} onChange={e => handleChange('shopifyPayout', e.target.value)} />
                        </td>
                        <td className="px-2 py-4 align-top min-w-[80px]">
                            <input className="w-full p-1 border rounded text-right text-xs" value={editForm.washDeductionKgs} onChange={e => handleChange('washDeductionKgs', e.target.value)} />
                        </td>
                        <td className="px-2 py-4 align-top min-w-[80px]">
                            <input className="w-full p-1 border rounded text-right text-xs font-semibold text-red-600" value={editForm.totalDeduction} onChange={e => handleChange('totalDeduction', e.target.value)} />
                        </td>
                        <td className="px-2 py-4 text-center align-top">
                            <div className="flex items-center justify-center gap-2">
                                <button onClick={saveEdit} className="p-1 text-emerald-600 hover:bg-emerald-100 rounded"><Check className="w-4 h-4" /></button>
                                <button onClick={cancelEdit} className="p-1 text-gray-500 hover:bg-gray-100 rounded"><X className="w-4 h-4" /></button>
                            </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-4 py-4 whitespace-nowrap">
                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                           {row.laundryService}
                         </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{row.customerName}</span>
                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                <span className="font-mono text-emerald-600">{row.orderNumber}</span>
                                <span className="text-gray-300">•</span>
                                <div className="flex items-center gap-0.5">
                                    <Calendar className="w-3 h-3 text-gray-400" />
                                    <span>{row.date}</span>
                                </div>
                            </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 max-w-[200px]">
                        {row.address ? (
                            <div className="flex items-start gap-1 text-xs text-gray-500">
                              <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0 text-gray-400" />
                              <span className="truncate-2-lines">{row.address}</span>
                            </div>
                        ) : (
                            <span className="text-gray-300 text-xs">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1 text-gray-700 font-medium">
                                <Box className="w-3 h-3 text-emerald-500" />
                                {row.itemDescription || "Standard Laundry"}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5 ml-4">
                                Qty: {row.itemQuantity}
                            </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded-md w-fit">
                              <Scale className="w-3 h-3 text-gray-500" />
                              {row.weight}
                          </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <span className="font-medium text-gray-900">{row.clientTotalPaid}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <span className="font-medium text-emerald-600">{row.shopifyPayout}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-gray-600">
                        {row.washDeductionKgs}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right font-semibold text-red-600">
                        {row.totalDeduction}
                      </td>
                      <td className="px-4 py-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => startEdit(row)} 
                                className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Edit"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => onDelete(row.id)} 
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};
