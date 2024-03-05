import * as cheerio from 'cheerio';

import fetchHtmlService from './fetchHtmlService';

interface ResortData {
  resortOpens: string | null,
  resortCloses: string | null,
  resortOpen: boolean | null,
  weather: string,
  weather24: string,
  weather48: string,
  weather72: string,
  temperature: string
  temperatureBot: string,
  temperatureTop: string
}

async function parseHtml (url: string): Promise<ResortData> {

  // Fetch resort data and remove useless parts
  const html = await fetchHtmlService.getHtml(url);
  let data = html.split('</head>');
  data = data[1].split('</body');
  const dataToParse = data[0] + '</body>';

  let $ = cheerio.load(dataToParse);

  // Get the season information
  const opensDate = $('b:contains("Season opens")').next().text();
  const closesDate = $('b:contains("Season closes")').next().text();

  let resortOpens = null;
  let resortCloses = null;
  let resortOpen = null;

  if (opensDate !== '-' && closesDate !== '-') {
    resortOpen = false;

    // Convert dates and determine if resort is open
    resortOpens = new Date(opensDate);
    resortCloses = new Date(closesDate);

    const userTimeZoneOffset = resortOpens.getTimezoneOffset() * 60000;
    
    resortOpens = new Date(resortOpens.getTime() - userTimeZoneOffset).toLocaleDateString('fi-FI');
    resortCloses = new Date(resortCloses.getTime() - userTimeZoneOffset).toLocaleDateString('fi-FI');

    const today = new Date().toLocaleDateString('fi-FI');

    if (today > resortOpens && today <= resortCloses) {
      resortOpen = true;
    }
  }

  // Fetch weather data at middle
  const urlMid = url + '/6day/mid';
  const htmlMid = await fetchHtmlService.getHtml(urlMid);
  let dataMid = htmlMid.split('<table class="forecast');
  dataMid = dataMid[1].split('</table>');
  const dataToParseMid = '<table class="forecast' + dataMid[0] + '</table>';

  $ = cheerio.load(dataToParseMid);

  // Get the weather today and in coming days
  const weather = $('span.forecast-table__phrase').eq(1).text();
  const weather24 = $('span.forecast-table__phrase').eq(4).text();
  const weather48 = $('span.forecast-table__phrase').eq(7).text();
  const weather72 = $('span.forecast-table__phrase').eq(10).text();
  const temperature = $('div.forecast-table__container--min').eq(1).text();

  // Fetch weather data at bottom
  const urlBot = url + '/6day/bot';
  const htmlBot = await fetchHtmlService.getHtml(urlBot);
  let dataBot = htmlBot.split('<table class="forecast');
  dataBot = dataBot[1].split('</table>');
  const dataToParseBot = '<table class="forecast' + dataBot[0] + '</table>';

  $ = cheerio.load(dataToParseBot);

  const temperatureBot = $('div.forecast-table__container--min').eq(1).text();

  // Fetch weather data at top
  const urlTop = url + '/6day/top';
  const htmlTop = await fetchHtmlService.getHtml(urlTop);
  let dataTop = htmlTop.split('<table class="forecast');
  dataTop = dataTop[1].split('</table>');
  const dataToParseTop = '<table class="forecast' + dataTop[0] + '</table>';

  $ = cheerio.load(dataToParseTop);

  const temperatureTop = $('div.forecast-table__container--min').eq(1).text();

  // Store the values to result array
  return {
    resortOpens,
    resortCloses,
    resortOpen,
    weather,
    weather24,
    weather48,
    weather72,
    temperature,
    temperatureBot,
    temperatureTop
    };  
}

export default {
  parseHtml
};
