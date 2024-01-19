function savePassword() {
    var passwordInput = document.getElementById('password');
    var password = passwordInput.value;
  
    // In a real scenario, you would hash and encrypt the password
    // before storing it. This is highly insecure and should not be used in practice.
    chrome.storage.local.set({ 'password': password }, function () {
      console.log('Password saved:', password);
    });
  }
  