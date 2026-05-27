import { calculateNPV, normalize } from "./utils.js";
import { applyFilters } from "./filter.js";

const DEFAULT_IMAGE = "assets/car_paint.png";

const NPV_CONFIG = {
  years: 5,
  insurance: 25000,
  maintenance: 5000,
  kmPerYear: 15000,
};

let sourceCars = [];

document.addEventListener("filterschange", (e) => {
  if (!sourceCars.length) return;

  const filteredCars = applyFilters(sourceCars, e.detail);
  renderCars(filteredCars, e.detail);
});

function getClusterName(cluster) {
  const clusters = {
    0: "All-round",
    1: "Local",
    2: "Long Range",
    3: "City",
  };

  return clusters[cluster] || "Unknown";
}

function formatMoney(value) {
  return "฿" + Number(value || 0).toLocaleString();
}

function calculateDefaultNPV(car) {
  return (
    calculateNPV(
      car,
      NPV_CONFIG.years,
      NPV_CONFIG.insurance,
      NPV_CONFIG.maintenance,
      NPV_CONFIG.kmPerYear
    ) || 0
  );
}

function renderColorDot(color) {
  if (color.secondary) {
    return `
      <div
        class="color-dot"
        title="${color.name}"
        style="background:linear-gradient(to bottom, ${color.secondary} 50%, ${color.hex} 50%);">
      </div>
    `;
  }

  return `
    <div
      class="color-dot"
      title="${color.name}"
      style="background:${color.hex};">
    </div>
  `;
}

function getDisplayScore(car, normalizedNPV, filters) {
  const hasPreferences =
    filters?.preferences &&
    filters.preferences.length > 0;

  if (hasPreferences) {
    return `Score: ${(car.match_score || 0).toFixed(2)}`;
  }

  return `Score: ${normalizedNPV.toFixed(2)}`;
}

function createCarCard(car, normalizedNPV, filters) {
  const card = document.createElement("div");
  card.className = "car-card";

  const carName = `${car.model} ${car.trim || ""}`.trim();
  const colors = car.colors || [];
  const colorHTML = colors.map(renderColorDot).join("");

  const displayScore = getDisplayScore(car, normalizedNPV, filters);
  const displayNPV = `NPV : ${Math.round(calculateDefaultNPV(car)).toLocaleString()}฿`;

  card.innerHTML = `
    <div class="card-image-wrapper">
      <span class="tag">
        ${getClusterName(car.cluster)}
      </span>

      <img
        src="${car.image_url || DEFAULT_IMAGE}"
        class="car-image"
        alt="${car.brand} ${carName}"
      />
    </div>

    <div class="car-info">
      <div class="card-top-info">
        <p class="brand">${car.brand || "-"}</p>
        <p class="npv-top">${displayNPV}</p>
      </div>

      <h3 class="car-title">${carName}</h3>

      <div class="colors">
        ${colorHTML}
      </div>

      <div class="spec-box">
        <div class="spec-item">
          <p>${car.wltp_range_km || "-"} km</p>
          <span>Range</span>
        </div>

        <div class="spec-item">
          <p>${car.battery_capacity_kWh || "-"} kWh</p>
          <span>Battery</span>
        </div>

        <div class="spec-item">
          <p>${car.dc_charging_power_kW || "-"} kW</p>
          <span>Charging</span>
        </div>
      </div>

      <div class="bottom">
        <p class="price">${formatMoney(car.price)}</p>
        <p class="npv">${displayScore}</p>
      </div>
    </div>
  `;

  card.addEventListener("click", () => {
    window.location.href = `car.html?id=${car.ID}`;
  });

  return card;
}

export function renderCars(cars, filters = {}) {
  const container = document.getElementById("car-list");
  if (!container) return;

  if (!sourceCars.length && cars?.length) {
    sourceCars = [...cars];
  }

  container.innerHTML = "";

  if (!cars || cars.length === 0) {
    container.innerHTML = `<p class="empty-result">❌ No cars found</p>`;
    return;
  }

  const npvValues = cars.map(calculateDefaultNPV);
  const minNPV = Math.min(...npvValues);
  const maxNPV = Math.max(...npvValues);

  cars.forEach((car, index) => {
    const normalizedNPV = normalize(npvValues[index], minNPV, maxNPV);
    const card = createCarCard(car, normalizedNPV, filters);

    container.appendChild(card);
  });
}