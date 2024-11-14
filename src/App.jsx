import React, { useState, useEffect } from 'react';
import SpotForm from './components/SpotForm';

function App() {
  const [spots, setSpots] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingSpot, setEditingSpot] = useState(null);

  useEffect(() => {
    const savedSpots = localStorage.getItem('parkingSpots');
    if (savedSpots) {
      setSpots(JSON.parse(savedSpots));
    }
  }, []);

  // Fonction pour créer/modifier une place
  const handleSpotSubmit = (data) => {
    if (editingSpot) {
      const newSpots = spots.map(spot => 
        spot.id === editingSpot.id ? data : spot
      );
      setSpots(newSpots);
      localStorage.setItem('parkingSpots', JSON.stringify(newSpots));
    } else {
      if (spots.some(spot => spot.id === data.id)) {
        alert('Ce numéro de place existe déjà.');
        return;
      }
      const newSpots = [...spots, data];
      setSpots(newSpots);
      localStorage.setItem('parkingSpots', JSON.stringify(newSpots));
    }
    setShowForm(false);
    setEditingSpot(null);
  };

  const handleDelete = (spotId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette place ?')) {
      const newSpots = spots.filter(spot => spot.id !== spotId);
      setSpots(newSpots);
      localStorage.setItem('parkingSpots', JSON.stringify(newSpots));
    }
  };

  const handleFreeSpot = (spotId) => {
    if (window.confirm('Êtes-vous sûr de vouloir libérer cette place ?')) {
      const newSpots = spots.map(spot => 
        spot.id === spotId ? {
          ...spot,
          tenant: null,
          startDate: null,
          endDate: null,
          email: null,
          phone: null,
          isIndefinite: false
        } : spot
      );
      setSpots(newSpots);
      localStorage.setItem('parkingSpots', JSON.stringify(newSpots));
    }
  };

  // Fonction pour ouvrir le formulaire en mode édition
  const handleEdit = (spot) => {
    setEditingSpot(spot);
    setShowForm(true);
  };

  // Fonction pour ouvrir le formulaire en mode création
  const handleAdd = () => {
    setEditingSpot(null);
    setShowForm(true);
  };

  // Filtrage des places
  const filteredSpots = spots.filter(spot => {
    const matchesSearch = !searchQuery || (
      spot.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (spot.tenant && spot.tenant.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (spot.email && spot.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (spot.phone && spot.phone.includes(searchQuery))
    );

    const matchesStatus = 
      statusFilter === 'all' ? true :
      statusFilter === 'occupied' ? spot.tenant !== null :
      statusFilter === 'available' ? spot.tenant === null :
      true;

    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ 
      minHeight: '100vh',
      padding: '1rem',
      maxWidth: '72rem',
      margin: '0 auto',
      color: 'white'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div className="card">
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Places totales</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{spots.length}</p>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Places occupées</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{spots.filter(spot => spot.tenant).length}</p>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Places disponibles</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{spots.filter(spot => !spot.tenant).length}</p>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        flexDirection: 'column'
      }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            placeholder="Rechercher par n° de place, locataire, email ou téléphone..."
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '0.375rem',
              backgroundColor: 'rgb(30 41 59)',
              border: '1px solid rgb(51 65 85)',
              color: 'white'
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            style={{
              padding: '0.5rem',
              borderRadius: '0.375rem',
              backgroundColor: 'rgb(30 41 59)',
              border: '1px solid rgb(51 65 85)',
              color: 'white'
            }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="occupied">Occupées</option>
            <option value="available">Disponibles</option>
          </select>
        </div>

        <button
          onClick={handleAdd}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: 'rgb(37 99 235)',
            color: 'white',
            borderRadius: '0.375rem',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          + Nouvelle place
        </button>
      </div>

      {showForm && (
        <SpotForm
          spot={editingSpot}
          onSubmit={handleSpotSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingSpot(null);
          }}
        />
      )}

      <div className="card">
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Places de parking ({filteredSpots.length})
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgb(51 65 85)' }}>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>N° Place</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Statut</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Locataire</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Contact</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Période</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSpots.map((spot) => (
                <tr 
                  key={spot.id} 
                  style={{ 
                    borderBottom: '1px solid rgb(51 65 85)'
                  }}
                >
                  <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>{spot.id}</td>
                  <td style={{ padding: '0.5rem' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      backgroundColor: spot.tenant ? 'rgb(127 29 29)' : 'rgb(22 101 52)',
                      color: 'white',
                      fontSize: '0.875rem'
                    }}>
                      {spot.tenant ? 'Occupé' : 'Disponible'}
                    </span>
                  </td>
                  <td style={{ padding: '0.5rem' }}>{spot.tenant || '-'}</td>
                  <td style={{ padding: '0.5rem' }}>
                    {spot.tenant ? (
                      <div style={{ fontSize: '0.875rem' }}>
                        <div>{spot.email}</div>
                        <div>{spot.phone}</div>
                      </div>
                    ) : '-'}
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    {spot.startDate ? (
                      <div style={{ fontSize: '0.875rem' }}>
                        <div>Début : {new Date(spot.startDate).toLocaleDateString('fr-FR')}</div>
                        <div>
                          {spot.isIndefinite ? 
                            'Durée indéterminée' : 
                            `Fin : ${spot.endDate ? new Date(spot.endDate).toLocaleDateString('fr-FR') : '-'}`
                          }
                        </div>
                      </div>
                    ) : '-'}
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleEdit(spot)}
                        title="Modifier"
                        style={{
                          padding: '0.25rem',
                          color: 'rgb(37 99 235)',
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        ✏️
                      </button>
                      {spot.tenant && (
                        <button
                          onClick={() => handleFreeSpot(spot.id)}
                          title="Libérer la place"
                          style={{
                            padding: '0.25rem',
                            color: 'rgb(234 88 12)',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          ❌
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(spot.id)}
                        title="Supprimer"
                        style={{
                          padding: '0.25rem',
                          color: 'rgb(220 38 38)',
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;