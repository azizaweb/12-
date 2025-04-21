document.addEventListener('DOMContentLoaded', () => {
    const userCardsContainer = document.getElementById('userCards');
    const totalPriceContainer = document.getElementById('totalPrice');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortPrice = document.getElementById('sortPrice');
    const loader = document.getElementById('loader');
    let products = [];
    let totalAmount = 0;

    fetch('https://fakestoreapi.com/products?limit=10')
        .then(res => res.json())
        .then(data => {
            products = data;
            loader.style.display = 'none'; // Hide the loader once data is loaded
            loadCategories();
            displayUsers(products);
        });

    function loadCategories() {
        const categories = [...new Set(products.map(p => p.category))];
        categoryFilter.innerHTML = '<option value="">Barcha kategoriyalar</option>' +
            categories.map(c => `<option value="${c}">${c}</option>`).join('');
    }

    function displayUsers(data) {
        userCardsContainer.innerHTML = '';
        data.forEach(user => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${user.image}" alt="${user.title}">
                <h3>${user.title}</h3>
                <p>${user.description.substring(0, 50)}...</p>
                <div class="price-button">
                    <span class="price">$${user.price}</span>
                    <button class="buy-button" data-price="${user.price}">Sotib olish</button>
                </div>
            `;
            userCardsContainer.appendChild(card);
        });

        document.querySelectorAll('.buy-button').forEach(button => {
            button.addEventListener('click', function () {
                const price = parseFloat(this.getAttribute('data-price'));
                totalAmount += price;
                totalPriceContainer.innerHTML = `<h3>Umumiy hisob: $${totalAmount.toFixed(2)}</h3>`;
            });
        });
    }

    function filterAndSortProducts() {
        let filtered = [...products];

        const searchValue = searchInput.value.toLowerCase();
        if (searchValue) {
            filtered = filtered.filter(p => p.title.toLowerCase().includes(searchValue));
        }

        const selectedCategory = categoryFilter.value;
        if (selectedCategory) {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        const sortValue = sortPrice.value;
        if (sortValue === 'asc') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortValue === 'desc') {
            filtered.sort((a, b) => b.price - a.price);
        }

        displayUsers(filtered);
    }

    searchInput.addEventListener('input', filterAndSortProducts);
    categoryFilter.addEventListener('change', filterAndSortProducts);
    sortPrice.addEventListener('change', filterAndSortProducts);
});