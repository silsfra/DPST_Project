import { getCars } from './api.js';

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

let currentCar = null;

async function loadCar() {
  const cars = await getCars();
  const car = cars.find(c => String(c.ID) === id);

  if (!car) return;

  currentCar = car;

  // render
  document.getElementById("car-image").src = car.image_url;
  document.getElementById("car-title").innerText = car.model;
  document.getElementById("car-desc").innerText = car.brand;

  updateNPV();
}

function updateNPV() {
  if (!currentCar) return;

  const years = Number(document.getElementById("years").value);
  const insurance = Number(document.getElementById("insurance").value);
  const maintenance = Number(document.getElementById("maintenance").value);

  let npv = -currentCar.price;

  for (let t = 1; t <= years; t++) {
    const yearlyCost = insurance + maintenance;

    npv += (-yearlyCost) / Math.pow(1.05, t);
  }

  document.getElementById("npv-result").innerText =
    "NPV: ฿" + Math.round(npv).toLocaleString();
}

// 🔥 realtime update
document.querySelectorAll("input").forEach(input => {
  input.addEventListener("input", updateNPV);
});

loadCar();