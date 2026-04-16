import { getCars } from './api.js';
import { applyFilters } from './filter.js';
import { renderCars } from './render.js';

async function updateUI() {
  const cars = await getCars();

  const filters = {
    brands: Array.from(document.querySelectorAll(".brand:checked"))
      .map(cb => cb.value),

    priceRange: document.getElementById("priceRange")?.value || "",

    cluster: document.getElementById("cluster")?.value || "",

    // ✅ ต้องอยู่ตรงนี้เท่านั้น
    budget: document.getElementById("budget")?.value || ""
  };

  console.log("filters:", filters);

  const filtered = applyFilters(cars, filters);

  console.log("filtered:", filtered);

  renderCars(filtered);
}

// ✅ ปุ่มเดียวพอ
const btn = document.getElementById("recommend-btn");

if (btn) {
  btn.addEventListener("click", updateUI);
}

// โหลดครั้งแรก
updateUI();