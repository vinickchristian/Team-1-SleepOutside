function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

const baseURL = import.meta.env.VITE_SERVER_URL;

export default class ProductData {
  constructor() {
  }
  async getData(category) {
    const url = `${baseURL}/products/search/${category}`;
    console.log('Fetching from:', url);
    const response = await fetch(url);
    console.log('Response status:', response.status);
    const data = await convertToJson(response);
    console.log('Data:', data);
    return data.Result;
  }
  async findProductById(id) {
    const url = `${baseURL}/products/${id}`;
    console.log('Fetching product from:', url);
    const response = await fetch(url);
    console.log('Response status:', response.status);
    const data = await convertToJson(response);
    console.log('Product data:', data);
    return data;
  }
}