const articlesContainer = document.getElementById('articlesContainer');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const sortFilter = document.getElementById('sortFilter');

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
  // Extraire catégories uniques
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

  // Filtrer par recherche + catégorie
  filteredArticles = articles.filter(a => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm) ||
      (a.description && a.description.toLowerCase().includes(searchTerm));

    const matchesCategory = selectedCategory === 'all' || a.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Trier
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
    default:
      // Pas de tri spécifique
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
      window.location.href = `article.html?id=${article.id}`;
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
