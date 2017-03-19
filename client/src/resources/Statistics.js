import qEnv from 'resources/qEnv.js';

export default class Statistics {

  async getNumberOfActiveItems(inLastDaysCount = undefined) {
    try {
      const QServerBaseUrl = await qEnv.QServerBaseUrl;

      let url = `${QServerBaseUrl}/statistics/number-of-items`;
      if (inLastDaysCount) {
        url += `/${Date.now() - (inLastDaysCount * 24 * 60 * 60 * 1000)}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw response;
      }

      const data = await response.json();
      return data.value;
    } catch (e) {
      return null;
    }
  }
}
