import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import {
 Dialog,
 DialogContent,
 DialogHeader,
 DialogTitle,
 DialogTrigger,
} from "./components/ui/dialog";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

const ParkingManagement = () => {
 const [spots, setSpots] = useState([
   { id: 'A1', status: 'libre' },
   { 
     id: 'A2', 
     status: 'occupée',
     tenant: {
       name: 'Dupont Jean',
       phone: '06 10 02 03 04',
       plate: 'AB123CD',
       address: '123 Rue Example',
       email: 'jean.dupont@email.com',
       remoteId: 'REM001',
       departureDate: ''
     }
   },
   { 
     id: 'A3', 
     status: 'bientôt libre',
     tenant: {
       name: 'Martin Paul',
       phone: '06 11 22 33 44',
       plate: 'EF456GH',
       address: '456 Rue Test',
       email: 'paul.martin@email.com',
       remoteId: 'REM002',
       departureDate: '2024-12-31'
     }
   }
 ]);

 const [search, setSearch] = useState('');
 const [filter, setFilter] = useState('all');

 const formatPhoneNumber = (phone) => {
   const cleaned = phone.replace(/\s/g, '');
   return cleaned.match(/.{1,2}/g)?.join(' ') || cleaned;
 };

 const updateSpotStatus = (spotData) => {
   if (!spotData.tenant) return 'libre';
   if (spotData.tenant.departureDate) return 'bientôt libre';
   return 'occupée';
 };

 const filteredSpots = spots
   .filter(spot => {
     if (filter === 'free') return spot.status === 'libre';
     if (filter === 'occupied') return spot.status === 'occupée';
     if (filter === 'soon') return spot.status === 'bientôt libre';
     return true;
   })
   .filter(spot => {
     const searchTerm = search.toLowerCase();
     return (
       spot.id.toLowerCase().includes(searchTerm) ||
       spot.tenant?.name?.toLowerCase().includes(searchTerm) ||
       spot.tenant?.plate?.toLowerCase().includes(searchTerm) ||
       spot.tenant?.phone?.replace(/\s/g, '').includes(searchTerm.replace(/\s/g, ''))
     );
   });

 const TenantForm = ({ tenant, spotId, onSave, onDelete }) => {
   const [formData, setFormData] = useState(tenant || {
     name: '',
     phone: '',
     plate: '',
     address: '',
     email: '',
     remoteId: '',
     departureDate: ''
   });
   const [newSpotId, setNewSpotId] = useState(spotId);

   const handlePhoneChange = (e) => {
     const formattedPhone = formatPhoneNumber(e.target.value);
     setFormData({...formData, phone: formattedPhone});
   };

   return (
     <div className="space-y-4">
       <Input
         placeholder="Numéro de place"
         value={newSpotId}
         onChange={e => setNewSpotId(e.target.value)}
       />
       <Input
         placeholder="Nom"
         value={formData.name}
         onChange={e => setFormData({...formData, name: e.target.value})}
       />
       <Input
         placeholder="Téléphone"
         value={formData.phone}
         onChange={handlePhoneChange}
       />
       <Input
         placeholder="Immatriculation"
         value={formData.plate}
         onChange={e => setFormData({...formData, plate: e.target.value})}
       />
       <Input
         placeholder="Adresse"
         value={formData.address}
         onChange={e => setFormData({...formData, address: e.target.value})}
       />
       <Input
         placeholder="Email"
         value={formData.email}
         onChange={e => setFormData({...formData, email: e.target.value})}
       />
       <Input
         placeholder="N° Télécommande"
         value={formData.remoteId}
         onChange={e => setFormData({...formData, remoteId: e.target.value})}
       />
       <Input
         type="date"
         placeholder="Date de départ"
         value={formData.departureDate}
         onChange={e => setFormData({...formData, departureDate: e.target.value})}
       />
       <div className="flex justify-between">
         <Button onClick={() => {
           const spotData = { id: newSpotId, tenant: formData };
           spotData.status = updateSpotStatus(spotData);
           onSave(formData, newSpotId);
         }}>
           Enregistrer
         </Button>
         {tenant && (
           <Button 
             variant="destructive" 
             onClick={onDelete}
           >
             Supprimer
           </Button>
         )}
       </div>
     </div>
   );
 };

 return (
   <div className="max-w-2xl mx-auto p-6 space-y-4">
     <h1 className="text-2xl font-bold text-center">Gestion du Parking</h1>

     <div className="flex justify-between items-center mb-4">
       <div className="flex space-x-2">
         <Button variant={filter === 'all' ? 'default' : 'outline'} 
                 onClick={() => setFilter('all')}>
           Toutes les places
         </Button>
         <Button variant={filter === 'free' ? 'default' : 'outline'}
                 onClick={() => setFilter('free')}>
           Places libres
         </Button>
         <Button variant={filter === 'occupied' ? 'default' : 'outline'}
                 onClick={() => setFilter('occupied')}>
           Places occupées
         </Button>
         <Button variant={filter === 'soon' ? 'default' : 'outline'}
                 onClick={() => setFilter('soon')}>
           Places bientôt libres
         </Button>
       </div>
       <Dialog>
         <DialogTrigger asChild>
           <Button>
             <Plus className="h-4 w-4 mr-2" />
             Ajouter une place
           </Button>
         </DialogTrigger>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>Nouvelle place</DialogTitle>
           </DialogHeader>
           <TenantForm
             onSave={(formData, newSpotId) => {
               const spotData = { id: newSpotId, tenant: formData };
               spotData.status = updateSpotStatus(spotData);
               setSpots([...spots, spotData]);
             }}
           />
         </DialogContent>
       </Dialog>
     </div>

     <div className="relative">
       <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
       <Input
         className="pl-10"
         placeholder="Rechercher un locataire..."
         value={search}
         onChange={e => setSearch(e.target.value)}
       />
     </div>

     <div className="space-y-2">
       {filteredSpots.map(spot => (
         <Dialog key={spot.id}>
           <DialogTrigger asChild>
             <div className={`p-4 rounded-lg cursor-pointer ${
               spot.status === 'libre' ? 'bg-green-100' :
               spot.status === 'occupée' ? 'bg-red-100' : 'bg-orange-100'
             }`}>
               <div className="flex justify-between items-center">
                 <div>
                   <h3 className="font-semibold">Place {spot.id}</h3>
                   <p className="text-sm text-gray-600">{spot.status}</p>
                   {spot.tenant && (
                     <div className="mt-1">
                       <p>{spot.tenant.name}</p>
                       <p className="text-sm">{spot.tenant.plate} - {spot.tenant.phone}</p>
                       {spot.tenant.departureDate && (
                         <p className="text-sm text-gray-600">Départ prévu : {spot.tenant.departureDate}</p>
                       )}
                     </div>
                   )}
                 </div>
                 <Button variant="secondary">Modifier</Button>
               </div>
             </div>
           </DialogTrigger>
           <DialogContent>
             <DialogHeader>
               <DialogTitle>Place {spot.id}</DialogTitle>
             </DialogHeader>
             <TenantForm
               tenant={spot.tenant}
               spotId={spot.id}
               onSave={(formData, newSpotId) => {
                 const spotData = { id: newSpotId, tenant: formData };
                 spotData.status = updateSpotStatus(spotData);
                 setSpots(spots.map(s => s.id === spot.id ? spotData : s));
               }}
               onDelete={() => {
                 setSpots(spots.map(s =>
                   s.id === spot.id
                     ? { ...s, tenant: null, status: 'libre' }
                     : s
                 ));
               }}
             />
           </DialogContent>
         </Dialog>
       ))}
     </div>
   </div>
 );
};

export default ParkingManagement;