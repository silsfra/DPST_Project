import { calculateNPV, normalize } from "./utils.js";

const DEFAULT_IMAGE = "assets/car_paint.png";

const NPV_YEARS = 5;
const NPV_INSURANCE = 25000;
const NPV_MAINTENANCE = 5000;
const NPV_KM_PER_YEAR = 15000;

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
  return calculateNPV(
    car,
    NPV_YEARS,
    NPV_INSURANCE,
    NPV_MAINTENANCE,
    NPV_KM_PER_YEAR
  ) || 0;
}

function renderColorDot(color) {
  if (color.secondary) {
    return `
      <div
        class="color-dot"
        title="${color.name}"
        style="
          background:
          linear-gradient(
            to bottom,
            ${color.secondary} 50%,
            ${color.hex} 50%
          );
        ">
      </div>
    `;
  }

  return `
    <div
      class="color-dot"
      title="${color.name}"
      style="background: ${color.hex};">
    </div>
  `;
}

function getDisplayScore(car, normalizedNPV, filters) {
  const hasPreferences =
    filters?.preferences &&
    filters.preferences.length > 0;

  // ===== PERSONAL PREFERENCE SCORE =====
  if (hasPreferences) {
    return `Score: ${(car.match_score || 0).toFixed(2)}`;
  }

  // ===== DEFAULT NPV SCORE =====
  return `Score: ${normalizedNPV.toFixed(2)}`;
}

function renderCarCard(car, normalizedNPV, filters) {
  const colors = car.colors || [];
  const colorHTML = colors.map(renderColorDot).join("");

  const carName =
    `${car.model} ${car.trim || ""}`.trim();

  const displayScore =
    getDisplayScore(car, normalizedNPV, filters);

  const displayNPV =
    `NPV : ${Math.round(calculateDefaultNPV(car)).toLocaleString()}฿`;

  const card = document.createElement("div");

  card.className = "car-card";

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
        <p class="brand">
          ${car.brand || "-"}
        </p>

        <p class="npv-top">
          ${displayNPV}
        </p>
      </div>

      <h3 class="car-title">
        ${carName}
      </h3>

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

        <p class="price">
          ${formatMoney(car.price)}
        </p>

        <p class="npv">
          ${displayScore}
        </p>

      </div>

    </div>
  `;

  card.addEventListener("click", () => {
    window.location.href =
      `car.html?id=${car.ID}`;
  });

  return card;
}

export function renderCars(cars, filters = {}) {
  const container =
    document.getElementById("car-list");

  container.innerHTML = "";

  if (!cars || cars.length === 0) {
    container.innerHTML =
      `<p class="empty-result">❌ No cars found</p>`;

    return;
  }

  // ===== DEFAULT NPV SCORE =====
  const npvValues =
    cars.map(calculateDefaultNPV);

  const minNPV =
    Math.min(...npvValues);

  const maxNPV =
    Math.max(...npvValues);

  cars.forEach((car, index) => {

    const normalizedNPV =
      normalize(
        npvValues[index],
        minNPV,
        maxNPV
      );

    const card =
      renderCarCard(
        car,
        normalizedNPV,
        filters
      );

    container.appendChild(card);
  });
}