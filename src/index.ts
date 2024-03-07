import fetchHtmlService from './services/fetchHtmlService';
import snowReportService from './services/snowReportService';
// import snowWeatherService from './services/snowWeatherService';
// import databaseService from "./services/databaseService";

async function main() {
  const url = 'https://www.snow-forecast.com/countries/Austria/resorts/A-D';
  // const url ='https://www.snow-forecast.com/countries/Australia/resorts';
  // const url = 'https://www.snow-forecast.com/resorts/Abtenau';
  // const urlMid = 'https://www.snow-forecast.com/resorts/Abtenau/6day/mid';
  // const urlBot = 'https://www.snow-forecast.com/resorts/Abtenau/6day/bot';
  // const urlTop = 'https://www.snow-forecast.com/resorts/Abtenau/6day/top';

  const html = await fetchHtmlService.getHtml(url);
  const resortData = snowReportService.parseHtml(html, url);
  // const resortData = await snowWeatherService.parseHtml(url);
  console.log(resortData);

  // await databaseService.createDatabase(resortData);
}

main().then(() => {}).catch(() => {});
