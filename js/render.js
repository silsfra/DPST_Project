export function renderCars(cars) {
  const container = document.getElementById("car-list");
  container.innerHTML = "";

  if (cars.length === 0) {
    container.innerHTML = "❌ No cars found";
    return;
  }

  cars.forEach(car => {
    const div = document.createElement("div");
    div.className = "car-card";

    const npv = car.price + 30000;

    div.innerHTML = `
      <img src="assets/car_paint.png" class="car-image">
      <h3>${car.brand} ${car.model}</h3>
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