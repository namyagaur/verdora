import { loadList, saveList, savingsList } from "./expense.js";
import { currentsavingsUpdate } from "./savings.js"; // import your savings functions

export const wishlistVault = loadList("wishlistVault") || [];

// ====== Add Wishlist Function ======
export function addToWishlist() {
  const addWishButton = document.querySelectorAll(".wab-add");
  const addingBox = document.querySelector(".wishlist-adding-box");
  const wishName = document.getElementById("wishlist-name");
  const wishAmount = document.getElementById("wishlist-amount");
  const wishIcon = document.getElementById("wishlist-icon");
  const wishCategory = document.getElementById("wishlist-category");

  if (!addWishButton.length || !addingBox) return;

  addWishButton.forEach((button) => {
    button.addEventListener("click", () => {
      const finalName = wishName.value.trim();
      const finalAmount = Number(wishAmount.value);
      const finalIcon = wishIcon.value.trim();
      const finalCategory = wishCategory.value.trim();

      if (!finalName || !finalAmount || !finalCategory) {
        alert("Kindly fill all the details :)");
        return;
      }

      const id = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
      const wishItem = {
        id,
        name: finalName,
        amount: finalAmount,
        category: finalCategory,
        icon: finalIcon,
        saved: 0,
        remaining: finalAmount,
      };

      wishlistVault.push(wishItem);
      saveList("wishlistVault", wishlistVault);

      // Clear form & hide box
      wishName.value = "";
      wishAmount.value = "";
      wishIcon.value = "";
      wishCategory.value = "";
      addingBox.classList.remove("show");

      renderWishList();
    });
  });
}

// ====== Render Wishlist ======
export function renderWishList() {
  const contentDiv = document.querySelector(".wishlist-list");
  if (!contentDiv) return;

  // Remove old listener to prevent duplicates
  contentDiv.removeEventListener("click", handleWishlistClicks);

  if (wishlistVault.length === 0) {
    contentDiv.innerHTML = "No Wishlist Items Yet :)";
    return;
  }

  contentDiv.innerHTML = wishlistVault
    .map((item) => {
      const progress = item.remaining === 0 ? 100 : Math.floor((item.saved / item.amount) * 100);

      // Remarks logic
      let remarks = "";
      let mark = "";
      if (progress >= 100) {
        mark = "Completed";
        remarks = "Completed 🎉";
      } else if (progress >= 75) {
        mark = "Almost";
        remarks = "A little more left 💪";
      } else if (progress >= 50) {
        mark = "Halfway";
        remarks = "Halfway there ✨";
      } else {
        mark = "Start";
        remarks = "Let's go saving 🚀";
      }

      const completeClass = progress >= 100 ? "wishlist-complete" : "";
      const disableClass = progress >= 100 ? "disabled" : "";

      return `
        <div class="wishlist-item ${completeClass}" data-id="${item.id}">
          <div class="wishlist-heading">
            <div class="emoji-picker">${item.icon}</div>
            <div class="w-title-wrapper">
              <div class="w-title">${item.name}</div>
              <div class="w-category">${item.category}</div>
            </div>
            <div class="remove-wishlist" data-id="${item.id}">🗑️</div>
          </div>

          <div class="wishlist-progress">
            <div class="wp-title-percent">
              <div class="wp-title">Progress</div>
              <div class="wp-percent">${progress}%</div>
            </div>
            <div class="wp-progress-bar">
              <div class="wp-progress-fill" style="width: ${progress}%;"></div>
            </div>
          </div>

          <div class="wishlist-info">
            <div class="wishlist-saved">
              <div class="ws-title">Saved</div>
              <div class="ws-amount">₹${item.saved}</div>
            </div>
            <div class="wishlist-goal">
              <div class="wg-title">Goal</div>
              <div class="wg-amount">₹${item.amount}</div>
            </div>
            <div class="wishlist-remaining">
              <div class="wr-title">Remaining</div>
              <div class="wr-amount">₹${item.remaining}</div>
            </div>
          </div>

          <div class="wishlist-addons">
            <div class="w-remarks ${mark}">${remarks}</div>
            <div class="w-add-wrapper ${disableClass}">
              <div class="w-add" id="a-50" data-id="${item.id}" data-amount="50">+ ₹50</div>
              <div class="w-add" id="a-100" data-id="${item.id}" data-amount="100">+ ₹100</div>
            </div>
          </div>

          <div class="wishlist-add-amount ${disableClass}">
            <input type="number" placeholder="Add amount of savings" data-id="${item.id}" ${progress >= 100 ? "disabled" : ""}/>
            <div class="add-button" data-id="${item.id}">+</div>
          </div>
        </div>
      `;
    })
    .join("");

  // Attach listener once
  contentDiv.addEventListener("click", handleWishlistClicks);
}

// ====== Wishlist Click Handler ======
function handleWishlistClicks(e) {
  const target = e.target;

  // Delete
  if (target.classList.contains("remove-wishlist")) {
    const id = target.dataset.id;
    const item = wishlistVault.find((i) => i.id === id);
    if (!item) return;

    // Refund saved amount
    if (item.saved > 0) {
      if (savingsList.length === 0) {
        savingsList.push({
          id: `refund-${Date.now()}`,
          title: "Wishlist Refund",
          amount: item.saved,
          date: new Date().toISOString().split("T")[0],
          category: "refund",
        });
      } else {
        savingsList[0].amount = Number(savingsList[0].amount) + item.saved;
      }
      saveList("savingsList", savingsList);
      currentsavingsUpdate();
    }

    const newList = wishlistVault.filter((w) => w.id !== id);
    wishlistVault.length = 0;
    wishlistVault.push(...newList);
    saveList("wishlistVault", wishlistVault);

    renderWishList();
    return;
  }

  // Add fixed amount (+50, +100)
  if (target.classList.contains("w-add")) {
    const id = target.dataset.id;
    const amount = Number(target.dataset.amount);
    addToWishlistItem(id, amount);
    return;
  }

  // Add custom amount from input
  if (target.classList.contains("add-button")) {
    const id = target.dataset.id;
    const input = document.querySelector(`.wishlist-add-amount input[data-id="${id}"]`);
    const amount = Number(input.value);
    if (!amount || amount <= 0) {
      alert("Enter a valid amount!");
      return;
    }
    addToWishlistItem(id, amount);
    input.value = "";
  }
}

// ====== Add amount to wishlist item ======
function addToWishlistItem(id, amount) {
  const item = wishlistVault.find((i) => i.id === id);
  if (!item) return;

  let totalSavings = savingsList.reduce((sum, s) => sum + Number(s.amount), 0);
  if (amount > totalSavings) {
    alert("Not enough savings!");
    return;
  }

  let remainingAmount = amount;
  for (let s of savingsList) {
    let available = Number(s.amount);
    if (available >= remainingAmount) {
      s.amount = available - remainingAmount;
      break;
    } else {
      remainingAmount -= available;
      s.amount = 0;
    }
  }

  saveList("savingsList", savingsList);
  currentsavingsUpdate();

  item.saved += amount;
  item.remaining = Math.max(item.amount - item.saved, 0);
  saveList("wishlistVault", wishlistVault);
  renderWishList();
}

// ====== Wishlist Toggle ======
export function initWishlistToggle() {
  const showBtn = document.getElementById("show-add-item-btn");
  const closeBtn = document.getElementById("close-add-item-btn");
  const modalBackdrop = document.getElementById("wishlist-modal-backdrop");
  
  if (showBtn && modalBackdrop) {
    showBtn.addEventListener('click', () => {
      // Shows the modal by adding the 'show' class to the backdrop
      modalBackdrop.classList.add('show'); 
    });
  }

  if (closeBtn && modalBackdrop) {
    closeBtn.addEventListener('click', () => {
      // Hides the modal by removing the 'show' class
      modalBackdrop.classList.remove('show');
    });
  }
}
