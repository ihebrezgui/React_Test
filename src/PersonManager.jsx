import React, { useState, useEffect } from 'react';
import { User, Plus, Clock, Gift, UserPlus, Trash2 } from 'lucide-react';

const PersonManager = () => {
 const [people, setPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [newPersonName, setNewPersonName] = useState('');
  const [subCount, setSubCount] = useState(1);
  const [donationCount, setDonationCount] = useState(1);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => {
          if (timer <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return timer - 1;
        });
      }, 1000);
    } else if (!isTimerRunning) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const addPerson = () => {
    if (newPersonName.trim() !== '') {
      const newPerson = {
        id: Date.now(),
        name: newPersonName,
        subscriptions: 0,
        donations: 0,
        totalActions: 0
      };
      setPeople([...people, newPerson]);
      setNewPersonName('');
    }
  };

  const deletePerson = (id) => {
    setPeople(people.filter(person => person.id !== id));
    if (selectedPerson && selectedPerson.id === id) {
      setSelectedPerson(null);
    }
  };

  const selectPerson = (person) => {
    setSelectedPerson(person);
  };

  const addSubscription = () => {
    if (selectedPerson) {
      const updatedPeople = people.map(person =>
        person.id === selectedPerson.id
          ? {
              ...person,
              subscriptions: person.subscriptions + subCount,
              totalActions: person.totalActions + subCount
            }
          : person
      );
      setPeople(updatedPeople);
      setSelectedPerson({
        ...selectedPerson,
        subscriptions: selectedPerson.subscriptions + subCount,
        totalActions: selectedPerson.totalActions + subCount
      });
    }
  };

  const addDonation = () => {
    if (selectedPerson) {
      const updatedPeople = people.map(person =>
        person.id === selectedPerson.id
          ? {
              ...person,
              donations: person.donations + donationCount,
              totalActions: person.totalActions + donationCount
            }
          : person
      );
      setPeople(updatedPeople);
      setSelectedPerson({
        ...selectedPerson,
        donations: selectedPerson.donations + donationCount,
        totalActions: selectedPerson.totalActions + donationCount
      });
    }
  };

  const startTimer = (seconds) => {
    setTimer(seconds);
    setIsTimerRunning(true);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    setTimer(0);
  };

  const addTime = () => {
    setTimer(timer + 30);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="app-container">
      <div className="app-content">
        <h1 className="app-title">
          <User className="title-icon" />
          Gestionnaire de Personnes
        </h1>

        <div className="main-grid">
          {/* Section d'ajout de personne */}
          <div className="card">
            <h2 className="card-title">
              <Plus className="section-icon" />
              Ajouter une Personne
            </h2>
            <div className="input-group">
              <input
                type="text"
                value={newPersonName}
                onChange={(e) => setNewPersonName(e.target.value)}
                placeholder="Nom de la personne"
                className="person-input"
                onKeyPress={(e) => e.key === 'Enter' && addPerson()}
              />
              <button
                onClick={addPerson}
                className="btn btn-add"
              >
                Ajouter
              </button>
            </div>
          </div>

          {/* Timer Section */}
          <div className="card">
            <h2 className="card-title">
              <Clock className="section-icon" />
              Timer
            </h2>
            <div className="timer-section">
              <div className="timer-display">
                {formatTime(timer)}
              </div>
              <div className="timer-controls">
                <button
                  onClick={() => startTimer(30)}
                  className="btn btn-timer"
                >
                  30s
                </button>
                <button
                  onClick={addTime}
                  className="btn btn-add-time"
                >
                  +30s
                </button>
                {isTimerRunning ? (
                  <button
                    onClick={() => setIsTimerRunning(false)}
                    className="btn btn-pause"
                  >
                    Pause
                  </button>
                ) : (
                  timer > 0 && (
                    <button
                      onClick={() => setIsTimerRunning(true)}
                      className="btn btn-start"
                    >
                      Start
                    </button>
                  )
                )}
                <button
                  onClick={stopTimer}
                  className="btn btn-reset"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des personnes */}
        <div className="card people-list">
          <h2 className="card-title">Liste des Personnes</h2>
          {people.length === 0 ? (
            <p className="empty-message">Aucune personne ajoutée</p>
          ) : (
            <div className="people-grid">
              {people.map(person => (
                <div
                  key={person.id}
                  onClick={() => selectPerson(person)}
                  className={`person-item ${
                    selectedPerson && selectedPerson.id === person.id
                      ? 'person-item-selected'
                      : ''
                  }`}
                >
                  <div className="person-info">
                    <div className="person-name-section">
                      <User className="person-icon" size={20} />
                      <span className="person-name">{person.name}</span>
                    </div>
                    <div className="person-stats">
                      <span className="stat-sub">
                        Sub: {person.subscriptions} (€{(person.subscriptions * 3.2).toFixed(1)})
                      </span>
                      <span className="stat-don">Don: {person.donations}</span>
                      <span className="stat-total">Total: {person.totalActions}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePerson(person.id);
                        }}
                        className="delete-btn"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions pour la personne sélectionnée */}
        {selectedPerson && (
          <div className="card actions-section">
            <h2 className="card-title">
              Actions pour: <span className="selected-person-name">{selectedPerson.name}</span>
            </h2>
            
            {/* Champs de saisie */}
            <div className="action-inputs">
              <div className="input-card">
                <label className="input-label">Nombre de Subscriptions</label>
                <input
                  type="number"
                  value={subCount}
                  onChange={(e) => setSubCount(parseInt(e.target.value) || 1)}
                  min="1"
                  className="number-input"
                />
                <p className="value-display">Valeur: €{(subCount * 3.2).toFixed(1)}</p>
              </div>
              
              <div className="input-card">
                <label className="input-label">Nombre de Donations</label>
                <input
                  type="number"
                  value={donationCount}
                  onChange={(e) => setDonationCount(parseInt(e.target.value) || 1)}
                  min="1"
                  className="number-input"
                />
              </div>
            </div>
            
            <div className="action-buttons">
              <button
                onClick={addSubscription}
                className="btn btn-subscription"
              >
                <UserPlus size={20} />
                Ajouter {subCount} Subscription{subCount > 1 ? 's' : ''}
              </button>
              <button
                onClick={addDonation}
                className="btn btn-donation"
              >
                <Gift size={20} />
                Ajouter {donationCount} Donation{donationCount > 1 ? 's' : ''}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};




export default PersonManager;
