import qEnv from 'resources/qEnv.js';

export default class Statistics {

  getNumberOfActiveItems(inLastDaysCount = undefined) {
    return qEnv.QServerBaseUrl
      .then(QServerBaseUrl => {
        let url = `${QServerBaseUrl}/statistics/number-of-items`;
        if (inLastDaysCount) {
          url += `/${Date.now() - (inLastDaysCount * 24 * 60 * 60 * 1000)}`;
        }
        return fetch(url)
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(data => {
        return data.value;
      })
  }
}
