import "./style.css";
const config = {
  flowServiceUrl: import.meta.env.VITE_FLOW_SERVICE_URL,
};

const params = new URLSearchParams(window.location.search);

function navigation(ev) {
  // const hash = window.location.hash;
  // const pages = document.querySelectorAll("#pages > *");
  // pages.forEach((page) => {
  //   if (!hash.includes(page.id)) {
  //       page.style.display = "none";
  //   }
  // });
}
window.addEventListener("DOMContentLoaded", navigation);
window.addEventListener("hashchange", navigation);

const PayButton = document.querySelector("#pay-button");

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
const order = {
  subject: "Compra de productos",
  email: "dvergara@flow.cl",
  amount: products.reduce((prev, current) => {
    return prev + current.unitPrice;
  }, 0),
};
async function sendOrder() {
  const response = await fetch(`${config.flowServiceUrl}/payment/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });
  const data = await response.json();
  PayButton.href = data.url;
  PayButton.classList.remove("button--disabled");
  PayButton.target = "_blank";
}

const productsComponent = products.map((product) => {
  return createProductComponent(product);
});

document.getElementById("products-detail").append(...productsComponent);
sendOrder();

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
  productContainer.style.minWidth = "300px";

  const productName = document.createElement("h2");
  productName.textContent = name;

  const productImage = document.createElement("img");
  productImage.src = imageUrl;
  productImage.alt = name;
  productImage.style.maxWidth = "100%";
  productImage.style.height = "200px";
  productImage.style.display = "block";
  productImage.style.marginInline = "auto";
  const priceParagraph = document.createElement("p");
  priceParagraph.textContent = `Price: ${formatCurrency(unitPrice)}`;

  // Append elements
  productContainer.appendChild(productName);
  productContainer.appendChild(productImage);
  productContainer.appendChild(priceParagraph);

  return productContainer;
}
