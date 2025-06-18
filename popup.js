// Function to derive a key from a password using PBKDF2
async function deriveKey(password, salt, iterations, hashAlgorithm) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveBits", "deriveKey"]
    );
    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: iterations,
            hash: hashAlgorithm,
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 }, // Using AES-GCM for encryption
        true,
        ["encrypt", "decrypt"]
    );
}

// Helper function to convert ArrayBuffer to base64 string
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

// Helper function to convert base64 string to ArrayBuffer
function base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}


// Modified savePassword function to hash and encrypt
async function savePassword() {
    var passwordInput = document.getElementById('password');
    var password = passwordInput.value;

    if (!password) {
        console.log("Password input is empty.");
        alert("Please enter a password.");
        return;
    }

    // --- SECURITY IMPROVEMENT ---
    // In a real application:
    // 1. The user should set a master password when they first use the extension.
    // 2. A salt should be generated *once* per user/installation and stored securely.
    // 3. The master password should be hashed using PBKDF2 (or Argon2) with the salt and stored.
    // 4. The encryption key should be derived from the master password using PBKDF2 and the stored salt.
    // This example uses a placeholder master password and generates a new salt each time, which is NOT secure.
    // It demonstrates the *mechanism* of key derivation and encryption.

    const masterPasswordPlaceholder = "ReplaceWithUsersMasterPassword"; // !!! SECURELY GET THIS FROM USER !!!
    const salt = crypto.getRandomValues(new Uint8Array(16)); // !!! GENERATE ONCE AND STORE SECURELY !!!
    const iterations = 310000; // Recommended iterations (NIST recommends >= 310,000 for PBKDF2-SHA256)
    const hashAlgorithm = "SHA-256";

    try {
        // 1. Derive an encryption key from the master password and salt
        const encryptionKey = await deriveKey(masterPasswordPlaceholder, salt, iterations, hashAlgorithm);

        // 2. Generate a unique Initialization Vector (IV) for this encryption
        const iv = crypto.getRandomValues(new Uint8Array(12)); // AES-GCM recommended IV length is 12 bytes

        const enc = new TextEncoder();
        const encodedPassword = enc.encode(password);

        // 3. Encrypt the password using the derived key and IV
        const ciphertextBuffer = await crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: iv,
            },
            encryptionKey,
            encodedPassword
        );

        // 4. Convert the ciphertext, IV, and salt to base64 for storage
        const ciphertextBase64 = arrayBufferToBase64(ciphertextBuffer);
        const ivBase64 = arrayBufferToBase64(iv);
        const saltBase64 = arrayBufferToBase64(salt); // Store the salt used for key derivation

        // 5. Store the encrypted data, IV, and salt in chrome.storage.local
        chrome.storage.local.set({
            'encryptedPassword': ciphertextBase64,
            'iv': ivBase64,
            'keyDerivationSalt': saltBase64 // Store the salt used for deriving the encryption key
        }, function () {
            console.log('Encrypted password, IV, and salt saved.');
            alert('Password saved securely (encrypted).');
        });

        // In a real application, you would ALSO hash the master password during initial setup
        // and store that hash and its salt separately for authentication (login).
        // Example (would be in a separate function):
        /*
        const masterPasswordSaltForHashing = crypto.getRandomValues(new Uint8Array(16)); // New salt for hashing the master password itself
        const hashedMasterPasswordBuffer = await hashPassword(masterPasswordPlaceholder, masterPasswordSaltForHashing, iterations, hashAlgorithm);
        const hashedMasterPasswordBase64 = arrayBufferToBase64(hashedMasterPasswordBuffer);
        const masterPasswordSaltForHashingBase64 = arrayBufferToBase64(masterPasswordSaltForHashing);
        chrome.storage.local.set({
             'hashedMasterPassword': hashedMasterPasswordBase64,
             'masterPasswordSaltForHashing': masterPasswordSaltForHashingBase64
        }, function() {
             console.log('Hashed master password and its salt saved.');
        });
        */


    } catch (e) {
        console.error("Error during encryption:", e);
        alert("Failed to save password securely.");
    }
}

// --- SECURITY IMPROVEMENT: Added function to load and decrypt password ---
async function loadPassword() {
    // --- SECURITY NOTE ---
    // This function also uses the placeholder master password.
    // In a real application, the user would need to provide their master password to decrypt.
    // The salt for key derivation should be loaded from storage.
    const masterPasswordPlaceholder = "ReplaceWithUsersMasterPassword"; // !!! SECURELY GET THIS FROM USER !!!
    const iterations = 310000; // Must match the iterations used for encryption
    const hashAlgorithm = "SHA-256"; // Must match the hash algorithm used for encryption

    try {
        // 1. Retrieve the encrypted data, IV, and salt from storage
        chrome.storage.local.get(['encryptedPassword', 'iv', 'keyDerivationSalt'], async function(data) {
            const ciphertextBase64 = data.encryptedPassword;
            const ivBase64 = data.iv;
            const saltBase64 = data.keyDerivationSalt;

            if (!ciphertextBase64 || !ivBase64 || !saltBase64) {
                console.log("No encrypted password found in storage.");
                // Handle case where no password is saved
                return;
            }

            const ciphertextBuffer = base64ToArrayBuffer(ciphertextBase64);
            const iv = base64ToArrayBuffer(ivBase64);
            const salt = base64ToArrayBuffer(saltBase64); // Use the stored salt

            // 2. Derive the decryption key using the master password and stored salt
            const decryptionKey = await deriveKey(masterPasswordPlaceholder, salt, iterations, hashAlgorithm);

            // 3. Decrypt the ciphertext using the derived key and IV
            const plaintextBuffer = await crypto.subtle.decrypt(
                {
                    name: "AES-GCM",
                    iv: iv,
                },
                decryptionKey,
                ciphertextBuffer
            );

            // 4. Convert the plaintext ArrayBuffer back to a string
            const dec = new TextDecoder();
            const decryptedPassword = dec.decode(plaintextBuffer);

            console.log('Decrypted password:', decryptedPassword);
            alert('Password loaded and decrypted (check console).');

            // You would typically display this decrypted password in a secure manner
            // or use it for autofill, NOT just log it to console in a real app.

        });
    } catch (e) {
        console.error("Error during decryption:", e);
        alert("Failed to load password securely.");
    }
}


// --- Event Listeners ---
// Add event listeners after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Bind the savePassword function to the save button click
    const saveButton = document.getElementById('saveButton');
    if (saveButton) {
        saveButton.addEventListener('click', savePassword);
    }

    // Bind the loadPassword function to the load button click
    const loadButton = document.getElementById('loadButton');
    if (loadButton) {
        loadButton.addEventListener('click', loadPassword);
    }
});
