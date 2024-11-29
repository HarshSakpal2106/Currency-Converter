function setupCountrySelector(buttonId, flagId, nameId, selectCurrencyId, listClass) {
  const countryBtn = document.getElementById(buttonId);
  const countryFlag = document.getElementById(flagId);
  const countryName = document.getElementById(nameId);
  const selectCurrency = document.getElementById(selectCurrencyId);
  const countryList = countryBtn.parentElement.querySelector(`.${listClass}`);
  const caretIcon = countryBtn.querySelector('.fa-caret-down');

  countryBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isDropdownOpen = countryList.style.display === 'flex';

    document.querySelectorAll('.country-list').forEach(list => list.style.display = 'none');
    document.querySelectorAll('.fa-caret-down').forEach(icon => icon.classList.remove('rotate'));

    if (!isDropdownOpen) {
      countryList.style.display = 'flex';
      caretIcon.classList.add('rotate');
    }
  });

  countryList.querySelectorAll('.options').forEach(option => {
    option.addEventListener('click', () => {
      const imgSrc = option.querySelector('img').src;
      const currencyName = option.textContent.trim();

      countryFlag.src = imgSrc;
      countryName.textContent = currencyName;
      selectCurrency.style.display = 'none';
      countryList.style.display = 'none';
      caretIcon.classList.remove('rotate');
    });
  });

  document.addEventListener('click', () => {
    countryList.style.display = 'none';
    caretIcon.classList.remove('rotate');
  });
}

setupCountrySelector('to', 'toCountryFlag', 'toCountryName', 'toSelectCurrency', 'country-list');
setupCountrySelector('from', 'fromCountryFlag', 'fromCountryName', 'fromSelectCurrency', 'country-list');


// CURRENCY CONVERTER LOGIC
async function getExchangeRate(fromCurrency, toCurrency) {
  const apiKey = '227175c0cd82f69d006c4f96';
  const url = `https://open.er-api.com/v6/latest/${fromCurrency}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.result === 'success') {
      return data.rates[toCurrency];
    } else {
      alert('Failed to fetch exchange rates. Please try again.');
    }
  } catch (error) {
    alert('Error fetching exchange rates: ' + error.message);
  }
}

document.getElementById('result').addEventListener('click', async () => {
  const amount = parseFloat(document.getElementById('moneyAmount').value);
  const fromCurrency = document.getElementById('fromCountryName').textContent.trim();
  const toCurrency = document.getElementById('toCountryName').textContent.trim();

  if (isNaN(amount) || amount <= 0) {
    alert('Please enter a valid amount.');
    return;
  }

  if (!fromCurrency || !toCurrency) {
    alert('Please select both currencies.');
    return;
  }

  const currencyNames = {
    'USD': 'United States Dollar(s)',
    'INR': 'Indian Rupee(s)',
    'GBP': 'British Pound(s)',
    'EUR': 'Euro(s)',
    'JPY': 'Japanese Yen',
    'KRW': 'South Korean Won(s)',
    'PKR': 'Pakistani Rupee(s)',
    'KWD': 'Kuwaiti Dinar(s)',
    'CNY': 'Chinese Yuan',
    'IR': 'Iranian Rial(s)'
  };

  const exchangeRate = await getExchangeRate(fromCurrency, toCurrency);

  if (exchangeRate) {
    const convertedAmount = (amount * exchangeRate).toFixed(2);
    const fromCurrencyFull = currencyNames[fromCurrency] || fromCurrency;
    const toCurrencyFull = currencyNames[toCurrency] || toCurrency;
    alert(`${amount} ${fromCurrencyFull} = ${convertedAmount} ${toCurrencyFull}`);
  }
});

document.getElementById('resetBtn').addEventListener('click', () => {
  document.getElementById('moneyAmount').value = '';

  document.getElementById('fromCountryFlag').src = '';
  document.getElementById('fromCountryName').textContent = '';
  document.getElementById('fromSelectCurrency').style.display = 'block';
  document.getElementById('toCountryFlag').src = '';
  document.getElementById('toCountryName').textContent = '';
  document.getElementById('toSelectCurrency').style.display = 'block';

  const resultDiv = document.getElementById('conversionResult');
  resultDiv.style.display = 'none';
});