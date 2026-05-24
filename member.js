const memberCurrentUserKey = "purrfectPawCurrentUser";
const memberUsersKey = "purrfectPawUsers";
const memberMenuPrices = {
  "Caramel Whisker Latte": 370,
  "Hazelnut Purrccino": 370,
  "Berry Cloud Latte": 370,
  "Honey Bunny Milk": 300,
  "Rose Garden Tea": 300,
  "Mint Moon Tea": 300,
  "Paw Print Cupcake": 300,
  "Butter Biscuit Scone": 245,
  "Garden Tea Toastie": 400,
  "Catnip Crunch Bites": 180,
  "Salmon Star Nibbles": 220,
};
const memberMenuImagePaths = {
  "Caramel Whisker Latte": "assets/caramellatte.jpg",
  "Hazelnut Purrccino": "assets/hazelnut.jpeg",
  "Berry Cloud Latte": "assets/berrylatte.jpg",
  "Honey Bunny Milk": "assets/honeymilk.jpg",
  "Rose Garden Tea": "assets/rosetea.jpeg",
  "Mint Moon Tea": "assets/minttea.jpg",
  "Paw Print Cupcake": "assets/pawprintcupcake.webp",
  "Butter Biscuit Scone": "assets/butterbiscuitscone.jpeg",
  "Garden Tea Toastie": "assets/gardenteatoastie.webp",
  "Catnip Crunch Bites": "assets/catnipbites.jpg",
  "Salmon Star Nibbles": "assets/salmonstarnibbles.jpg",
};

const getMemberCurrentUser = () => {
  const storedUser = localStorage.getItem(memberCurrentUserKey);
  return storedUser ? JSON.parse(storedUser) : null;
};

const clearMemberCurrentUser = () => {
  localStorage.removeItem(memberCurrentUserKey);
};

const setMemberCurrentUser = (user) => {
  localStorage.setItem(memberCurrentUserKey, JSON.stringify(user));
};

const getMemberCartKey = (email) => `purrfectPawCart:${email}`;

const getMemberCartItems = (email) => {
  const storedItems = localStorage.getItem(getMemberCartKey(email));
  return storedItems ? JSON.parse(storedItems) : [];
};

const saveMemberCartItems = (email, items) => {
  localStorage.setItem(getMemberCartKey(email), JSON.stringify(items));
};

const syncMemberCartPrices = (items) =>
  items.map((item) => ({
    ...item,
    price: memberMenuPrices[item.name] ?? item.price,
  }));

const formatPeso = (amount) =>
  `₱${Number(amount).toLocaleString("en-PH", { maximumFractionDigits: 0 })}`;

const maskPassword = (password) => "*".repeat(Math.max(password.length, 8));
const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const getPasswordRules = (password) => ({
  length: password.length >= 8,
  case: /[a-z]/.test(password) && /[A-Z]/.test(password),
  number: /\d/.test(password),
  special: /[^A-Za-z0-9]/.test(password),
});

const updateMemberCartBadge = (items) => {
  const cartBadge = document.getElementById("cart-badge");
  if (!cartBadge) {
    return;
  }

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  cartBadge.textContent = String(totalCount);
};

const startNavDateTime = () => {
  const dateTimeElement = document.getElementById("nav-datetime");
  if (!dateTimeElement) {
    return;
  }

  const renderDateTime = () => {
    const now = new Date();
    const dateText = now.toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const timeText = now.toLocaleTimeString("en-PH", {
      hour: "numeric",
      minute: "2-digit",
    });

    dateTimeElement.textContent = `${dateText} • ${timeText}`;
  };

  renderDateTime();
  window.setInterval(renderDateTime, 1000);
};

const requireLoggedInUser = () => {
  const currentUser = getMemberCurrentUser();
  if (!currentUser) {
    window.location.href = "index.html";
    return null;
  }
  return currentUser;
};

const wireMemberShell = (currentPage) => {
  const currentUser = requireLoggedInUser();
  if (!currentUser) {
    return null;
  }

  const displayName = document.getElementById("member-display-name");
  const displayUsername = document.getElementById("member-display-username");
  const userAvatar = document.querySelector(".module-user-avatar");
  const logoutButton = document.getElementById("member-logout-button");
  const navLinks = document.querySelectorAll(".module-nav a");
  const cartBadge = document.getElementById("cart-badge");

  if (displayName) {
    displayName.textContent = currentUser.name;
  }

  if (displayUsername) {
    displayUsername.textContent = `@${currentUser.username}`;
  }

  if (userAvatar) {
    userAvatar.textContent = currentUser.name.trim().charAt(0).toUpperCase();
  }

  navLinks.forEach((link) => {
    if (link.dataset.page === currentPage) {
      link.classList.add("is-current");
    }
  });

  if (cartBadge) {
    const items = syncMemberCartPrices(getMemberCartItems(currentUser.email));
    saveMemberCartItems(currentUser.email, items);
    updateMemberCartBadge(items);
  }

  startNavDateTime();

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      clearMemberCurrentUser();
      window.location.href = "index.html";
    });
  }

  return currentUser;
};

const renderMenuPage = () => {
  const currentUser = wireMemberShell("menu");
  if (!currentUser) {
    return;
  }

  document.querySelectorAll(".quantity-picker").forEach((picker) => {
    const valueElement = picker.querySelector(".quantity-value");
    const decreaseButton = picker.querySelector('[data-quantity-action="decrease"]');
    const increaseButton = picker.querySelector('[data-quantity-action="increase"]');

    if (!valueElement || !decreaseButton || !increaseButton) {
      return;
    }

    decreaseButton.addEventListener("click", () => {
      const nextValue = Math.max(1, Number(valueElement.textContent) - 1);
      valueElement.textContent = String(nextValue);
    });

    increaseButton.addEventListener("click", () => {
      const nextValue = Number(valueElement.textContent) + 1;
      valueElement.textContent = String(nextValue);
    });
  });

  document.querySelectorAll(".add-cart-button").forEach((button) => {
    button.addEventListener("click", () => {
      const itemName = button.dataset.item;
      const itemPrice = Number(button.dataset.price);
      const quantityValue = button
        .closest(".module-action")
        ?.querySelector(".quantity-value");
      const quantityToAdd = Math.max(1, Number(quantityValue?.textContent || "1"));
      const items = syncMemberCartPrices(getMemberCartItems(currentUser.email));
      const existingItem = items.find((item) => item.name === itemName);

      if (existingItem) {
        existingItem.quantity += quantityToAdd;
      } else {
        items.push({ name: itemName, price: itemPrice, quantity: quantityToAdd });
      }

      saveMemberCartItems(currentUser.email, items);
      updateMemberCartBadge(items);
      if (quantityValue) {
        quantityValue.textContent = "1";
      }
      button.textContent = "Added";
      setTimeout(() => {
        button.textContent = "Add";
      }, 900);
    });
  });
};

const renderCartPage = () => {
  const currentUser = wireMemberShell("cart");
  if (!currentUser) {
    return;
  }

  const cartItems = document.getElementById("cart-page-items");
  const cartTotal = document.getElementById("cart-page-total");
  const checkoutButton = document.getElementById("checkout-button");
  const checkoutModal = document.getElementById("checkout-modal");
  const closeCheckoutModal = document.getElementById("close-checkout-modal");
  const cancelCheckoutButton = document.getElementById("cancel-checkout-button");
  const confirmCheckoutButton = document.getElementById("confirm-checkout-button");
  const doneCheckoutButton = document.getElementById("done-checkout-button");
  const checkoutSummaryText = document.getElementById("checkout-summary-text");
  const checkoutReceiptText = document.getElementById("checkout-receipt-text");
  const checkoutSummaryView = document.getElementById("checkout-summary-view");
  const checkoutReceiptView = document.getElementById("checkout-receipt-view");

  if (!cartItems || !cartTotal) {
    return;
  }

  const closeCheckout = () => {
    if (!checkoutModal || !checkoutSummaryView || !checkoutReceiptView) {
      return;
    }

    checkoutModal.classList.remove("is-open");
    checkoutModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    checkoutSummaryView.classList.remove("hidden-field");
    checkoutSummaryView.setAttribute("aria-hidden", "false");
    checkoutReceiptView.classList.add("hidden-field");
    checkoutReceiptView.setAttribute("aria-hidden", "true");
  };

  const openCheckout = () => {
    if (!checkoutModal || !checkoutSummaryView || !checkoutReceiptView) {
      return;
    }

    checkoutModal.classList.add("is-open");
    checkoutModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    checkoutSummaryView.classList.remove("hidden-field");
    checkoutSummaryView.setAttribute("aria-hidden", "false");
    checkoutReceiptView.classList.add("hidden-field");
    checkoutReceiptView.setAttribute("aria-hidden", "true");
  };

  const getSyncedCartItems = () => syncMemberCartPrices(getMemberCartItems(currentUser.email));

  const buildOrderSummaryMarkup = (items) => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const lines = items
      .map(
        (item) =>
          `<p><strong>${escapeHtml(item.name)}</strong> x${item.quantity} - ${formatPeso(
            item.price * item.quantity
          )}</p>`
      )
      .join("");

    return `${lines}<p class="checkout-summary-total"><strong>Total: ${formatPeso(total)}</strong></p>`;
  };

  const paintCart = () => {
    const items = getSyncedCartItems();
    saveMemberCartItems(currentUser.email, items);
    updateMemberCartBadge(items);

    if (!items.length) {
      cartItems.innerHTML = '<p class="empty-state">Your cart is feeling a little empty.</p>';
      cartTotal.textContent = formatPeso(0);
      if (checkoutButton) {
        checkoutButton.disabled = true;
      }
      return;
    }

    if (checkoutButton) {
      checkoutButton.disabled = false;
    }

    cartItems.innerHTML = items
      .map(
        (item) => `
          <div class="cart-row">
            <div class="cart-item-main">
              <img class="item-thumb" src="${memberMenuImagePaths[item.name] || ""}" alt="${escapeHtml(item.name)}">
              <div class="cart-item-info">
                <strong>${item.name}</strong>
                <p>${formatPeso(item.price)} each</p>
              </div>
            </div>
            <div class="cart-item-actions">
              <div class="quantity-picker cart-quantity-picker" aria-label="Adjust cart quantity">
                <button class="quantity-button" type="button" data-cart-quantity-action="decrease" data-cart-item="${item.name}" aria-label="Decrease quantity for ${item.name}">-</button>
                <span class="quantity-value" aria-live="polite">${item.quantity}</span>
                <button class="quantity-button" type="button" data-cart-quantity-action="increase" data-cart-item="${item.name}" aria-label="Increase quantity for ${item.name}">+</button>
              </div>
              <span class="cart-price">${formatPeso(item.price * item.quantity)}</span>
              <button class="cart-delete-button" type="button" data-delete-item="${item.name}" aria-label="Remove ${item.name} from cart">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 3h6l1 2h4v2H4V5h4l1-2Zm1 7v7m4-7v7M7 7l1 12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        `
      )
      .join("");

    cartItems.querySelectorAll("[data-cart-quantity-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const itemName = button.dataset.cartItem;
        const action = button.dataset.cartQuantityAction;
        const nextItems = syncMemberCartPrices(getMemberCartItems(currentUser.email))
          .map((item) => {
            if (item.name !== itemName) {
              return item;
            }

            const nextQuantity =
              action === "increase"
                ? item.quantity + 1
                : Math.max(1, item.quantity - 1);

            return {
              ...item,
              quantity: nextQuantity,
            };
          });

        saveMemberCartItems(currentUser.email, nextItems);
        paintCart();
      });
    });

    cartItems.querySelectorAll(".cart-delete-button").forEach((button) => {
      button.addEventListener("click", () => {
        const itemName = button.dataset.deleteItem;
        const nextItems = syncMemberCartPrices(getMemberCartItems(currentUser.email)).filter(
          (item) => item.name !== itemName
        );
        saveMemberCartItems(currentUser.email, nextItems);
        paintCart();
      });
    });

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.textContent = formatPeso(total);
  };

  checkoutButton?.addEventListener("click", () => {
    const items = getSyncedCartItems();
    if (!items.length || !checkoutSummaryText) {
      return;
    }

    checkoutSummaryText.innerHTML = buildOrderSummaryMarkup(items);
    openCheckout();
  });

  closeCheckoutModal?.addEventListener("click", closeCheckout);
  cancelCheckoutButton?.addEventListener("click", closeCheckout);
  doneCheckoutButton?.addEventListener("click", () => {
    closeCheckout();
    paintCart();
  });
  checkoutModal?.addEventListener("click", (event) => {
    if (event.target === checkoutModal) {
      closeCheckout();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && checkoutModal?.classList.contains("is-open")) {
      closeCheckout();
    }
  });

  confirmCheckoutButton?.addEventListener("click", () => {
    const items = getSyncedCartItems();
    if (!items.length || !checkoutReceiptText || !checkoutSummaryView || !checkoutReceiptView) {
      return;
    }

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const receiptNumber = `PP-${Date.now().toString().slice(-6)}`;
    const receiptDate = new Date().toLocaleString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
    const itemLines = items
      .map(
        (item) =>
          `<p>${escapeHtml(item.name)} x${item.quantity} - ${formatPeso(item.price * item.quantity)}</p>`
      )
      .join("");

    checkoutReceiptText.innerHTML = `
      <p><strong>Receipt No:</strong> ${receiptNumber}</p>
      <p><strong>Member:</strong> ${escapeHtml(currentUser.name)}</p>
      <p><strong>Date:</strong> ${receiptDate}</p>
      <div class="checkout-receipt-lines">${itemLines}</div>
      <p class="checkout-summary-total"><strong>Total Paid: ${formatPeso(total)}</strong></p>
    `;

    saveMemberCartItems(currentUser.email, []);
    updateMemberCartBadge([]);
    checkoutSummaryView.classList.add("hidden-field");
    checkoutSummaryView.setAttribute("aria-hidden", "true");
    checkoutReceiptView.classList.remove("hidden-field");
    checkoutReceiptView.setAttribute("aria-hidden", "false");
  });

  paintCart();
};

const renderFelinesPage = () => {
  wireMemberShell("felines");
};

const renderProfilePage = () => {
  const currentUser = wireMemberShell("profile");
  if (!currentUser) {
    return;
  }

  const profileName = document.getElementById("profile-page-name");
  const profileUsername = document.getElementById("profile-page-username");
  const profileEmail = document.getElementById("profile-page-email");
  const profilePassword = document.getElementById("profile-page-password");
  const editAccountButton = document.getElementById("edit-account-button");
  const profileEditModal = document.getElementById("profile-edit-modal");
  const closeProfileEditModal = document.getElementById("close-profile-edit-modal");
  const profileEditForm = document.getElementById("profile-edit-form");
  const profileOldPassword = document.getElementById("profile-old-password");
  const profileNewPassword = document.getElementById("profile-new-password");
  const profileConfirmPassword = document.getElementById("profile-confirm-password");
  const profilePasswordChecklist = document.getElementById("profile-password-checklist");
  const profileRuleLength = document.getElementById("profile-rule-length");
  const profileRuleCase = document.getElementById("profile-rule-case");
  const profileRuleNumber = document.getElementById("profile-rule-number");
  const profileRuleSpecial = document.getElementById("profile-rule-special");
  const profileOldPasswordCheck = document.getElementById("profile-old-password-check");
  const profileConfirmPasswordCheck = document.getElementById("profile-confirm-password-check");
  const profileEditMessage = document.getElementById("profile-edit-message");

  if (profileName) {
    profileName.textContent = currentUser.name;
  }
  if (profileUsername) {
    profileUsername.textContent = currentUser.username;
  }
  if (profileEmail) {
    profileEmail.textContent = currentUser.email;
  }
  if (profilePassword) {
    profilePassword.textContent = maskPassword(currentUser.password);
  }

  const openProfileEditModal = () => {
    if (!profileEditModal) {
      return;
    }

    profileEditModal.classList.add("is-open");
    profileEditModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    if (profileEditMessage) {
      profileEditMessage.textContent = "";
      profileEditMessage.classList.remove("success");
    }
    if (profileOldPasswordCheck) {
      profileOldPasswordCheck.textContent = "";
      profileOldPasswordCheck.classList.remove("is-valid", "is-invalid");
    }
    if (profileConfirmPasswordCheck) {
      profileConfirmPasswordCheck.textContent = "";
      profileConfirmPasswordCheck.classList.remove("is-valid", "is-invalid");
    }
    profileEditForm?.reset();
  };

  const closeProfileEdit = () => {
    if (!profileEditModal) {
      return;
    }

    profileEditModal.classList.remove("is-open");
    profileEditModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };

  editAccountButton?.addEventListener("click", openProfileEditModal);
  closeProfileEditModal?.addEventListener("click", closeProfileEdit);
  profileEditModal?.addEventListener("click", (event) => {
    if (event.target === profileEditModal) {
      closeProfileEdit();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && profileEditModal?.classList.contains("is-open")) {
      closeProfileEdit();
    }
  });

  profileEditForm?.querySelectorAll(".password-toggle").forEach((toggle) => {
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
    });
  });

  const updateOldPasswordValidation = () => {
    if (!profileOldPassword || !profileOldPasswordCheck) {
      return false;
    }

    const matches = profileOldPassword.value === currentUser.password;
    if (!profileOldPassword.value) {
      profileOldPasswordCheck.textContent = "";
      profileOldPasswordCheck.classList.remove("is-valid", "is-invalid");
      return false;
    }

    profileOldPasswordCheck.textContent = matches
      ? "Old password matches your current password."
      : "Old password does not match your current password.";
    profileOldPasswordCheck.classList.toggle("is-valid", matches);
    profileOldPasswordCheck.classList.toggle("is-invalid", !matches);
    return matches;
  };

  const updateProfilePasswordChecklist = () => {
    if (
      !profileNewPassword ||
      !profileRuleLength ||
      !profileRuleCase ||
      !profileRuleNumber ||
      !profileRuleSpecial
    ) {
      return { length: false, case: false, number: false, special: false };
    }

    const rules = getPasswordRules(profileNewPassword.value);
    profileRuleLength.classList.toggle("is-valid", rules.length);
    profileRuleCase.classList.toggle("is-valid", rules.case);
    profileRuleNumber.classList.toggle("is-valid", rules.number);
    profileRuleSpecial.classList.toggle("is-valid", rules.special);
    return rules;
  };

  const updateConfirmPasswordValidation = () => {
    if (!profileNewPassword || !profileConfirmPassword || !profileConfirmPasswordCheck) {
      return false;
    }

    const matches = Boolean(profileConfirmPassword.value) && profileConfirmPassword.value === profileNewPassword.value;
    if (!profileConfirmPassword.value) {
      profileConfirmPasswordCheck.textContent = "";
      profileConfirmPasswordCheck.classList.remove("is-valid", "is-invalid");
      return false;
    }

    profileConfirmPasswordCheck.textContent = matches
      ? "Confirm password matches."
      : "Confirm password does not match the new password.";
    profileConfirmPasswordCheck.classList.toggle("is-valid", matches);
    profileConfirmPasswordCheck.classList.toggle("is-invalid", !matches);
    return matches;
  };

  profileOldPassword?.addEventListener("input", updateOldPasswordValidation);
  profileNewPassword?.addEventListener("input", () => {
    updateProfilePasswordChecklist();
    updateConfirmPasswordValidation();
  });
  profileConfirmPassword?.addEventListener("input", updateConfirmPasswordValidation);

  if (profilePasswordChecklist) {
    updateProfilePasswordChecklist();
  }

  profileEditForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!profileOldPassword || !profileNewPassword || !profileConfirmPassword || !profileEditMessage) {
      return;
    }

    const oldPassword = profileOldPassword.value.trim();
    const nextPassword = profileNewPassword.value.trim();
    const confirmPassword = profileConfirmPassword.value.trim();
    profileEditMessage.classList.remove("success");

    if (!oldPassword || !nextPassword || !confirmPassword) {
      profileEditMessage.textContent = "Please fill in all password fields.";
      return;
    }

    if (!updateOldPasswordValidation()) {
      profileEditMessage.textContent = "Please enter your current password correctly.";
      return;
    }

    if (nextPassword.length < 8) {
      profileEditMessage.textContent = "Your new password should be at least 8 characters.";
      return;
    }

    const passwordRules = updateProfilePasswordChecklist();
    if (!passwordRules.length || !passwordRules.case || !passwordRules.number || !passwordRules.special) {
      profileEditMessage.textContent = "Please meet all password requirements before saving.";
      return;
    }

    if (!updateConfirmPasswordValidation()) {
      profileEditMessage.textContent = "Passwords do not match yet.";
      return;
    }

    const users = JSON.parse(localStorage.getItem(memberUsersKey) || "[]");
    const nextUsers = users.map((user) =>
      user.email === currentUser.email
        ? { ...user, password: nextPassword }
        : user
    );
    const nextCurrentUser = { ...currentUser, password: nextPassword };

    localStorage.setItem(memberUsersKey, JSON.stringify(nextUsers));
    setMemberCurrentUser(nextCurrentUser);

    if (profilePassword) {
      profilePassword.textContent = maskPassword(nextPassword);
    }

    profileEditMessage.textContent = "Password updated successfully.";
    profileEditMessage.classList.add("success");

    setTimeout(() => {
      closeProfileEdit();
    }, 700);
  });
};
