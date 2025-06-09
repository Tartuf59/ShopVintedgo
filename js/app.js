document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("articlesContainer");
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const sortFilter = document.getElementById("sortFilter");

  let allArticles = [];

  // Chargement du JSON
  fetch("data/articles.json")
    .then(response => {
      if (!response.ok) throw new Error("Erreur lors du chargement des articles.");
      return response.json();
    })
    .then(data => {
      allArticles = data;
      populateCategoryFilter(data);
      renderArticles(data);
    })
    .catch(error => {
      console.error("Erreur : ", error);
      container.innerHTML = "<p>Impossible de charger les articles.</p>";
    });

  function populateCategoryFilter(articles) {
    const categories = [...new Set(articles.map(a => a.category))];
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categoryFilter.appendChild(option);
    });
  }

  function renderArticles(articles) {
    container.innerHTML = "";
    if (articles.length === 0) {
      container.innerHTML = "<p>Aucun article trouvé.</p>";
      return;
    }

    articles.forEach(article => {
      const card = document.createElement("div");
      card.className = "article-card";
      card.innerHTML = `
        ${article.isNew ? '<div class="new-badge">Nouveau</div>' : ""}
        <a href="${article.linkVinted}" target="_blank">
          <img src="${article.image}" alt="${article.title}" />
          <div class="article-content">
            <h2>${article.title}</h2>
            <p>${article.price} €</p>
          </div>
        </a>
      `;
      container.appendChild(card);
    });
  }

  function applyFilters() {
    let filtered = [...allArticles];

    const search = searchInput.value.toLowerCase();
    if (search) {
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(search) ||
        a.description.toLowerCase().includes(search)
      );
    }

    const category = categoryFilter.value;
    if (category !== "all") {
      filtered = filtered.filter(a => a.category === category);
    }

    const sort = sortFilter.value;
    if (sort === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === "date-desc") {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sort === "date-asc") {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    renderArticles(filtered);
  }

  searchInput.addEventListener("input", applyFilters);
  categoryFilter.addEventListener("change", applyFilters);
  sortFilter.addEventListener("change", applyFilters);
});

