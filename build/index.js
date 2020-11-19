"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const init_client_1 = require("./init_client");
dotenv_1.config();
init_client_1.initClient().login(process.env.TOKEN);
