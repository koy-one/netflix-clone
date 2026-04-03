const API_KEY = "3786b1b37ec23eacd03fde220328a619";


// ==========================
// HERO
// ==========================
function setHero(movie) {

  const hero = document.getElementById("hero");

  hero.style.backgroundImage =
    `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;

  hero.innerHTML = `
    <div class="hero-content max-w-xl relative z-10">
      <h1 class="text-4xl font-bold mb-4">${movie.title}</h1>
      <p class="text-gray-300 mb-4">${movie.overview}</p>

      <button class="bg-white text-black px-6 py-2 rounded hover:scale-105 transition">
        ▶ Play Trailer
      </button>
    </div>
  `;

  showTrailer(movie.id);
}


// ==========================
// TRAILER
// ==========================
function showTrailer(movieId) {

  fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`)
    .then(res => res.json())
    .then(data => {

      const hero = document.getElementById("hero");

      const trailer = data.results.find(
        v => v.type === "Trailer" && v.site === "YouTube"
      );

      if (trailer) {

        const iframe = document.createElement("iframe");

        iframe.src = `https://www.youtube.com/embed/${trailer.key}`;
        iframe.width = "100%";
        iframe.height = "400";
        iframe.classList.add("mt-4", "rounded");

        hero.appendChild(iframe);

      }

    });

}


// ==========================
// FETCH MOVIES
// ==========================
function fetchMovies(url, containerId) {

  fetch(url)
    .then(res => res.json())
    .then(data => {

      document.getElementById("loader").style.display = "none";

      const container = document.getElementById(containerId);

      if (containerId === "trending" && data.results.length > 0) {
        setHero(data.results[0]);
      }

      data.results.forEach(movie => {

        if (!movie.poster_path) return;

        const card = document.createElement("div");
        card.classList.add("movie-card", "relative", "min-w-[160px]");

        const img = document.createElement("img");
        img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        img.classList.add("rounded-lg", "cursor-pointer");

        const overlay = document.createElement("div");
        overlay.classList.add(
          "overlay",
          "absolute",
          "bottom-0",
          "left-0",
          "right-0",
          "bg-black/70",
          "p-2",
          "opacity-0",
          "group-hover:opacity-100"
        );

        overlay.innerHTML = `<p class="text-sm">${movie.title}</p>`;

        card.addEventListener("click", () => setHero(movie));

        card.appendChild(img);
        card.appendChild(overlay);
        container.appendChild(card);

      });

    });

}


// ==========================
// SEARCH
// ==========================
document.getElementById("searchBtn").addEventListener("click", searchMovies);

function searchMovies() {

  const query = document.getElementById("searchInput").value;
  if (!query) return;

  fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`)
    .then(res => res.json())
    .then(data => {

      const container = document.getElementById("searchResults");
      container.innerHTML = "";

      data.results.forEach(movie => {

        if (!movie.poster_path) return;

        const img = document.createElement("img");

        img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        img.classList.add("w-40", "rounded-lg", "cursor-pointer", "hover:scale-110", "transition");

        img.addEventListener("click", () => setHero(movie));

        container.appendChild(img);

      });

    });

}


// ==========================
// ENTER KEY
// ==========================
document.getElementById("searchInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchMovies();
});


// ==========================
// INIT
// ==========================
fetchMovies(
  `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`,
  "trending"
);

fetchMovies(
  `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`,
  "topRated"
);