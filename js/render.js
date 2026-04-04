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
      <h3>${car.brand} ${car.model} ${car.trim || ""}</h3>
      <p>💰 ${car.price.toLocaleString()}</p>
      <p>🔋 ${car.wltp_range_km} km</p>
      <p style="color:green;">NPV: ${npv.toLocaleString()}</p>
    `;

    div.onclick = () => {
      window.location.href = `car.html?id=${car.ID}`;
    };

    container.appendChild(div);
  });
}