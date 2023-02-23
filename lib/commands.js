module.exports = {
  clickElement: async function (page, selector) {
    try {
      await page.waitForSelector(selector);
      await page.click(selector);
    } catch (error) {
      throw new Error(`this element is not clickable: ${selector}`);
    }
  },
  bookingPlace: async function (page, row, seat) {
    //бронь места на пересечении row и seat
    try {
      const cssSel = `div.buying-scheme__row:nth-child(${row}) span:nth-child(${seat})`;
      await page.waitForSelector(cssSel);
      await page.click(cssSel);
    } catch (error) {
      throw new Error(
        `this place cannot be booked, please check: row ${row}, seat ${seat}`
      );
    }
  },

  getWeekDay: async function (page, dayOfWeek) {
    //получение дня соответствующего аргументу функции
    const day = `.page-nav__day`;
    for (let i = 1; i < day.length + 1; i++) {
      const buttonSelector = `a.page-nav__day:nth-child(${i})`;
      const weekDay = await page.$eval(
        `.page-nav__day:nth-child(${i}) .page-nav__day-week`,
        (link) => link.textContent
      );
      if (weekDay === dayOfWeek) {
        await page.click(buttonSelector);
        break;
      }
    }
  },
  getDayOfSeance: async function (page, days = 2) {
    //получение дня следующего за текущим
    const cssSelector = `.page-nav__day:nth-child(${days}`;
    await page.click(cssSelector);
  },
  getSeance: async function (page, hallNum, seanceNum) {
    const seance = `.movie:nth-child(${hallNum}) .movie-seances__time-block:nth-child(${seanceNum})`;
    await page.waitForSelector(seance);
    await page.click(seance);
  },
};
