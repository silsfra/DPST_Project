import { supabase } from './supabase.js';

async function fetchCars() {
    const price = document.getElementById("price").value;
    const range = document.getElementById("range").value;

    console.log("Filter:", price, range);

    const { data, error } = await supabase
        .from("car_data")
        .select("*")
        .lte("price", price)          // ราคา ≤
        .gte("wltp_range_km", range); // ระยะ ≥

    console.log("DATA:", data);
    console.log("ERROR:", error);

    const container = document.getElementById("car-list");
    container.innerHTML = "";

    if (error) {
        container.innerHTML = "❌ Error loading data";
        return;
    }

    if (!data || data.length === 0) {
        container.innerHTML = "❌ No cars match filter";
        return;
    }

    data.forEach(car => {
        const div = document.createElement("div");
        div.className = "car-card";

        const npv = car.price + 30000; // 👈 คำนวณตรงนี้

        div.innerHTML = `
    <h3>${car.brand} ${car.model}</h3>
    <p>💰 Price: ${car.price.toLocaleString()} บาท</p>
    <p>🔋 Range: ${car.wltp_range_km} km</p>

    <p style="color: green; font-weight: bold;">
      📊 NPV: ${npv.toLocaleString()} บาท
    </p>
  `;

        div.style.cursor = "pointer";
        div.onclick = () => {
            window.location.href = `car.html?id=${car.ID}`;
        };

        container.appendChild(div);
    });
}

// 👇 กดปุ่มแล้ว filter
document.getElementById("filterBtn").addEventListener("click", fetchCars);

// 👇 โหลดครั้งแรก
fetchCars();