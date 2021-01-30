import './finance.css';
import Chart from 'chart.js';
import FinanceMenu from './finance-menu';

const nbrbURL = 'https://www.nbrb.by/api/exrates/rates?periodicity=0';

const extraCurrencyData = [
  { Cur_Abbreviation: 'AUD', Cur_ID: 170, Cur_Scale: 1 },
  { Cur_Abbreviation: 'BGN', Cur_ID: 191, Cur_Scale: 1 },
  { Cur_Abbreviation: 'UAH', Cur_ID: 290, Cur_Scale: 100 },
  { Cur_Abbreviation: 'DKK', Cur_ID: 291, Cur_Scale: 10 },
  { Cur_Abbreviation: 'USD', Cur_ID: 145, Cur_Scale: 1 },
  { Cur_Abbreviation: 'EUR', Cur_ID: 292, Cur_Scale: 1 },
  { Cur_Abbreviation: 'PLN', Cur_ID: 293, Cur_Scale: 10 },
  { Cur_Abbreviation: 'JPY', Cur_ID: 355, Cur_Scale: 100 },
  { Cur_Abbreviation: 'IRR', Cur_ID: 303, Cur_Scale: 100000 },
  { Cur_Abbreviation: 'ISK', Cur_ID: 294, Cur_Scale: 100 },
  { Cur_Abbreviation: 'CAD', Cur_ID: 23, Cur_Scale: 1 },
  { Cur_Abbreviation: 'CNY', Cur_ID: 304, Cur_Scale: 10 },
  { Cur_Abbreviation: 'KWD', Cur_ID: 72, Cur_Scale: 1 },
  { Cur_Abbreviation: 'MDL', Cur_ID: 296, Cur_Scale: 10 },
  { Cur_Abbreviation: 'NZD', Cur_ID: 286, Cur_Scale: 1 },
  { Cur_Abbreviation: 'NOK', Cur_ID: 297, Cur_Scale: 10 },
  { Cur_Abbreviation: 'RUB', Cur_ID: 298, Cur_Scale: 100 },
  { Cur_Abbreviation: 'XDR', Cur_ID: 299, Cur_Scale: 1 },
  { Cur_Abbreviation: 'SGD', Cur_ID: 119, Cur_Scale: 1 },
  { Cur_Abbreviation: 'KGS', Cur_ID: 300, Cur_Scale: 100 },
  { Cur_Abbreviation: 'KZT', Cur_ID: 301, Cur_Scale: 1000 },
  { Cur_Abbreviation: 'TRY', Cur_ID: 302, Cur_Scale: 10 },
  { Cur_Abbreviation: 'GBP', Cur_ID: 143, Cur_Scale: 1 },
  { Cur_Abbreviation: 'CZK', Cur_ID: 305, Cur_Scale: 100 },
  { Cur_Abbreviation: 'SEK', Cur_ID: 306, Cur_Scale: 10 },
  { Cur_Abbreviation: 'CHF', Cur_ID: 130, Cur_Scale: 1 },
];

const getRateForDayRequest = async () => {
  const response = await fetch(nbrbURL);
  const data = await response.json();
  const arr = [];
  data.forEach((c) =>
    arr.push({
      Cur_Abbreviation: c.Cur_Abbreviation,
      Cur_ID: c.Cur_ID,
      Cur_Scale: c.Cur_Scale,
    })
  );
  return data;
};

const getCurrencyPairData = async () => {
  const data = await getRateForDayRequest();
  const eur = data.find((currency) => currency.Cur_Abbreviation === 'EUR');
  const usd = data.find((currency) => currency.Cur_Abbreviation === 'USD');
  const rub = data.find((currency) => currency.Cur_Abbreviation === 'RUB');
  return {
    eur,
    usd,
    rub,
  };
};

const getDataForChart = async (currencyId) => {
  const currentDate = new Date();
  const dataDate = currentDate.toString().split(' ');
  const day = dataDate[0];
  const month = dataDate[1];
  const date = dataDate[2];
  const year = dataDate[3];

  const responseForYear = await fetch(
    `https://www.nbrb.by/API/ExRates/Rates/Dynamics/${currencyId}
    ?startDate=Tue%2C+3+Mar+2020+21%3A00%3A00+GMT&endDate=${day}
    %2C+${date}+${month}+${year}+21%3A00%3A00+GMT`
  );

  return responseForYear;
};
class Finance {
  constructor(parentNode) {
    this.parentNode = parentNode;
    this.currencyList = document.createElement('div');
    this.currencyChoiceBlock = document.createElement('div');
    this.chart = false;
    this.render();
  }

  async createPairEurUsd() {
    const { eur, usd } = await getCurrencyPairData();

    const eurUsd = document.createElement('p');

    this.currencyList.classList.add('currencyList');
    eurUsd.classList.add('eurUsd');

    eurUsd.textContent = `EUR/USD: ${(
      eur.Cur_OfficialRate /
      eur.Cur_Scale /
      (usd.Cur_OfficialRate / usd.Cur_Scale)
    ).toFixed(4)}`;

    this.currencyList.appendChild(eurUsd);
  }

  async createPairEurRub() {
    const { eur, rub } = await getCurrencyPairData();
    const eurRub = document.createElement('p');

    eurRub.classList.add('eurRub');

    eurRub.textContent = `EUR/RUB: ${(
      eur.Cur_OfficialRate /
      eur.Cur_Scale /
      (rub.Cur_OfficialRate / rub.Cur_Scale)
    ).toFixed(4)}`;

    this.currencyList.appendChild(eurRub);
  }

  async createPairBlrUsd() {
    const { usd } = await getCurrencyPairData();
    const blrUsd = document.createElement('p');

    blrUsd.classList.add('blrUsd');

    blrUsd.textContent = `USD/BLR: ${(
      usd.Cur_OfficialRate / usd.Cur_Scale
    ).toFixed(4)}`;

    this.currencyList.appendChild(blrUsd);
  }

  createSelect(selectName, selectedItem) {
    const select = document.createElement('select');
    select.name = selectName;

    const fragment = document.createDocumentFragment();

    extraCurrencyData.forEach((currency) => {
      const option = document.createElement('option');
      option.value = `${currency.Cur_ID}`;
      if (currency.Cur_Abbreviation === selectedItem) option.selected = true;
      option.textContent = `${currency.Cur_Abbreviation}`;
      fragment.appendChild(option);
    });

    select.appendChild(fragment);
    this.currencyChoiceBlock.appendChild(select);

    return select;
  }

  renderCurrencyChoiceBlock() {
    const wrapCurrencyChoiceBlock = document.createElement('div');
    const titleCurrencyChoiceBlock = document.createElement('div');

    titleCurrencyChoiceBlock.textContent = 'Select currency pair ';
    wrapCurrencyChoiceBlock.classList.add('wrapCurrencyChoiceBlock');
    this.currencyChoiceBlock.classList.add('currencyChoiceBlock');

    wrapCurrencyChoiceBlock.appendChild(titleCurrencyChoiceBlock);
    wrapCurrencyChoiceBlock.appendChild(this.currencyChoiceBlock);
    this.parentNode.appendChild(wrapCurrencyChoiceBlock);
  }

  axesLinearChart(updatedDate, currencyDynamic, rateCurrencyPair) {
    if (this.chart) {
      const previousChart = document.querySelector('.chartBlock');
      previousChart.parentElement.removeChild(previousChart);
    }
    const chartBlock = document.createElement('div');
    chartBlock.classList.add('chartBlock');
    chartBlock.innerHTML = `<canvas id="line-chart" style="height: 300px"></canvas>`;

    this.parentNode.appendChild(chartBlock);
    const ctx = document.getElementById('line-chart').getContext('2d');

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            label: `${
              updatedDate[updatedDate.length - 1]
            } Rate: ${rateCurrencyPair}`,
            data: currencyDynamic,
            fill: false,
            borderColor: 'red',
            backgroundColor: 'red',
            radius: 1,
            borderWidth: 1,
          },
        ],
        labels: updatedDate,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }

  async getFinanceData() {
    const dates = [];
    const shortDates = [];
    let currencyDynamicsLeft = [];
    let currencyDynamicsRight = [];

    const getYearCurrencyData = async (currencyId, select) => {
      const responseForYear = await getDataForChart(currencyId);
      const yearData = await responseForYear.json();
      const chosenCurrency = extraCurrencyData.find(
        (cur) => cur.Cur_ID === +currencyId
      );

      dates.length = 0;
      shortDates.length = 0;

      yearData.forEach((val) => dates.push(val.Date));

      dates.forEach((dateItem) => shortDates.push(dateItem.slice(0, 10)));

      if (select === 'selectLeft') {
        currencyDynamicsLeft = [];
        yearData.forEach((val) =>
          currencyDynamicsLeft.push(
            val.Cur_OfficialRate / chosenCurrency.Cur_Scale
          )
        );
      }
      if (select === 'selectRight') {
        currencyDynamicsRight = [];
        yearData.forEach((val) =>
          currencyDynamicsRight.push(
            val.Cur_OfficialRate / chosenCurrency.Cur_Scale
          )
        );
      }

      const chartLine = [];

      currencyDynamicsLeft.forEach((item, i) =>
        chartLine.push((item / currencyDynamicsRight[i]).toFixed(4))
      );
      this.axesLinearChart(
        shortDates,
        chartLine,
        chartLine[chartLine.length - 1]
      );
    };

    getYearCurrencyData(292, 'selectLeft');
    setTimeout(() => {
      getYearCurrencyData(145, 'selectRight');
    }, 0);

    let flag = false;
    function addClickedCurrency(e) {
      if (flag === false) {
        flag = true;
      } else {
        getYearCurrencyData(e.target.value, e.target.name);
        flag = false;
      }
    }

    const selectLeft = await this.createSelect('selectLeft', 'EUR');
    const selectRight = await this.createSelect('selectRight', 'USD');

    selectLeft.addEventListener('click', addClickedCurrency);
    selectRight.addEventListener('click', addClickedCurrency);
  }

  render() {
    this.parentNode.innerHTML = `
    <div class="popular-header">
      <h3>Finance</h3>
      <div class="dot-menu">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </div>
    `;
    this.createPairEurUsd();
    this.createPairEurRub();
    this.createPairBlrUsd();
    this.parentNode.appendChild(this.currencyList);
    this.renderCurrencyChoiceBlock();
    this.getFinanceData();

    this.btnMenu = this.parentNode.querySelector('.dot-menu');
    this.rssMenu = new FinanceMenu(this.btnMenu, 'Finance');
  }
}

export default Finance;
