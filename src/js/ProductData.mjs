// ProductData.mjs - Handles fetching product data

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error(`Bad Response: ${res.status}`);
  }
}

export default class ProductData {
  constructor() {
    this.baseURL = 'https://wdd330-backend.onrender.com/';
  }

  async getData(category) {
    try {
      console.log(`Fetching products for category: ${category}`);
      const response = await fetch(this.baseURL + `products/search/${category}`);
      const data = await convertToJson(response);
      console.log('Products fetched:', data);
      return data.Result;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  async findProductById(id) {
    try {
      console.log(`Fetching product with ID: ${id}`);
      const response = await fetch(this.baseURL + `product/${id}`);
      const data = await convertToJson(response);
      console.log('Product fetched:', data);
      return data.Result;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }
}