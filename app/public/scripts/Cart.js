// Carrito
const btnCartLarge = document.querySelector('.cart-large .container-cart-icon');
const btnCartSmall = document.querySelector('.cart-small .container-cart-icon');
const containerCartProductsLarge = document.querySelector('.cart-large .container-cart-products');
const containerCartProductsSmall = document.querySelector('.cart-small .container-cart-products');

const toggleCart = (container) => {
    container.classList.toggle('hidden-cart');
};

btnCartLarge.addEventListener('click', () => toggleCart(containerCartProductsLarge));
btnCartSmall.addEventListener('click', () => toggleCart(containerCartProductsSmall));

// Cerrar el carrito al hacer clic fuera de él
document.addEventListener('click', (e) => {
    if (!containerCartProductsLarge.contains(e.target) && !btnCartLarge.contains(e.target)) {
        containerCartProductsLarge.classList.add('hidden-cart');
    }
    if (!containerCartProductsSmall.contains(e.target) && !btnCartSmall.contains(e.target)) {
        containerCartProductsSmall.classList.add('hidden-cart');
    }
});

/* ========================= */
const rowProductLarge = document.querySelector('.cart-large .row-product');
const rowProductSmall = document.querySelector('.cart-small .row-product');

// Lista de todos los contenedores de productos
const productsList = document.querySelectorAll('.container-items');

// Variable de arreglos de Productos
let allProducts = [];

const valorTotalLarge = document.querySelector('.cart-large .total-pagar');
const valorTotalSmall = document.querySelector('.cart-small .total-pagar');
const countProductsLarge = document.querySelector('.cart-large #contador-productos');
const countProductsSmall = document.querySelector('.cart-small #contador-productos');
const cartEmptyLarge = document.querySelector('.cart-large .cart-empty');
const cartEmptySmall = document.querySelector('.cart-small .cart-empty');
const cartTotalLarge = document.querySelector('.cart-large .cart-total');
const cartTotalSmall = document.querySelector('.cart-small .cart-total');

productsList.forEach(container => {
    container.addEventListener('click', async (e) => {
        if (e.target.classList.contains('btn-add-cart')) {
            const product = e.target.parentElement;

            const infoProduct = {
                title: product.querySelector('h2').textContent,
                price: product.querySelector('.price').textContent,
            };

            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(infoProduct),
            });

            allProducts = await response.json();
            showHTML();
        }
    });
});

// Guardar carrito en localStorage
const saveCartToLocalStorage = () => {
    localStorage.setItem('cart', JSON.stringify(allProducts));
};

// Llamar a saveCartToLocalStorage cada vez que se actualice el carrito
const updateCart = (rowProduct, cartEmpty, cartTotal, valorTotal, countProducts) => {
    if (!allProducts.length) {
        cartEmpty.classList.remove('hidden');
        rowProduct.classList.add('hidden');
        cartTotal.classList.add('hidden');
    } else {
        cartEmpty.classList.add('hidden');
        rowProduct.classList.remove('hidden');
        cartTotal.classList.remove('hidden');
    }

    // Limpiar HTML
    rowProduct.innerHTML = '';

    let total = 0;
    let totalOfProducts = 0;

    allProducts.forEach(product => {
        const containerProduct = document.createElement('div');
        containerProduct.classList.add('cart-product');

        containerProduct.innerHTML = `
            <div class="info-cart-product">
                <span class="cantidad-producto-carrito">${product.quantity}</span>
                <p class="titulo-producto-carrito">${product.title}</p>
                <span class="precio-producto-carrito">${product.price}</span>
            </div>
        `;

        rowProduct.append(containerProduct);

        total += parseFloat(product.price.slice(1)) * product.quantity;
        totalOfProducts += product.quantity;
    });

    valorTotal.innerText = `$${total.toFixed(2)}`;
    countProducts.innerText = totalOfProducts;

    saveCartToLocalStorage(); // Guardar el carrito actualizado
};

// Cargar carrito desde localStorage al iniciar la página
const loadCartFromLocalStorage = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        allProducts = JSON.parse(savedCart);
        showHTML();
    }
};

// Llamar a loadCartFromLocalStorage al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    loadCartFromLocalStorage();
});

const rowProductClickHandler = async (e, rowProduct, container) => {
    if (e.target.classList.contains('icon-close')) {
        const product = e.target.parentElement;
        const title = product.querySelector('p').textContent;

        const response = await fetch('/api/cart', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title }),
        });

        allProducts = await response.json();
        showHTML();
        saveCartToLocalStorage(); // Guardar el carrito actualizado
    }
};

rowProductLarge.addEventListener('click', (e) => rowProductClickHandler(e, rowProductLarge, containerCartProductsLarge));
rowProductSmall.addEventListener('click', (e) => rowProductClickHandler(e, rowProductSmall, containerCartProductsSmall));

// Función para mostrar HTML
const showHTML = () => {
    const updateCart = (rowProduct, cartEmpty, cartTotal, valorTotal, countProducts) => {
        if (!allProducts.length) {
            cartEmpty.classList.remove('hidden');
            rowProduct.classList.add('hidden');
            cartTotal.classList.add('hidden');
        } else {
            cartEmpty.classList.add('hidden');
            rowProduct.classList.remove('hidden');
            cartTotal.classList.remove('hidden');
        }

        // Limpiar HTML
        rowProduct.innerHTML = '';

        let total = 0;
        let totalOfProducts = 0;

        allProducts.forEach(product => {
            const containerProduct = document.createElement('div');
            containerProduct.classList.add('cart-product');

            containerProduct.innerHTML = `
                <div class="info-cart-product">
                    <span class="cantidad-producto-carrito">${product.quantity}</span>
                    <p class="titulo-producto-carrito">${product.title}</p>
                    <span class="precio-producto-carrito">${product.price}</span>
                </div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="icon-close"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            `;

            rowProduct.append(containerProduct);

            total = total + parseInt(product.quantity * product.price.slice(1));
            totalOfProducts = totalOfProducts + product.quantity;
            
        });

        valorTotal.innerText = `$${total}`;
        countProducts.innerText = totalOfProducts;
        saveCartToLocalStorage(); // Añadir esta línea al final
    };

    updateCart(rowProductLarge, cartEmptyLarge, cartTotalLarge, valorTotalLarge, countProductsLarge);
    updateCart(rowProductSmall, cartEmptySmall, cartTotalSmall, valorTotalSmall, countProductsSmall);
};

