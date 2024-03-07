"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio = __importStar(require("cheerio"));
const fetchHtmlService_1 = __importDefault(require("./fetchHtmlService"));
async function parseHtml(url) {
    // Fetch resort data and remove useless parts
    const html = await fetchHtmlService_1.default.getHtml(url);
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
    const htmlMid = await fetchHtmlService_1.default.getHtml(urlMid);
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
    const htmlBot = await fetchHtmlService_1.default.getHtml(urlBot);
    let dataBot = htmlBot.split('<table class="forecast');
    dataBot = dataBot[1].split('</table>');
    const dataToParseBot = '<table class="forecast' + dataBot[0] + '</table>';
    $ = cheerio.load(dataToParseBot);
    const temperatureBot = $('div.forecast-table__container--min').eq(1).text();
    // Fetch weather data at top
    const urlTop = url + '/6day/top';
    const htmlTop = await fetchHtmlService_1.default.getHtml(urlTop);
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
exports.default = {
    parseHtml
};
