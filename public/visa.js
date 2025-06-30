// Elements
const visaForm       = document.getElementById('visaForm');
const tableContainer = document.getElementById('applicationsTableContainer');
const tableBody      = document.getElementById('applicationsTableBody');
const searchInput    = document.getElementById('searchInput');
const sortSelect     = document.getElementById('sortSelect');
let editId = null;

// On load, fetch & render
document.addEventListener('DOMContentLoaded', renderVisas);

// Validation feedback
visaForm.addEventListener('input', e => {
  e.target.classList[e.target.checkValidity() ? 'remove' : 'add']('is-invalid');
});

// Submit handler
visaForm.addEventListener('submit', async e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(visaForm));
  if (!data.status) data.status = 'Pending'; // your schema default

  const method = editId ? 'PUT' : 'POST';
  const url    = editId ? `/api/visas/${editId}` : '/api/visas';

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const msg = await res.text();
    return alert('Error: ' + msg);
  }

  visaForm.reset();
  editId = null;
  renderVisas();
});

// Fetch + render
async function renderVisas() {
  const res = await fetch('/api/visas');
  if (!res.ok) return alert('Failed to load visas');
  const visas = await res.json();

  // show table
  tableContainer.classList.remove('d-none');

  // filter
  const q = searchInput.value.toLowerCase();
  const filtered = visas.filter(v =>
    v.firstName.toLowerCase().includes(q) ||
    v.lastName.toLowerCase().includes(q)
  );

  // sort
  filtered.sort((a, b) => {
    switch (sortSelect.value) {
      case 'firstName_asc':  return a.firstName.localeCompare(b.firstName);
      case 'firstName_desc': return b.firstName.localeCompare(a.firstName);
      case 'duration_asc':   return a.duration - b.duration;
      case 'duration_desc':  return b.duration - a.duration;
      default: return 0;
    }
  });

  // render rows
  tableBody.innerHTML = filtered.map(v => `
    <tr>
      <td>${v.firstName} ${v.lastName}</td>
      <td>${v.nationality}</td>
      <td>${v.visaType}</td>
      <td>${v.duration} days</td>
      <td>${v.status}</td>
      <td>
        <button class="btn btn-sm btn-warning" onclick="startEditVisa('${v._id}')">
          Edit
        </button>
        <button class="btn btn-sm btn-danger" onclick="deleteVisa('${v._id}')">
          Delete
        </button>
      </td>
    </tr>
  `).join('');
}

// Delete
async function deleteVisa(id) {
  if (!confirm('Delete this application?')) return;
  await fetch(`/api/visas/${id}`, { method: 'DELETE' });
  renderVisas();
}
window.deleteVisa = deleteVisa;

// Edit
async function startEditVisa(id) {
  const res = await fetch(`/api/visas/${id}`);
  if (!res.ok) return alert('Failed to fetch');
  const v = await res.json();
  editId = id;

  visaForm.elements['firstName'].value   = v.firstName;
  visaForm.elements['lastName'].value    = v.lastName;
  visaForm.elements['nationality'].value = v.nationality;
  visaForm.elements['passportNumber'].value = v.passportNumber;
  visaForm.elements['visaType'].value    = v.visaType;
  visaForm.elements['duration'].value    = v.duration;
  visaForm.elements['purpose'].value     = v.purpose;
  if (visaForm.elements['status']) visaForm.elements['status'].value = v.status;
}
window.startEditVisa = startEditVisa;

// Wire search & sort
searchInput.addEventListener('input', renderVisas);
sortSelect.addEventListener('change', renderVisas);
