import { calculateNPV } from "./utils.js";

function getClusterName(cluster) {
  switch (cluster) {
    case 0: return "All-round";
    case 1: return "Local";
    case 2: return "Long Range";
    case 3: return "City";
    default: return "Unknown";
  }
}

export function renderCars(cars) {
  const container = document.getElementById("car-list");
  container.innerHTML = "";

  if (!cars || cars.length === 0) {
    container.innerHTML = "❌ No cars found";
    return;
  }

  cars.forEach((car) => {
    const npv = calculateNPV(car);

    // ===== COLORS =====
    const colors = car.colors || [];

    const colorHTML = colors
      .map((c) => {
        // 👉 ถ้ามี 2 สี
        if (c.secondary) {
          return `
    <div class="color-dot"
      title="${c.name}"
      style="background: linear-gradient(to bottom, ${c.secondary} 50%, ${c.hex} 50%);">
    </div>
  `;
        }

        // 👉 สีเดียว (ของเดิม)
        return `
      <div class="color-dot"
        title="${c.name}"
        style="background:${c.hex}">
      </div>
    `;
      })
      .join("");

    // ===== CREATE CARD =====
    const div = document.createElement("div");
    div.className = "car-card";

    div.innerHTML = `
      <div class="card-image-wrapper">
  <span class="tag">${getClusterName(car.cluster)}</span>

  <img src="${car.image_url || 'assets/car_paint.png'}" class="car-image">
</div>

      <div class="car-info">

        <p class="brand">${car.brand}</p>

        <h3 class="car-title">
          ${`${car.model} ${car.trim || ""}`.trim()}
        </h3>

        <!-- COLORS -->
        <div class="colors">
  ${colorHTML}
</div>

        <!-- SPEC BOX -->
        <div class="spec-box">
  <div class="spec-item">
    <p>${car.wltp_range_km} km</p>
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

        <!-- BOTTOM -->
        <div class="bottom">
          <p class="price">฿${car.price.toLocaleString()}</p>
        </div>

      </div>
    `;

    div.onclick = () => {
      window.location.href = `car.html?id=${car.ID}`;
    };

    container.appendChild(div);
  });
}
