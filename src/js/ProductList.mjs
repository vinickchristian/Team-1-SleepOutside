import { renderListWithTemplate } from './utils.mjs';

function productCardTemplate(product) {
  const image = (product.Images && (product.Images.PrimarySmall || product.Images.PrimaryMedium || product.Images.PrimaryLarge)) || './images/placeholder.png';
  const brand = product.Brand && product.Brand.Name ? product.Brand.Name : '';
  const name = product.NameWithoutBrand || product.Name || '';
  const price = product.FinalPrice !== undefined ? `$${product.FinalPrice.toFixed(2)}` : '';

  return `
    <li class="product-card">
      <a href="./product_pages/index.html?product=${product.Id}">
        <img src="${image}" alt="${name}" />
        <div class="product-card__meta">
          <h3 class="product-brand">${brand}</h3>
          <h2 class="product-name">${name}</h2>
          <p class="product-card__price">${price}</p>
        </div>
      </a>
    </li>
  `;
}

export default class ProductList {
  constructor(category, dataSource, element) {
    this.category = category;
    this.dataSource = dataSource;
    this.element = element;
  }

  async init() {
    if (!this.element) {
      console.error('No element provided to render product list');
      return;
    }

    // show loading state
    this.element.innerHTML = '<li class="loading">Loading products...</li>';

    try {
      const products = await this.dataSource.getData(this.category);

      if (!products || products.length === 0) {
        this.element.innerHTML = '<li class="empty">No products found.</li>';
        return;
      }

      renderListWithTemplate(productCardTemplate, this.element, products, 'beforeend', true);
    } catch (error) {
      console.error('Error rendering product list:', error);
      this.element.innerHTML = `<li class="error">Error loading products.</li>`;
    }
  }
}