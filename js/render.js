import { calculateNPV } from './utils.js';

export function renderCars(cars) {
  const container = document.getElementById("car-list");
  container.innerHTML = "";

  if (!cars || cars.length === 0) {
    container.innerHTML = "❌ No cars found";
    return;
  }

  cars.forEach(car => {
    const npv = calculateNPV(car);

    // ===== COLORS =====
    const colors = car.colors || [];

    const colorHTML = colors.map(c => `
  <div class="color-dot" title="${c.name}" style="background:${c.hex}"></div>
`).join("");

    // ===== CREATE CARD =====
    const div = document.createElement("div");
    div.className = "car-card";

    div.innerHTML = `
      <div class="card-image-wrapper">
        <img src="assets/car_paint.png" class="car-image">
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
          <div>
            <p>${car.wltp_range_km}</p>
            <span>RANGE</span>
          </div>
          <div>
            <p>${car.battery_capacity_kWh || "-"}</p>
            <span>kWh</span>
          </div>
          <div>
            <p>${car.horsepower_hp || "-"}</p>
            <span>HP</span>
          </div>
        </div>

        <!-- BOTTOM -->
        <div class="bottom">
          <p class="price">฿${car.price.toLocaleString()}</p>

          <button class="detail-btn">Details</button>
        </div>

      </div>
    `;

    div.onclick = () => {
      window.location.href = `car.html?id=${car.ID}`;
    };

    container.appendChild(div);
  });
}