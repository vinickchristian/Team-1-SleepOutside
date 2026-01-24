import { getParam, loadHeaderFooter } from './utils.mjs';
import ProductData from './ProductData.mjs';
import ProductDetails from './ProductDetails.mjs';

console.log('product.js loaded');

// Load header and footer
loadHeaderFooter();

// Get product ID from URL
const productId = getParam('product');
console.log('Product ID from URL:', productId);

if (!productId) {
  console.error('No product ID found in URL');
  document.querySelector('.product-detail').innerHTML = `
    <div class="error">
      <h2>Product not found</h2>
      <p>No product ID specified.</p>
      <a href="/index.html">Return to home</a>
    </div>
  `;
} else {
  console.log('Initializing product details for ID:', productId);
  
  // Initialize data source
  const dataSource = new ProductData();
  
  // Create product details instance
  const product = new ProductDetails(productId, dataSource);
  
  // Initialize product details
  product.init();
}