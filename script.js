// Populate currency dropdowns dynamically on page load
async function populateCurrencies() {
  try {
    // Fetch latest rates with base EUR (default)
    const res = await fetch('https://api.frankfurter.dev/latest/currencies');
    const data = await res.json();
    const currencyCodes = Object.keys(data.rates).concat(data.base).sort();

    const fromSelect = document.getElementById("from");
    const toSelect = document.getElementById("to");

    // Clear any existing options (in case of reload)
    fromSelect.innerHTML = '';
    toSelect.innerHTML = '';

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

    // Set default selections
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

  if (from === to) {
    document.getElementById("result").innerHTML = `${amount} ${from} ≈ ${amount.toFixed(2)} ${to}`;
    return;
  }

  try {
    const res = await fetch(`https://api.frankfurter.dev/latest/currencies?from=${from}&to=${to}`);
    const data = await res.json();

    const rate = data.rates[to];
    if (!rate) {
      document.getElementById("result").innerHTML = "⚠️ Sorry, exchange rate not found.";
      return;
    }

    const converted = amount * rate;

    document.getElementById("result").innerHTML = `<p>${amount} ${from} ≈ ${converted.toFixed(2)} ${to}</p>`;
  } catch (error) {
    document.getElementById("result").innerHTML = "⚠️ Error fetching exchange rates.";
    console.error(error);
  }
}

// Initialize dropdowns on page load
window.onload = populateCurrencies;
