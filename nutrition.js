/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */
function analyze() {
    const food = document.getElementById("foodInput").value;
    const appId = '1cb0c083'; // Replace with your Edamam API app ID
    const appKey = 'f0aa008c22291a53ffa47183348de01b'; // Replace with your Edamam API app key

    // Make a GET request to the Edamam API
    fetch(`https://api.edamam.com/api/nutrition-data?app_id=${appId}&app_key=${appKey}&ingr=${food}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Display the analysis results
            displayResults(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function displayResults(data) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = ""; // Clear previous results

    if (data.totalNutrients) {
        // Display the total nutrients
        const nutrients = data.totalNutrients;
        const nutrientKeys = Object.keys(nutrients);
        nutrientKeys.forEach(key => {
            const nutrient = nutrients[key];
            const nutrientHtml = `<p>${nutrient.label}: ${nutrient.quantity.toFixed(2)} ${nutrient.unit}</p>`;
            resultsDiv.innerHTML += nutrientHtml;
        });
    } else {
        resultsDiv.innerHTML = "<p>No nutrition data found for the provided food item.</p>";
    }
}
