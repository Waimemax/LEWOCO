// CART ARRAY (saved in localStorage)
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Update cart counter
function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  if (cartCount) {
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  }
}

// Add to cart buttons
document.querySelectorAll(".add-cart").forEach(button => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = parseInt(button.dataset.price);

    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();

    alert(`${name} added to cart 🛒`);
  });
});

// Load cart count on page load
updateCartCount();
