import { loadHeaderFooter, getLocalStorage, setLocalStorage, alertMessage } from './utils.mjs';

loadHeaderFooter();

function cartItemTemplate(item, index) {
  const img = (item && item.Images && (item.Images.PrimaryMedium || item.Images.PrimarySmall || item.Images.PrimaryLarge)) || './images/placeholder.png';
  const name = (item && (item.Name || item.NameWithoutBrand)) || 'Unnamed product';
  const color = (item && item.Colors && item.Colors[0] && item.Colors[0].ColorName) || '';
  const price = (item && item.FinalPrice != null && !isNaN(item.FinalPrice)) ? `$${Number(item.FinalPrice).toFixed(2)}` : '';

  return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img src="${img}" alt="${name}">
    </a>
    <a href="../product_pages/index.html?product=${item.Id}">
      <h2 class="card__name">${name}</h2>
    </a>
    <p class="cart-card__color">${color}</p>
    <p class="cart-card__quantity">qty: 1</p>
    <p class="cart-card__price">${price}</p>
    <button class="remove-item" data-index="${index}">Remove</button>
  </li>`;
}

function renderCartContents() {
  try {
    const cartItems = getLocalStorage('so-cart') || [];
  const productList = document.querySelector('.product-list');
  
  if (!productList) {
    console.error('Product list element not found!');
    return;
  }
  
    if (cartItems.length === 0) {
      productList.innerHTML = '<li class="empty-cart">Your cart is empty. <a href="../index.html">Start shopping!</a></li>';
      hideCartTotal();
      return;
    }
  
    // Render items
    const htmlItems = cartItems.map((item, index) => cartItemTemplate(item, index));
    productList.innerHTML = htmlItems.join('');
  
  // Add remove button listeners
  addRemoveListeners();
  
    // Show total
    displayCartTotal(cartItems);
  } catch (error) {
    console.error('Error rendering cart contents:', error);
    const productList = document.querySelector('.product-list');
    if (productList) productList.innerHTML = '<li class="error">Unable to load cart. See console for details.</li>';
    hideCartTotal();
  }
}

function addRemoveListeners() {
  const removeButtons = document.querySelectorAll('.remove-item');
  removeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      removeFromCart(index);
    });
  });
}

function removeFromCart(index) {
  let cart = getLocalStorage('so-cart') || [];
  cart.splice(index, 1);
  setLocalStorage('so-cart', cart);
  renderCartContents();
  alertMessage('Item removed from cart', false, 2000);
}

function displayCartTotal(items) {
  const total = items.reduce((sum, item) => sum + item.FinalPrice, 0);
  
  let totalElement = document.querySelector('.cart-total');
  if (!totalElement) {
    totalElement = document.createElement('div');
    totalElement.className = 'cart-total';
    document.querySelector('.products').appendChild(totalElement);
  }
  
  totalElement.innerHTML = `
    <p class="cart-total-label">Subtotal:</p>
    <p class="cart-total-price">$${total.toFixed(2)}</p>
    <a href="../checkout/index.html" class="checkout-link">Proceed to Checkout</a>
  `;
}

function hideCartTotal() {
  const totalElement = document.querySelector('.cart-total');
  if (totalElement) {
    totalElement.remove();
  }
}

// Initialize cart on page load
renderCartContents();