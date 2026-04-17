import { getCars } from './api.js';
import { applyFilters } from './filter.js';
import { renderCars } from './render.js';

async function updateUI() {
  const cars = await getCars();

  const filters = {
    brands: Array.from(document.querySelectorAll(".brand:checked"))
      .map(cb => cb.value),

    colors: Array.from(document.querySelectorAll(".color:checked"))
      .map(cb => cb.value),

    priceRange: document.getElementById("priceRange")?.value || "",
    cluster: document.getElementById("cluster")?.value || "",
    budget: document.getElementById("budget")?.value || ""
  };

  console.log("filters:", filters);

  const filtered = applyFilters(cars, filters);

  console.log("filtered:", filtered);

  renderCars(filtered);
}

// ===== SIDEBAR (ทำงานทันที) =====
document.querySelectorAll(".brand").forEach(cb => {
  cb.addEventListener("change", updateUI);
});

// ✅ color filter → ทำงานทันที
document.querySelectorAll(".color").forEach(cb => {
  cb.addEventListener("change", updateUI);
});

// ===== TOP FILTER (กดปุ่มก่อน) =====
const btn = document.getElementById("recommend-btn");

if (btn) {
  btn.addEventListener("click", updateUI);
}

// ===== LOAD ครั้งแรก =====
updateUI();