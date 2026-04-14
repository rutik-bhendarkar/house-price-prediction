/**
 * Helper function to retrieve selected Bathroom value
 */
function getBathValue() {
  var uiBathrooms = document.getElementsByName("uiBathrooms");
  for (var i = 0; i < uiBathrooms.length; i++) {
    if (uiBathrooms[i].checked) return parseInt(uiBathrooms[i].value);
  }
  return -1;
}

/**
 * Helper function to retrieve selected BHK value
 */
function getBHKValue() {
  var uiBHK = document.getElementsByName("uiBHK");
  for (var i = 0; i < uiBHK.length; i++) {
    if (uiBHK[i].checked) return parseInt(uiBHK[i].value);
  }
  return -1;
}

/**
 * Triggered when button clicked
 */
function onClickedEstimatePrice() {
  console.log("Analyze Market Value clicked");
  
  var sqft = document.getElementById("uiSqft");
  var bhk = getBHKValue();
  var bathrooms = getBathValue();
  var location = document.getElementById("uiLocations");
  var priceResultArea = $(".price-result");
  var loader = $(".loader-dots");

  priceResultArea.hide();
  loader.fadeIn();

  // ✅ FIXED: Use Render backend
  var url = "https://house-price-prediction-hqrt.onrender.com/predict_home_price";

  // ✅ Validation added
  if (!sqft.value || bhk == -1 || bathrooms == -1 || !location.value) {
      loader.hide();
      priceResultArea.html("<h2 style='color:red;'>Fill all fields</h2>").fadeIn();
      return;
  }

  $.post(url, {
      total_sqft: parseFloat(sqft.value),
      bhk: bhk,
      bath: bathrooms,
      location: location.value
  }, function(data, status) {
      console.log("Prediction received:", data);

      setTimeout(function() {
          loader.hide();
          priceResultArea.html("<h2>₹ " + data.estimated_price + " Lakh</h2>").fadeIn();
      }, 800);
  }).fail(function() {
      loader.hide();
      priceResultArea.html("<h2 style='color: #ef4444;'>Server Error</h2>").fadeIn();
  });
}

/**
 * Load locations
 */
function onPageLoad() {
  console.log("Fetching locations");

  // ✅ FIXED: Use Render backend
  var url = "https://house-price-prediction-hqrt.onrender.com/get_location_names";

  $.get(url, function(data, status) {
      if(data && data.locations) {
          var uiLocations = $('#uiLocations');

          uiLocations.empty();
          uiLocations.append(new Option("Search Neighborhood...", "", true, true));
          $('#uiLocations option:first').attr('disabled', 'disabled');

          for(var i in data.locations) {
              var loc = data.locations[i];
              var name = loc.split(' ').map(w => w[0].toUpperCase() + w.substr(1).toLowerCase()).join(' ');
              uiLocations.append(new Option(name, loc));
          }
      }
  }).fail(function() {
      console.error("Backend not reachable");
  });
}

/**
 * Area status
 */
function updateAreaStatus() {
    let sqftInput = document.getElementById("uiSqft");
    let status = document.getElementById("areaStatus");

    if (!sqftInput || !status) return;

    let sqft = sqftInput.value;

    if (sqft < 800) status.innerHTML = "(Compact)";
    else if (sqft <= 1500) status.innerHTML = "(Standard)";
    else status.innerHTML = "(Premium)";
}

/**
 * Tilt effect (SAFE)
 */
function applyTilt() {
    const card = document.getElementById('mainCard');
    if (!card) return;

    document.addEventListener('mousemove', (e) => {
        if(window.innerWidth < 1000) return;
        let xAxis = (window.innerWidth / 2 - e.pageX) / 50;
        let yAxis = (window.innerHeight / 2 - e.pageY) / 50;
        card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });
}

/**
 * Extend page load safely
 */
const originalOnPageLoad = onPageLoad;

onPageLoad = function() {
    originalOnPageLoad();
    applyTilt();

    var sqftInput = document.getElementById("uiSqft");
    if (sqftInput) {
        sqftInput.addEventListener("input", updateAreaStatus);
        updateAreaStatus();
    }
};

// Load
window.onload = onPageLoad;