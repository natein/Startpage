// import './finance.scss';
import "./finance.css";

class Finance {
  constructor(parentNode) {
    // parentNode - это обычный div, в который вставляешь свои элементы
    this.parentNode = parentNode;
    this.currencyList = document.createElement("div");
    this.render();
  }

  static async getRateForDayRequest() {
    const response = await fetch(
      "https://www.nbrb.by/api/exrates/rates?periodicity=0"
    );
    const data = await response.json();
    return data;
  }

  async createPairEurUsd() {
    const { eur, usd } = await Finance.getCurrencyPairData();

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
    const { eur, rub } = await Finance.getCurrencyPairData();
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
    const { usd } = await Finance.getCurrencyPairData();
    const blrUsd = document.createElement("p");

    blrUsd.classList.add("blrUsd");

    blrUsd.textContent = `EUR/BLR: ${(
      usd.Cur_OfficialRate / usd.Cur_Scale
    ).toFixed(4)}`;

    this.currencyList.appendChild(blrUsd);
  }

  static async getCurrencyPairData() {
    const data = await Finance.getRateForDayRequest();
    const eur = data.find((currency) => currency.Cur_Abbreviation === "EUR");
    const usd = data.find((currency) => currency.Cur_Abbreviation === "USD");
    const rub = data.find((currency) => currency.Cur_Abbreviation === "RUB");
    return {
      eur,
      usd,
      rub,
    };
  }

  async getFinanceData() {
    const data = await Finance.getRateForDayRequest();

    await this.createPairEurUsd();
    await this.createPairEurRub();
    await this.createPairBlrUsd();

    this.parentNode.appendChild(this.currencyList);

    const currencyChoiceBlock = document.createElement("div");
    currencyChoiceBlock.classList.add("currencyChoiceBlock");
    currencyChoiceBlock.textContent = "Select currency pair ";
    const selectLeft = document.createElement("select");
    selectLeft.name = "selectLeft";
    const selectRight = document.createElement("select");
    selectRight.name = "selectRight";
    const fragmentLeft = document.createDocumentFragment();
    const fragmentRight = document.createDocumentFragment();

    data.forEach((currency) => {
      const option = document.createElement("option");
      option.value = `${currency.Cur_ID}`;
      if (currency.Cur_Abbreviation === "EUR") option.selected = true;
      option.textContent = `${currency.Cur_Abbreviation}`;
      fragmentLeft.appendChild(option);
    });

    data.forEach((currency) => {
      const option = document.createElement("option");
      option.value = `${currency.Cur_ID}`;
      if (currency.Cur_Abbreviation === "USD") option.selected = true;
      option.textContent = `${currency.Cur_Abbreviation}`;
      fragmentRight.appendChild(option);
    });

    selectLeft.appendChild(fragmentLeft);
    selectRight.appendChild(fragmentRight);
    currencyChoiceBlock.appendChild(selectLeft);
    currencyChoiceBlock.appendChild(selectRight);
    this.parentNode.appendChild(currencyChoiceBlock);

    const chartBlock = document.createElement("div");
    chartBlock.classList.add("chartBlock");
    chartBlock.innerHTML = `<canvas id="line-chart"></canvas>`;
    this.parentNode.appendChild(chartBlock);
    const ctx = document.getElementById("line-chart").getContext("2d");
    let chart;

    function axesLinearChart(updatedDate, currencyDynamic, rateCurrencyPair) {
      if (chart) {
        chart.destroy();
      }

      chart = new Chart(ctx, {
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

    const dates = [];
    const updatedDates = [];
    let currencyDynamicsLeft = [];
    let currencyDynamicsRight = [];

    async function getYearCurrencyData(currencyId, select) {
      const currentDate = new Date();
      const dataDate = currentDate.toString().split(" ");
      const day = dataDate[0];
      const month = dataDate[1];
      const date = dataDate[2];
      const year = dataDate[3];
      // console.log(day, month, date, year)
      // console.log(currentDate.toString().split(' '))

      const responseOnYear = await fetch(
        `https://www.nbrb.by/API/ExRates/Rates/Dynamics/${currencyId}?startDate=Tue%2C+31+Dec+2019+21%3A00%3A00+GMT&endDate=${day}%2C+${date}+${month}+${year}+21%3A00%3A00+GMT`
      );
      dates.length = 0;
      updatedDates.length = 0;
      const yearData = await responseOnYear.json();
      yearData.forEach((val) => dates.push(val.Date));

      dates.forEach((dateItem) => updatedDates.push(dateItem.slice(0, 10)));
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
      axesLinearChart(updatedDates, chartLine, chartLine[chartLine.length - 1]);
      // console.log(chartLine);
      // console.log(yearData);
      // console.log(currencyDynamicsLeft);
      // console.log(currencyDynamicsRight);
      // console.log(updatedDates);
    }
    getYearCurrencyData(292, "selectLeft");
    setTimeout(() => {
      getYearCurrencyData(145, "selectRight");
    }, 500);

    let flag = false;
    function addClickedCurrency(e) {
      if (flag === false) {
        flag = true;
      } else {
        // console.log(e.target.value);
        // console.log(e.target.name);
        getYearCurrencyData(e.target.value, e.target.name);
        flag = false;
      }
    }

    selectLeft.addEventListener("click", addClickedCurrency);
    selectRight.addEventListener("click", addClickedCurrency);
  }

  render() {
    const caption = document.createElement("h3");
    caption.textContent = "Finance";
    this.parentNode.appendChild(caption);
    this.getFinanceData();
  }
}

export default Finance;
