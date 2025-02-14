  "use strict";

  let htmlHeader = `<!DOCTYPE html>
  <html lang="ru">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Выгрузка из Сбера</title>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
      />
      <style type="text/css">
        body {
          display: flex;
          justify-content: center;
          font-family: "Roboto", sans-serif;
        }
        .container {
          width: 95%;
          max-width: 900px;
        }
        header {
          text-align: center;
          margin: 60px 0px;
        }
        .profitAndLoss table {
          width: 100%;
        }
        table {
          border-collapse: collapse;
        }
        td,
        th {
          padding: 10px;
          text-align: left;
        }
        th {
          background-color: #bcf1c0
        }
        td {
          border-left: 1px solid #e8e7e7;
          border-right: 1px solid #e8e7e7;
          border-bottom: 1px solid #e8e7e7;
        }
        tr:nth-child(even) {
          background-color: #f2f2f2;
        }
        tr:nth-child(odd) {
          background-color: #ffffff;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <header>
          <h1>Выгрузка из Сбера</h1>
        </header>
        <section>
          <table class="profitAndLoss">
            <tr>
              <th>№</th>
              <th>Дата</th>
              <th>Контрагент</th>
              <th>Сумма</th>
              <th>Тип операции</th>
              <th>Комментарий</th>
            </tr>`;
  let htmlPnLTable = ``;
  let htmlFooter = `        </table>
        </section>
      </div>
    </body>
  </html>`;

  let profitAndLoss = {
    objects: [],
  };
  
  // Раскомментировать, чтобы работало в браузерном приложении
  // const parseBtn = document.getElementById("parse");
  // parseBtn.addEventListener("click", () => {
  //   parseSber();
  // });

  // parseBtn.addEventListener("click", () => {
  //   chrome.tabs.query({active: true}, (tabs) => {
  //     let tab = tabs[0].id;
  //     if (tab) {
  //         console.log(tab);
  //     } else {
  //         alert("There are no active tabs")
  //     }
  //   })
  // });
  
  // Раскомментировать, чтобы работало в консоли
  parseSber();

  function parseSber() {
    const days = document.querySelectorAll("Section");
    const daysCount = days.length;
    let profitAndLossCount = 0;

    for (let i = 1; i < daysCount; i++) {
      let date = days[i].children[0].innerText;
      let parsedDate = date;
      let operations = days[i].querySelectorAll("li");
      let operationsCount = days[i].querySelectorAll("li").length;
      for (let j = 0; j < operationsCount; j++) {
        let operationArgumentsElements =
          operations[j].querySelectorAll("li a div p");
        let args = Array.from(operationArgumentsElements).map(
          (el) => el.innerText
        );
        let argumentsCount = args.length;
        if (argumentsCount === 3) {
          let sum = sumParsing(args[1]);
          if (sum != 0 && !isNaN(sum)) {
            profitAndLossCount++;
            parsedDate = dateParsing(date);
            addNewPnL(profitAndLossCount, parsedDate, args[0], sum, args[2]);
          }
        } else if (argumentsCount === 4) {
          let sum = sumParsing(args[1]);
          if (sum != 0 && !isNaN(sum)) {
            profitAndLossCount++;
            parsedDate = dateParsing(date);
            addNewPnL(profitAndLossCount, parsedDate, args[0], sum, args[2]);
          }
        } else if (argumentsCount === 6) {
          console.log("!ПЕРЕВОД");
        } else {
          console.log("!ДРУГОЕ");
        }
      }
    }
    addRowPnLTable();
  }

  function sumParsing(sum) {
    const parsedSum = sum
      .replace("RUB", "")
      .replace("RUR", "")
      .replace("₽", "")
      .replace(",", ".")
      .replace(" ", "");
    let signedSum = parsedSum;
    if (isNaN(parsedSum)) {
      signedSum = 0;
    } else {
      if (parsedSum[0] === "+") {
        signedSum = parsedSum.slice(1);
      } else {
        signedSum = `-${parsedSum}`;
      }
      return signedSum;
    }
  }

  function dateParsing(date) {
    const todayDate = new Date();
    const today = todayDate.getDate();
    const yesterday = todayDate.getDate() - 1;
    const dayBeforeYesterday = todayDate.getDate() - 2;
    const currentMonth = todayDate.getMonth() + 1;
    const currentYear = todayDate.getFullYear();
    const words = date.replace(",", "").split(" ");
    const wordsCount = words.length;
    let day;
    let month;
    let year;
    let parsedDate;
    if (wordsCount === 3) {
      day = words[0];
      month = getMonthNumber(words[1]);
      if (!isNaN(words[2])) {
        year = words[2];
      } else {
        year = currentYear;
      }
      parsedDate = `${day}.${month}.${year}`;
    } else if (words == "Сегодня") {
      parsedDate = `${today}.${currentMonth}.${currentYear}`;
    } else if (words == "Вчера") {
      parsedDate = `${yesterday}.${currentMonth}.${currentYear}`;
    } else if (words == "Позавчера") {
      parsedDate = `${dayBeforeYesterday}.${currentMonth}.${currentYear}`;
    }
    return parsedDate;
  }

  function getMonthNumber(month) {
    let monthNumber;
    if (month == "января") monthNumber = "01";
    if (month == "февраля") monthNumber = "02";
    if (month == "марта") monthNumber = "03";
    if (month == "апреля") monthNumber = "04";
    if (month == "мая") monthNumber = "05";
    if (month == "июня") monthNumber = "06";
    if (month == "июля") monthNumber = "07";
    if (month == "августа") monthNumber = "08";
    if (month == "сентября") monthNumber = "09";
    if (month == "октября") monthNumber = "10";
    if (month == "ноября") monthNumber = "11";
    if (month == "декабря") monthNumber = "12";
    return monthNumber;
  }

  function addNewPnL(number, date, counterparty, amount, operationType) {
    let newObject = {
      number: number,
      date: date,
      counterparty: counterparty,
      amount: amount,
      operationType: operationType,
    };
    profitAndLoss.objects.push(newObject);
  }

  function addRowPnLTable() {
    for (let i = 0; i < profitAndLoss.objects.length; i++) {
      htmlPnLTable += `
      <tr>
        <td>${profitAndLoss.objects[i].number}</td>
        <td>${profitAndLoss.objects[i].date}</td>
        <td>${profitAndLoss.objects[i].counterparty}</td>
        <td>${profitAndLoss.objects[i].amount.replace(".", ",")}</td>
        <td>${profitAndLoss.objects[i].operationType}</td>
        <td></td>
      </tr>`;
    }
    let html = htmlHeader + htmlPnLTable + htmlFooter;
    openNewWindow(html);
  }

  function openNewWindow(html) {
    let newWindow = window.open();
    newWindow.document.write(html);
    newWindow.document.close();
  }