// DOM Elements - all the elements we need from HTML
const passwordInput = document.getElementById("password");
const lengthSlider = document.getElementById("length");
const lengthDisplay = document.getElementById("length-value");
const uppercaseCheckbox = document.getElementById("uppercase");
const lowercaseCheckbox = document.getElementById("lowercase");
const numbersCheckbox = document.getElementById("numbers");
const symbolsCheckbox = document.getElementById("symbols");
const generateButton = document.getElementById("generate-btn");
const copyButton = document.getElementById("copy-btn");
const strengthBar = document.querySelector(".strength-bar");
const strengthText = document.querySelector(".strength-container p");
const strengthLabel = document.getElementById("strength-label");

// Character sets
const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
const numberCharacters = "0123456789";
const symbolCharacters = "!@#$%^&*()-_=+[]{}|;:,.<>?/";

// Update length display when slider changes        
lengthSlider.addEventListener("input", () => {
    lengthDisplay.textContent = lengthSlider.value;
});

// Generate password when button is clicked
generateButton.addEventListener("click", makePassword);

function makePassword() {
    const length = Number(lengthSlider.value);
    const includeUppercase = uppercaseCheckbox.checked;
    const includeLowercase = lowercaseCheckbox.checked;
    const includeNumbers = numbersCheckbox.checked;
    const includeSymbols = symbolsCheckbox.checked;

    //User must select at least one character type
    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
        alert("Please select at least one character type!");
        return;
    }

    const newPassword = createRandomPassword(length, includeUppercase, includeLowercase, includeNumbers, includeSymbols);
    passwordInput.value = newPassword;
    updateStrengthIndicator(newPassword);
}

function updateStrengthIndicator(password) {
    const length = password.length;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[!@#$%^&*()\-_=+\[\]{}|;:,.<>?\/]/.test(password);

    let strengthScore = 0;

    // Add points based on password length - Each character gives 2 points, but max contribution from length is 40
    strengthScore += Math.min(length * 2, 40);

    // Each type (uppercase, lowercase, numbers, symbols) gives 15 points
    if (hasUppercase) strengthScore += 15;
    if (hasLowercase) strengthScore += 15;
    if (hasNumbers) strengthScore += 15;
    if (hasSymbols) strengthScore += 15;

    // If password is less than 8 characters, cap the total score at 40
    if (length < 8) {
        strengthScore = Math.min(strengthScore, 40);
    }

    // Ensure the strength score is within the valid range
    const safeScore = Math.max(5, Math.min(100, strengthScore));
    strengthBar.style.width = safeScore + "%";

    let strengthLabelText = "";
    let barColor = "";

    // Update strength bar and text 
    if (strengthScore < 40) {
      // weak password
      barColor = "#fc8181"; // Red
      strengthLabelText = "Weak";
    } else if (strengthScore < 70) {
      // Medium password
      barColor = "#fbd38d"; // Yellow
      strengthLabelText = "Medium";
    } else {
      // Strong password
      barColor = "#68d391"; // Green
      strengthLabelText = "Strong";
    }

    strengthBar.style.backgroundColor = barColor;
    strengthLabel.textContent = strengthLabelText;
}

function createRandomPassword(length, includeUppercase, includeLowercase, includeNumbers, includeSymbols) {
    let characterPool = "";

    if (includeUppercase) characterPool += uppercaseLetters;
    if (includeLowercase) characterPool += lowercaseLetters;
    if (includeNumbers) characterPool += numberCharacters;
    if (includeSymbols) characterPool += symbolCharacters;  

    let password = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characterPool.length);
        password += characterPool[randomIndex];
    }

    return password;
}

// Copy password to clipboard
copyButton.addEventListener("click", () => {
    if (!passwordInput.value) return;
    // Use Clipboard API to copy text
    navigator.clipboard
        .writeText(passwordInput.value)
        .then(() => showCopySuccess())
        .catch((error) => console.log("Could not copy:", error));
});

function showCopySuccess() {
    // Change copy button to checkmark and color to green
    copyButton.classList.remove("far", "fa-copy");
    copyButton.classList.add("fas", "fa-check");
    copyButton.style.color = "#48bb78";

    //Button will revert back to copy icon after 1.5 seconds
    setTimeout(() => {
        copyButton.classList.remove("fas", "fa-check");
        copyButton.classList.add("far", "fa-copy");
        copyButton.style.color = "";
    }, 1500);
} 