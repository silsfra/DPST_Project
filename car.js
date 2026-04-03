import { supabase } from './supabaseClient.js';

function getCarId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("");
}

async function loadCar() {
    const id = new URLSearchParams(window.location.search).get("id");
    console.log("URL ID:", id);

    const { data, error } = await supabase
        .from("car_data")
        .select("*")
        .eq("ID", id)
        .single();

    const container = document.getElementById("car-detail");

    if (error || !data) {
        container.innerHTML = "❌ Car not found";
        return;
    }

    const npv = data.price + 30000;

    container.innerHTML = `
    <h2>${data.brand} ${data.model}</h2>
    <p>💰 Price: ${data.price.toLocaleString()} บาท</p>
    <p>🔋 Range: ${data.wltp_range_km} km</p>
    <p>🔋 Battery: ${data.battery_capacity_kWh || "-"} kWh</p>
    <p>⚡ Torque: ${data.torque_Nm || "-"} Nm</p>
    <p>🏎️ Horsepower: ${data.horsepower_hp || "-"} hp</p>
    <p>🧳 Cargo: ${data.cargo_capacity_liters || "-"} L</p>

    <hr>

    <p style="color: green; font-weight: bold;">
    📊 NPV: ${npv.toLocaleString()} บาท
  </p>
  `;
}

loadCar();