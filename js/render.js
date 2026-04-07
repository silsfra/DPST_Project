import { calculateNPV } from './utils.js';

export function renderCars(cars) {
  const container = document.getElementById("car-list");
  container.innerHTML = "";

  if (!cars || cars.length === 0) {
    container.innerHTML = "❌ No cars found";
    return;
  }

  cars.forEach(car => {

    const npv = calculateNPV(car); // ✅ ต้องอยู่ตรงนี้

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
  </div>
`;

    div.onclick = () => {
      window.location.href = `car.html?id=${car.ID}`;
    };

    container.appendChild(div);
  });
}