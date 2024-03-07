"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
// Download the html page
async function getHtml(url) {
    try {
        const response = await axios_1.default.get(url);
        if (response.status !== 200) {
            console.error("Error in fetching html");
            return "";
        }
        const html = response.data;
        return html;
    }
    catch (err) {
        console.error(err);
        return "";
    }
}
exports.default = { getHtml };
