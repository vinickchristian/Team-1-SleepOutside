import { loadHeaderFooter, getLocalStorage, setLocalStorage, alertMessage } from './utils.mjs';

loadHeaderFooter();

function renderCheckoutCart() {
  const cartItems = getLocalStorage('so-cart') || [];
  const cartList = document.querySelector('.checkout-cart-list');
  
  if (!cartList) return;
  
  if (cartItems.length === 0) {
    cartList.innerHTML = '<li>Your cart is empty</li>';
    document.querySelector('.checkout-form').style.display = 'none';
    return;
  }
  
  const html = cartItems.map(item => `
    <li class="checkout-cart-item">
      <img src="${item.Images.PrimarySmall}" alt="${item.Name}">
      <div class="item-details">
        <h4>${item.Name}</h4>
        <p>$${item.FinalPrice}</p>
      </div>
    </li>
  `).join('');
  
  cartList.innerHTML = html;
  
  // Calculate totals
  calculateOrderTotal(cartItems);
}

function calculateOrderTotal(items) {
  const subtotal = items.reduce((sum, item) => sum + item.FinalPrice, 0);
  const tax = subtotal * 0.06;
  const shipping = items.length > 0 ? 10 : 0; // $10 flat shipping
  const total = subtotal + tax + shipping;
  
  document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
  document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
  document.getElementById('order-total').textContent = `$${total.toFixed(2)}`;
}

function handleCheckoutSubmit(e) {
  e.preventDefault();
  
  // Get form data
  const formData = new FormData(e.target);
  const order = {
    items: getLocalStorage('so-cart'),
    shipping: {
      fname: formData.get('fname'),
      lname: formData.get('lname'),
      street: formData.get('street'),
      city: formData.get('city'),
      state: formData.get('state'),
      zip: formData.get('zip')
    },
    payment: {
      cardNumber: formData.get('cardNumber'),
      expiration: formData.get('expiration'),
      code: formData.get('code')
    },
    orderDate: new Date().toISOString()
  };
  
  // In a real app, you'd send this to a server
  console.log('Order placed:', order);
  
  // Clear the cart
  setLocalStorage('so-cart', []);
  
  // Show success message
  alertMessage('Order placed successfully! Thank you for your purchase.', true, 5000);
  
  // Redirect to home after 2 seconds
  setTimeout(() => {
    window.location.href = '/index.html';
  }, 2000);
}

// Initialize
renderCheckoutCart();

const form = document.getElementById('checkout-form');
if (form) {
  form.addEventListener('submit', handleCheckoutSubmit);
}