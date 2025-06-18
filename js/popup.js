// js/popup.js

// --- STATE MANAGEMENT ---
let decryptedVault = null;
let masterPassword = null;

// --- DOM ELEMENTS ---
const views = {
    loading: document.getElementById('loading-view'),
    setup: document.getElementById('setup-view'),
    login: document.getElementById('login-view'),
    vault: document.getElementById('vault-view')
};
const errors = {
    setup: document.getElementById('setup-error'),
    login: document.getElementById('login-error'),
    vault: document.getElementById('vault-error')
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', main);

async function main() {
    showView('loading');
    try {
        const result = await chrome.storage.local.get(['vault', 'salt', 'hash']);
        if (result.vault && result.salt && result.hash) {
            showView('login');
        } else {
            showView('setup');
        }
    } catch (e) {
        showError('setup', 'Could not access storage.');
    }
    attachEventListeners();
}

function showView(viewName) {
    for (const key in views) {
        views[key].style.display = (key === viewName) ? 'block' : 'none';
    }
}

function showError(view, message) {
    if (errors[view]) {
        errors[view].textContent = message;
    }
}

// --- EVENT LISTENERS ---
function attachEventListeners() {
    // Setup View
    document.getElementById('create-vault-btn').addEventListener('click', handleSetup);
    // Login View
    document.getElementById('unlock-btn').addEventListener('click', handleLogin);
    // Vault View
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    document.getElementById('add-credential-btn').addEventListener('click', handleAddCredential);
}


// --- HANDLER FUNCTIONS ---

// SETUP: Create the vault for a new user
async function handleSetup() {
    const password = document.getElementById('setup-password').value;
    const confirm = document.getElementById('confirm-password').value;

    if (password.length < 12) {
        return showError('setup', 'Password must be at least 12 characters.');
    }
    if (password !== confirm) {
        return showError('setup', 'Passwords do not match.');
    }
    showError('setup', '');

    try {
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const saltB64 = btoa(String.fromCharCode(...salt));
        const hash = await hashMasterPassword(password, salt);

        const initialVault = { credentials: [] };
        const encryptedVault = await encryptVault(initialVault, password, salt);

        await chrome.storage.local.set({
            vault: encryptedVault,
            salt: saltB64,
            hash: hash
        });
        
        // Log in the user immediately after setup
        decryptedVault = initialVault;
        masterPassword = password;
        renderVault();
        showView('vault');

    } catch (e) {
        showError('setup', 'Could not create vault. Please try again.');
        console.error(e);
    }
}

// LOGIN: Unlock the existing vault
async function handleLogin() {
    const password = document.getElementById('login-password').value;
    if (!password) {
        return showError('login', 'Please enter your master password.');
    }
    showError('login', '');

    try {
        const stored = await chrome.storage.local.get(['salt', 'hash', 'vault']);
        const salt = new Uint8Array(atob(stored.salt).split("").map(c => c.charCodeAt(0)));
        
        const hashToVerify = await hashMasterPassword(password, salt);
        if (hashToVerify !== stored.hash) {
            return showError('login', 'Incorrect master password.');
        }

        decryptedVault = await decryptVault(stored.vault, password, salt);
        masterPassword = password; // Store master password in memory for the session
        renderVault();
        showView('vault');

    } catch (e) {
        showError('login', e.message);
        console.error(e);
    }
}

// LOGOUT: Lock the vault and clear session data
function handleLogout() {
    decryptedVault = null;
    masterPassword = null;
    document.getElementById('login-password').value = '';
    showView('login');
}

// VAULT: Add a new credential
async function handleAddCredential() {
    const website = document.getElementById('new-website').value;
    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;

    if (!website || !username || !password) {
        return showError('vault', 'All fields are required.');
    }
    showError('vault', '');

    decryptedVault.credentials.push({
        id: `cred_${Date.now()}`, // Simple unique ID
        website,
        username,
        password
    });

    await saveVault();
    renderVault();
    // Clear input fields
    document.getElementById('new-website').value = '';
    document.getElementById('new-username').value = '';
    document.getElementById('new-password').value = '';
}

// VAULT: Delete a credential
async function handleDeleteCredential(id) {
    decryptedVault.credentials = decryptedVault.credentials.filter(c => c.id !== id);
    await saveVault();
    renderVault();
}

// VAULT: Save the current state of the vault back to storage (encrypted)
async function saveVault() {
    try {
        const stored = await chrome.storage.local.get(['salt']);
        const salt = new Uint8Array(atob(stored.salt).split("").map(c => c.charCodeAt(0)));
        const encryptedVault = await encryptVault(decryptedVault, masterPassword, salt);
        await chrome.storage.local.set({ vault: encryptedVault });
    } catch(e) {
        showError('vault', 'Failed to save vault!');
        console.error(e);
    }
}


// --- RENDERING ---

// Renders the list of credentials in the vault view
function renderVault() {
    const list = document.getElementById('credentials-list');
    list.innerHTML = ''; // Clear previous list

    if (!decryptedVault || decryptedVault.credentials.length === 0) {
        list.innerHTML = '<p>Your vault is empty. Add a new login below.</p>';
        return;
    }

    decryptedVault.credentials.forEach(cred => {
        const item = document.createElement('div');
        item.className = 'credential-item';
        item.innerHTML = `
            <div class="credential-info">
                <strong>${cred.website}</strong><br>
                <span>${cred.username}</span>
            </div>
            <div class="credential-actions">
                <button class="copy-btn" data-type="username" data-value="${cred.username}">Copy User</button>
                <button class="copy-btn" data-type="password" data-value="${cred.password}">Copy Pass</button>
                <button class="delete-btn" data-id="${cred.id}">Delete</button>
            </div>
        `;
        list.appendChild(item);
    });

    // Add event listeners for the new buttons
    list.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => handleDeleteCredential(btn.dataset.id));
    });
    list.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            navigator.clipboard.writeText(btn.dataset.value);
            const originalText = e.target.textContent;
            e.target.textContent = 'Copied!';
            setTimeout(() => { e.target.textContent = originalText; }, 1500);
        });
    });
}