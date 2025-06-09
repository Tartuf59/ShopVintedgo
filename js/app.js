document.addEventListener("DOMContentLoaded", function () {
  const thumbnails = document.querySelectorAll(".thumbnails img");
  const mainImage = document.querySelector(".main-image");

  thumbnails.forEach((thumb) => {
    thumb.addEventListener("click", function () {
      mainImage.src = this.src;
      mainImage.classList.add("fade");
      setTimeout(() => mainImage.classList.remove("fade"), 300);
    });
  });

  const searchInput = document.getElementById("searchInput");
  const articles = document.querySelectorAll(".article-card");

  searchInput.addEventListener("input", function () {
    const filter = this.value.toLowerCase();

    articles.forEach((article) => {
      const title = article.querySelector(".article-title").textContent.toLowerCase();
      if (title.includes(filter)) {
        article.style.display = "";
      } else {
        article.style.display = "none";
      }
    });
  });

  const sortSelect = document.getElementById("sortSelect");

  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      const value = this.value;
      const container = document.querySelector(".articles-grid");
      const cards = Array.from(container.children);

      cards.sort((a, b) => {
        const priceA = parseFloat(a.querySelector(".article-price").textContent.replace(/[^\d.-]/g, '')) || 0;
        const priceB = parseFloat(b.querySelector(".article-price").textContent.replace(/[^\d.-]/g, '')) || 0;
        return value === "asc" ? priceA - priceB : priceB - priceA;
      });

      container.innerHTML = "";
      cards.forEach(card => container.appendChild(card));
    });
  }
});
