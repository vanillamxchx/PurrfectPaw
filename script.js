const moodButton = document.getElementById("surprise-btn");
const moodNote = document.getElementById("mood-note");
const catGalleryFrame = document.getElementById("cat-gallery-frame");
const catGalleryPhoto = document.getElementById("cat-gallery-photo");
const catGalleryTitle = document.getElementById("cat-gallery-title");
const catGalleryText = document.getElementById("cat-gallery-text");
const revealItems = document.querySelectorAll(".reveal");
const authModal = document.getElementById("auth-modal");
const openAccountLink = document.getElementById("open-account-link");
const openAccountButton = document.getElementById("open-account-button");
const closeAuthModal = document.getElementById("close-auth-modal");
const authForm = document.getElementById("auth-form");
const authIntro = document.getElementById("auth-intro");
const authSubmit = document.getElementById("auth-submit");
const formMessage = document.getElementById("form-message");
const navAccountLink = document.getElementById("open-account-link");
const loginTab = document.getElementById("login-tab");
const signupTab = document.getElementById("signup-tab");
const nameGroup = document.getElementById("name-group");
const usernameGroup = document.getElementById("username-group");
const confirmGroup = document.getElementById("confirm-group");
const passwordChecklist = document.getElementById("password-checklist");
const emailCheck = document.getElementById("email-check");
const confirmCheck = document.getElementById("confirm-check");
const nameInput = document.getElementById("name");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const passwordToggles = document.querySelectorAll(".password-toggle");
const ruleLength = document.getElementById("rule-length");
const ruleCase = document.getElementById("rule-case");
const ruleNumber = document.getElementById("rule-number");
const ruleSpecial = document.getElementById("rule-special");
const memberHub = document.getElementById("member-hub");
const hubLogoutButton = document.getElementById("hub-logout-button");

const moods = [
  "Mochi says: today is perfect for a caramel latte and a long nap.",
  "Biscuit says: order something sweet and sit where the sun reaches your shoes.",
  "Miso says: bring your favorite person and split a plate of cupcakes.",
  "Pebble says: slow down, breathe deep, and let a purring cat reset your day."
];

const featuredCats = [
  {
    name: "Mochi",
    photo: "assets/cat1.jpg",
    description: "Professional lap warmer, biscuit maker, and unofficial cafe host."
  },
  {
    name: "Miso",
    photo: "assets/cat2.avif",
    description: "Curious window watcher who inspects every pastry box with care."
  },
  {
    name: "Pebble",
    photo: "assets/cat3.jpg",
    description: "Gentle greeter known for calm blinks and dramatic stretch routines."
  },
  {
    name: "Luna",
    photo: "assets/cat4.webp",
    description: "Soft-footed explorer who claims the moonlit corner seat every evening."
  },
  {
    name: "Tofu",
    photo: "assets/cat5.avif",
    description: "Round little snuggler with a talent for stealing hearts and warm blankets."
  },
  {
    name: "Maple",
    photo: "assets/cat6.avif",
    description: "Sweet and curious companion who follows the scent of pastries all day."
  }
];

let activeFeaturedCatIndex = 0;
let featuredCatTransitionTimer = null;

const setFeaturedCat = (index) => {
  if (!catGalleryPhoto || !catGalleryTitle || !catGalleryText) {
    return;
  }

  const boundedIndex = Math.max(0, Math.min(featuredCats.length - 1, index));
  const selectedCat = featuredCats[boundedIndex];
  activeFeaturedCatIndex = boundedIndex;

  if (featuredCatTransitionTimer) {
    window.clearTimeout(featuredCatTransitionTimer);
  }

  catGalleryPhoto.classList.add("is-switching");
  catGalleryTitle.classList.add("is-switching");
  catGalleryText.classList.add("is-switching");

  featuredCatTransitionTimer = window.setTimeout(() => {
    catGalleryPhoto.src = selectedCat.photo;
    catGalleryPhoto.alt = `${selectedCat.name} from Purrfect Paw`;
    catGalleryTitle.textContent = `Meet ${selectedCat.name}`;
    catGalleryText.textContent = selectedCat.description;

    catGalleryPhoto.classList.remove("is-switching");
    catGalleryTitle.classList.remove("is-switching");
    catGalleryText.classList.remove("is-switching");
  }, 120);
};

if (catGalleryFrame && catGalleryPhoto && catGalleryTitle && catGalleryText) {
  setFeaturedCat(0);

  catGalleryFrame.addEventListener("mousemove", (event) => {
    const frameBounds = catGalleryFrame.getBoundingClientRect();
    const relativeX = event.clientX - frameBounds.left;
    const segmentWidth = frameBounds.width / featuredCats.length;
    const nextIndex = Math.min(
      featuredCats.length - 1,
      Math.max(0, Math.floor(relativeX / segmentWidth))
    );

    if (nextIndex !== activeFeaturedCatIndex) {
      setFeaturedCat(nextIndex);
    }
  });

  catGalleryFrame.addEventListener("mouseleave", () => {
    setFeaturedCat(0);
  });
}

if (moodButton && moodNote) {
  moodButton.addEventListener("click", () => {
    const nextMood = moods[Math.floor(Math.random() * moods.length)];
    moodNote.textContent = nextMood;
    moodNote.classList.remove("updated");

    requestAnimationFrame(() => {
      moodNote.classList.add("updated");
    });
  });
}

const openModal = () => {
  if (!authModal) {
    return;
  }

  authModal.classList.add("is-open");
  authModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
};

const closeModal = () => {
  if (!authModal) {
    return;
  }

  authModal.classList.remove("is-open");
  authModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
};

if (openAccountLink) {
  openAccountLink.addEventListener("click", (event) => {
    event.preventDefault();
    openModal();
  });
}

if (openAccountButton) {
  openAccountButton.addEventListener("click", openModal);
}

if (closeAuthModal) {
  closeAuthModal.addEventListener("click", closeModal);
}

if (authModal) {
  authModal.addEventListener("click", (event) => {
    if (event.target === authModal) {
      closeModal();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && authModal && authModal.classList.contains("is-open")) {
    closeModal();
  }
});

let authMode = "login";

const setAuthMode = (mode) => {
  authMode = mode;

  const isSignup = mode === "signup";
  loginTab.classList.toggle("active", !isSignup);
  signupTab.classList.toggle("active", isSignup);
  loginTab.setAttribute("aria-selected", String(!isSignup));
  signupTab.setAttribute("aria-selected", String(isSignup));
  nameGroup.classList.toggle("hidden-field", !isSignup);
  nameGroup.classList.toggle("visible-field", isSignup);
  usernameGroup.classList.toggle("hidden-field", !isSignup);
  usernameGroup.classList.toggle("visible-field", isSignup);
  confirmGroup.classList.toggle("hidden-field", !isSignup);
  confirmGroup.classList.toggle("visible-field", isSignup);
  passwordChecklist.classList.toggle("hidden-field", !isSignup);
  passwordChecklist.classList.toggle("visible-field", isSignup);
  emailCheck.classList.toggle("hidden-field", !isSignup);
  emailCheck.classList.toggle("visible-field", isSignup);
  nameInput.required = isSignup;
  usernameInput.required = isSignup;
  confirmPasswordInput.required = isSignup;
  authIntro.textContent = isSignup
    ? "Create your account and collect cute cafe perks."
    : "Welcome back. Your favorite window seat might be waiting.";
  authSubmit.textContent = isSignup ? "Create My Account" : "Login";
  formMessage.textContent = "";
  formMessage.classList.remove("success");
  clearLoginValidationState();
  emailCheck.textContent = isSignup ? "Enter a valid email address." : "";
  emailCheck.classList.remove("is-valid", "is-invalid");
  if (confirmCheck) {
    confirmCheck.textContent = isSignup ? "Re-enter your password to confirm it." : "";
    confirmCheck.classList.remove("is-valid", "is-invalid");
  }
};

const passwordRules = (password) => ({
  length: password.length >= 8,
  case: /[a-z]/.test(password) && /[A-Z]/.test(password),
  number: /\d/.test(password),
  special: /[^A-Za-z0-9]/.test(password)
});

const updatePasswordChecklist = () => {
  const rules = passwordRules(passwordInput.value);
  ruleLength.classList.toggle("is-valid", rules.length);
  ruleCase.classList.toggle("is-valid", rules.case);
  ruleNumber.classList.toggle("is-valid", rules.number);
  ruleSpecial.classList.toggle("is-valid", rules.special);
  return rules;
};

const emailRules = (email) => ({
  valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
});

const updateEmailValidation = () => {
  if (authMode !== "signup") {
    return { valid: true };
  }

  const email = emailInput.value.trim();
  const rules = emailRules(email);

  if (!email) {
    emailCheck.textContent = "Enter a valid email address.";
    emailCheck.classList.remove("is-valid", "is-invalid");
    return rules;
  }

  emailCheck.textContent = rules.valid ? "Valid email format." : "Please enter a valid email address.";
  emailCheck.classList.toggle("is-valid", rules.valid);
  emailCheck.classList.toggle("is-invalid", !rules.valid);
  return rules;
};

const updateConfirmPasswordValidation = () => {
  if (authMode !== "signup" || !confirmCheck) {
    return { valid: true };
  }

  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (!confirmPassword) {
    confirmCheck.textContent = "Re-enter your password to confirm it.";
    confirmCheck.classList.remove("is-valid", "is-invalid");
    return { valid: false };
  }

  const valid = password === confirmPassword;
  confirmCheck.textContent = valid
    ? "Passwords match."
    : "Passwords do not match yet.";
  confirmCheck.classList.toggle("is-valid", valid);
  confirmCheck.classList.toggle("is-invalid", !valid);
  return { valid };
};

const currentUserKey = "purrfectPawCurrentUser";

const setCurrentUser = (user) => {
  localStorage.setItem(currentUserKey, JSON.stringify(user));
};

const getCurrentUser = () => {
  const storedUser = localStorage.getItem(currentUserKey);
  return storedUser ? JSON.parse(storedUser) : null;
};

const clearCurrentUser = () => {
  localStorage.removeItem(currentUserKey);
};

const clearLoginValidationState = () => {
  emailInput.classList.remove("input-invalid");
  passwordInput.classList.remove("input-invalid");
};

const getCartKey = (email) => `purrfectPawCart:${email}`;

const hideMemberHub = () => {
  if (memberHub) {
    memberHub.classList.add("hidden-hub");
    memberHub.classList.remove("visible-hub");
    memberHub.setAttribute("aria-hidden", "true");
  }
  if (navAccountLink) {
    navAccountLink.textContent = "Login/Sign Up";
  }
};

const saveUser = (user) => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem("purrfectPawUsers", JSON.stringify(users));
};

const getUsers = () => {
  const storedUsers = localStorage.getItem("purrfectPawUsers");
  return storedUsers ? JSON.parse(storedUsers) : [];
};

if (loginTab && signupTab) {
  loginTab.addEventListener("click", () => setAuthMode("login"));
  signupTab.addEventListener("click", () => setAuthMode("signup"));
}

if (passwordInput) {
  passwordInput.addEventListener("input", () => {
    updatePasswordChecklist();
    updateConfirmPasswordValidation();
  });
}

if (emailInput) {
  emailInput.addEventListener("input", updateEmailValidation);
}

if (confirmPasswordInput) {
  confirmPasswordInput.addEventListener("input", updateConfirmPasswordValidation);
}

passwordToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const targetId = toggle.dataset.target;
    const targetInput = document.getElementById(targetId);

    if (!targetInput) {
      return;
    }

    const isPassword = targetInput.type === "password";
    targetInput.type = isPassword ? "text" : "password";
    toggle.classList.toggle("is-visible", isPassword);
    toggle.setAttribute("aria-pressed", String(isPassword));
    toggle.setAttribute(
      "aria-label",
      isPassword ? `Hide ${targetId === "confirm-password" ? "confirm password" : "password"}` : `Show ${targetId === "confirm-password" ? "confirm password" : "password"}`
    );
  });
});

if (hubLogoutButton) {
  hubLogoutButton.addEventListener("click", () => {
    clearCurrentUser();
    hideMemberHub();
  });
}

if (authForm) {
  setAuthMode("login");
  updatePasswordChecklist();
  updateEmailValidation();
  updateConfirmPasswordValidation();

  authForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const storedUsers = getUsers();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const name = nameInput.value.trim();
    const username = usernameInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    const rules = updatePasswordChecklist();
    const emailValidation = updateEmailValidation();
    const confirmValidation = updateConfirmPasswordValidation();

    formMessage.classList.remove("success");
    clearLoginValidationState();

    if (!email || !password) {
      formMessage.textContent = "Please fill in your email and password.";
      return;
    }

    if (authMode === "signup") {
      if (!name) {
        formMessage.textContent = "Please add your full name before signing up.";
        return;
      }

      if (!username) {
        formMessage.textContent = "Please choose a username before signing up.";
        return;
      }

      if (!emailValidation.valid) {
        formMessage.textContent = "Please enter a valid email address before signing up.";
        return;
      }

      if (!rules.length || !rules.case || !rules.number || !rules.special) {
        formMessage.textContent = "Please meet all password requirements before signing up.";
        return;
      }

      if (!confirmValidation.valid) {
        formMessage.textContent = "Passwords do not match yet.";
        return;
      }

      const emailExists = storedUsers.some((user) => user.email === email);
      const usernameExists = storedUsers.some((user) => user.username === username);

      if (emailExists) {
        formMessage.textContent = "That email is already registered.";
        return;
      }

      if (usernameExists) {
        formMessage.textContent = "That username is already taken.";
        return;
      }

      saveUser({ name, username, email, password });
      formMessage.textContent = `Account created for ${name}. You can log in right away.`;
      formMessage.classList.add("success");
      authForm.reset();
      setAuthMode("login");
      emailInput.value = email;
      return;
    }

    if (!storedUsers.length) {
      formMessage.textContent = "No account found yet. Please sign up first.";
      emailInput.classList.add("input-invalid");
      passwordInput.classList.add("input-invalid");
      return;
    }

    const matchedEmailUser = storedUsers.find((user) => user.email === email);
    const matchedUser = storedUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (!matchedEmailUser) {
      formMessage.textContent = "No account was found for that email address.";
      emailInput.classList.add("input-invalid");
      return;
    }

    if (!matchedUser) {
      formMessage.textContent = "The password you entered is incorrect.";
      passwordInput.classList.add("input-invalid");
      return;
    }

    setCurrentUser(matchedUser);
    formMessage.textContent = `Welcome back, ${matchedUser.name}. Login successful.`;
    formMessage.classList.add("success");
    authForm.reset();
    closeModal();
    window.location.href = "menu.html";
  });
}

hideMemberHub();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18
  }
);

revealItems.forEach((item) => revealObserver.observe(item));
