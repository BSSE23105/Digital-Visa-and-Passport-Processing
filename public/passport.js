// Elements
const passportForm = document.getElementById('passportForm');
const container = document.getElementById('passportApplicationsContainer');
const tableBody = document.getElementById('passportApplicationsBody');
const searchField = document.getElementById('passportSearch');
const sortField = document.getElementById('passportSort');
let editId = null;

// On load
document.addEventListener('DOMContentLoaded', renderPassports);

// Validation feedback
passportForm.addEventListener('input', e => {
  e.target.classList[e.target.checkValidity() ? 'remove' : 'add']('is-invalid');
});

// Submit handler
passportForm.addEventListener('submit', async e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(passportForm));
  if (!data.status) data.status = 'Pending';

  const method = editId ? 'PUT' : 'POST';
  const url = editId
    ? `/api/passports/${editId}`
    : '/api/passports';

//     let method;
// let url;

// if (editId) {
//   method = 'PUT';
//   url = `/api/passports/${editId}`;
// } else {
//   method = 'POST';
//   url = '/api/passports';
// }
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const msg = await res.text();
    return alert('Error: ' + msg);
  }

  passportForm.reset();
  editId = null;
  renderPassports();
});

// Fetch & render list
async function renderPassports() {
  const res = await fetch('/api/passports');
  if (!res.ok) return alert('Failed to load passports');
  const list = await res.json();

  // show table
  container.classList.remove('d-none');

  // filter
  const q = searchField.value.toLowerCase();
  const filtered = list.filter(p =>
    p.firstName.toLowerCase().includes(q) ||
    p.lastName.toLowerCase().includes(q)
  );

  // sort
  filtered.sort((a, b) => {
    switch (sortField.value) {
      case 'firstName_asc': return a.firstName.localeCompare(b.firstName);
      case 'firstName_desc': return b.firstName.localeCompare(a.firstName);
      case 'date_asc': return new Date(a.dateOfBirth) - new Date(b.dateOfBirth);
      case 'date_desc': return new Date(b.dateOfBirth) - new Date(a.dateOfBirth);
      default: return 0;
    }
  });

  tableBody.innerHTML = filtered.map(p => `
    <tr>
      <td>${p.firstName} ${p.lastName}</td>
      <td>${p.passportType}</td>
      <td>${new Date(p.dateOfBirth).toLocaleDateString()}</td>
      <td>${p.status}</td>
      <td>
        <button class="btn btn-sm btn-warning"
                onclick="startEditPassport('${p._id}')">Edit</button>
        <button class="btn btn-sm btn-danger"
                onclick="deletePassport('${p._id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

// Delete
async function deletePassport(id) {
  if (!confirm('Delete this application?')) return;
  await fetch(`/api/passports/${id}`, { method: 'DELETE' });
  renderPassports();
}
window.deletePassport = deletePassport;

// Edit
async function startEditPassport(id) {
  const res = await fetch(`/api/passports/${id}`);
  if (!res.ok) return alert('Failed to fetch');
  const p = await res.json();
  editId = id;

  passportForm.elements['firstName'].value = p.firstName;
  passportForm.elements['lastName'].value = p.lastName;
  passportForm.elements['dateOfBirth'].value = p.dateOfBirth.slice(0, 10);
  passportForm.elements['gender'].value = p.gender;
  passportForm.elements['passportType'].value = p.passportType;
  passportForm.elements['email'].value = p.email;
  passportForm.elements['phone'].value = p.phone;
  passportForm.elements['address'].value = p.address;
  if (passportForm.elements['status']) passportForm.elements['status'].value = p.status;
}
window.startEditPassport = startEditPassport;

// Wire search & sort
searchField.addEventListener('input', renderPassports);
sortField.addEventListener('change', renderPassports);
