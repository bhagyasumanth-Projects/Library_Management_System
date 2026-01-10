const API_BASE = "https://tall-kassey-sumanth87-4dcf6b1d.koyeb.app/api/books";

document.addEventListener("DOMContentLoaded", () => {
    loadBooks();
    loadMembers();
    // Live Search Event
    document.getElementById('bookSearch').addEventListener('input', loadBooks);
});

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('d-none'));
    document.getElementById(tabId).classList.remove('d-none');
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    
    if(tabId === 'booksTab') document.getElementById('link-books').classList.add('active');
    if(tabId === 'membersTab') document.getElementById('link-members').classList.add('active');
}

// --- BOOKS LOGIC ---
function loadBooks() {
    const searchTerm = document.getElementById('bookSearch').value.toLowerCase();
    
    fetch(`${API_BASE}/books`)
        .then(res => res.json())
        .then(data => {
            // Update Stats
            document.getElementById('stat-total-books').innerText = data.length;
            document.getElementById('stat-issued-books').innerText = data.filter(b => b.issued).length;

            const filtered = data.filter(b => 
                b.title.toLowerCase().includes(searchTerm) || 
                b.author.toLowerCase().includes(searchTerm)
            );

            const table = document.getElementById("bookTable");
            table.innerHTML = filtered.map(book => {
                
                // NEW LOGIC: Extract the name from the member object
                let statusHtml = "";
                if (book.issued) {
                    const borrowerName = book.issuedTo ? book.issuedTo.name : "Unknown Member";
                    statusHtml = `
                        <span class="badge-status bg-warning-subtle text-warning" title="Issued to ${borrowerName}">
                            <i class="fa-solid fa-user me-1"></i> Issued to ${borrowerName}
                        </span>`;
                } else {
                    statusHtml = `
                        <span class="badge-status bg-success-subtle text-success">
                            <i class="fa-solid fa-check me-1"></i> Available
                        </span>`;
                }
                
                return `
                <tr>
                    <td class="ps-4">
                        <div class="d-flex align-items-center">
                            <div class="bg-light p-2 rounded text-primary me-3"><i class="fa-solid fa-book"></i></div>
                            <div>
                                <div class="fw-bold">${book.title}</div>
                                <div class="small text-muted">ID: #${book.id} • ${book.author}</div>
                            </div>
                        </div>
                    </td>
                    <td>${book.year}</td>
                    <td>${statusHtml}</td>
                    <td class="text-end pe-4">
                        ${book.issued
                            ? `<button class="btn btn-sm btn-light border" onclick="returnBook(${book.id})">Return</button>`
                            : `<button class="btn btn-sm btn-primary" onclick="openIssueModal(${book.id}, '${book.title}')">Issue</button>`}
                        <button class="btn btn-sm text-danger ms-1" onclick="deleteBook(${book.id})"><i class="fa fa-trash"></i></button>
                    </td>
                </tr>`;
            }).join('');
        });
}

// --- MEMBERS LOGIC ---
async function loadMembers() {
    try {
        const [mRes, bRes] = await Promise.all([fetch(`${API_BASE}/members`), fetch(`${API_BASE}/books`)]);
        const members = await mRes.json();
        const books = await bRes.json();
        
        document.getElementById('stat-total-members').innerText = members.length;
        const table = document.getElementById("memberTable");
        table.innerHTML = "";

        members.forEach(m => {
            const count = books.filter(b => b.issuedTo && b.issuedTo.id === m.id).length;
            table.innerHTML += `
                <tr>
                    <td class="ps-4 text-muted">#${m.id}</td>
                    <td>
                        <div class="fw-bold">${m.name}</div>
                        <div class="small text-muted"><i class="fa fa-phone me-1"></i>${m.phoneNumber || 'N/A'}</div>
                    </td>
                    <td>${m.email}</td>
                    <td><span class="badge ${count > 0 ? 'bg-primary' : 'bg-light text-dark border'} rounded-pill px-3">${count} Books</span></td>
                    <td class="text-end pe-4">
                        <button class="btn btn-sm text-danger border-0" onclick="deleteMember(${m.id})"><i class="fa fa-trash-can"></i></button>
                    </td>
                </tr>`;
        });
    } catch (e) { console.error(e); }
}

// ISSUE & RETURN
async function openIssueModal(id, title) {
    document.getElementById("hiddenBookId").value = id;
    document.getElementById("displayBookTitle").innerText = title;
    const res = await fetch(`${API_BASE}/members`);
    const members = await res.json();
    const dropdown = document.getElementById("memberDropdown");
    dropdown.innerHTML = '<option value="" selected disabled>-- Select Member --</option>';
    members.forEach(m => dropdown.innerHTML += `<option value="${m.id}">${m.name} (ID: ${m.id})</option>`);
    new bootstrap.Modal(document.getElementById('issueBookModal')).show();
}

function submitIssue() {
    const bId = document.getElementById("hiddenBookId").value;
    const mId = document.getElementById("memberDropdown").value;
    if(!mId) return alert("Select a member");
    fetch(`${API_BASE}/books/issue/${bId}/${mId}`, { method: "POST" }).then(() => {
        bootstrap.Modal.getInstance(document.getElementById('issueBookModal')).hide();
        loadBooks(); loadMembers();
    });
}

function returnBook(id) {
    fetch(`${API_BASE}/books/return/${id}`, { method: "POST" }).then(() => { loadBooks(); loadMembers(); });
}

// FORMS & DELETES
let isSubmittingMember = false;
document.getElementById("memberForm").addEventListener("submit", function(e) {
    e.preventDefault();
    if(isSubmittingMember) return;
    isSubmittingMember = true;
    const member = { 
        name: document.getElementById("mName").value, 
        email: document.getElementById("mEmail").value, 
        phoneNumber: document.getElementById("mPhone").value 
    };
    fetch(`${API_BASE}/members`, {
        method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(member)
    }).then(res => {
        if(res.ok) { bootstrap.Modal.getInstance(document.getElementById('addMemberModal')).hide(); this.reset(); loadMembers(); }
        else alert("Duplicate Email or Invalid Data");
    }).finally(() => isSubmittingMember = false);
});

function deleteMember(id) {
    if(confirm("Delete member?")) {
        fetch(`${API_BASE}/members/${id}`, { method: "DELETE" }).then(res => {
            if(res.ok) loadMembers();
            else alert("Denied: Member has books to return!");
        });
    }
}

document.getElementById("bookForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const book = { title: document.getElementById("title").value, author: document.getElementById("author").value, year: document.getElementById("year").value };
    fetch(`${API_BASE}/books`, { method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(book) })
    .then(() => { bootstrap.Modal.getInstance(document.getElementById('addBookModal')).hide(); this.reset(); loadBooks(); });
});

function deleteBook(id) { if(confirm("Delete book?")) fetch(`${API_BASE}/books/${id}`, { method: "DELETE" }).then(() => loadBooks()); }
