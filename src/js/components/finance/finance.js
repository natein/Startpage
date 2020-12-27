// import './finance.scss';
import "./finance.css";

class Finance {
  constructor(parentNode) {
    // parentNode - это обычный div, в который вставляешь свои элементы
    this.parentNode = parentNode;
    this.render();
  }

  render() {
    const caption = document.createElement("h3");
    caption.textContent = "Finance";
    this.parentNode.appendChild(caption);

    async function getFinanceData() {
      const response = await fetch(
        "https://www.nbrb.by/api/exrates/rates?periodicity=0"
      );
      const data = await response.json();
      console.log(data);
    };
    // getFinanceData();

    const currentDate = new Date();
    const dataDate = currentDate.toString().split(' ');
    const day = dataDate[0];
    const month = dataDate[1];
    const date = dataDate[2];
    const year = dataDate[3];
    // console.log(day, month, date, year)
    // console.log(currentDate.toString().split(' '))

    async function getCurrencyData(Cur_ID = 292) {
      const response = await fetch(
        `https://www.nbrb.by/API/ExRates/Rates/Dynamics/${Cur_ID}?startDate=Tue%2C+31+Dec+2019+21%3A00%3A00+GMT&endDate=${day}%2C+${date}+${month}+${year}+21%3A00%3A00+GMT`
      );
      const data = await response.json();
      console.log(data);
    };
    // getCurrencyData('145');


  }
}

export default Finance;
