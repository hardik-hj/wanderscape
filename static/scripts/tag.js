// Existing functions remain unchanged
function tags(category) {
    window.location.href = `/tag/${category}`;
}

function navbar(click) {
    window.location.href = `/${click}`;
}

var data_string = document.getElementById('data').getAttribute('data-value');
var data_tuple = JSON.parse(data_string);

for (let i = 0; i < data_tuple.length; i++) {
    var btn1 = document.createElement("button");
    btn1.className = "button";
    btn1.id = `${data_tuple[i].split(" ")[0]}`;
    btn1.setAttribute('onclick', `tags('${data_tuple[i]}')`);
    btn1.textContent = `${data_tuple[i]}`;
    document.body.appendChild(btn1);
}

const images = document.querySelectorAll('button');
images.forEach((image) => {
    document.getElementById(image.id).style.background =
        `linear-gradient( rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 1)), url('/static/tags/${image.id.toLowerCase()}.jpg')`
});

// Function to search cities (unchanged)
function searchCities() {
    var query = $('#city-search').val();  // Get the input value
    if (query.length >= 3) {  // Only start searching after 3 characters
        $.get('/search', { query: query }, function(data) {
            // Clear the previous results
            $('#search-results').empty();

            // Display the new search results
            data.forEach(function(city) {
                $('#search-results').append('<li><a href="/city/' + encodeURIComponent(city) + '">' + city + '</a></li>');
            });
        });
    } else {
        $('#search-results').empty();  // Clear the results if less than 3 characters
    }
}

// Initialize the budget range slider using noUiSlider
var budgetSlider = document.getElementById('budget-range');
noUiSlider.create(budgetSlider, {
    start: [1000, 20000], // Starting range values
    connect: true, // Connect the handles
    range: {
        'min': 1000, // Min budget value
        'max': 20000 // Max budget value
    },
    step: 1000, // Step increment
    format: {
        to: function (value) {
            return value / 1000 + 'k'; // Display values in k (e.g., 1000 -> 1k)
        },
        from: function (value) {
            return value.replace('k', '') * 1000; // Convert back to raw number
        }
    }
});

// Update the budget range values when slider changes
budgetSlider.noUiSlider.on('update', function (values, handle) {
    var minValue = values[0]; // Get the min value
    var maxValue = values[1]; // Get the max value
    document.getElementById('budget-min-value').innerText = minValue;
    document.getElementById('budget-max-value').innerText = maxValue;

    // Fetch results for the selected budget range
    fetchBudgetResults(minValue, maxValue);
});

// Fetch results based on the budget range
function fetchBudgetResults(minBudget, maxBudget) {
    $.get('/searchByBudget', { minBudget: minBudget, maxBudget: maxBudget }, function(data) {
        // Clear previous results
        $('#budget-results').empty();

        // Display the new search results
        if (data.length > 0) {
            data.forEach(function(item) {
                $('#budget-results').append(`<li><a href="/city/${encodeURIComponent(item.city)}">${item.sightseeing}</a></li>`);
            });
        } else {
            $('#budget-results').append('<li>No results found for this budget.</li>');
        }
    });
}
