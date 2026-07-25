import { getCars } from "./api.js";
import { applyFilters } from "./filter.js";
import { renderCars } from "./render.js";

let allCars = [];

function getCheckedValues(selector) {
  return Array
    .from(document.querySelectorAll(`${selector}:checked`))
    .map(input => input.value);
}

function getCheckedValuesFromContainer(container) {
  if (!container) return [];

  return Array.from(
    container.querySelectorAll("input[type='checkbox']:checked")
  ).map(input => input.value);
}

function getElementValue(id) {
  return document.getElementById(id)?.value || "";
}

function getRankingMode() {
  return document.querySelector("input[name='rankingMode']:checked")?.value || "default";
}

function getPreferences() {
  return Array
    .from(document.querySelectorAll(".preference-item"))
    .map(item => {
      const checkbox = item.querySelector("input[type='checkbox']");
      const percentInput = item.querySelector(".preference-percent");

      if (!checkbox?.checked) return null;

      const percent = Number(percentInput?.value || 0);

      if (percent <= 0) return null;

      return {
        key: checkbox.dataset.key,
        percent,
      };
    })
    .filter(Boolean);
}

function togglePreferenceBox() {
  const rankingMode = getRankingMode();
  const preferenceBox = document.getElementById("preference-box");

  if (!preferenceBox) return;

  preferenceBox.classList.toggle("hidden", rankingMode !== "personal");
}

function getFilters() {
  const dropdowns = document.querySelectorAll(
    ".left-filter .custom-dropdown"
  );

  return {
    brands: dropdowns[0]
      ? getCheckedValuesFromContainer(dropdowns[0])
      : [],

    priceRanges: dropdowns[1]
      ? getCheckedValuesFromContainer(dropdowns[1])
      : [],

    colors: dropdowns[2]
      ? getCheckedValuesFromContainer(dropdowns[2])
      : [],

    clusters: getCheckedValues(
      ".car-type-options input[type='checkbox']"
    ),

    rankingMode: getRankingMode(),
    preferences: getPreferences(),
  };
}

function updateUI() {
  togglePreferenceBox();

  const filters = getFilters();
  const filteredCars = applyFilters(allCars, filters);

  renderCars(filteredCars, filters);
}

function bindEvents() {
  document
    .querySelectorAll(`
      .left-filter .custom-dropdown input[type='checkbox'],
      .car-type-options input[type='checkbox'],
      input[name='rankingMode'],
      .preference-item input[type='checkbox'],
      .preference-percent
    `)
    .forEach(input => {
      input.addEventListener("change", updateUI);

      if (input.classList.contains("preference-percent")) {
        input.addEventListener("input", updateUI);
      }
    });
}

async function init() {
  try {
    allCars = await getCars();

    bindEvents();
    updateUI();
  } catch (error) {
    console.error("Failed to load cars:", error);

    document.getElementById("car-list").innerHTML = `
      <p class="empty-result">
        เกิดข้อผิดพลาดในการโหลดข้อมูลรถ
      </p>
    `;
  }
}

init();