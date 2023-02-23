const puppeteer = require("puppeteer");
const {
  clickElement,
  getSeance,
  bookingPlace,
  getDayOfSeance,
} = require("./lib/commands.js");
const { testTimeout } = require("./jest.config");

let page;

beforeEach(async () => {
  page = await browser.newPage();
  await page.goto("http://qamid.tmweb.ru/client/index.php");
});
afterEach(() => {
  page.close();
});
describe("Happy path", () => {
  test.only("Book one ticket", async () => {
    const buttonSelector = ".acceptin-button";
    const seanceNum = 3;
    const hallNum = 1;
    const row = 4;
    const seat = 10;
    await getDayOfSeance(page, 3);
    const movieName = await page.$eval(
      `.movie:nth-child(${hallNum}) .movie__title`,
      (link) => link.textContent
    );
    await getSeance(page, hallNum, seanceNum);
    await bookingPlace(page, row, seat);
    await clickElement(page, buttonSelector);
    // проверить что сумма и место отображаются корректно
    const expectedSum = await page.$eval(
      ".ticket__cost",
      (link) => link.textContent
    );
    await expect(expectedSum).toContain("3500");
    const actualPlace = await page.$eval(
      ".ticket__chairs",
      (link) => link.textContent
    );
    //await expect(actualPlace).toContain(`${row}/${seat}`);
    await clickElement(page, buttonSelector);
    const title = await page.$eval("h2", (link) => link.textContent);
    const actualMovieName = await page.$eval(
      ".ticket__title",
      (link) => link.textContent
    );
    await expect(title).toContain("Электронный билет");
    await expect(actualPlace).toContain(`${row}/${seat}`);
    await expect(actualMovieName).toEqual(movieName);
  });
  test("Book two tickets", async () => {
    const buttonSelector = ".acceptin-button";
    await getDayOfSeance(page);
    await getSeance(page, 1, 2);
    const row1 = 4;
    const seat1 = 9;
    const row2 = 4;
    const seat2 = 10;
    await bookingPlace(page, row1, seat1);
    await bookingPlace(page, row2, seat2);
    await clickElement(page, buttonSelector);
    // проверить что сумма и место отображаются корректно
    const actualSum = await page.$eval(
      ".ticket__cost",
      (link) => link.textContent
    );
    await expect(actualSum).toContain("7000");
    const actualPlace = await page.$eval(
      ".ticket__chairs",
      (link) => link.textContent
    );
    await expect(actualPlace).toContain(`${row1}/${seat1}, ${row2}/${seat2}`);
    await clickElement(page, buttonSelector);
    const title = await page.$eval("h2", (link) => link.textContent);
    await expect(title).toContain("Электронный билет");
  });
  test("Return to page back", async () => {
    await getDayOfSeance(page, 3);
    await getSeance(page, 1, 3);
    const row = 3;
    const seat = 9;
    await bookingPlace(page, row, seat);
    await bookingPlace(page, row, seat);
    await page.goBack();
    await getSeance(page, 1, 3);
    const chair = `div.buying-scheme__row:nth-child(${row}) span:nth-child(${seat})`;
    await expect(chair).not.toContain("chair_taken");
  });
});
describe("Unhappy path", () => {
  test("Book the same seat again", async () => {
    const row = 1;
    const seat = 6;
    const buttonSelector = ".acceptin-button";
    await getDayOfSeance(page, 4);
    await getSeance(page, 1, 1);
    await bookingPlace(page, row, seat);
    await clickElement(page, buttonSelector);
    await clickElement(page, buttonSelector);

    await page.goto("http://qamid.tmweb.ru/client/index.php");
    await getDayOfSeance(page, 4);
    await getSeance(page, 1, 1);
    await bookingPlace(page, row, seat);
    const seatCss = `div.buying-scheme__row:nth-child(${row}) span:nth-child(${seat})`;
    const actualClass = await page.$eval(seatCss, (link) => link.className);
    await expect(actualClass).toContain("chair_taken");
    await clickElement(page, seatCss);
    const resultTitle = await page.$eval("h1", (link) => link.textContent);
    await expect(resultTitle).toContain("Идёмвкино");
  });
  test("Seance time is expired", async () => {
    let now = new Date().getHours();
    const disabledButton = ".acceptin-button-disabled";
    await page.click(disabledButton);
    const result = await page.$eval(disabledButton, (link) => link.textContent);
    await expect(Number(result.substr(0, 2))).toBeLessThanOrEqual(now);
  });
});
