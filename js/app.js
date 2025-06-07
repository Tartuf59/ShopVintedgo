const articlesContainer = document.getElementById('articlesContainer');
const searchInput = document.getElementById('searchInput');

let articles = [];

// Charger les articles JSON (ici en local pour test)
fetch('data/articles.json')
  .then(res => res.json())
  .then(data => {
    articles = data;
    displayArticles(articles);
  });

// Fonction pour afficher les articles dans le container
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

// Recherche instantanée
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase().trim();
  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(query) ||
    (a.description && a.description.toLowerCase().includes(query))
  );
  displayArticles(filtered);
});
