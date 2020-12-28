// import './finance.scss';
import "./finance.css";

class Finance {
  constructor(parentNode) {
    // parentNode - это обычный div, в который вставляешь свои элементы
    this.parentNode = parentNode;
    this.render();
    this.getFinanceData();
    // this.getYearCurrencyData();
  }

  async getFinanceData() {
    const response = await fetch(
      "https://www.nbrb.by/api/exrates/rates?periodicity=0"
    );
    const data = await response.json();
    console.log(data);

    // function createCurrencyList() {
    const eur = data.find((currency) => currency.Cur_Abbreviation === "EUR");
    const usd = data.find((currency) => currency.Cur_Abbreviation === "USD");
    const rub = data.find((currency) => currency.Cur_Abbreviation === "RUB");

    const currencyList = document.createElement("div");
    currencyList.classList.add("currencyList");
    const eurUsd = document.createElement("p");
    eurUsd.classList.add("eurUsd");
    eurUsd.textContent = `EUR/USD: ${(
      eur.Cur_OfficialRate /
      eur.Cur_Scale /
      (usd.Cur_OfficialRate / usd.Cur_Scale)
    ).toFixed(4)}`;
    currencyList.appendChild(eurUsd);

    const eurRub = document.createElement("p");
    eurRub.classList.add("eurRub");
    eurRub.textContent = `EUR/RUB: ${(
      eur.Cur_OfficialRate /
      eur.Cur_Scale /
      (rub.Cur_OfficialRate / rub.Cur_Scale)
    ).toFixed(4)}`;
    currencyList.appendChild(eurRub);

    const blrUsd = document.createElement("p");
    blrUsd.classList.add("blrUsd");
    blrUsd.textContent = `EUR/BLR: ${(
      usd.Cur_OfficialRate / usd.Cur_Scale
    ).toFixed(4)}`;
    currencyList.appendChild(blrUsd);

    this.parentNode.appendChild(currencyList);
    // }

    // createCurrencyList();

    const currencyChoice = document.createElement("div");
    const selectLeft = document.createElement("select");
    selectLeft.name = "selectLeft";
    const selectRight = document.createElement("select");
    selectRight.name = "selectRight";
    const fragmentLeft = document.createDocumentFragment();
    const fragmentRight = document.createDocumentFragment();

    data.forEach((currency) => {
      const option = document.createElement("option");
      // option.classList.add('currency');
      option.value = `${currency.Cur_ID}`;
      // option.dataset.currency = `${currency.Cur_Abbreviation}`;
      option.textContent = `${currency.Cur_Abbreviation}`;
      fragmentLeft.appendChild(option);
    });

    data.forEach((currency) => {
      const option = document.createElement("option");
      // option.classList.add('currency');
      option.value = `${currency.Cur_ID}`;
      // option.dataset.currency = `${currency.Cur_Abbreviation}`;
      option.textContent = `${currency.Cur_Abbreviation}`;
      fragmentRight.appendChild(option);
    });
    selectLeft.appendChild(fragmentLeft);
    selectRight.appendChild(fragmentRight);
    currencyChoice.appendChild(selectLeft);
    currencyChoice.appendChild(selectRight);
    this.parentNode.appendChild(currencyChoice);

    const ctx = document.getElementById("line-chart").getContext("2d");
    let chart;

    const dates = [];
    const updatedDates = [];
    let currencyDynamicsLeft = [];
    let currencyDynamicsRight = [];

    function axesLinearChart(updatedDate, currencyDynamic) {
      if (chart) {
        chart.destroy();
      }

      chart = new Chart(ctx, {
        type: "line",
        data: {
          datasets: [
            {
              label: "Cases",
              data: currencyDynamic,
              fill: false,
              borderColor: "red",
              backgroundColor: "red",
              borderWidth: 0,
            },
            // {
            //    label: "Recovered",
            //    data: currencyDynamicsRight,
            //    fill: false,
            //    borderColor: "#009688",
            //    backgroundColor: "#009688",
            //    borderWidth: 0,
            // },
          ],
          labels: updatedDate,
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }

    async function getYearCurrencyData(currencyId = 292, select) {
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
      // transform format of date
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
        chartLine.push(item / currencyDynamicsRight[i])
      );
      axesLinearChart(updatedDates, chartLine);
      console.log(chartLine);
      // console.log(yearData);
      // console.log(currencyDynamicsLeft);
      // console.log(currencyDynamicsRight);
      // console.log(updatedDates);
    }
    getYearCurrencyData(292, "selectLeft");
    getYearCurrencyData(145, "selectRight");

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
  }
}

export default Finance;
