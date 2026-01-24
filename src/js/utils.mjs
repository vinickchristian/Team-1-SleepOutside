// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// retrieve data from localstorage
export function getLocalStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (error) {
    console.error(`Error reading from localStorage: ${error}`);
    return null;
  }
}

// save data to local storage
export function setLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage: ${error}`);
  }
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  const element = qs(selector);
  if (element) {
    element.addEventListener("touchend", (event) => {
      event.preventDefault();
      callback();
    });
    element.addEventListener("click", callback);
  }
}

// get the product id from the query string
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// render a list with a template
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {
  if (!parentElement) {
    console.error("Parent element not found!");
    return;
  }
  
  const htmlStrings = list.map(templateFn);
  
  if (clear) {
    parentElement.innerHTML = "";
  }
  
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

// render with template
export function renderWithTemplate(template, parentElement, data, callback) {
  if (!parentElement) {
    console.error("Parent element not found!");
    return;
  }
  
  parentElement.innerHTML = template;
  
  if (callback) {
    callback(data);
  }
}

// load template from file
export async function loadTemplate(path) {
  try {
    const response = await fetch(path);
    
    if (!response.ok) {
      throw new Error(`Failed to load template: ${response.status} ${response.statusText}`);
    }
    
    const html = await response.text();
    return html;
  } catch (error) {
    console.error(`Error loading template from ${path}:`, error);
    return "";
  }
}

// Update cart count badge in header
export function updateCartCount() {
  const cart = getLocalStorage('so-cart') || [];
  const countElement = document.getElementById('cart-count');
  
  if (countElement) {
    const count = cart.length;
    countElement.textContent = count;
    
    if (count === 0) {
      countElement.classList.add('hidden');
    } else {
      countElement.classList.remove('hidden');
    }
  }
}

// Set active navigation link
export function setActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.navbar a');
  
  navLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname;
    
    if (currentPath === linkPath || 
        (currentPath === '/' && linkPath.includes('index.html')) ||
        (currentPath.includes('/index.html') && linkPath.includes('/index.html'))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Load header and footer
export async function loadHeaderFooter() {
  try {
    // Try several candidate paths so partials load correctly from nested pages
    const candidates = [
      'partials/header.html',
      './partials/header.html',
      '../partials/header.html',
      '../../partials/header.html',
      '/src/partials/header.html',
      '/partials/header.html'
    ];

    let headerTemplate = '';
    let footerTemplate = '';

    for (const p of candidates) {
      const resolved = new URL(p, window.location.href).href;
      const tpl = await loadTemplate(resolved);
      if (tpl && tpl.trim().length > 0) {
        headerTemplate = tpl;
        break;
      }
    }

    for (const p of candidates) {
      const resolved = new URL(p.replace('header', 'footer'), window.location.href).href;
      const tpl = await loadTemplate(resolved);
      if (tpl && tpl.trim().length > 0) {
        footerTemplate = tpl;
        break;
      }
    }
    
    const headerElement = document.getElementById("main-header");
    const footerElement = document.getElementById("main-footer");
    
    if (headerElement && headerTemplate) {
      renderWithTemplate(headerTemplate, headerElement);
      updateCartCount();
      setActiveNavLink();
    }
    
    if (footerElement && footerTemplate) {
      renderWithTemplate(footerTemplate, footerElement);
    }
    
  } catch (error) {
    console.error("Error in loadHeaderFooter:", error);
  }
}

// Alert message function
export function alertMessage(message, scroll = true, duration = 3000) {
  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.innerHTML = `<p>${message}</p><span class="close-alert">✖</span>`;
  
  document.body.appendChild(alert);
  
  if (scroll) {
    window.scrollTo(0, 0);
  }
  
  alert.querySelector(".close-alert").addEventListener("click", () => {
    alert.remove();
  });
  
  setTimeout(() => {
    if (alert.parentElement) {
      alert.remove();
    }
  }, duration);
}

// Remove all alerts
export function removeAllAlerts() {
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach(alert => alert.remove());
}