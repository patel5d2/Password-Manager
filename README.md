# Simple Password Manager Chrome Extension

A minimal Chrome extension for securely storing and retrieving a password, using modern encryption methods.  
**Note:** This is a demonstration project and should not be used for sensitive data in production.

---

## Features

- Securely saves a password in your browser's local storage
- Password is encrypted using AES-GCM with a key derived by PBKDF2 (SHA-256, random salt & IV)
- Simple popup UI for entering, saving, and loading passwords
- All cryptography handled by the Web Crypto API

---

## Screenshots

<!-- If you have screenshots, add them here. Example: -->
<!-- ![screenshot](f548522d-77b9-40aa-8faf-f3725fb95fff.jpeg) -->

---

## How It Works

- Enter a password in the extension's popup and click "Save Password"
- The password is encrypted and stored in Chrome's local storage
- Click "Load Password" to decrypt and retrieve the password

**Security Notes:**
- A placeholder master password is currently used for key derivation.  
  _You must implement a real master password workflow for real-world use!_
- A new salt is generated for each save; in a real app, the salt should be generated once per user and stored securely.
- For demonstration only; see code comments for improvements needed in production.

---

## Installation

1. Clone or download this repository:

   ```bash
   git clone https://github.com/patel5d2/Password-Manager.git
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" (top right)

4. Click **Load unpacked extension** and select the project directory

5. The extension will appear in your browser's toolbar

---

## Usage

1. Click the extension icon to open the popup.
2. Enter a password and click "Save Password" to encrypt and store it.
3. Click "Load Password" to decrypt and retrieve your password (shown in a popup and console).

---

## Project Structure

- `manifest.json` &mdash; Extension manifest
- `popup.html` &mdash; Popup UI
- `popup.js` &mdash; Encryption, decryption, and storage logic
- `main.js` &mdash; Not used in extension logic (demo only)
- `f548522d-77b9-40aa-8faf-f3725fb95fff.jpeg` &mdash; (Optional) Example image

---

## Security Caveats

This project is **not** production-ready!  
- Master password is a hardcoded placeholder
- Salt and authentication logic are not fully implemented
- No password management or multi-entry support
- For educational/demo purposes only

---

## Author

- Dharmin Patel

---

## License

MIT (or specify your preferred license)

---

## Improvements & Contributions

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

See code comments in `popup.js` for ideas on making this extension more secure and user-friendly.
