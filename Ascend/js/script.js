const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

// Event listener to toggle navigation bar when hamburger icon is clicked
hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// User Login and Signup Functions
// If accounts key does not exist, initialize it
if (!(localStorage.getItem("ascendAccounts"))) {
  localStorage.setItem("ascendAccounts", JSON.stringify([]));
}

// Create global variable for accounts
let accounts, userAccount;
let login = document.getElementById("login");
let overlayBlur = document.createElement("div");
overlayBlur.classList.add("overlay-blur");

// If user is already logged in, change login button to account button with name
if (localStorage.getItem("ascendLoggedIn")) {
  userAccount = JSON.parse(localStorage.getItem("ascendUserAccount"));
  console.log(userAccount);
  login.innerText = `${userAccount[2]}`;
}

// Detect when login button is clicked
login.addEventListener("click", () => {
  // If user is already logged in, display account page
  if (localStorage.getItem("ascendLoggedIn")) {
    accountPopup();
  // Otherwise, display login page
  } else {
    loginPopup();
  }
  
  // Append overlay element to the HTML page
  document.body.appendChild(overlayBlur);
});

// Function to display account page
function accountPopup() {
  overlayBlur.innerHTML = `
    <div class="auth-wrapper">
      <button id="close-popup" onclick=closePopup()>X</button>
      <h1>Account Details</h1>
      <p><b>First Name: </b>${userAccount[2]}</p>
      <p><b>Last Name: </b>${userAccount[3]}</p>
      <p><b>User Email: </b>${userAccount[0]}</p>
      <p><b>Date Created: </b>${userAccount[4]}</p>
      <button id="logout-user" class="auth-button" onclick=logoutUser()>LOG OUT</button>
    </div>`;
}

// Function to log out user
function logoutUser() {
  // Remove keys for loggedIn and userAccount in localStorage
  localStorage.removeItem("ascendLoggedIn");
  localStorage.removeItem("ascendUserAccount");

  // Redirect to home page
  window.location.href = "home.html";
}

// Function for login page
function loginPopup() {
  overlayBlur.innerHTML = `
    <div class="auth-wrapper">
      <button id="close-popup" onclick=closePopup()>X</button>
      <h1>Log in</h1>
      <div id="login-status" class="auth-status"></div>
      <input id="user-email" class="auth-input" type="text" placeholder="Email Address" required>
      <input id="password" class="auth-input" type="password" placeholder="Password" required>
      <button id="login-user" class="auth-button" onclick=loginUser()>LOG IN</button>
      <p>No account yet? <span id="signup-switch" class="auth-switch" onclick=signupPopup()>Sign up</span> here.
    </div>`;
}

// Function to attempt user login
function loginUser() {
  // Get input values
  let userEmail = document.getElementById("user-email").value.trim();
  let password = document.getElementById("password").value;
  let loginStatus = document.getElementById("login-status");
  accounts = JSON.parse(localStorage.getItem("ascendAccounts"));

  // Attempt to retrieve account index from localStorage
  let accountIndex = getAccount(userEmail);

  // Checks if given email address exists in localStorage
  if (accountIndex != null) {
    // If user password matches account password, grant entry
    if (accounts[accountIndex][1] === password) {
      // Format login message box
      loginStatus.innerText = "Login successful!";
      loginStatus.style.backgroundColor = "#22865753";
      loginStatus.style.color = "#228657";
      loginStatus.style.border = "2px solid #228657";

      // Create keys for login and user accounts in localStorage
      localStorage.setItem("ascendLoggedIn", true);
      localStorage.setItem("ascendUserAccount", JSON.stringify(accounts[accountIndex]));

      // Redirect to home page
      window.location.href = "home.html";
    } else {
      // If user password does not match account password
      loginStatus.innerText = "Password is incorrect!";
    }
  } else {
    // If given email does not exist
    loginStatus.innerText = "Email address does not exist!";
  }

  // If login attempt failed, format the login message box
  if (loginStatus.innerText != "Login successful!") {
    loginStatus.style.backgroundColor = "#b4000044";
    loginStatus.style.color = "#b40000";
    loginStatus.style.border = "2px solid #b40000";
  }
}

// Function to create signup page
function signupPopup() {
  // Insert signup HTML into overlay
  overlayBlur.innerHTML = `
    <div class="auth-wrapper">
      <button id="close-popup" onclick=closePopup()>X</button>
      <h1>Sign up</h1>
      <div id="signup-status" class="auth-status"></div>
      <div class="name-input">
        <input id="first-name" class="auth-input" type="text" placeholder="First Name" >
        <input id="last-name" class="auth-input" type="text" placeholder="Last Name" >
      </div>
      <input id="new-email" class="auth-input" type="email" placeholder="Email Address" >
      <input id="new-password" class="auth-input" type="password" placeholder="Password" >
      <input id="confirm-password" class="auth-input" type="password" placeholder="Confirm Password" >
      <button id="signup-user" class="auth-button" onclick=signupUser()>SIGN UP</button>
      <p>Already have an account? <span id="login-switch" class="auth-switch" onclick=loginPopup()>Log in</span> here.
    </div>`;
}

// Function to validate name input
function validateName (firstName, lastName) {
  // Regex for name
  const namePattern = /^[a-zA-Z ]+$/;

  // If name input fields are empty
  if (firstName === "" || lastName === "") {
    return "Name fields cannot be left blank!";
  }
  
  // If name input is less than 3 or more than 32 characters
  if (firstName.length < 3 || firstName.length > 32 || lastName.length < 3 || lastName.length > 32) {
    return "First and last name must be between 3-32 characters!";
  }
  
  // If name input contains invalid characters
  if (!(namePattern.test(firstName) && namePattern.test(lastName))) {
    return "First and last name must only contain letters and spaces!";
  }

  //Return null if name input is valid
  return null;
}

//Function to validate email input 
function validateEmail(email) {
  // Regex for email
  const emailPattern = /^[a-z0-9\._-]+@[a-z0-9-]{2,}[.][a-z]{2,4}$/;

  // If email input field is empty
  if (email === "") {
    return "Please provide an email address!";
  } 
  
  // If email input format is invalid
  if (!(emailPattern.test(email))) {
    return "Please provide a valid email address! (john_doe@gmail.com, no uppercase)";
  }

  // Return null if email is valid
  return null;
}

function validatePassword(password, confirmPassword) {
  // Regex for password
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).+$/;

  // If password field is blank
  if (password === "") {
    return "Please provide a password!";
  }

  // If password is less than 8 characters
  if (password.length < 8) {
    return "Password must have at least 8 characters!" //No need to check empty?
  }

  // If password does not meet the requirements
  if (!(passwordPattern.test(password))) {
    return "Password must include at least one lowercase letter, uppercase letter, number and special character.";
  }
  
  // If the two password fields do not match
  if (password !== confirmPassword) {
    return "Password does not match.";
  }

  // Return null if password is valid
  return null;
}

// Function to attempt user signup
function signupUser() {
  // Retrieve input values
  let firstName = document.getElementById("first-name").value.trim();
  let lastName = document.getElementById("last-name").value.trim();
  let newEmail = document.getElementById("new-email").value.trim();
  let newPassword = document.getElementById("new-password").value;
  let confirmPassword = document.getElementById("confirm-password").value;
  let signupStatus = document.getElementById("signup-status");
  accounts = JSON.parse(localStorage.getItem("ascendAccounts"));
  
  // Check if email address has been used to create an account
  if (getAccount(newEmail)) {
    signupStatus.innerText = "Email address already exists!";
    return;
  
  // Check if error message was returned by input validation
  } else if (validateName(firstName, lastName)) {
    signupStatus.innerText = validateName(firstName, lastName);
  } else if (validateEmail(newEmail)) {
    signupStatus.innerText = validateEmail(newEmail);
  } else if (validatePassword(newPassword, confirmPassword)) {
    signupStatus.innerText = validatePassword(newPassword, confirmPassword);
  } else {
    // If there is no error, create user account
    let dateCreated = new Date().toLocaleDateString();
    let newAccount = [newEmail, newPassword, firstName, lastName, dateCreated];
    accounts.push(newAccount);
    localStorage.setItem("ascendAccounts", JSON.stringify(accounts));

    signupStatus.innerText = "Account created!";
  }

  // Change signup message box format if attempt is not successful
  if (signupStatus.innerText != "Account created!") {
    signupStatus.style.backgroundColor = "#b4000044";
    signupStatus.style.color = "#b40000";
    signupStatus.style.border = "2px solid #b40000";
  } else {
    signupStatus.style.backgroundColor = "#22865753";
    signupStatus.style.color = "#228657";
    signupStatus.style.border = "2px solid #228657";
  }
}

// Function to search for user account using email address
function getAccount(email) {
  accounts = JSON.parse(localStorage.getItem("ascendAccounts"));

  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i][0] == email) {
      return i;
    }
  }
  // Return null if no account is found
  return null;
}

// Function to close popup page
function closePopup() {
  overlayBlur.remove();
}

// Contact form validation
let contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent actual submission for validation

    const name = this.name.value.trim();
    const email = this.email.value.trim();
    const mobile = this.mobile.value.trim();
    const subject = this.subject.value;
    const description = this.description.value.trim();

    if (!name) {
      alert("Please enter your Name.");
      return;
    }

    if (!email) {
      alert("Please enter your Email address.");
      return;
    }

    if (!mobile) {
      alert("Please enter your Mobile number.");
      return;
    }

    if (!subject) {
      alert("Please select a Subject.");
      return;
    }

    if (!description) {
      alert("Please provide a Description.");
      return;
    }

    // If all fields are valid
    alert("Thank you! Your message has been submitted.");
    this.submit(); // Continue form submission if needed
  });
}

  // Wait until the page content is loaded
  window.addEventListener("DOMContentLoaded", () => {
    const scrollBtn = document.getElementById("scrollToTopBtn");

    // Show or hide the button based on scroll position
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 200) {
        scrollBtn.style.display = "flex";
      } else {
        scrollBtn.style.display = "none";
      }
    });

    // Scroll to top smoothly when button is clicked
    scrollBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });