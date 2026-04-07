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

    // ✅ ===== ใส่ตรงนี้ =====
    const colors = car.colors || [];

    const visibleColors = colors.slice(0, 3);
    const extraCount = colors.length - 3;

    const colorHTML = visibleColors.map(c => `
      <div class="color-dot" title="${c.name}" style="background:${c.hex}"></div>
    `).join("");

    const extraHTML = extraCount > 0 
      ? `<div class="color-more">+${extraCount}</div>`
      : "";
    // =======================

    const div = document.createElement("div");
    div.className = "car-card";

    div.innerHTML = `
      <img src="assets/car_paint.png" class="car-image">

      <div class="car-info">
        <h3 class="car-title">
          ${`${car.brand} ${car.model} ${car.trim || ""}`.trim()}
        </h3>

        <p class="price">💰 ${car.price.toLocaleString()} บาท</p>

        <div class="specs">
          <span>🔋 ${car.wltp_range_km} km</span>
          <span>⚡ ${car.horsepower_hp || "-"} hp</span>
        </div>

        <div class="npv">
          ⭐ NPV: ${npv.toLocaleString()}
        </div>

        <!-- ✅ ใส่ตรงนี้ -->
        <div class="colors">
          ${colorHTML}
          ${extraHTML}
        </div>

      </div>
    `;

    div.onclick = () => {
      window.location.href = `car.html?id=${car.ID}`;
    };

    container.appendChild(div);
  });
}