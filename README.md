# 🔐 Simple Password Manager Chrome Extension

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue.svg)](https://developer.chrome.com/docs/extensions/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

A **demonstration** Chrome extension that showcases secure password storage using modern web cryptography. This project implements AES-GCM encryption with PBKDF2 key derivation to safely store and retrieve passwords in the browser's local storage.

> ⚠️ **Important**: This is an educational/demonstration project and should **NOT** be used for storing sensitive data in production environments.

## ✨ Features

- 🔒 **Strong Encryption**: AES-GCM with 256-bit keys
- 🔑 **Secure Key Derivation**: PBKDF2 with SHA-256 and random salt
- 🎯 **Simple Interface**: Clean, intuitive popup UI
- 🌐 **Web Crypto API**: Leverages browser's native cryptographic functions
- 💾 **Local Storage**: Encrypted data stored securely in Chrome's local storage
- 🚀 **Lightweight**: Minimal footprint with no external dependencies

## 📸 Screenshots

*Coming soon - Screenshots will be added to showcase the extension's interface*

<!-- Uncomment when screenshots are available:
![Extension Popup](screenshots/popup.png)
-->

## 🔧 How It Works

1. **Save Password**: 
   - User enters a password in the popup interface
   - Password is encrypted using AES-GCM with a randomly generated salt and IV
   - Encrypted data is stored in Chrome's local storage

2. **Load Password**: 
   - Extension retrieves encrypted data from local storage
   - Decrypts the password using the stored salt and IV
   - Displays the decrypted password (for demonstration purposes)

### 🔐 Cryptographic Implementation

- **Algorithm**: AES-GCM (Galois/Counter Mode)
- **Key Derivation**: PBKDF2 with SHA-256
- **Key Length**: 256 bits
- **Salt**: 128-bit random salt (generated per encryption)
- **IV**: 96-bit random initialization vector
- **Iterations**: 100,000 PBKDF2 iterations

---

## 🚀 Installation

### Method 1: Direct Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/patel5d2/Password-Manager.git
   cd Password-Manager
   ```

2. **Load the extension in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable **"Developer mode"** (toggle in the top right corner)
   - Click **"Load unpacked"** button
   - Select the `Password-Manager` directory
   - The extension icon will appear in your browser's toolbar

### Method 2: Download ZIP

1. Download the repository as a ZIP file from GitHub
2. Extract the ZIP file to your desired location
3. Follow steps 2 from Method 1 above

### 🛠️ Requirements

- Google Chrome (version 88 or later recommended)
- Chrome Developer Mode enabled
- No additional dependencies required

---

## 📖 Usage

### Basic Operations

1. **Access the Extension**:
   - Click the extension icon in your Chrome toolbar
   - The popup window will open

2. **Save a Password**:
   - Enter your password in the input field
   - Click **"Save Password"**
   - The password will be encrypted and stored locally
   - You'll see a confirmation message

3. **Retrieve a Password**:
   - Click **"Load Password"**
   - The stored password will be decrypted and displayed
   - Check the browser console for additional technical details

### 🎯 Use Cases

- **Learning**: Understand how modern web cryptography works
- **Development**: Use as a reference for implementing secure storage
- **Education**: Demonstrate encryption/decryption concepts
- **Prototyping**: Base for building more comprehensive password managers

---

## 📁 Project Structure

```
Password-Manager/
├── 📄 manifest.json          # Chrome extension manifest (v3)
├── 🎨 style.css              # Global styling and theme
├── 🔧 main.js                # Additional demo utilities
├── 📖 README.md              # Project documentation
├── 🖼️ f548522d-...jpeg       # Sample image asset
├── 📁 js/                    # JavaScript modules
│   ├── ⚙️ crypto.js          # Cryptographic functions
│   └── 🔄 popup.js           # UI logic and event handlers
├── 📁 views/                 # User interface components
│   └── 🎨 popup.html         # Extension popup interface
└── 📁 .vscode/               # VS Code configuration
    └── ⚙️ settings.json       # Editor settings
```

### 📋 File Descriptions

| File/Directory | Purpose | Key Features |
|----------------|---------|-------------|
| `manifest.json` | Chrome extension configuration | Manifest v3, permissions, popup configuration |
| `style.css` | Global styling | Modern CSS, theming, responsive design |
| `js/crypto.js` | Cryptographic core | AES-GCM encryption, PBKDF2 key derivation |
| `js/popup.js` | UI logic | Event handlers, DOM manipulation, user interactions |
| `views/popup.html` | User interface | Clean popup design, semantic HTML |
| `main.js` | Development utilities | Additional demo/testing functions |

### 🏗️ Modular Architecture

- **📱 Frontend**: Semantic HTML5 + Modern CSS3 in `/views`
- **⚙️ Core Logic**: Modular JavaScript (ES6+) in `/js`
  - `crypto.js`: Pure cryptographic functions
  - `popup.js`: UI logic and user interactions
- **🔒 Security**: Web Crypto API with zero external dependencies
- **💾 Storage**: Chrome's secure local storage API
- **🎨 Styling**: Centralized CSS with modern design patterns

---

## ⚠️ Security Considerations

> **Critical**: This is a **demonstration project** and has several security limitations that make it unsuitable for production use:

### 🚨 Current Limitations

- **Hardcoded Master Password**: Uses a placeholder instead of user-defined master password
- **Salt Management**: Generates new salt for each encryption (should be per-user and persistent)
- **Single Password Storage**: Only stores one password at a time
- **No Authentication**: Missing user authentication mechanisms
- **Local Storage Only**: No secure cloud backup or sync
- **Limited Access Control**: No session management or auto-lock features

### 🛡️ Production Requirements

To make this production-ready, implement:

- [ ] User-defined master password with secure storage
- [ ] Proper salt management and user session handling
- [ ] Multiple password entries with categories
- [ ] Auto-lock after inactivity
- [ ] Secure backup and synchronization
- [ ] Password strength validation
- [ ] Two-factor authentication support
- [ ] Secure password generation
- [ ] Import/export functionality with encryption
- [ ] Auto-fill capabilities for web forms
- [ ] Cross-browser compatibility (Firefox, Edge)
- [ ] Biometric authentication support

## 🔒 Technical Security Details

- **Encryption Standard**: AES-256-GCM (AEAD - Authenticated Encryption)
- **Key Derivation**: PBKDF2-SHA256 with 310,000 iterations (NIST recommended)
- **Salt Generation**: 128-bit cryptographically secure random salt
- **IV Generation**: 96-bit random initialization vector per encryption
- **Random Generation**: `crypto.getRandomValues()` for secure entropy
- **Data Integrity**: Built-in authentication with GCM mode
- **Storage**: Chrome's secure local storage API with JSON serialization
- **Code Architecture**: Modular separation of cryptographic and UI concerns

## 👨‍💻 Author

**Dharmin Patel**
- GitHub: [@patel5d2](https://github.com/patel5d2)
- Project: [Password-Manager](https://github.com/patel5d2/Password-Manager)

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License - Feel free to use, modify, and distribute
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### 🐛 Bug Reports
- Use the issue tracker to report bugs
- Include steps to reproduce the issue
- Provide browser version and OS information

### 🚀 Feature Requests
- Open an issue to discuss new features
- Explain the use case and expected behavior
- Consider backward compatibility

### 💻 Pull Requests
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### 📝 Development Guidelines
- Follow existing code style and conventions
- Add comments for complex cryptographic operations
- Test thoroughly before submitting
- Update documentation as needed

## 🔗 Related Resources

- [Chrome Extension Development](https://developer.chrome.com/docs/extensions/)
- [Web Crypto API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [OWASP Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
- [PBKDF2 Best Practices](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf)

## ⭐ Support

If you find this project helpful:
- ⭐ Star the repository
- 🍴 Fork it for your own experiments  
- 📢 Share it with others learning web cryptography
- 🐛 Report issues to help improve it

---

<div align="center">
  <strong>Built with ❤️ for learning and demonstration purposes</strong>
</div>
