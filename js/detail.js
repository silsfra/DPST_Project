import { getCars } from './api.js';

import {
  calculateNPV,
  calculateRunningCost,
  calculateResalePrice,
  getTax
} from './utils.js';

window.addEventListener("DOMContentLoaded", () => {

  const params = new URLSearchParams(window.location.search);

  const id = params.get("id");

  let currentCar = null;

  // =========================
  // LOAD CAR
  // =========================
  async function loadCar() {

    const cars = await getCars();

    const car = cars.find(
      c => String(c.ID) === id
    );

    if (!car) {

      document.body.innerHTML = `
        <h1>Car Not Found</h1>
      `;

      return;
    }

    currentCar = car;

    const fullName =
      `${car.brand} ${car.model} ${car.trim || ""}`.trim();

    document.getElementById("car-image").src =
      car.image_url;

    document.getElementById("car-title").innerText =
      fullName;

    document.getElementById("car-desc").innerText =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

    updateNPV();
  }

  // =========================
  // UPDATE
  // =========================
  function updateNPV() {

    if (!currentCar) return;

    const years =
      Number(document.getElementById("years").value);

    const insurance =
      Number(document.getElementById("insurance").value);

    const maintenance =
      Number(document.getElementById("maintenance").value);

    const km =
      Number(document.getElementById("km").value);

    // =========================
    // CALCULATE
    // =========================

    const npv = calculateNPV(
      currentCar,
      years,
      insurance,
      maintenance,
      km
    );

    const runningCost = calculateRunningCost(
      currentCar,
      years,
      insurance,
      maintenance
    );

    const resale = calculateResalePrice(
      currentCar,
      years,
      km
    );

    // =========================
    // SHOW RESULT
    // =========================

    document.getElementById("npv-result").innerText =
      "NPV: " +
      Math.round(npv).toLocaleString() + "฿";

    document.getElementById("running-cost-result").innerText =
      "ค่าใช้จ่ายเพิ่มเติมตลอดระยะเวลา: " +
      Math.round(runningCost).toLocaleString() + "฿";

    document.getElementById("running-cost-result-per-year").innerText =
      "ค่าใช้จ่ายเพิ่มเติมรายปี: " +
      Math.round(runningCost / years).toLocaleString() + "฿";

    // =========================
    // SUMMARY
    // =========================

    const discountRate = 0.05;

    let discountedRunningCost = 0;

    for (let t = 1; t <= years; t++) {
      const taxBase = getTax(currentCar.weight);
      const tax = t === 1 ? taxBase * 0.2 : taxBase;

      const yearlyCost =
        insurance +
        maintenance +
        645.21 +
        tax;

      discountedRunningCost +=
        yearlyCost / Math.pow(1 + discountRate, t);
    }

    const discountedResale =
      resale / Math.pow(1 + discountRate, years);

    document.getElementById("npv-summary").innerHTML = `

  <div class="npv-summary-row">
    <span>ราคารถเริ่มต้น</span>
    <span>-฿${Math.round(currentCar.price).toLocaleString()}</span>
  </div>

  <div class="npv-summary-row">
    <span>ค่าใช้จ่ายเพิ่มเติมหลังคิดลด 5%</span>
    <span>-฿${Math.round(discountedRunningCost).toLocaleString()}</span>
  </div>

  <div class="npv-summary-row">
    <span>มูลค่าปัจจุบันของราคาขายต่อ</span>
    <span>+฿${Math.round(discountedResale).toLocaleString()}</span>
  </div>

  <div class="npv-summary-row total">
    <span>สรุป NPV</span>
    <span>
      -${Math.round(currentCar.price).toLocaleString()}
      -${Math.round(discountedRunningCost).toLocaleString()}
      +${Math.round(discountedResale).toLocaleString()}
      =
      ${Math.round(npv).toLocaleString()}
    </span>
  </div>

`;
  }
  // =========================
  // REALTIME
  // =========================
  document
    .querySelectorAll(
      "#years, #insurance, #maintenance, #km"
    )
    .forEach(input => {

      input.addEventListener(
        "input",
        updateNPV
      );

    });

  // =========================
  // START
  // =========================
  loadCar();

});