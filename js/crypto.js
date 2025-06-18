// js/crypto.js

const CRYPTO_CONFIG = {
    pbkdf2: {
        iterations: 500000, // Increased iterations for stronger key derivation
        hash: "SHA-256"
    },
    aes: {
        name: "AES-GCM",
        length: 256
    }
};

// --- KEY DERIVATION ---

// Derives a key from a master password and salt.
// Used for both master key hashing and vault encryption.
async function deriveKey(password, salt, usage) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: CRYPTO_CONFIG.pbkdf2.iterations,
            hash: CRYPTO_CONFIG.pbkdf2.hash,
        },
        keyMaterial,
        (usage === 'encrypt') ? { name: CRYPTO_CONFIG.aes.name, length: CRYPTO_CONFIG.aes.length } : { name: "HMAC", hash: "SHA-256" },
        true,
        (usage === 'encrypt') ? ["encrypt", "decrypt"] : ["sign"]
    );
}

// --- VAULT ENCRYPTION & DECRYPTION ---

// Encrypts the vault data (as a JSON string)
async function encryptVault(vaultObject, masterPassword, salt) {
    const encryptionKey = await deriveKey(masterPassword, salt, 'encrypt');
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const encodedVault = enc.encode(JSON.stringify(vaultObject));

    const encryptedData = await crypto.subtle.encrypt(
        { name: CRYPTO_CONFIG.aes.name, iv: iv },
        encryptionKey,
        encodedVault
    );

    // Return IV and encrypted data as base64 strings
    return {
        iv: btoa(String.fromCharCode(...new Uint8Array(iv))),
        data: btoa(String.fromCharCode(...new Uint8Array(encryptedData)))
    };
}

// Decrypts the vault data
async function decryptVault(encryptedVault, masterPassword, salt) {
    try {
        const encryptionKey = await deriveKey(masterPassword, salt, 'encrypt');
        
        const iv = new Uint8Array(atob(encryptedVault.iv).split("").map(c => c.charCodeAt(0)));
        const data = new Uint8Array(atob(encryptedVault.data).split("").map(c => c.charCodeAt(0)));

        const decryptedData = await crypto.subtle.decrypt(
            { name: CRYPTO_CONFIG.aes.name, iv: iv },
            encryptionKey,
            data
        );

        const dec = new TextDecoder();
        return JSON.parse(dec.decode(decryptedData));
    } catch (e) {
        console.error("Decryption failed:", e);
        // This error is critical, often indicates a wrong password
        throw new Error("Decryption failed. Incorrect master password.");
    }
}

// --- MASTER PASSWORD HASHING ---

// Creates a hash of the master password for verification during login.
// This hash is stored so we never have to store the master password itself.
async function hashMasterPassword(password, salt) {
    const key = await deriveKey(password, salt, 'sign');
    const enc = new TextEncoder();
    const signature = await crypto.subtle.sign("HMAC", key, enc.encode("master-password-verification"));
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
}