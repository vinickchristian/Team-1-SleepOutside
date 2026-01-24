import { setLocalStorage, getLocalStorage, updateCartCount } from './utils.mjs';

function productDetailsTemplate(product) {
  console.log('Creating template for product:', product);
  
  return `
    <div class="product-detail-container">
      <h3 class="product-brand">${product.Brand.Name}</h3>
      <h2 class="product-name divider">${product.NameWithoutBrand}</h2>
      <img
        class="product-image divider"
        src="${product.Images.PrimaryLarge}"
        alt="${product.NameWithoutBrand}"
      />
      <p class="product-card__price">$${product.FinalPrice.toFixed(2)}</p>
      <p class="product__color"><strong>Color:</strong> ${product.Colors[0].ColorName}</p>
      <div class="product__description">
        ${product.DescriptionHtmlSimple}
      </div>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
      </div>
    </div>
  `;
}

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
    console.log('ProductDetails created for ID:', productId);
  }

  async init() {
    console.log('ProductDetails.init() called');
    
    try {
      // Show loading state
      const detailElement = document.querySelector('.product-detail');
      if (detailElement) {
        detailElement.innerHTML = '<div class="loading">Loading product details...</div>';
      }
      
      // Get product details
      console.log('Fetching product data...');
      this.product = await this.dataSource.findProductById(this.productId);
      console.log('Product data received:', this.product);
      
      if (!this.product) {
        throw new Error('Product not found - null response');
      }
      
      // Render product details
      console.log('Rendering product details...');
      this.renderProductDetails();
      
      // Add event listener to "Add to Cart" button
      const addButton = document.getElementById('addToCart');
      if (addButton) {
        console.log('Add to cart button found, attaching listener');
        addButton.addEventListener('click', this.addToCart.bind(this));
      } else {
        console.error('Add to cart button not found!');
      }
        
    } catch (error) {
      console.error('Error in ProductDetails.init():', error);
      const detailElement = document.querySelector('.product-detail');
      if (detailElement) {
        detailElement.innerHTML = `
          <div class="error">
            <h2>Error Loading Product</h2>
            <p>Sorry, we couldn't load this product.</p>
            <p>Error: ${error.message}</p>
            <a href="/index.html">Return to home</a>
          </div>
        `;
      }
    }
  }

  addToCart() {
    console.log('Adding product to cart:', this.product);
    
    try {
      // Get existing cart or create empty array
      let cart = getLocalStorage('so-cart') || [];
      console.log('Current cart:', cart);
      
      // Add product to cart
      cart.push(this.product);
      console.log('Updated cart:', cart);
      
      // Save back to localStorage
      setLocalStorage('so-cart', cart);
      
      // Update cart count in header
      updateCartCount();
      
      // Show confirmation
      const button = document.getElementById('addToCart');
      if (button) {
        const originalText = button.textContent;
        button.textContent = '✓ Added to Cart!';
        button.style.background = '#5cb85c';
        
        setTimeout(() => {
          button.textContent = originalText;
          button.style.background = '';
        }, 2000);
      }
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding product to cart. Please try again.');
    }
  }

  renderProductDetails() {
    console.log('Rendering product details...');
    const element = document.querySelector('.product-detail');
    
    if (!element) {
      console.error('Product detail element not found!');
      return;
    }
    
    console.log('Product detail element found, inserting HTML');
    element.innerHTML = productDetailsTemplate(this.product);
    console.log('Product details rendered successfully');
  }
}