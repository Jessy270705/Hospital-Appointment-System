/**
 * MEDIBOOK - CORE ENGINE
 * Simulated Full-Stack Functionality
 */

// --- INITIAL DATA (Simulating a Database) ---
const INITIAL_DOCTORS =[
    { id: 1, name: "Dr. Richard James", specialty: "General Physician", degree: "MBBS", experience: "4 Years", fee: 50, image: "https://i.pravatar.cc/300?img=11" },
    { id: 2, name: "Dr. Emily Larson", specialty: "Gynecologist", degree: "MD", experience: "7 Years", fee: 60, image: "https://i.pravatar.cc/300?img=20" },
    { id: 3, name: "Dr. Christopher Lee", specialty: "Dermatologist", degree: "MBBS", experience: "5 Years", fee: 45, image: "https://i.pravatar.cc/300?img=12" },
    { id: 4, name: "Dr. Sarah Patel", specialty: "Pediatrician", degree: "MD", experience: "10 Years", fee: 80, image: "https://i.pravatar.cc/300?img=26" },
];

const SPECIALTIES =["General Physician", "Gynecologist", "Dermatologist", "Pediatrician", "Neurologist", "Gastroenterologist"];

// Pre-configured Demo Accounts
const INITIAL_USERS =[
    { name: "Super Admin", email: "admin@medibook.com", role: "admin", password: "123", avatar: "" },
    { name: "Dr. Richard James", email: "doctor@medibook.com", role: "doctor", password: "123", avatar: "", docId: 1 },
    { name: "John Patient", email: "patient@medibook.com", role: "patient", password: "123", avatar: "" }
];

// --- STATE MANAGEMENT ---
const state = {
    doctors: JSON.parse(localStorage.getItem('doctors')) || INITIAL_DOCTORS,
    appointments: JSON.parse(localStorage.getItem('appointments')) ||[],
    users: JSON.parse(localStorage.getItem('users')) || INITIAL_USERS,
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
    view: 'home'
};

const saveState = () => {
    localStorage.setItem('doctors', JSON.stringify(state.doctors));
    localStorage.setItem('appointments', JSON.stringify(state.appointments));
    localStorage.setItem('users', JSON.stringify(state.users));
    localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
};

// --- APP ENGINE ---
const app = {
    selectedTime: '10:00 AM', 

    init: () => {
        app.renderNav();
        app.navigate('home');
        
        document.getElementById('mobile-menu').addEventListener('click', () => {
            document.getElementById('nav-links').classList.toggle('mobile-active');
            document.getElementById('nav-auth').classList.toggle('mobile-active');
        });
    },

    navigate: (view, params = null) => {
        state.view = view;
        app.renderNav();
        const root = document.getElementById('app-root');
        
        switch(view) {
            case 'home': root.innerHTML = app.views.home(); break;
            case 'doctors': root.innerHTML = app.views.allDoctors(params); break;
            case 'doctor-details': root.innerHTML = app.views.doctorDetails(params); break;
            case 'login': root.innerHTML = app.views.auth('login'); break;
            case 'register': root.innerHTML = app.views.auth('register'); break;
            case 'patient-dash': root.innerHTML = app.views.patientDash(); break;
            case 'admin-dash': root.innerHTML = app.views.adminDash(); break;
            case 'doctor-dash': root.innerHTML = app.views.doctorDash(); break;
            case 'profile': root.innerHTML = app.views.profileSettings(); break;
        }
        window.scrollTo(0,0);
    },

    renderNav: () => {
        const linksContainer = document.getElementById('nav-links');
        const authContainer = document.getElementById('nav-auth');
        
        let links = `<li><a href="#" onclick="app.navigate('home')">Home</a></li>
                     <li><a href="#" onclick="app.navigate('doctors')">All Doctors</a></li>`;
        linksContainer.innerHTML = links;

        if (state.currentUser) {
            let dashType = state.currentUser.role === 'patient' ? 'patient-dash' : 
                           state.currentUser.role === 'doctor' ? 'doctor-dash' : 'admin-dash';
            
            let btnLabel = state.currentUser.role === 'patient' ? 'My Panel' : 'Dashboard';
            let userProfileHeader = '';
            
            if (state.currentUser.role !== 'admin') {
                userProfileHeader = `
                    <div style="display:flex; align-items:center; gap:10px; margin-right:15px; text-align:right;">
                        <img src="${state.currentUser.avatar || 'https://ui-avatars.com/api/?name=' + state.currentUser.name}" style="width:40px; height:40px; border-radius:50%; object-fit:cover; border:2px solid var(--primary);">
                        <div style="line-height:1.2; display:none;" class="desktop-user-info">
                            <div style="font-weight:700; font-size:14px; color:var(--text-main);">${state.currentUser.name}</div>
                            <div style="font-size:12px; color:var(--text-muted); text-transform:capitalize;">${state.currentUser.role}</div>
                        </div>
                    </div>
                `;
            }
            
            authContainer.style.display = "flex";
            authContainer.style.alignItems = "center";
            authContainer.innerHTML = `
                ${userProfileHeader}
                <button class="btn btn-outline" style="margin-right:10px; padding: 8px 15px;" onclick="app.navigate('${dashType}')">${btnLabel}</button>
                <button class="btn btn-primary" style="padding: 8px 15px;" onclick="app.logout()">Logout</button>
            `;
        } else {
            authContainer.innerHTML = `<button class="btn btn-primary" onclick="app.navigate('login')">Login</button>`;
        }
    },

    logout: () => {
        state.currentUser = null;
        saveState();
        app.navigate('home');
    },

    selectTimeSlot: (time, element) => {
        app.selectedTime = time;
        document.querySelectorAll('.slot-btn').forEach(btn => btn.classList.remove('active'));
        element.classList.add('active');
    },

    cancelAppointment: (id) => {
        if(confirm("Are you sure you want to cancel this appointment?")) {
            state.appointments = state.appointments.filter(a => a.id !== id);
            saveState();
            app.navigate('patient-dash');
        }
    },

    completeAppointment: (id) => {
        const appt = state.appointments.find(a => a.id === id);
        if (appt) {
            appt.status = 'Completed';
            saveState();
            app.navigate('doctor-dash');
        }
    },

    updateProfile: () => {
        const name = document.getElementById('prof-name').value;
        const avatar = document.getElementById('prof-pic').value;
        if(!name) return alert("Name cannot be empty");
        
        state.currentUser.name = name;
        if(avatar) state.currentUser.avatar = avatar;
        
        const dbUser = state.users.find(u => u.email === state.currentUser.email);
        if(dbUser) {
            dbUser.name = name;
            dbUser.avatar = avatar;
        }

        saveState();
        alert("Profile Updated Successfully!");
        app.renderNav();
    },

    views: {
        home: () => `
            <section class="hero container">
                <div class="hero-content">
                    <h1>Book Appointment <br><span style="color:var(--primary)">With Trusted Doctors</span></h1>
                    <p>Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.</p>
                    <button class="btn btn-primary" onclick="app.navigate('doctors')">Book Appointment →</button>
                </div>
            </section>
            <section class="container" style="padding: 60px 0;">
                <h2 style="text-align:center; margin-bottom:40px">Find by Specialty</h2>
                <div class="filters" style="justify-content:center">
                    ${SPECIALTIES.map(s => `<div class="filter-btn" onclick="app.navigate('doctors', '${s}')">${s}</div>`).join('')}
                </div>
            </section>
        `,

        allDoctors: (filter = null) => {
            const filteredDocs = filter ? state.doctors.filter(d => d.specialty === filter) : state.doctors;
            return `
                <div class="container" style="padding: 40px 0;">
                    <h1>${filter ? filter + 's' : 'All Doctors'}</h1>
                    <div class="doctor-grid">
                        ${filteredDocs.map(doc => `
                            <div class="doc-card" onclick="app.navigate('doctor-details', ${doc.id})">
                                <img src="${doc.image}" class="doc-img">
                                <div class="doc-info">
                                    <span class="specialty-tag">${doc.specialty}</span>
                                    <h3 style="margin: 10px 0 5px">${doc.name}</h3>
                                    <p style="color:var(--text-muted); font-size: 0.9rem">${doc.degree} - ${doc.experience}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        },

        doctorDetails: (id) => {
            const doc = state.doctors.find(d => d.id === id);
            app.selectedTime = "10:00 AM"; 

            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const minDate = tomorrow.toISOString().split('T')[0];

            return `
                <div class="container" style="padding: 60px 0;">
                    <div style="display:flex; gap:40px; background:white; padding:40px; border-radius:var(--radius); box-shadow:var(--shadow); flex-wrap: wrap;">
                        <img src="${doc.image}" style="width:300px; height:300px; object-fit:cover; border-radius:var(--radius); background:var(--primary)">
                        <div>
                            <h1>${doc.name}</h1>
                            <p style="color:var(--text-muted)">${doc.degree} - ${doc.specialty}</p>
                            <div style="margin: 20px 0; padding:10px; background:#f0f9ff; border-radius:8px">
                                <strong>Experience:</strong> ${doc.experience} <br>
                                <strong>Booking Fee:</strong> $${doc.fee}
                            </div>
                            
                            <h3>Select Date</h3>
                            <input type="date" id="book-date" min="${minDate}" style="margin: 10px 0 20px 0; padding: 10px; border-radius: 8px; border: 1px solid #cbd5e1; width: 100%; max-width: 250px;" required>

                            <h3>Select Slot</h3>
                            <div style="display:flex; gap:10px; margin:15px 0; flex-wrap:wrap;">
                                <button class="filter-btn slot-btn active" onclick="app.selectTimeSlot('10:00 AM', this)">10:00 AM</button>
                                <button class="filter-btn slot-btn" onclick="app.selectTimeSlot('11:00 AM', this)">11:00 AM</button>
                                <button class="filter-btn slot-btn" onclick="app.selectTimeSlot('02:00 PM', this)">02:00 PM</button>
                                <button class="filter-btn slot-btn" onclick="app.selectTimeSlot('04:00 PM', this)">04:00 PM</button>
                            </div>
                            
                            <button class="btn btn-primary" style="margin-top:15px; width:100%; max-width: 250px;" onclick="app.handleBooking(${doc.id})">Book Appointment</button>
                        </div>
                    </div>
                </div>
            `;
        },

        auth: (type) => {
            const isLogin = type === 'login';
            return `
                <div class="auth-form">
                    <h2>${isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                    <p style="margin-bottom:20px; color:var(--text-muted)">
                        ${isLogin ? 'Please enter your email and password to log in.' : 'Please fill out the details below to register.'}
                    </p>
                    
                    ${isLogin ? `
                        <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 0.85rem; color: var(--text-muted);">
                            <strong>Demo Accounts (Password: 123)</strong><br>
                            Admin: admin@medibook.com<br>
                            Doctor: doctor@medibook.com<br>
                            Patient: patient@medibook.com
                        </div>
                    ` : `
                        <div class="form-group">
                            <label>Full Name</label>
                            <input type="text" id="auth-name" placeholder="John Doe">
                        </div>
                        <div class="form-group">
                            <label>Role</label>
                            <select id="auth-role">
                                <option value="patient">Patient</option>
                                <!-- Removed Doctor from public registration, now only Admins can create Doctors -->
                            </select>
                        </div>
                    `}

                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="auth-email" placeholder="Email Address">
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" id="auth-pass" placeholder="Password">
                    </div>
                    
                    <button class="btn btn-primary" style="width:100%" onclick="app.handleAuth('${type}')">
                        ${isLogin ? 'Login' : 'Create Account'}
                    </button>
                    
                    <p style="margin-top:20px; text-align:center">
                        ${isLogin 
                            ? "Don't have an account? <a href='#' style='color:var(--primary); font-weight:600;' onclick=\"app.navigate('register')\">Sign up</a>" 
                            : "Already have an account? <a href='#' style='color:var(--primary); font-weight:600;' onclick=\"app.navigate('login')\">Login</a>"}
                    </p>
                </div>
            `;
        },

        patientDash: () => {
            const userApps = state.appointments.filter(a => a.patientEmail === state.currentUser.email);
            return `
                <div class="container dashboard-container">
                    <aside class="sidebar">
                        <ul class="sidebar-nav">
                            <li class="active" onclick="app.navigate('patient-dash')">My Appointments</li>
                            <li onclick="app.navigate('profile')">Profile Settings</li>
                        </ul>
                    </aside>
                    <div>
                        <h2>Patient Panel</h2>
                        <div style="margin-top:20px; overflow-x: auto;">
                            ${userApps.length === 0 ? '<p>No appointments booked yet.</p>' : `
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Doctor</th>
                                            <th>Specialty</th>
                                            <th>Date & Time</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${userApps.map(a => `
                                            <tr>
                                                <td style="font-weight: 500;">${a.docName}</td>
                                                <td>${a.specialty}</td>
                                                <td>${a.date} | ${a.time}</td>
                                                <td style="color:${a.status === 'Completed' ? 'var(--primary)' : 'green'}; font-weight:600;">${a.status}</td>
                                                <td>
                                                    ${a.status !== 'Completed' ? `<button class="btn" style="color:red; font-size:0.8rem; padding: 5px 10px; border: 1px solid red; background: white;" onclick="app.cancelAppointment(${a.id})">Cancel</button>` : '-'}
                                                </td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            `}
                        </div>
                    </div>
                </div>
            `;
        },

        doctorDash: () => {
            const myApps = state.appointments.filter(a => a.docId === state.currentUser.docId);
            const earnings = myApps.filter(a => a.status === 'Completed').reduce((sum, a) => sum + a.fee, 0);
            return `
                <div class="container dashboard-container">
                    <aside class="sidebar">
                        <ul class="sidebar-nav">
                            <li class="active" onclick="app.navigate('doctor-dash')">Appointments</li>
                            <li onclick="app.navigate('profile')">Profile Settings</li>
                        </ul>
                    </aside>
                    <div>
                        <h2>Doctor Earnings: $${earnings}</h2>
                        <h3 style="margin-top:30px">Upcoming Appointments</h3>
                        <div style="overflow-x: auto;">
                        ${myApps.length === 0 ? '<p>No appointments pending.</p>' : `
                        <table>
                            <thead>
                                <tr><th>Patient Name</th><th>Date & Time</th><th>Status</th><th>Action</th></tr>
                            </thead>
                            <tbody>
                                ${myApps.map(a => `
                                    <tr>
                                        <td style="font-weight: 500;">${a.patientName}</td>
                                        <td>${a.date} | ${a.time}</td>
                                        <td style="color:${a.status === 'Completed' ? 'var(--primary)' : 'green'}; font-weight:600;">${a.status}</td>
                                        <td>
                                            ${a.status === 'Completed' 
                                                ? `<span style="color:var(--text-muted);">Done</span>` 
                                                : `<button class="btn btn-primary" style="padding:5px 10px" onclick="app.completeAppointment(${a.id})">Complete</button>`
                                            }
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                        `}
                        </div>
                    </div>
                </div>
            `;
        },

        profileSettings: () => {
            let backRoute = state.currentUser.role === 'patient' ? 'patient-dash' : 'doctor-dash';
            return `
                <div class="container dashboard-container">
                    <aside class="sidebar">
                        <ul class="sidebar-nav">
                            <li onclick="app.navigate('${backRoute}')">Back to Dashboard</li>
                            <li class="active">Profile Settings</li>
                        </ul>
                    </aside>
                    <div>
                        <h2>Profile Settings</h2>
                        <div class="medical-form" style="max-width: 500px;">
                            <div style="display:flex; align-items:center; gap: 20px; margin-bottom: 20px;">
                                <img src="${state.currentUser.avatar || 'https://ui-avatars.com/api/?name=' + state.currentUser.name}" style="width:80px; height:80px; border-radius:50%; object-fit:cover; border:2px solid var(--primary);">
                                <div>
                                    <h3 style="margin:0">${state.currentUser.name}</h3>
                                    <p style="color:var(--text-muted); text-transform:capitalize;">Role: ${state.currentUser.role}</p>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Full Name</label>
                                <input type="text" id="prof-name" value="${state.currentUser.name}">
                            </div>
                            <div class="form-group">
                                <label>Profile Picture URL</label>
                                <input type="text" id="prof-pic" value="${state.currentUser.avatar || ''}" placeholder="https://image-url.com/me.png">
                                <small style="color:var(--text-muted);">Paste an image link to update your avatar</small>
                            </div>
                            <button class="btn btn-primary" onclick="app.updateProfile()">Save Changes</button>
                        </div>
                    </div>
                </div>
            `;
        },

        adminDash: () => {
            setTimeout(() => {
                const firstNav = document.querySelector('.sidebar-nav li');
                showAdminSection('overview', firstNav);
            }, 0);

            return `
                <div class="container dashboard-container">
                    <aside class="sidebar">
                        <ul class="sidebar-nav">
                            <li class="active" onclick="showAdminSection('overview', this)">Dashboard Overview</li>
                            <li onclick="showAdminSection('add', this)">Add Doctor</li>
                            <li onclick="showAdminSection('list', this)">Doctors List</li>
                            <li onclick="showAdminSection('appointments', this)">All Appointments</li>
                        </ul>
                    </aside>
                    <div class="dash-content" id="admin-sub-content">
                        <!-- Content Injected Dynamically by showAdminSection() -->
                    </div>
                </div>
            `;
        }
    },

    // --- SEPARATED AUTHENTICATION LOGIC ---
    handleAuth: (type) => {
        const email = document.getElementById('auth-email').value.trim();
        const password = document.getElementById('auth-pass').value.trim();
        
        if (!email || !password) return alert("Please fill in both email and password.");

        if (type === 'register') {
            const name = document.getElementById('auth-name').value.trim();
            const role = document.getElementById('auth-role').value.toLowerCase();
            
            if (!name) return alert("Please enter your Full Name.");

            const existingUser = state.users.find(u => u.email === email);
            if (existingUser) return alert("Email is already registered! Please Login instead.");

            const newUser = { name, email, role, password, avatar: '' };

            state.users.push(newUser);
            state.currentUser = newUser;
            alert("Account created successfully!");

        } else if (type === 'login') {
            const user = state.users.find(u => u.email === email && u.password === password);
            if (!user) {
                return alert("Invalid Email or Password! Try again or create an account.");
            }
            state.currentUser = user;
        }

        saveState();
        app.navigate(state.currentUser.role === 'admin' ? 'admin-dash' : state.currentUser.role === 'doctor' ? 'doctor-dash' : 'patient-dash');
    },

    handleBooking: (docId) => {
        if (!state.currentUser) {
            alert("Please login to book an appointment");
            return app.navigate('login');
        }
        if (state.currentUser.role !== 'patient') {
            return alert("Only patients can book appointments.");
        }

        const dateInput = document.getElementById('book-date').value;
        if (!dateInput) return alert("Please select an appointment date.");
        
        const doc = state.doctors.find(d => d.id === docId);
        const dateObj = new Date(dateInput);
        const formattedDate = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

        const newApp = {
            id: Date.now(),
            docId: doc.id,
            docName: doc.name,
            specialty: doc.specialty,
            fee: doc.fee,
            patientEmail: state.currentUser.email,
            patientName: state.currentUser.name, 
            date: formattedDate, 
            time: app.selectedTime, 
            status: 'Booked'
        };

        state.appointments.push(newApp);
        saveState();
        alert(`Appointment Booked Successfully with ${doc.name} on ${formattedDate} at ${app.selectedTime}!`);
        app.navigate('patient-dash');
    }
};

// --- Admin Section Logic & Visualizations ---
function showAdminSection(type, element) {
    const container = document.getElementById('admin-sub-content');
    if(!container) return;

    if(element) {
        document.querySelectorAll('.sidebar-nav li').forEach(link => link.classList.remove('active'));
        element.classList.add('active');
    }

    if (type === 'overview') {
        const totalDocs = state.doctors.length;
        const totalAppts = state.appointments.length;
        const uniquePatients = new Set(state.appointments.map(a => a.patientEmail)).size;
        
        const revenue = state.appointments
            .filter(a => a.status === 'Completed')
            .reduce((sum, a) => sum + (Number(a.fee) || 0), 0);

        const specCounts = {};
        state.appointments.forEach(a => {
            specCounts[a.specialty] = (specCounts[a.specialty] || 0) + 1;
        });
        
        let maxCount = Math.max(...Object.values(specCounts), 1); 

        let chartHTML = '';
        if(Object.keys(specCounts).length === 0) {
            chartHTML = `<p style="color:var(--text-muted)">No booking data available yet.</p>`;
        } else {
            for (const [spec, count] of Object.entries(specCounts)) {
                let percentage = (count / maxCount) * 100;
                chartHTML += `
                    <div class="chart-bar-row">
                        <div class="chart-label">${spec}</div>
                        <div class="chart-track">
                            <div class="chart-fill" style="width: ${percentage}%;"></div>
                        </div>
                        <div class="chart-value">${count}</div>
                    </div>
                `;
            }
        }

        container.innerHTML = `
            <h2>Dashboard Overview</h2>
            <div class="stat-grid">
                <div class="stat-card" style="border-left-color: #3b82f6;">
                    <div class="stat-title">Total Revenue</div>
                    <div class="stat-value">$${revenue}</div>
                </div>
                <div class="stat-card" style="border-left-color: #10b981;">
                    <div class="stat-title">Total Appointments</div>
                    <div class="stat-value">${totalAppts}</div>
                </div>
                <div class="stat-card" style="border-left-color: #8b5cf6;">
                    <div class="stat-title">Total Doctors</div>
                    <div class="stat-value">${totalDocs}</div>
                </div>
                <div class="stat-card" style="border-left-color: #f59e0b;">
                    <div class="stat-title">Unique Patients</div>
                    <div class="stat-value">${uniquePatients}</div>
                </div>
            </div>
            <div class="chart-container">
                <h3>Appointments by Specialty</h3>
                <div style="margin-top: 20px;">
                    ${chartHTML}
                </div>
            </div>
        `;
    } 
    else if (type === 'add') {
        container.innerHTML = `
            <div class="admin-form-container">
                <h2>Add New Doctor & Login Credentials</h2>
                <form id="add-doctor-form" class="medical-form">
                    <h3 style="margin-bottom:15px; color:var(--primary); font-size:1rem; border-bottom:1px solid #e2e8f0; padding-bottom:5px;">Public Profile Info</h3>
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Doctor Name</label>
                            <input type="text" id="add-doc-name" placeholder="Dr. John Doe" required>
                        </div>
                        <div class="form-group">
                            <label>Specialty</label>
                            <select id="add-doc-specialty">
                                ${SPECIALTIES.map(s => `<option value="${s}">${s}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Experience (Years)</label>
                            <input type="text" id="add-doc-exp" placeholder="5 Years" required>
                        </div>
                        <div class="form-group">
                            <label>Fees ($)</label>
                            <input type="number" id="add-doc-fee" placeholder="50" required>
                        </div>
                        <div class="form-group">
                            <label>Education/Degree</label>
                            <input type="text" id="add-doc-degree" placeholder="MBBS, MD" required>
                        </div>
                        <div class="form-group">
                            <label>Upload Image</label>
                            <input type="file" id="add-doc-img" accept="image/*" required>
                            <img id="image-preview" src="" style="display:none; width: 80px; height: 80px; object-fit: cover; margin-top: 10px; border-radius: 8px;">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>About Doctor</label>
                        <textarea id="add-doc-about" rows="3" placeholder="Brief description..."></textarea>
                    </div>

                    <h3 style="margin:25px 0 15px 0; color:var(--primary); font-size:1rem; border-bottom:1px solid #e2e8f0; padding-bottom:5px;">Doctor Login Account</h3>
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Account Email (For Login)</label>
                            <input type="email" id="add-doc-email" placeholder="doctor.name@medibook.com" required>
                        </div>
                        <div class="form-group">
                            <label>Account Password</label>
                            <input type="text" id="add-doc-pass" placeholder="Password123" required>
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary" style="margin-top:10px;">Create Doctor Account</button>
                </form>
            </div>
        `;
        setTimeout(initAdminForm, 0);
    } 
    else if (type === 'list') {
        let html = `<h2>Doctors List</h2><div class="admin-table-container" style="overflow-x:auto;"><table>
            <thead><tr><th>Image</th><th>Name</th><th>Specialty</th><th>Login Email</th><th>Action</th></tr></thead>
            <tbody>`;
        state.doctors.forEach(doc => {
            // Find the associated user account to display their login email
            const assocUser = state.users.find(u => u.docId === doc.id);
            const loginEmail = assocUser ? assocUser.email : 'Pre-built Demo';

            html += `<tr>
                <td><img src="${doc.image}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;"></td>
                <td>${doc.name}</td>
                <td>${doc.specialty}</td>
                <td style="color:var(--text-muted); font-size: 0.9rem;">${loginEmail}</td>
                <td><button class="btn btn-outline" onclick="deleteDoctor(${doc.id})" style="color:red; border-color:red; padding: 4px 10px; font-size:12px;">Delete</button></td>
            </tr>`;
        });
        html += `</tbody></table></div>`;
        container.innerHTML = html;
    } 
    else if (type === 'appointments') {
        let html = `<h2>All Appointments</h2><div class="admin-table-container" style="overflow-x:auto;"><table>
            <thead><tr><th>Patient</th><th>Doctor</th><th>Date & Time</th><th>Fee</th><th>Status</th></tr></thead>
            <tbody>
                ${state.appointments.length > 0 ? state.appointments.map(a => `
                    <tr>
                        <td style="font-weight:500;">${a.patientName}</td>
                        <td>${a.docName}</td>
                        <td>${a.date} | ${a.time}</td>
                        <td>$${a.fee}</td>
                        <td><span style="color:${a.status === 'Completed' ? 'var(--text-muted)' : 'green'}; font-weight: 600;">${a.status}</span></td>
                    </tr>
                `).join('') : `<tr><td colspan="5">No appointments found.</td></tr>`}
            </tbody>
        </table></div>`;
        container.innerHTML = html;
    }
}

function initAdminForm() {
    const form = document.getElementById('add-doctor-form');
    const imgInput = document.getElementById('add-doc-img');
    const imgPreview = document.getElementById('image-preview');

    if (imgInput && imgPreview) {
        imgInput.onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(evt) {
                    imgPreview.src = evt.target.result;
                    imgPreview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        };
    }

    if (form) {
        form.onsubmit = function(e) {
            e.preventDefault();

            // Extract User Account Data First
            const emailInput = document.getElementById('add-doc-email').value.trim();
            const passInput = document.getElementById('add-doc-pass').value.trim();

            // Check if email already exists in User Database
            if (state.users.find(u => u.email === emailInput)) {
                return alert("This email is already in use by another account.");
            }

            const file = imgInput.files[0];
            if (!file) return alert("Please select an image file.");

            const reader = new FileReader();
            reader.onload = function(evt) {
                const newDocId = Date.now();

                // 1. Create Front-End Doctor Profile
                const newDoctor = {
                    id: newDocId,
                    name: document.getElementById('add-doc-name').value,
                    specialty: document.getElementById('add-doc-specialty').value,
                    degree: document.getElementById('add-doc-degree').value,
                    experience: document.getElementById('add-doc-exp').value,
                    fee: parseFloat(document.getElementById('add-doc-fee').value) || 0,
                    about: document.getElementById('add-doc-about').value,
                    image: evt.target.result
                };

                // 2. Create actual User Login Account attached to the Doctor Profile
                const newUserAccount = {
                    name: newDoctor.name,
                    email: emailInput,
                    password: passInput,
                    role: 'doctor',
                    avatar: evt.target.result,
                    docId: newDocId // Very Important: This ties the login to the appointments!
                };

                // Save Both
                state.doctors.push(newDoctor);
                state.users.push(newUserAccount);

                try {
                    saveState(); 
                    alert('Doctor profile & login account created successfully!');
                    showAdminSection('list', document.querySelectorAll('.sidebar-nav li')[2]); 
                } catch (error) {
                    // Revert on storage fail
                    state.doctors.pop();
                    state.users.pop();
                    alert("Storage limit exceeded! Image is too large.");
                }
            };
            reader.readAsDataURL(file);
        };
    }
}

function deleteDoctor(id) {
    if(confirm('Are you sure you want to remove this doctor? This will also delete their login account.')) {
        // Remove Doctor Profile
        state.doctors = state.doctors.filter(d => d.id !== id);
        // Remove associated User Login Account
        state.users = state.users.filter(u => u.docId !== id);
        
        saveState();
        showAdminSection('list', document.querySelectorAll('.sidebar-nav li')[2]);
    }
}

// Initialize App
app.init();