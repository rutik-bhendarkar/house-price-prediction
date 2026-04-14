/**
 * Get selected Bathroom value
 */
function getBathValue() {
  const uiBathrooms = document.getElementsByName("uiBathrooms");
  for (let i = 0; i < uiBathrooms.length; i++) {
    if (uiBathrooms[i].checked) return parseInt(uiBathrooms[i].value);
  }
  return -1;
}

/**
 * Get selected BHK value
 */
function getBHKValue() {
  const uiBHK = document.getElementsByName("uiBHK");
  for (let i = 0; i < uiBHK.length; i++) {
    if (uiBHK[i].checked) return parseInt(uiBHK[i].value);
  }
  return -1;
}

/**
 * Predict Price
 */
function onClickedEstimatePrice() {
  console.log("Analyze Market Value clicked");

  const sqft = document.getElementById("uiSqft");
  const bhk = getBHKValue();
  const bathrooms = getBathValue();
  const location = document.getElementById("uiLocations");

  const priceResultArea = $(".price-result");
  const loader = $(".loader-dots");

  priceResultArea.hide();
  loader.fadeIn();

  const url = "https://house-price-prediction-hqrt.onrender.com/predict_home_price";

  // ✅ Basic validation
  if (!sqft.value || bhk === -1 || bathrooms === -1 || !location.value) {
    loader.hide();
    priceResultArea.html("<h2 style='color:red;'>Fill all fields</h2>").fadeIn();
    return;
  }

  // 🔥 New validation (sqft >= 1000)
  if (parseFloat(sqft.value) < 1000) {
    loader.hide();
    priceResultArea
      .html("<h2 style='color:red;'>Minimum area should be 1000 sqft</h2>")
      .fadeIn();
    return;
  }

  // API call
  $.post(url, {
    total_sqft: parseFloat(sqft.value),
    bhk: bhk,
    bath: bathrooms,
    location: location.value
  })
  .done(function (data) {
    console.log("Prediction:", data);

    setTimeout(function () {
      loader.hide();

      if (data && data.estimated_price !== undefined) {
        priceResultArea
          .html(`<h2>₹ ${data.estimated_price} Lakh</h2>`)
          .fadeIn();
      } else {
        priceResultArea
          .html("<h2 style='color:red;'>Invalid Response</h2>")
          .fadeIn();
      }
    }, 800);
  })
  .fail(function () {
    loader.hide();
    priceResultArea
      .html("<h2 style='color:#ef4444;'>Server Error</h2>")
      .fadeIn();
    console.error("Backend error");
  });
}

/**
 * Load locations
 */
function loadLocations() {
  console.log("Fetching locations...");

  const url = "https://house-price-prediction-hqrt.onrender.com/get_location_names";

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data && data.locations) {
        const uiLocations = document.getElementById("uiLocations");

        uiLocations.innerHTML = "";

        const defaultOption = document.createElement("option");
        defaultOption.text = "Search Neighborhood...";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        uiLocations.add(defaultOption);

        data.locations.forEach(loc => {
          const name = loc
            .split(" ")
            .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(" ");

          const option = document.createElement("option");
          option.value = loc;
          option.text = name;

          uiLocations.add(option);
        });

        console.log("Locations loaded ✅");
      }
    })
    .catch(err => {
      console.error("Error loading locations ❌", err);
    });
}

/**
 * Area status
 */
function updateAreaStatus() {
  const sqftInput = document.getElementById("uiSqft");
  const status = document.getElementById("areaStatus");

  if (!sqftInput || !status) return;

  const sqft = sqftInput.value;

  if (sqft < 800) status.innerHTML = "(Compact)";
  else if (sqft <= 1500) status.innerHTML = "(Standard)";
  else status.innerHTML = "(Premium)";
}

/**
 * Tilt effect
 */
function applyTilt() {
  const card = document.getElementById("mainCard");
  if (!card) return;

  document.addEventListener("mousemove", (e) => {
    if (window.innerWidth < 1000) return;

    const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 50;

    card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
  });
}

/**
 * Init App
 */
function initApp() {
  loadLocations();
  applyTilt();

  const sqftInput = document.getElementById("uiSqft");
  if (sqftInput) {
    sqftInput.addEventListener("input", updateAreaStatus);
    updateAreaStatus();
  }
}

// Safe load
if (typeof window !== "undefined") {
  window.onload = initApp;
}