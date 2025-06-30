document.addEventListener('DOMContentLoaded', () => {
  // Sections
  const signupSection   = document.getElementById('signupSection');
  const loginSection    = document.getElementById('loginSection');
  const processSection  = document.getElementById('processSection');
  const dashboardSection = document.getElementById('dashboardSection');

  // Nav links
  const loginNav       = document.getElementById('loginNav');
  const signupNav      = document.getElementById('signupNav');
  const showSignupLink = document.getElementById('showSignupLink');
  const showLoginLink  = document.getElementById('showLoginLink');

  // Forms
  const signupForm = document.getElementById('signupForm');
  const loginForm  = document.getElementById('loginForm');
  const recordForm = document.getElementById('recordForm');

  // Spinner & Progress Bar
  const loadingSpinner = document.getElementById('loadingSpinner');
  const progressBar    = document.getElementById('progressBar');

  // Utility: show/hide spinner
  function showSpinner() {
    loadingSpinner.style.display = 'block';
  }

  function hideSpinner() {
    loadingSpinner.style.display = 'none';
  }

  // Utility: update progress bar
  function updateProgress(percent) {
    if (!progressBar) return;
    progressBar.style.width = percent + '%';
    progressBar.setAttribute('aria-valuenow', percent);
    progressBar.textContent = percent + '%';
  }

  // Check login status
  function isLoggedIn() {
    return localStorage.getItem('loggedIn') === 'true';
  }

  // Authentication: SIGN UP
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const username = document.getElementById('signupUsername').value.trim();
    const password = document.getElementById('signupPassword').value;
    if (!username || password.length < 6) {
      alert('Please enter a valid username and a password of at least 6 characters.');
      return;
    }
    localStorage.setItem('savedUsername', username);
    localStorage.setItem('savedPassword', password);
    localStorage.setItem('loggedIn', 'true');

    // Simulate processing with spinner then update progress
    showSpinner();
    setTimeout(() => {
      hideSpinner();
      alert('Sign-up successful! You are now logged in.');
      signupForm.reset();
      updateProgress(30); // set progress to 30%
      showProcessSection();
    }, 500);
  });

  // Authentication: LOGIN
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const storedUser = localStorage.getItem('savedUsername');
    const storedPass = localStorage.getItem('savedPassword');

    if (username === storedUser && password === storedPass) {
      showSpinner();
      setTimeout(() => {
        hideSpinner();
        localStorage.setItem('loggedIn', 'true');
        alert('Login successful!');
        loginForm.reset();
        updateProgress(30); // after login, progress bar shows 30%
        showProcessSection();
      }, 500);
    } else {
      alert('Invalid credentials. Please try again.');
    }
  });

  // Navigation link toggles
  showSignupLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginSection.classList.add('d-none');
    signupSection.classList.remove('d-none');
  });

  showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    signupSection.classList.add('d-none');
    loginSection.classList.remove('d-none');
  });

  // Show the process section (records management) and dashboard after successful login/sign-up
  function showProcessSection() {
    signupSection.classList.add('d-none');
    loginSection.classList.add('d-none');
    if (processSection) processSection.classList.remove('d-none');
    if (dashboardSection) dashboardSection.classList.remove('d-none');
  }

  // ---------------------------
  // Dynamic Records Management
  // ---------------------------
  let records = []; // Array of record objects { name, date }
  let editIndex = -1; // -1 indicates no editing in progress
  let dashboardChart; // Chart.js instance

  // Render records to the table and update dashboard metrics/chart
  function renderRecords() {
    const tbody = document.querySelector('#recordsTable tbody');
    tbody.innerHTML = '';
    const filterText = document.getElementById('searchInput').value.trim().toLowerCase();
    const filteredRecords = records.filter(record =>
      record.name.toLowerCase().includes(filterText)
    );
    filteredRecords.forEach((record, index) => {
      const tr = document.createElement('tr');

      // Name Column
      const tdName = document.createElement('td');
      tdName.textContent = record.name;
      tr.appendChild(tdName);

      // Date Column
      const tdDate = document.createElement('td');
      tdDate.textContent = record.date;
      tr.appendChild(tdDate);

      // Actions Column
      const tdActions = document.createElement('td');

      // Edit Button with confirmation prompt
      const editBtn = document.createElement('button');
      editBtn.className = 'btn btn-sm btn-warning me-2';
      editBtn.textContent = 'Edit';
      editBtn.addEventListener('click', () => {
        if (!confirm('Are you sure you want to update this record?')) return;
        // Fill form fields with selected record's data
        document.getElementById('recordName').value = record.name;
        document.getElementById('recordDate').value = record.date;
        editIndex = index;
        // Change submit button text for update mode
        document.getElementById('recordSubmitButton').textContent = 'Update Record';
      });
      tdActions.appendChild(editBtn);

      // Delete Button with confirmation prompt
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-sm btn-danger';
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => {
        if (!confirm('Are you sure you want to delete this record?')) return;
        records.splice(index, 1);
        renderRecords();
      });
      tdActions.appendChild(deleteBtn);

      tr.appendChild(tdActions);
      tbody.appendChild(tr);
    });
    updateDashboard(); // Update metrics and chart after every render
  }

  // Record form submission: add or update a record with spinner and confirmation on update
  recordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showSpinner();
    setTimeout(() => {
      const nameInput = document.getElementById('recordName');
      const dateInput = document.getElementById('recordDate');
      const name = nameInput.value.trim();
      const date = dateInput.value;

      if (!name || !date) {
        alert('Please fill in both Name and Date fields.');
        hideSpinner();
        return;
      }

      if (editIndex === -1) {
        // Add new record
        records.push({ name, date });
      } else {
        // Confirm update action
        if (!confirm('Are you sure you want to update this record?')) {
          recordForm.reset();
          document.getElementById('recordSubmitButton').textContent = 'Add Record';
          editIndex = -1;
          hideSpinner();
          return;
        }
        // Update existing record
        records[editIndex] = { name, date };
        editIndex = -1;
        document.getElementById('recordSubmitButton').textContent = 'Add Record';
      }
      recordForm.reset();
      hideSpinner();
      renderRecords();
    }, 500); // simulate 500ms processing time
  });

  // Live Search: Filter records as user types
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', () => {
    renderRecords();
  });

  // Sorting functionality
  document.getElementById('sortNameAsc').addEventListener('click', () => {
    records.sort((a, b) => a.name.localeCompare(b.name));
    renderRecords();
  });

  document.getElementById('sortNameDesc').addEventListener('click', () => {
    records.sort((a, b) => b.name.localeCompare(a.name));
    renderRecords();
  });

  document.getElementById('sortDateAsc').addEventListener('click', () => {
    records.sort((a, b) => new Date(a.date) - new Date(b.date));
    renderRecords();
  });

  document.getElementById('sortDateDesc').addEventListener('click', () => {
    records.sort((a, b) => new Date(b.date) - new Date(a.date));
    renderRecords();
  });

  // ---------------------------
  // Dashboard & Chart.js Section
  // ---------------------------
  function updateDashboard() {
    // Calculate metrics
    const total = records.length;
    const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
    const completed = records.filter(record => record.date === today).length;
    const pending = total - completed;

    // Update metric cards
    document.getElementById('totalRecords').textContent = total;
    document.getElementById('completedToday').textContent = completed;
    document.getElementById('pendingItems').textContent = pending;

    // Update or Create Chart
    const ctx = document.getElementById('dashboardChart').getContext('2d');
    const chartData = {
      labels: ['Completed Today', 'Pending Items'],
      datasets: [{
        data: [completed, pending],
        backgroundColor: ['#28a745', '#dc3545']
      }]
    };

    if (dashboardChart) {
      dashboardChart.data = chartData;
      dashboardChart.update();
    } else {
      dashboardChart = new Chart(ctx, {
        type: 'pie',
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    }
  }

  // ---------------------------
  // Application Buttons (Protected Routes)
  // ---------------------------
  const applyPassportBtn = document.querySelector('a.btn-primary[href="passport.html"]');
  const applyVisaBtn     = document.querySelector('a.btn-success[href="visa.html"]');

  // Guard apply buttons
  [applyPassportBtn, applyVisaBtn].forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', e => {
      if (!isLoggedIn()) {
        e.preventDefault();
        alert('Please log in or sign up before applying.');
        showLogin();
      }
    });
  });

  // Utility functions for toggling login/signup windows
  function showLogin() {
    signupSection.classList.add('d-none');
    loginSection.classList.remove('d-none');
    processSection && processSection.classList.add('d-none');
  }

  function showSignup() {
    loginSection.classList.add('d-none');
    signupSection.classList.remove('d-none');
    processSection && processSection.classList.add('d-none');
  }

  // Nav click handlers for switching forms
  loginNav.addEventListener('click', e => { e.preventDefault(); showLogin(); });
  signupNav.addEventListener('click', e => { e.preventDefault(); showSignup(); });
  showSignupLink.addEventListener('click', e => { e.preventDefault(); showSignup(); });
  showLoginLink.addEventListener('click', e => { e.preventDefault(); showLogin(); });

  // Example PROCESS FORM: only allow if logged in (if such form exists)
  const processForm = document.getElementById('processForm');
  if (processForm) {
    processForm.addEventListener('submit', e => {
      e.preventDefault();
      if (!isLoggedIn()) {
        alert('You must be logged in to submit this form.');
        showLogin();
        return;
      }
      showSpinner();
      setTimeout(() => {
        hideSpinner();
        alert('Processing form submitted successfully!');
        updateProgress(100);
        processForm.reset();
      }, 500);
    });
  }
});
