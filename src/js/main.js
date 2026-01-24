// main.js - Homepage functionality
import { loadHeaderFooter } from './utils.mjs';
import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';

console.log('main.js loaded');

// Load header and footer
loadHeaderFooter();

// Initialize product data source
const dataSource = new ProductData();

// Create product list for tents category
const listElement = document.querySelector('.product-list');

if (listElement) {
  console.log('Product list element found, initializing...');
  const productList = new ProductList('tents', dataSource, listElement);
  productList.init();
} else {
  console.error('Product list element not found!');
}