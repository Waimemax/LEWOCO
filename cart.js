// Get cart from localStorage
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Render cart items
function renderCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");

  const cart = getCart();
  cartItemsContainer.innerHTML = "";

  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty 🛒</p>";
    cartTotalElement.textContent = "Total: KES 0";
    return;
  }

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `
  <div class="cart-info">
    <h3>${item.name}</h3>
    <p>KES ${item.price}</p>

    <div class="quantity-controls">
      <button class="decrease" data-id="${item.id}">−</button>
      <span>${item.quantity}</span>
      <button class="increase" data-id="${item.id}">+</button>
    </div>

    <p class="item-total">Subtotal: KES ${itemTotal}</p>
    <button class="remove-item" data-id="${item.id}">Remove</button>
  </div>
`;


    cartItemsContainer.appendChild(cartItem);
  });

  cartTotalElement.textContent = `Total: KES ${total}`;
}

// Increase quantity
function increaseQuantity(id) {
  const cart = getCart();
  const item = cart.find(item => item.id === id);

  if (item) {
    item.quantity += 1;
    saveCart(cart);
    renderCart();
  }
}

// Decrease quantity
function decreaseQuantity(id) {
  let cart = getCart();
  const item = cart.find(item => item.id === id);

  if (item) {
    item.quantity -= 1;

    if (item.quantity <= 0) {
      cart = cart.filter(i => i.id !== id);
    }

    saveCart(cart);
    renderCart();
  }
}




// Remove item
function removeItem(id) {
  const cart = getCart().filter(item => item.id !== id);
  saveCart(cart);
  renderCart();
}

// Handle button clicks (event delegation)
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("increase")) {
    increaseQuantity(e.target.dataset.id);
  }

  if (e.target.classList.contains("decrease")) {
    decreaseQuantity(e.target.dataset.id);
  }

  if (e.target.classList.contains("remove-item")) {
    removeItem(e.target.dataset.id);
  }
});

// Load cart on page load
document.addEventListener("DOMContentLoaded", renderCart);



