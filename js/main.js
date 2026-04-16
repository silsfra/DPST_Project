import { getCars } from './api.js';
import { applyFilters } from './filter.js';
import { renderCars } from './render.js';

async function updateUI() {
  const cars = await getCars();

  const filters = {
    brands: Array.from(document.querySelectorAll(".brand:checked"))
      .map(cb => cb.value),

    // ✅ ป้องกัน null
    priceRange: document.getElementById("priceRange")?.value || ""
  };

  console.log("filters:", filters);

  const filtered = applyFilters(cars, filters);

  console.log("filtered:", filtered);

  renderCars(filtered);
}

// ===== EVENT =====

// brand checkbox
document.querySelectorAll(".brand").forEach(cb => {
  cb.addEventListener("change", updateUI);
});

// ✅ ป้องกัน error (ตัวพังจริง)
const priceInput = document.getElementById("priceRange");
if (priceInput) {
  priceInput.addEventListener("change", updateUI);
}

// ===== LOAD =====
updateUI();