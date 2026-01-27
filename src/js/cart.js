import { getLocalStorage } from "../js/utils.mjs";

function renderCartContents() {
  // Obtenemos los productos del localStorage
  const cartItems = getLocalStorage("so-cart") || [];

  // Convertimos cada objeto de producto en HTML usando la plantilla
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  
  // Inyectamos el HTML en la lista del carrito
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  // Llamamos a la función del total para actualizar la visibilidad y el monto
  displayCartTotal(cartItems);
}

function cartItemTemplate(item) {
  // Verificamos que existan colores para evitar errores de renderizado
  const colorName = item.Colors && item.Colors[0] ? item.Colors[0].ColorName : "Standard";

  return `
    <li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img src="${item.Image}" alt="${item.Name}" />
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${colorName}</p>
      <p class="cart-card__quantity">qty: 1</p>
      <p class="cart-card__price">$${item.FinalPrice}</p>
    </li>
  `;
}

function displayCartTotal(cartItems) {
  const cartFooter = document.querySelector(".cart-footer");
  const cartTotal = document.querySelector(".cart-total");

  // 1. Si el carrito está vacío, ocultamos el pie de página y salimos
  if (cartItems.length === 0) {
    cartFooter.classList.add("hide");
    return;
  }

  // 2. Si hay artículos, mostramos el pie de página
  cartFooter.classList.remove("hide");

  // 3. Calculamos el total de los productos usando reduce
  const total = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);

  // 4. Mostramos el total formateado a dos decimales
  cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

// Inicializamos la carga del carrito
renderCartContents();