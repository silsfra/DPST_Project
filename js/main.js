import { getCars } from "./api.js";
import { applyFilters } from "./filter.js";
import { renderCars } from "./render.js";

let allCars = [];

function getCheckedValues(selector) {
  return Array.from(document.querySelectorAll(`${selector}:checked`))
    .map(input => input.value);
}

function getElementValue(id) {
  return document.getElementById(id)?.value || "";
}

function getFilters() {
  return {
    brands: getCheckedValues(".brand"),
    colors: getCheckedValues(".color"),
    priceRange: getElementValue("priceRange"),
    cluster: getElementValue("cluster"),
    budget: getElementValue("budget"),
    sort: getElementValue("sort"),
  };
}

function updateUI() {
  const filters = getFilters();
  const filteredCars = applyFilters(allCars, filters);

  renderCars(filteredCars);
}

function bindEvents() {
  document
    .querySelectorAll(".brand, .color")
    .forEach(input => {
      input.addEventListener("change", updateUI);
    });

  document
    .getElementById("recommend-btn")
    ?.addEventListener("click", updateUI);
}

async function init() {
  try {
    allCars = await getCars();

    bindEvents();
    updateUI();
  } catch (error) {
    console.error("Failed to load cars:", error);

    document.getElementById("car-list").innerHTML =
      `<p class="empty-result">เกิดข้อผิดพลาดในการโหลดข้อมูลรถ</p>`;
  }
}

init();