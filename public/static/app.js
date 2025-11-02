// Configuration
const API_URL = '';
let currentUser = null;
let authToken = null;

// ==================== UTILITIES ====================

function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
    type === 'success' ? 'bg-green-500' : 'bg-red-500'
  } text-white`;
  notification.innerHTML = `
    <div class="flex items-center gap-2">
      <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
      <span>${message}</span>
    </div>
  `;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

function formatDate(dateString) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
}

function formatTime(timeString) {
  return timeString.substring(0, 5);
}

// ==================== AUTH ====================

function saveAuth(token, user) {
  authToken = token;
  currentUser = user;
  localStorage.setItem('authToken', token);
  localStorage.setItem('currentUser', JSON.stringify(user));
}

function loadAuth() {
  authToken = localStorage.getItem('authToken');
  const userStr = localStorage.getItem('currentUser');
  if (userStr) {
    currentUser = JSON.parse(userStr);
  }
}

function logout() {
  authToken = null;
  currentUser = null;
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
  renderLoginPage();
}

// ==================== API CALLS ====================

async function apiCall(endpoint, method = 'GET', data = null) {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (authToken) {
    config.headers['Authorization'] = `Bearer ${authToken}`;
  }

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await axios({
      url: API_URL + endpoint,
      method,
      headers: config.headers,
      data
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Erreur lors de la requête');
    }
    throw error;
  }
}

// ==================== LOGIN PAGE ====================

function renderLoginPage() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div class="text-center mb-8">
          <i class="fas fa-hands-helping text-6xl text-indigo-600 mb-4"></i>
          <h1 class="text-3xl font-bold text-gray-800">Thérapie Sensori-Motrice</h1>
          <p class="text-gray-600 mt-2">Réservation de rendez-vous</p>
        </div>

        <div class="mb-6 flex gap-2">
          <button onclick="showLoginForm()" id="loginTab" class="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg font-medium">
            Connexion
          </button>
          <button onclick="showRegisterForm()" id="registerTab" class="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium">
            Inscription
          </button>
        </div>

        <div id="authForm">
          <!-- Form will be inserted here -->
        </div>
      </div>
    </div>
  `;
  showLoginForm();
}

window.showLoginForm = function() {
  document.getElementById('loginTab').className = 'flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg font-medium';
  document.getElementById('registerTab').className = 'flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium';
  
  document.getElementById('authForm').innerHTML = `
    <form onsubmit="handleLogin(event)" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input type="email" name="email" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
        <input type="password" name="password" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
      </div>
      <button type="submit" class="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition">
        <i class="fas fa-sign-in-alt mr-2"></i>Se connecter
      </button>
    </form>
    <div class="mt-4 p-4 bg-blue-50 rounded-lg text-sm">
      <p class="font-medium text-gray-700 mb-2">Comptes de test :</p>
      <p class="text-gray-600"><strong>Thérapeute:</strong> therapist@example.com / therapist123</p>
      <p class="text-gray-600"><strong>Patient:</strong> patient1@example.com / patient123</p>
    </div>
  `;
}

window.showRegisterForm = function() {
  document.getElementById('loginTab').className = 'flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium';
  document.getElementById('registerTab').className = 'flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg font-medium';
  
  document.getElementById('authForm').innerHTML = `
    <form onsubmit="handleRegister(event)" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
          <input type="text" name="prenom" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
          <input type="text" name="nom" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input type="email" name="email" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
        <input type="tel" name="telephone" placeholder="0601020304" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
        <input type="password" name="password" required minlength="6" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Je suis</label>
        <select name="role" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
          <option value="patient">Patient</option>
          <option value="therapist">Thérapeute</option>
        </select>
      </div>
      <button type="submit" class="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition">
        <i class="fas fa-user-plus mr-2"></i>S'inscrire
      </button>
    </form>
  `;
}

window.handleLogin = async function(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = {
    email: formData.get('email'),
    password: formData.get('password')
  };

  try {
    const response = await apiCall('/api/auth/login', 'POST', data);
    saveAuth(response.token, response.user);
    showNotification('Connexion réussie !');
    renderDashboard();
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

window.handleRegister = async function(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
    nom: formData.get('nom'),
    prenom: formData.get('prenom'),
    telephone: formData.get('telephone'),
    role: formData.get('role')
  };

  try {
    await apiCall('/api/auth/register', 'POST', data);
    showNotification('Inscription réussie ! Vous pouvez maintenant vous connecter.');
    showLoginForm();
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

// ==================== DASHBOARD ====================

function renderDashboard() {
  if (currentUser.role === 'therapist') {
    renderTherapistDashboard();
  } else {
    renderPatientDashboard();
  }
}

// ==================== THERAPIST DASHBOARD ====================

async function renderTherapistDashboard() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav class="bg-white shadow-lg">
        <div class="container mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <i class="fas fa-user-md text-3xl text-indigo-600"></i>
              <div>
                <h1 class="text-xl font-bold text-gray-800">Dr. ${currentUser.prenom} ${currentUser.nom}</h1>
                <p class="text-sm text-gray-600">Espace Thérapeute</p>
              </div>
            </div>
            <button onclick="logout()" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
              <i class="fas fa-sign-out-alt mr-2"></i>Déconnexion
            </button>
          </div>
        </div>
      </nav>

      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Créer des créneaux -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">
              <i class="fas fa-calendar-plus text-indigo-600 mr-2"></i>Créer des créneaux
            </h2>
            <form onsubmit="createSlot(event)" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" name="date" required min="${new Date().toISOString().split('T')[0]}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Heure début</label>
                  <input type="time" name="start_time" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Heure fin</label>
                  <input type="time" name="end_time" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                </div>
              </div>
              <button type="submit" class="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition">
                <i class="fas fa-plus mr-2"></i>Ajouter le créneau
              </button>
            </form>
          </div>

          <!-- Mes rendez-vous -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">
              <i class="fas fa-calendar-check text-green-600 mr-2"></i>Mes rendez-vous
            </h2>
            <div id="therapistAppointments" class="space-y-3">
              <div class="text-center py-8">
                <i class="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Mes créneaux -->
        <div class="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">
            <i class="fas fa-clock text-blue-600 mr-2"></i>Mes créneaux disponibles
          </h2>
          <div id="therapistSlots" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="text-center py-8 col-span-full">
              <i class="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  loadTherapistData();
}

async function loadTherapistData() {
  try {
    // Charger les rendez-vous
    const appointmentsData = await apiCall('/api/appointments/therapist');
    const appointmentsDiv = document.getElementById('therapistAppointments');
    
    if (appointmentsData.appointments.length === 0) {
      appointmentsDiv.innerHTML = '<p class="text-center text-gray-500 py-4">Aucun rendez-vous</p>';
    } else {
      appointmentsDiv.innerHTML = appointmentsData.appointments
        .filter(apt => apt.status === 'confirmed')
        .map(apt => `
          <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <div class="flex justify-between items-start">
              <div>
                <p class="font-bold text-gray-800">${apt.patient_prenom} ${apt.patient_nom}</p>
                <p class="text-sm text-gray-600"><i class="fas fa-calendar mr-1"></i>${formatDate(apt.date)}</p>
                <p class="text-sm text-gray-600"><i class="fas fa-clock mr-1"></i>${formatTime(apt.start_time)} - ${formatTime(apt.end_time)}</p>
                <p class="text-sm text-gray-600"><i class="fas fa-phone mr-1"></i>${apt.patient_telephone || 'Non renseigné'}</p>
                <p class="text-sm text-gray-600"><i class="fas fa-envelope mr-1"></i>${apt.patient_email}</p>
              </div>
              <button onclick="cancelAppointment(${apt.id})" class="text-red-500 hover:text-red-700">
                <i class="fas fa-times-circle"></i>
              </button>
            </div>
          </div>
        `).join('');
    }

    // Charger les créneaux
    const slotsData = await apiCall('/api/slots/therapist');
    const slotsDiv = document.getElementById('therapistSlots');
    
    const availableSlots = slotsData.slots.filter(slot => slot.status === 'available');
    
    if (availableSlots.length === 0) {
      slotsDiv.innerHTML = '<p class="text-center text-gray-500 py-4 col-span-full">Aucun créneau disponible</p>';
    } else {
      slotsDiv.innerHTML = availableSlots.map(slot => `
        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
          <div class="flex justify-between items-start mb-2">
            <div>
              <p class="font-medium text-gray-800">${formatDate(slot.date)}</p>
              <p class="text-lg font-bold text-indigo-600">${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}</p>
            </div>
            <button onclick="deleteSlot(${slot.id})" class="text-red-500 hover:text-red-700">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `).join('');
    }
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

window.createSlot = async function(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = {
    date: formData.get('date'),
    start_time: formData.get('start_time'),
    end_time: formData.get('end_time')
  };

  try {
    await apiCall('/api/slots', 'POST', data);
    showNotification('Créneau créé avec succès !');
    e.target.reset();
    loadTherapistData();
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

window.deleteSlot = async function(slotId) {
  if (!confirm('Voulez-vous vraiment supprimer ce créneau ?')) return;

  try {
    await apiCall(`/api/slots/${slotId}`, 'DELETE');
    showNotification('Créneau supprimé');
    loadTherapistData();
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

// ==================== PATIENT DASHBOARD ====================

async function renderPatientDashboard() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav class="bg-white shadow-lg">
        <div class="container mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <i class="fas fa-user text-3xl text-indigo-600"></i>
              <div>
                <h1 class="text-xl font-bold text-gray-800">${currentUser.prenom} ${currentUser.nom}</h1>
                <p class="text-sm text-gray-600">Espace Patient</p>
              </div>
            </div>
            <button onclick="logout()" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
              <i class="fas fa-sign-out-alt mr-2"></i>Déconnexion
            </button>
          </div>
        </div>
      </nav>

      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Mes rendez-vous -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">
              <i class="fas fa-calendar-check text-green-600 mr-2"></i>Mes rendez-vous
            </h2>
            <div id="patientAppointments" class="space-y-3">
              <div class="text-center py-8">
                <i class="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
              </div>
            </div>
          </div>

          <!-- Créneaux disponibles -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">
              <i class="fas fa-clock text-blue-600 mr-2"></i>Créneaux disponibles
            </h2>
            <div id="availableSlots" class="space-y-3 max-h-[600px] overflow-y-auto">
              <div class="text-center py-8">
                <i class="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  loadPatientData();
}

async function loadPatientData() {
  try {
    // Charger les rendez-vous du patient
    const appointmentsData = await apiCall('/api/appointments/patient');
    const appointmentsDiv = document.getElementById('patientAppointments');
    
    const confirmedAppointments = appointmentsData.appointments.filter(apt => apt.status === 'confirmed');
    
    if (confirmedAppointments.length === 0) {
      appointmentsDiv.innerHTML = '<p class="text-center text-gray-500 py-4">Aucun rendez-vous</p>';
    } else {
      appointmentsDiv.innerHTML = confirmedAppointments.map(apt => `
        <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
          <div class="flex justify-between items-start">
            <div>
              <p class="font-bold text-gray-800">Dr. ${apt.therapist_prenom} ${apt.therapist_nom}</p>
              <p class="text-sm text-gray-600"><i class="fas fa-calendar mr-1"></i>${formatDate(apt.date)}</p>
              <p class="text-sm text-gray-600"><i class="fas fa-clock mr-1"></i>${formatTime(apt.start_time)} - ${formatTime(apt.end_time)}</p>
              <p class="text-sm text-gray-600"><i class="fas fa-phone mr-1"></i>${apt.therapist_telephone || 'Non renseigné'}</p>
            </div>
            <button onclick="cancelAppointment(${apt.id})" class="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition">
              Annuler
            </button>
          </div>
        </div>
      `).join('');
    }

    // Charger les créneaux disponibles
    const slotsData = await apiCall('/api/slots/available');
    const slotsDiv = document.getElementById('availableSlots');
    
    if (slotsData.slots.length === 0) {
      slotsDiv.innerHTML = '<p class="text-center text-gray-500 py-4">Aucun créneau disponible</p>';
    } else {
      // Grouper les créneaux par date
      const slotsByDate = {};
      slotsData.slots.forEach(slot => {
        if (!slotsByDate[slot.date]) {
          slotsByDate[slot.date] = [];
        }
        slotsByDate[slot.date].push(slot);
      });

      slotsDiv.innerHTML = Object.keys(slotsByDate).sort().map(date => `
        <div class="mb-4">
          <h3 class="font-bold text-lg text-gray-800 mb-2">${formatDate(date)}</h3>
          <div class="space-y-2">
            ${slotsByDate[date].map(slot => `
              <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200 flex justify-between items-center">
                <div>
                  <p class="font-medium text-gray-800">Dr. ${slot.prenom} ${slot.nom}</p>
                  <p class="text-sm text-indigo-600 font-bold">${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}</p>
                </div>
                <button onclick="bookAppointment(${slot.id})" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm">
                  <i class="fas fa-calendar-plus mr-1"></i>Réserver
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('');
    }
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

window.bookAppointment = async function(slotId) {
  if (!confirm('Voulez-vous réserver ce créneau ?')) return;

  try {
    await apiCall('/api/appointments', 'POST', { slot_id: slotId });
    showNotification('Rendez-vous confirmé !');
    loadPatientData();
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

window.cancelAppointment = async function(appointmentId) {
  if (!confirm('Voulez-vous annuler ce rendez-vous ?')) return;

  try {
    await apiCall(`/api/appointments/${appointmentId}`, 'DELETE');
    showNotification('Rendez-vous annulé');
    if (currentUser.role === 'therapist') {
      loadTherapistData();
    } else {
      loadPatientData();
    }
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

// ==================== INITIALIZATION ====================

function init() {
  loadAuth();
  if (authToken && currentUser) {
    renderDashboard();
  } else {
    renderLoginPage();
  }
}

// Start the app
init();
