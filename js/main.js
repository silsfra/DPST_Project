import { getCars } from './api.js';
import { applyFilters } from './filter.js';
import { renderCars } from './render.js';

async function updateUI() {
  const cars = await getCars();

  const filters = {
    brands: Array.from(document.querySelectorAll(".brand:checked")).map(cb => cb.value),
    priceRange: document.getElementById("priceRange").value
  };

  console.log("filters:", filters);

  const filtered = applyFilters(cars, filters);

  console.log("filtered:", filtered);

  renderCars(filtered); // ✅ ใช้ filter แล้ว
}

// event
document.querySelectorAll(".brand").forEach(cb => {
  cb.addEventListener("change", updateUI);
});

document.getElementById("priceRange").addEventListener("change", updateUI);

// load
updateUI();