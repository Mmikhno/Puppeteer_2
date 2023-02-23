const puppeteer = require("puppeteer");
const chai = require("chai");
const expect = chai.expect;
const {
  Given,
  When,
  Then,
  Before,
  After,
  setDefaultTimeout,
} = require("cucumber");
const {
  getDayOfSeance,
  getSeance,
  bookingPlace,
  clickElement,
} = require("../../lib/commands");
setDefaultTimeout(60000);

Before(async function () {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  this.browser = browser;
  this.page = page;
});

After(async function () {
  if (this.browser) {
    await this.browser.close();
  }
});

Given("user is on page {string}", async function (string) {
  return await this.page.goto(string), { setTimeout: 20000 };
});

When("user chooses day {int}", async function (int) {
  return await getDayOfSeance(this.page, int);
});

When("user chooses hall {int} and seance {int}", async function (int, int2) {
  return await getSeance(this.page, int, int2);
});
When(
  "user chooses row {int} and seat {int} to book",
  async function (int, int2) {
    return await bookingPlace(this.page, int, int2);
  }
);
When("user accepts the order", async function () {
  const acceptButton = ".acceptin-button";
  await clickElement(this.page, acceptButton);
  await this.page.waitForSelector(acceptButton);
  await clickElement(this.page, acceptButton);
});
Then("user sees e-ticket", async function () {
  const title = await this.page.$eval(
    ".ticket__check-title",
    (link) => link.textContent
  );
  expect(title).contains("Электронный билет");
});
When(
  "user cancelled the booking seat {int} in row {int}",
  async function (int, int2) {
    return await bookingPlace(this.page, int2, int);
  }
);
When("user went back to the previous page", async function () {
  return await this.page.goBack();
});
Then(
  "the seat {int} at row {int} hall {int} seance {int} day {int} must be available for booking",
  async function (int, int2, int3, int4, int5) {
    await getDayOfSeance(this.page, int5);
    await getSeance(this.page, int3, int4);
    const chair = `div.buying-scheme__row:nth-child(${int2}) span:nth-child(${int})`;
    expect(chair).not.contain("chair_taken");
  }
);
When("user chooses row {int} and seat {int}", async function (int, int2) {
  return await bookingPlace(this.page, int, int2);
});
When("user clicks on the button with expired time on it", async function () {
  const disabledButton = ".acceptin-button-disabled";
  return await this.page.click(disabledButton);
});
Then("button is disabled", async function () {
  let now = new Date().getHours();
  const disabledButton = ".acceptin-button-disabled";
  const result = await this.page.$eval(
    disabledButton,
    (link) => link.textContent
  );
  expect(Number(result.substr(0, 2))).to.be.lessThanOrEqual(now);
});
When("user confirms the choice", async function () {
  const acceptButton = ".acceptin-button";
  await clickElement(this.page, acceptButton);
  return this.page;
});
