async function convertCurrency() {
    const amount = parseFloat(document.getElementById("amount").value);
    const from = document.getElementById("from").value;
    const country = document.getElementById("country").value;
  
    const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
    const data = await res.json();
  
    const toCurrency = country === "Japan" ? "JPY" : "EUR";
    const rate = data.rates[toCurrency];
    const converted = amount * rate;
  
    const contextRes = await fetch("data.json");
    const contextData = await contextRes.json();
    const items = contextData[country];
  
    let resultHTML = `<p>${amount} ${from} ≈ ${converted.toFixed(2)} ${toCurrency}</p><ul>`;
    for (const [item, price] of Object.entries(items)) {
      const quantity = converted / price;
      resultHTML += `<li>${item}: ${quantity.toFixed(1)}×</li>`;
    }
    resultHTML += "</ul>";
  
    document.getElementById("result").innerHTML = resultHTML;
  }
  