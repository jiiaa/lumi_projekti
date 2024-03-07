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
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio = __importStar(require("cheerio"));
function parseHtml(html, url) {
    // Get the country from the url
    let splitUrl = url.split('countries/');
    splitUrl = splitUrl[1].split('/resorts');
    const country = splitUrl[0];
    // Remove useless data and split the table by rows
    let data = html.split('<tbody >');
    data = data[1].split('</tbody>');
    data = data[0].split('digest-row');
    // eslint-disable-next-line no-var
    var resortData = [];
    for (let ind = 1; ind < data.length; ind++) {
        let resort = null;
        let url = null;
        let webcam = null;
        let elevationBottom = null;
        let elevationTop = null;
        let lowerDepth = null;
        let upperDepth = null;
        let lastSnow = null;
        let lastSnowed = null;
        let day3 = null;
        let day6 = null;
        let day9 = null;
        const html = '<table><tbody><tr class="' + data[ind] + '</tbody></table>';
        const $ = cheerio.load(html);
        resort = $('div.name').children('a').text();
        url = $('div.name').children('a').attr('href');
        elevationBottom = $('p.elevation').children('span.height').eq(0).text();
        elevationTop = $('p.elevation').children('span.height').eq(1).text();
        webcam = $('td.webc').children('a').children('img').attr('src');
        lowerDepth = $('div.lower-depth').find('span.snow').text();
        upperDepth = $('div.upper-depth').find('span.snow').text();
        lastSnow = $('td.last-snowed').find('span.snow').text();
        lastSnowed = $('td.last-snowed').children('span.secondary').text();
        day3 = $('td.forecast-snow').find('div.three-day').find('span.snow').text();
        day6 = $('td.forecast-snow').find('div.six-day').find('span.snow').text();
        day9 = $('td.forecast-snow').find('div.nine-day').find('span.snow').text();
        // Make the full address
        url = `https://www.snow-forecast.com${url}`;
        // Remove decimals
        if (lastSnow.includes('.')) {
            // lastSnow = lastSnow.substring(0, lastSnow.indexOf('.'));
            lastSnow = String(Math.floor(Number(lastSnow)));
        }
        // Count the exact date
        // HTML page has four options
        if (lastSnowed == 'today') {
            const day = new Date().getDate();
            const month = new Date().getMonth() + 1;
            lastSnowed = `${day}.${month}.`;
        }
        else if (lastSnowed == 'yesterday') {
            const pvm = new Date();
            pvm.setDate(pvm.getDate() - 1);
            const day = pvm.getDate();
            const month = pvm.getMonth() + 1;
            lastSnowed = `${day}.${month}.`;
        }
        else if (lastSnowed.startsWith('on')) {
            lastSnowed = lastSnowed.replace('on ', '');
            const pvm = new Date(lastSnowed);
            const day = pvm.getDate();
            const month = pvm.getMonth() + 1;
            lastSnowed = `${day}.${month}.`;
        }
        else {
            lastSnowed = lastSnowed.replace(' days ago', '');
            const pvm = new Date();
            pvm.setDate(pvm.getDate() - Number(lastSnowed));
            const day = pvm.getDate();
            const month = pvm.getMonth() + 1;
            lastSnowed = `${day}.${month}.`;
        }
        // Remove decimals
        if (day3.includes('.')) {
            day3 = String(Math.floor(Number(day3)));
        }
        if (day6.includes('.')) {
            day6 = String(Math.floor(Number(day6)));
        }
        if (day9.includes('.')) {
            day9 = String(Math.floor(Number(day9)));
        }
        resortData.push([
            resort,
            country,
            url,
            webcam ? webcam : null,
            elevationBottom,
            elevationTop,
            lowerDepth ? lowerDepth : null,
            upperDepth ? upperDepth : null,
            lastSnow ? lastSnow : null,
            lastSnowed ? lastSnowed : null,
            day3 ? day3 : null,
            day6 ? day6 : null,
            day9 ? day9 : null
        ]);
    }
    return resortData;
}
exports.default = {
    parseHtml
};
