"use strict";

const debug = require("debug")("noticieros:endi");
const xray = require("../xray");

const site = "https://www.elnuevodia.com";

module.exports = async () => {
  const primeraPlana = await xray(site, ".featured-stories-primary", [
    {
      title: ".story-tease-title a | trim",
      summary: ".story-tease-summary p | trim",
      link: ".story-tease-title a@href | trim",
    },
  ]);
  debug("(Primera Plana: %O", primeraPlana);

  const segundaPlana = await xray(site, ".featured-stories-secondary", [
    {
      title: ".story-tease-title a | trim",
      summary: ".story-tease-summary p | trim",
      link: ".story-tease-title a@href | trim",
    },
  ]);
  debug("Segunda Plana: %O", segundaPlana);

  return [...primeraPlana, ...segundaPlana];
};
