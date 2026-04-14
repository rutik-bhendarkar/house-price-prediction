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
 * Triggered when the "Analyze Market Value" button is clicked.
 * Handles the POST request to the Flask server and UI animations.
 */
function onClickedEstimatePrice() {
  console.log("Analyze Market Value clicked");
  
  var sqft = document.getElementById("uiSqft");
  var bhk = getBHKValue();
  var bathrooms = getBathValue();
  var location = document.getElementById("uiLocations");
  var priceResultArea = $(".price-result");
  var loader = $(".loader-dots");

  // Reset UI: Hide previous results and show the loader
  priceResultArea.hide();
  loader.fadeIn();

  var url = "https://house-price-prediction-hqrt.onrender.com/predict_home_price"; 

  $.post(url, {
      total_sqft: parseFloat(sqft.value),
      bhk: bhk,
      bath: bathrooms,
      location: location.value
  }, function(data, status) {
      console.log("Prediction received: " + data.estimated_price);
      
      // UX DELAY: 800ms delay to make the AI analysis feel authentic
      setTimeout(function() {
          loader.hide();
          // Inject the price result with fade-in animation
          priceResultArea.html("<h2>₹ " + data.estimated_price.toString() + " Lakh</h2>").fadeIn();
          console.log("Status: " + status);
      }, 800);
  }).fail(function() {
      // Handle connection errors
      loader.hide();
      priceResultArea.html("<h2 style='color: #ef4444;'>Server Error</h2>").fadeIn();
      console.error("Could not connect to Flask server.");
  });
}

/**
 * Triggered on page load to fetch the list of locations from the server.
 */
function onPageLoad() {
  console.log("Document loaded - fetching locations");
  var url = "http://127.0.0.1:5000/get_location_names"; 

  $.get(url, function(data, status) {
      if(data && data.locations) {
          var uiLocations = $('#uiLocations');
          
          // Clear existing options
          uiLocations.empty();
          
          // Add and disable the placeholder
          uiLocations.append(new Option("Search Neighborhood...", "", true, true));
          $('#uiLocations option:first').attr('disabled', 'disabled'); 
          
          // Populate the dropdown with formatted location names
          for(var i in data.locations) {
              var loc = data.locations[i];
              // Title Case formatting (e.g., "electronic city" -> "Electronic City")
              var name = loc.split(' ').map(w => w[0].toUpperCase() + w.substr(1).toLowerCase()).join(' ');
              uiLocations.append(new Option(name, loc));
          }
          console.log("Locations loaded successfully");
      }
  }).fail(function() {
      console.error("Critical Error: Backend server unreachable at port 5000");
  });
}
// --- ADD THIS TO YOUR app.js ---

function updateAreaStatus() {
    let sqft = document.getElementById("uiSqft").value;
    let status = document.getElementById("areaStatus");
    if (sqft < 800) status.innerHTML = "(Compact)";
    else if (sqft >= 800 && sqft <= 1500) status.innerHTML = "(Standard)";
    else status.innerHTML = "(Premium)";
}

// Interactive Mouse Tilt Effect
function applyTilt() {
    const card = document.getElementById('mainCard');
    document.addEventListener('mousemove', (e) => {
        if(window.innerWidth < 1000) return; // Disable on mobile for performance
        let xAxis = (window.innerWidth / 2 - e.pageX) / 50;
        let yAxis = (window.innerHeight / 2 - e.pageY) / 50;
        card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });
}

// Modify your existing onPageLoad to include these
const originalOnPageLoad = onPageLoad;
onPageLoad = function() {
    originalOnPageLoad();
    applyTilt();
    document.getElementById("uiSqft").addEventListener("input", updateAreaStatus);
    updateAreaStatus();
};

// Bind the load event
window.onload = onPageLoad;

