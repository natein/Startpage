import "./finance.css";
import Chart from "chart.js";

const getRateForDayRequest = async () => {
  const response = await fetch(
    "https://www.nbrb.by/api/exrates/rates?periodicity=0"
  );
  const data = await response.json();
  return data;
};

const getCurrencyPairData = async () => {
  const data = await getRateForDayRequest();
  const eur = data.find((currency) => currency.Cur_Abbreviation === "EUR");
  const usd = data.find((currency) => currency.Cur_Abbreviation === "USD");
  const rub = data.find((currency) => currency.Cur_Abbreviation === "RUB");
  return {
    eur,
    usd,
    rub,
  };
};

const getDataForChart = async (currencyId) => {
  const currentDate = new Date();
  const dataDate = currentDate.toString().split(" ");
  const day = dataDate[0];
  const month = dataDate[1];
  const date = dataDate[2];
  const year = dataDate[3];

  const responseForYear = await fetch(
    `https://www.nbrb.by/API/ExRates/Rates/Dynamics/${currencyId}
    ?startDate=Tue%2C+31+Dec+2019+21%3A00%3A00+GMT&endDate=${day}
    %2C+${date}+${month}+${year}+21%3A00%3A00+GMT`
  );

  return responseForYear;
};
class Finance {
  constructor(parentNode) {
    this.parentNode = parentNode;
    this.currencyList = document.createElement("div");
    this.currencyChoiceBlock = document.createElement("div");
    this.chart = false;
    this.render();
  }

  async createPairEurUsd() {
    const { eur, usd } = await getCurrencyPairData();

    const eurUsd = document.createElement("p");

    this.currencyList.classList.add("currencyList");
    eurUsd.classList.add("eurUsd");

    eurUsd.textContent = `EUR/USD: ${(
      eur.Cur_OfficialRate /
      eur.Cur_Scale /
      (usd.Cur_OfficialRate / usd.Cur_Scale)
    ).toFixed(4)}`;

    this.currencyList.appendChild(eurUsd);
  }

  async createPairEurRub() {
    const { eur, rub } = await getCurrencyPairData();
    const eurRub = document.createElement("p");

    eurRub.classList.add("eurRub");

    eurRub.textContent = `EUR/RUB: ${(
      eur.Cur_OfficialRate /
      eur.Cur_Scale /
      (rub.Cur_OfficialRate / rub.Cur_Scale)
    ).toFixed(4)}`;

    this.currencyList.appendChild(eurRub);
  }

  async createPairBlrUsd() {
    const { usd } = await getCurrencyPairData();
    const blrUsd = document.createElement("p");

    blrUsd.classList.add("blrUsd");

    blrUsd.textContent = `USD/BLR: ${(
      usd.Cur_OfficialRate / usd.Cur_Scale
    ).toFixed(4)}`;

    this.currencyList.appendChild(blrUsd);
  }

  async createSelect(selectName, selectedItem) {
    const data = await getRateForDayRequest();
    const select = document.createElement("select");
    select.name = selectName;

    const fragment = document.createDocumentFragment();

    data.forEach((currency) => {
      const option = document.createElement("option");
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
    this.currencyChoiceBlock.classList.add("currencyChoiceBlock");
    this.currencyChoiceBlock.textContent = "Select currency pair ";
    this.parentNode.appendChild(this.currencyChoiceBlock);
  }

  axesLinearChart(updatedDate, currencyDynamic, rateCurrencyPair) {
    const chartBlock = document.createElement("div");
    chartBlock.classList.add("chartBlock");
    chartBlock.innerHTML = `<canvas id="line-chart"></canvas>`;

    this.parentNode.appendChild(chartBlock);
    const ctx = document.getElementById("line-chart").getContext("2d");
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: "line",
      data: {
        datasets: [
          {
            label: `${
              updatedDate[updatedDate.length - 1]
            } Rate: ${rateCurrencyPair}`,
            data: currencyDynamic,
            fill: false,
            borderColor: "red",
            backgroundColor: "red",
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

      dates.length = 0;
      shortDates.length = 0;

      yearData.forEach((val) => dates.push(val.Date));

      dates.forEach((dateItem) => shortDates.push(dateItem.slice(0, 10)));

      if (select === "selectLeft") {
        currencyDynamicsLeft = [];
        yearData.forEach((val) =>
          currencyDynamicsLeft.push(val.Cur_OfficialRate)
        );
      }
      if (select === "selectRight") {
        currencyDynamicsRight = [];
        yearData.forEach((val) =>
          currencyDynamicsRight.push(val.Cur_OfficialRate)
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

    getYearCurrencyData(292, "selectLeft");
    setTimeout(() => {
      getYearCurrencyData(145, "selectRight");
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

    const selectLeft = await this.createSelect("selectLeft", "EUR");
    const selectRight = await this.createSelect("selectRight", "USD");

    selectLeft.addEventListener("click", addClickedCurrency);
    selectRight.addEventListener("click", addClickedCurrency);
  }

  render() {
    const caption = document.createElement("h3");
    caption.textContent = "Finance";
    this.parentNode.appendChild(caption);
    this.createPairEurUsd();
    this.createPairEurRub();
    this.createPairBlrUsd();
    this.parentNode.appendChild(this.currencyList);
    this.renderCurrencyChoiceBlock();
    this.getFinanceData();
  }
}

export default Finance;
