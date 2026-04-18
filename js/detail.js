import { getCars } from './api.js';

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

let currentCar = null;

async function loadCar() {
  const cars = await getCars();
  const car = cars.find(c => String(c.ID) === id);

  if (!car) return;

  currentCar = car;

  // ===== FULL NAME =====
  const fullName = `${car.brand} ${car.model} ${car.trim || ""}`.trim();

  // ===== RENDER =====
  document.getElementById("car-image").src = car.image_url;
  document.getElementById("car-title").innerText = fullName;

  // 👉 lorem แทนไปก่อน
  document.getElementById("car-desc").innerText =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

  updateNPV();
}

function updateNPV() {
  if (!currentCar) return;

  // ===== INPUT =====
  const years = Number(document.getElementById("years").value) || 0;
  const insurance = Number(document.getElementById("insurance").value) || 0;
  const maintenance = Number(document.getElementById("maintenance").value) || 0;

  let npv = -currentCar.price;

  for (let t = 1; t <= years; t++) {
    const yearlyCost = insurance + maintenance;

    npv += (-yearlyCost) / Math.pow(1.05, t);
  }

  // ===== OUTPUT =====
  document.getElementById("npv-result").innerText =
    "NPV: ฿" + Math.round(npv).toLocaleString();
}

// ===== REALTIME UPDATE =====
document.querySelectorAll("#years, #insurance, #maintenance")
  .forEach(input => {
    input.addEventListener("input", updateNPV);
  });

// ===== LOAD =====
loadCar();