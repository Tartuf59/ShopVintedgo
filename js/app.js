const articlesContainer = document.getElementById('articlesContainer');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const sortFilter = document.getElementById('sortFilter');

// 🗺️ Dictionnaire ID → fichier HTML
const articlePages = {
  "Puzzle-Pokémon": "puzzle-pokemon.html",
  "Vtech-Kidizoom": "vtech-kidizoom.html",
  "Action-Caméra": "action-camera.html",
  "Boxer": "boxer.html"
};

let articles = [];
let filteredArticles = [];

// Charger articles JSON
fetch('data/articles.json')
  .then(res => res.json())
  .then(data => {
    articles = data;
    populateCategoryFilter();
    applyFilters();
  });

function populateCategoryFilter() {
  const categories = [...new Set(articles.map(a => a.category))];
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const selectedCategory = categoryFilter.value;
  const selectedSort = sortFilter.value;

  filteredArticles = articles.filter(a => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm) ||
      (a.description && a.description.toLowerCase().includes(searchTerm));
    const matchesCategory = selectedCategory === 'all' || a.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  switch (selectedSort) {
    case 'price-asc':
      filteredArticles.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filteredArticles.sort((a, b) => b.price - a.price);
      break;
    case 'date-asc':
      filteredArticles.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
    case 'date-desc':
      filteredArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
  }

  displayArticles(filteredArticles);
}

function displayArticles(list) {
  articlesContainer.innerHTML = '';

  if (list.length === 0) {
    articlesContainer.innerHTML = '<p>Aucun article trouvé.</p>';
    return;
  }

  list.forEach(article => {
    const articleCard = document.createElement('div');
    articleCard.className = 'article-card';
    articleCard.onclick = () => {
      const page = articlePages[article.id];
      if (page) {
        window.location.href = page;
      } else {
        alert("Page de l'article non trouvée.");
      }
    };

    articleCard.innerHTML = `
      ${article.isNew ? '<div class="new-badge">Nouveau</div>' : ''}
      <img src="${article.image}" alt="${article.title}" />
      <div class="article-content">
        <h3 class="article-title">${article.title}</h3>
        <p class="article-price">${article.price} €</p>
      </div>
    `;

    articlesContainer.appendChild(articleCard);
  });
}

// Event listeners
searchInput.addEventListener('input', applyFilters);
categoryFilter.addEventListener('change', applyFilters);
sortFilter.addEventListener('change', applyFilters);
