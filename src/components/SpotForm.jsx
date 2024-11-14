import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { X } from 'lucide-react';

const SpotForm = ({ spot, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    id: spot?.id || '',
    tenant: spot?.tenant || '',
    startDate: spot?.startDate || '',
    endDate: spot?.endDate || '',
    email: spot?.email || '',
    phone: spot?.phone || '',
    isIndefinite: spot?.isIndefinite || false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      tenant: formData.tenant.trim() || null,
      startDate: formData.tenant ? formData.startDate : null,
      endDate: formData.isIndefinite ? null : formData.endDate,
      email: formData.email.trim() || null,
      phone: formData.phone.trim() || null,
      isIndefinite: formData.tenant ? formData.isIndefinite : false
    });
  };

  return (
    <Card className="relative bg-slate-800 text-white">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 text-gray-300 hover:text-gray-100"
      >
        <X className="h-6 w-6" />
      </button>
      <CardHeader>
        <CardTitle>
          {spot ? 'Modifier la place' : 'Créer une nouvelle place'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Numéro de place</label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded bg-slate-700 text-white border-slate-600 focus:ring-2 focus:ring-blue-500"
                value={formData.id}
                onChange={(e) => setFormData({...formData, id: e.target.value})}
                readOnly={!!spot}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Nom du locataire</label>
              <input
                type="text"
                className="w-full p-2 border rounded bg-slate-700 text-white border-slate-600 focus:ring-2 focus:ring-blue-500"
                value={formData.tenant}
                onChange={(e) => setFormData({...formData, tenant: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full p-2 border rounded bg-slate-700 text-white border-slate-600 focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                disabled={!formData.tenant}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Téléphone</label>
              <input
                type="tel"
                className="w-full p-2 border rounded bg-slate-700 text-white border-slate-600 focus:ring-2 focus:ring-blue-500"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                disabled={!formData.tenant}
                pattern="[0-9]{10}"
                title="Veuillez entrer un numéro à 10 chiffres"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date de début</label>
              <input
                type="date"
                className="w-full p-2 border rounded bg-slate-700 text-white border-slate-600 focus:ring-2 focus:ring-blue-500"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                disabled={!formData.tenant}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isIndefinite"
                  checked={formData.isIndefinite}
                  onChange={(e) => setFormData({...formData, isIndefinite: e.target.checked})}
                  className="rounded border-gray-300"
                  disabled={!formData.tenant}
                />
                <label htmlFor="isIndefinite" className="text-sm font-medium">
                  Bail à durée indéterminée
                </label>
              </div>

              {!formData.isIndefinite && (
                <div>
                  <label className="block text-sm font-medium mb-1">Date de fin</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded bg-slate-700 text-white border-slate-600 focus:ring-2 focus:ring-blue-500"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    disabled={!formData.tenant}
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-600 rounded hover:bg-slate-700"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={formData.tenant && (!formData.email || !formData.phone || !formData.startDate)}
            >
              {spot ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SpotForm;