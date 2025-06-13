// Populate currency dropdowns dynamically on page load
async function populateCurrencies() {
  try {
    const res = await fetch("https://api.exchangerate.host/latest");
    const data = await res.json();
    const currencyCodes = Object.keys(data.rates).sort();

    const fromSelect = document.getElementById("from");
    const toSelect = document.getElementById("to");

    currencyCodes.forEach(code => {
      const optionFrom = document.createElement("option");
      optionFrom.value = code;
      optionFrom.textContent = code;
      fromSelect.appendChild(optionFrom);

      const optionTo = document.createElement("option");
      optionTo.value = code;
      optionTo.textContent = code;
      toSelect.appendChild(optionTo);
    });

    // Set defaults
    fromSelect.value = "USD";
    toSelect.value = "EUR";

  } catch (error) {
    console.error("Error loading currencies:", error);
    document.getElementById("result").innerHTML = "⚠️ Could not load currency list.";
  }
}

// Main conversion function
async function convertCurrency() {
  const amountInput = document.getElementById("amount").value;
  const amount = parseFloat(amountInput);
  if (isNaN(amount) || amount <= 0) {
    document.getElementById("result").innerHTML = "⚠️ Please enter a valid amount.";
    return;
  }

  const from = document.getElementById("from").value;
  const to = document.getElementById("to").value;

  try {
    const res = await fetch(`https://api.exchangerate.host/latest?base=${from}`);
    const data = await res.json();

    const rate = data.rates[to];
    if (!rate) {
      document.getElementById("result").innerHTML = "⚠️ Sorry, exchange rate not found.";
      return;
    }

    const converted = amount * rate;

    // Show conversion result
    let resultHTML = `<p>${amount} ${from} ≈ ${converted.toFixed(2)} ${to}</p>`;

    // Optional: Show context items if you want
    // For example, map some currencies to countries for context lookup
    const currencyToCountry = {
      "JPY": "Japan",
      "EUR": "France",
      "USD": "USA",
      // Add more mappings if you want context items for more countries
    };

    const country = currencyToCountry[to];
    if (country) {
      const contextRes = await fetch("data.json");
      const contextData = await contextRes.json();
      const items = contextData[country];

      if (items) {
        resultHTML += "<ul>";
        for (const [item, price] of Object.entries(items)) {
          const quantity = converted / price;
          resultHTML += `<li>${item}: ${quantity.toFixed(1)}×</li>`;
        }
        resultHTML += "</ul>";
      }
    }

    document.getElementById("result").innerHTML = resultHTML;

  } catch (error) {
    document.getElementById("result").innerHTML = "⚠️ Error fetching exchange rates.";
    console.error(error);
  }
}

// Initialize dropdowns on page load
window.onload = populateCurrencies;
