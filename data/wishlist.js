import { loadList, saveList } from "./expense.js";

export const wishlistVault = loadList("wishlistVault") || [];

export function addToWishlist() {
  const addWishButton = document.querySelectorAll(".wab-add");
  addWishButton.forEach((button) => {
    const wishName = document.getElementById("wishlist-name");
    const wishAmount = document.getElementById("wishlist-amount");
    const wishIcon = document.getElementById("wishlist-icon");
    const wishCategory = document.getElementById("wishlist-category");
    button.addEventListener("click", () => {
      const finalName = wishName.value;
      const finalAmount = wishAmount.value;
      const finalIcon = wishIcon.value;
      const finalCategory = wishCategory.value;

      if (!finalName || !finalAmount || !finalCategory) {
        alert("Kindly fill all the details :)");
        return;
      }

      const id = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
      const wishItem = {
        id: id,
        name: finalName,
        amount: finalAmount,
        category: finalCategory,
        icon: finalIcon,
        saved: 0,
        remaining: finalAmount,
      };

      wishlistVault.push(wishItem);
      saveList("wishlistVault", wishlistVault);

      wishName.value = "";
      wishAmount.value = "";
      wishIcon.value = "";
      wishCategory.value = "";

      renderWishList();
    });
  });
}

export function renderWishList() {
  const contentDiv = document.querySelector(".wishlist-list");
  let html = "";
  wishlistVault.forEach((item) => {
    const progress =
      item.remaining === 0 ? 100 : Math.floor((item.saved / item.amount) * 100);

    html += `<div class="wishlist-item">
    <div class="wishlist-heading">
      <div class="emoji-picker">${item.icon}</div>
      <div class="w-title-wrapper">
        <div class="w-title">${item.name}</div>
        <div class="w-category">${item.category}</div>
      </div>
      <div class="remove-wishlist" id= '${item.id}'>🗑️</div>
    </div>
    <div class="wishlist-progress">
      <div class="wp-title-percent">
        <div class="wp-title">Progress</div>
        <div class="wp-percent">${progress}%</div>
      </div>
      <div class="wp-progress-rang">------------</div>
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
      <div class="w-remarks">Halfway there!</div>
      <div class="w-add-wrapper">
        <div class="w-add" id="a-50">+ ₹50</div>
        <div class="w-add" id="a-100">+ ₹100</div>
      </div>
    </div>
    <div class="wishlist-add-amount">
      <input type="number" placeholder="Add amount of savings" />
      <div class="add-button">+</div>
    </div>
  </div>`;
  });

  contentDiv.innerHTML = html;

  const deleteBtns = document.querySelectorAll(".remove-wishlist");
  deleteBtns.forEach((button) => {
    button.addEventListener("click", () => {
      const btnid = button.id; // get the id of the clicked item
      const newList = wishlistVault.filter((p) => p.id !== btnid); // filter out the clicked item
      wishlistVault.length = 0;
      wishlistVault.push(...newList);
      saveList("wishlistVault", wishlistVault);
      renderWishList(); // re-render after deletion
    });
  });
}
