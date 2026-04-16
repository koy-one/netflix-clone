const API_KEY = "3786b1b37ec23eacd03fde220328a619";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

/* ELEMENTS */
const hero = document.getElementById("hero");
const trending = document.getElementById("trending");
const topRated = document.getElementById("topRated");
const searchResults = document.getElementById("searchResults");

const modal = document.getElementById("modal");
const modalVideo = document.getElementById("modalVideo");
const closeModal = document.getElementById("closeModal");

/* MODAL */
closeModal.onclick = () => {
  modal.classList.add("hidden");
  modalVideo.src = "";
};

function openModal(key) {
  modalVideo.src = `https://www.youtube.com/embed/${key}?autoplay=1`;
  modal.classList.remove("hidden");
}

/* CARD */
function createCard(movie, container) {
  if (!movie.poster_path) return;

  const div = document.createElement("div");
  div.classList.add("movie-card");

  div.innerHTML = `
    <img src="${IMG_URL + movie.poster_path}" alt="${movie.title}">
  `;

  div.onclick = () => showTrailer(movie.id);

  container.appendChild(div);
}

/* FETCH */
async function fetchMovies(url, container) {
  container.innerHTML = "";

  const res = await fetch(url);
  const data = await res.json();

  data.results.forEach(movie => createCard(movie, container));
}

/* HERO */
async function setHero() {
  const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`);
  const data = await res.json();

  if (!data.results.length) return;

  const movie = data.results[0];

  hero.style.backgroundImage = `url(${IMG_URL + movie.backdrop_path})`;

  document.getElementById("heroTitle").textContent = movie.title;
  document.getElementById("heroDesc").textContent = movie.overview.substring(0, 180) + "...";

  document.getElementById("playBtn").onclick = () => showTrailer(movie.id);
}

/* TRAILER */
async function showTrailer(id) {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`);
  const data = await res.json();

  const trailer = data.results.find(v => v.type === "Trailer");

  if (trailer) openModal(trailer.key);
}

/* SEARCH (LIVE) */
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", async () => {
  const query = searchInput.value.trim();
  if (query.length < 3) return;

  const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`);
  const data = await res.json();

  searchResults.innerHTML = "";
  data.results.forEach(movie => createCard(movie, searchResults));
});

/* INIT */
setHero();

fetchMovies(`https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}`, trending);
fetchMovies(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`, topRated);