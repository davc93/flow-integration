import "./style.css";
const config = {
  flowServiceUrl: import.meta.env.VITE_FLOW_SERVICE_URL,
};

const payButton = document.querySelector("#pay-button");
const statusButton = document.querySelector("#status-button");
const statusInput = document.querySelector("#status-input");
const paymentInfo = document.querySelector("#payment-info");
const form = document.querySelector("#pay-form");
const params = new URLSearchParams(window.location.search);
const token = params.get("token");
statusButton.addEventListener("click", (event) => {
  event.preventDefault();
  getOrderStatus(statusInput.value);
});

if (token) {
  statusInput.value = token;
  getOrderStatus(token);
}

function navigation(ev) {
  let hash = window.location.hash;
  const pages = document.querySelectorAll("#pages > *");
  pages.forEach((page) => {
    hash = !hash ? "checkout" : hash;
    if (!hash.includes(page.id)) {
      page.classList.remove("page-active")
    } else {
      page.classList.add("page-active")

    }
  });
}
window.addEventListener("DOMContentLoaded", navigation);
window.addEventListener("hashchange", navigation);

const products = [
  {
    name: "Telefono",
    unitPrice: 150000,
    currency: "CLP",
    imageUrl:
      "https://images.unsplash.com/photo-1505156868547-9b49f4df4e04?q=80&w=1432&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Computador",
    unitPrice: 520000,
    currency: "CLP",
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];
const totalAmount = products.reduce((prev, current) => {
  return prev + current.unitPrice;
}, 0);

document.querySelector("#total-amount").textContent = totalAmount;

const order = {
  subject: "Compra de productos",
  email: "dvergara@flow.cl",
  amount: totalAmount,
};
async function sendOrder(event) {
  event.preventDefault();
  if (form.checkValidity()) {
    payButton.disabled = "true"
    payButton.classList.add("button--disabled");
    payButton.textContent = "Cargando...";
    const response = await fetch(`${config.flowServiceUrl}/payment/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });
    const data = await response.json();
    window.location = data.url;
    payButton.classList.remove("button--disabled");
  }else {
    alert("Complete bien el formulario")
  }
}
async function getOrderStatus(token) {
  paymentInfo.textContent = "Cargando...";

  const response = await fetch(`${config.flowServiceUrl}/payment/status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });
  const data = await response.json();
  paymentInfo.textContent = JSON.stringify(data);
}

const productsComponent = products.map((product) => {
  return createProductComponent(product);
});

document.getElementById("products-detail").append(...productsComponent);
payButton.addEventListener("click", sendOrder);
function createProductComponent({ name, unitPrice, currency, imageUrl }) {
  // Function to format currency
  const formatCurrency = (price) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency,
    }).format(price);
  };

  // Create elements
  const productContainer = document.createElement("div");
  productContainer.style.border = "1px solid #ccc";
  productContainer.style.borderRadius = "5px";
  productContainer.style.padding = "10px";
  productContainer.style.margin = "10px";
  productContainer.style.width = "300px";
  productContainer.style.display = "flex"
  productContainer.style.gap = "20px"
  const productName = document.createElement("h2");
  productName.textContent = name;

  const productImage = document.createElement("img");
  productImage.src = imageUrl;
  productImage.alt = name;
  productImage.style.width = "100px";
  productImage.style.display = "block";
  const priceParagraph = document.createElement("p");
  priceParagraph.textContent = `Price: ${formatCurrency(unitPrice)}`;

  // Append elements
  const productContent = document.createElement("div")
  productContent.append(productName,priceParagraph)
  productContainer.append(productImage,productContent);

  return productContainer;
}
