const FAV_KEY = "favorites";

function getFavorites() {
  try {
    const data = JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveFavorites(list) {
  localStorage.setItem(FAV_KEY, JSON.stringify(list));
}

function isFavorite(id) {
  const fav = getFavorites();
  return fav.includes(String(id));
}

function toggleFavorite(id) {
  const fav = getFavorites();
  id = String(id);

  if (fav.includes(id)) {
    const updated = fav.filter(x => x !== id);
    saveFavorites(updated);
  } else {
    fav.push(id);
    saveFavorites(fav);
  }

  // обновляем navbar
  if (window.initNavbar) {
    window.initNavbar();
  }
}

window.Favorites = {
  getFavorites,
  toggleFavorite,
  isFavorite
};