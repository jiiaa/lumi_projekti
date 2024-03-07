"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetchHtmlService_1 = __importDefault(require("./services/fetchHtmlService"));
const snowReportService_1 = __importDefault(require("./services/snowReportService"));
// import snowWeatherService from './services/snowWeatherService';
// import databaseService from "./services/databaseService";
async function main() {
    const url = 'https://www.snow-forecast.com/countries/Austria/resorts/A-D';
    // const url ='https://www.snow-forecast.com/countries/Australia/resorts';
    // const url = 'https://www.snow-forecast.com/resorts/Abtenau';
    // const urlMid = 'https://www.snow-forecast.com/resorts/Abtenau/6day/mid';
    // const urlBot = 'https://www.snow-forecast.com/resorts/Abtenau/6day/bot';
    // const urlTop = 'https://www.snow-forecast.com/resorts/Abtenau/6day/top';
    const html = await fetchHtmlService_1.default.getHtml(url);
    const resortData = snowReportService_1.default.parseHtml(html, url);
    // const resortData = await snowWeatherService.parseHtml(url);
    console.log(resortData);
    // await databaseService.createDatabase(resortData);
}
main().then(() => { }).catch(() => { });
