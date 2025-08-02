// Global variables
let currentUser = null;
const API_BASE_URL = 'http://localhost:5000';

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    // Check for saved user session
    const savedUser = localStorage.getItem('guardianUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForLoggedInUser();
    }
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
}

function setupEventListeners() {
    // Forms
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const contactForm = document.getElementById('contactForm');
    
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
    if (contactForm) contactForm.addEventListener('submit', handleContactForm);
    
    // Modal clicks
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });
    
    // Navigation active state
    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink);
}

// Authentication Functions
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.classList.add('active');
}

function showRegisterModal() {
    const modal = document.getElementById('registerModal');
    if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

function switchToRegister() {
    closeModal('loginModal');
    showRegisterModal();
}

function switchToLogin() {
    closeModal('registerModal');
    showLoginModal();
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            currentUser = result.user;
            localStorage.setItem('guardianUser', JSON.stringify(currentUser));
            updateUIForLoggedInUser();
            closeModal('loginModal');
            showNotification(`Welcome back, ${currentUser.name}!`, 'success');
        } else {
            showNotification(result.message || 'Login failed', 'error');
        }
    } catch (error) {
        showNotification('Unable to connect to server', 'error');
        console.error('Login error:', error);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    
    if (!name || !email || !phone || !password || password.length < 6) {
        showNotification('Please fill all fields correctly (password min 6 chars)', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, phone })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            currentUser = result.user;
            localStorage.setItem('guardianUser', JSON.stringify(currentUser));
            updateUIForLoggedInUser();
            closeModal('registerModal');
            showNotification(`Welcome to Guardian Shield, ${currentUser.name}!`, 'success');
        } else {
            showNotification(result.message || 'Registration failed', 'error');
        }
    } catch (error) {
        showNotification('Unable to connect to server', 'error');
        console.error('Register error:', error);
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('guardianUser');
    updateUIForLoggedOutUser();
    showNotification('Logged out successfully', 'success');
}

function updateUIForLoggedInUser() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const userProfile = document.getElementById('userProfile');
    const userName = document.getElementById('userName');
    
    if (loginBtn) loginBtn.style.display = 'none';
    if (registerBtn) registerBtn.style.display = 'none';
    if (userProfile) userProfile.style.display = 'flex';
    if (userName) userName.textContent = currentUser.name;
}

function updateUIForLoggedOutUser() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const userProfile = document.getElementById('userProfile');
    
    if (loginBtn) loginBtn.style.display = 'flex';
    if (registerBtn) registerBtn.style.display = 'flex';
    if (userProfile) userProfile.style.display = 'none';
}

// Emergency Functions
function toggleEmergencyPanel() {
    const menu = document.querySelector('.emergency-menu');
    if (menu) menu.classList.toggle('active');
}

async function sendSOSAlert() {
    if (!currentUser) {
        showNotification('Please login to use emergency features', 'warning');
        showLoginModal();
        return;
    }
    
    if (!navigator.geolocation) {
        showNotification('Geolocation not supported by your browser', 'error');
        return;
    }
    
    showNotification('Getting your location for SOS alert...', 'warning');
    
    navigator.geolocation.getCurrentPosition(async (position) => {
        const locationData = {
            userId: currentUser._id,
            location: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                address: "Current Location"
            },
            message: "🚨 EMERGENCY! I need immediate help!"
        };
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/emergency/sos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(locationData)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                showNotification(`SOS Alert Sent! ${result.contactsNotified} contacts notified`, 'success');
                await updateUserLocation(position.coords.latitude, position.coords.longitude, "Emergency Location");
            } else {
                showNotification('Failed to send SOS: ' + result.message, 'error');
            }
        } catch (error) {
            showNotification('SOS Error: Please call 911 directly', 'error');
            console.error('SOS Error:', error);
        }
    }, (error) => {
        showNotification('Location access denied. Enable location for emergency features.', 'error');
    });
}

async function shareLocation() {
    if (!currentUser) {
        showNotification('Please login to share location', 'warning');
        showLoginModal();
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/location/share`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: currentUser._id,
                message: "Sharing my location for safety"
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showNotification(`Location shared with ${result.contactsNotified} contacts`, 'success');
        } else {
            showNotification('Failed to share location: ' + result.message, 'error');
        }
    } catch (error) {
        showNotification('Location sharing error', 'error');
        console.error('Location sharing error:', error);
    }
}

async function getSafeRoutes() {
    const from = prompt('🗺️ Enter starting location (e.g., Bangalore):');
    const to = prompt('🎯 Enter destination (e.g., Kerala):');
    
    if (!from || !to) {
        showNotification('Please enter both locations', 'warning');
        return;
    }
    
    // Show loading notification
    showNotification('🤖 AI is calculating the safest routes for you...', 'info');
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/location/safe-routes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ from, to, preferences: 'safest' })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showNotification(`✅ Found ${result.routes.length} safe routes`, 'success');
            displayRouteModal(result);
        } else {
            showNotification('❌ Route calculation failed', 'error');
        }
    } catch (error) {
        showNotification('❌ Unable to calculate routes', 'error');
        console.error('Route error:', error);
    }
}

function displayRouteModal(routeData) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.route-modal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.className = 'route-modal';
    modal.innerHTML = `
        <div class="route-modal-content">
            <div class="route-modal-header">
                <h3>🛣️ Safe Routes: ${routeData.from} → ${routeData.to}</h3>
                <button class="route-modal-close" onclick="this.closest('.route-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="route-modal-body">
                ${routeData.routes.map((route, index) => `
                    <div class="route-card">
                        <div class="route-header">
                            <h4>${route.name}</h4>
                            <div class="safety-badge safety-${Math.floor(route.safety_score || 8)}">
                                🛡️ ${route.safety_score || '8.0'}/10
                            </div>
                        </div>
                        <div class="route-details">
                            <div class="route-info">
                                <span class="route-distance">📏 ${route.distance}</span>
                                <span class="route-time">⏱️ ${route.estimated_time}</span>
                            </div>
                            <div class="route-description">
                                <strong>Route:</strong> ${route.route_description || route.route || 'Highway route'}
                            </div>
                            <div class="route-features">
                                <strong>Safety Features:</strong>
                                <div class="feature-tags">
                                    ${(route.features || ['Well-lit roads', 'Police checkpoints']).map(feature => 
                                        `<span class="feature-tag">${feature}</span>`
                                    ).join('')}
                                </div>
                            </div>
                            ${route.landmarks ? `
                                <div class="route-landmarks">
                                    <strong>Key Landmarks:</strong> ${route.landmarks.join(', ')}
                                </div>
                            ` : ''}
                            ${route.safety_notes ? `
                                <div class="route-notes">
                                    <strong>Safety Notes:</strong> ${route.safety_notes}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="route-modal-footer">
                <small>${routeData.powered_by || 'Powered by Guardian Shield AI'}</small>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listener for closing modal
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

async function checkLocationSafety() {
    if (!navigator.geolocation) {
        showNotification('❌ Geolocation not supported', 'error');
        return;
    }
    
    showNotification('🤖 AI is analyzing location safety...', 'info');
    
    navigator.geolocation.getCurrentPosition(async (position) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/location/safety-check`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    address: "Current Location"
                })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                displaySafetyModal(result);
            } else {
                showNotification('❌ Safety check failed', 'error');
            }
        } catch (error) {
            showNotification('❌ Safety analysis error', 'error');
            console.error('Safety check error:', error);
        }
    }, () => {
        showNotification('❌ Location access required for safety check', 'error');
    });
}

function displaySafetyModal(safetyData) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.safety-modal');
    if (existingModal) existingModal.remove();
    
    const safetyEmoji = safetyData.isSafeZone ? '✅' : '⚠️';
    const safetyText = safetyData.isSafeZone ? 'SAFE ZONE' : 'CAUTION NEEDED';
    const safetyClass = safetyData.isSafeZone ? 'safe' : 'caution';
    
    const modal = document.createElement('div');
    modal.className = 'safety-modal';
    modal.innerHTML = `
        <div class="safety-modal-content">
            <div class="safety-modal-header">
                <h3>🛡️ Location Safety Analysis</h3>
                <button class="safety-modal-close" onclick="this.closest('.safety-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="safety-modal-body">
                <div class="safety-status ${safetyClass}">
                    <div class="safety-indicator">
                        ${safetyEmoji}
                        <h4>${safetyText}</h4>
                        <div class="safety-score">Safety Score: ${safetyData.safetyScore || 7.5}/10</div>
                    </div>
                </div>
                
                <div class="safety-section">
                    <h5>📋 Recommendations:</h5>
                    <ul class="safety-list">
                        ${(safetyData.recommendations || ['Stay aware of surroundings', 'Travel in groups when possible']).map(rec => 
                            `<li>${rec}</li>`
                        ).join('')}
                    </ul>
                </div>
                
                ${safetyData.bestTimes ? `
                    <div class="safety-section">
                        <h5>⏰ Best Times to Visit:</h5>
                        <p>${safetyData.bestTimes}</p>
                    </div>
                ` : ''}
                
                <div class="safety-section">
                    <h5>🏢 Nearby Emergency Services:</h5>
                    <div class="services-grid">
                        ${(safetyData.nearbyServices || [
                            { type: 'Police Station', distance: '0.5 km' },
                            { type: 'Hospital', distance: '1.2 km' }
                        ]).map(service => `
                            <div class="service-item">
                                <strong>${service.type}</strong>
                                <span>${service.distance}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                ${safetyData.concerns ? `
                    <div class="safety-section">
                        <h5>⚠️ Safety Concerns:</h5>
                        <ul class="concerns-list">
                            ${safetyData.concerns.map(concern => `<li>${concern}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
            <div class="safety-modal-footer">
                <small>${safetyData.powered_by || 'Powered by Guardian Shield AI'}</small>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listener for closing modal
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    showNotification(`${safetyEmoji} Safety analysis complete`, safetyData.isSafeZone ? 'success' : 'warning');
}

async function addEmergencyContact() {
    if (!currentUser) {
        showNotification('Please login to add emergency contacts', 'warning');
        showLoginModal();
        return;
    }
    
    const name = prompt('Contact name:');
    const phone = prompt('Contact phone:');
    const email = prompt('Contact email (optional):');
    const relationship = prompt('Relationship (family/friend/colleague/other):');
    
    if (!name || !phone || !relationship) {
        showNotification('Please fill required fields', 'warning');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/contacts/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: currentUser._id,
                name, 
                phone, 
                email: email || '', 
                relationship, 
                isPrimary: false
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showNotification(`Emergency contact ${result.contact.name} added successfully`, 'success');
        } else {
            showNotification('Failed to add contact: ' + result.message, 'error');
        }
    } catch (error) {
        showNotification('Contact addition error', 'error');
        console.error('Contact addition error:', error);
    }
}

// Utility Functions
async function updateUserLocation(lat, lng, address) {
    if (!currentUser) return;
    
    try {
        await fetch(`${API_BASE_URL}/api/location/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: currentUser._id,
                latitude: lat,
                longitude: lng,
                address: address
            })
        });
    } catch (error) {
        console.error('Location update error:', error);
    }
}

function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Simulate form submission
    showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
    e.target.reset();
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    const icon = notification.querySelector('.notification-icon');
    const messageEl = notification.querySelector('.notification-message');
    
    if (!icon || !messageEl) return;
    
    // Set icon based on type
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    icon.className = `notification-icon ${icons[type] || icons.success}`;
    messageEl.textContent = message;
    notification.className = `notification ${type}`;
    
    // Show notification
    notification.classList.add('show');
    
    // Hide after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

function scrollToFeatures() {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function downloadApp() {
    showNotification('Mobile app coming soon! Use the web version for now.', 'info');
}

function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Close emergency panel when clicking outside
document.addEventListener('click', function(e) {
    const emergencyPanel = document.getElementById('emergencyPanel');
    const emergencyMenu = document.querySelector('.emergency-menu');
    
    if (emergencyPanel && emergencyMenu && 
        !emergencyPanel.contains(e.target) && 
        emergencyMenu.classList.contains('active')) {
        emergencyMenu.classList.remove('active');
    }
});

// Keyboard shortcuts for emergency
document.addEventListener('keydown', function(e) {
    // Ctrl + Shift + S for SOS (Emergency shortcut)
    if (e.ctrlKey && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        sendSOSAlert();
    }
    
    // Escape key to close modals
    if (e.key === 'Escape') {
        const openModal = document.querySelector('.route-modal, .safety-modal');
        if (openModal) {
            openModal.remove();
        }
    }
});

// Online/Offline status
window.addEventListener('online', function() {
    showNotification('You are back online!', 'success');
});

window.addEventListener('offline', function() {
    showNotification('You are offline. Some features may not work.', 'warning');
});

// Console message for developers
console.log(`
🛡️ Guardian Shield - Women's Safety Platform
Version: 1.0.0
Status: Active
Emergency Shortcut: Ctrl + Shift + S

For support: support@guardianshield.com
`);
