// Get cart from localStorage or create empty cart
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Add item to cart
function addToCart(product) {
  const cart = getCart();

  // Check if product already exists
  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  saveCart(cart);
  alert(`${product.name} added to cart 🛒`);
}

// Attach click listeners to all Add to Cart buttons
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".add-cart");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const product = {
        id: button.dataset.id,
        name: button.dataset.name,
        price: Number(button.dataset.price),
        image: button.dataset.image
      };

      // Safety check
      if (!product.id || !product.name || !product.price) {
        console.error("Missing product data", product);
        alert("Error adding item to cart");
        return;
      }

      addToCart(product);
    });
  });
});
