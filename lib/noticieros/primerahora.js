"use strict";

const debug = require("debug")("noticieros:primerahora");
const xray = require("../xray");

const site = "https://www.primerahora.com/noticias/";

module.exports = async () => {
  const primeraPlana = await xray(site, ".ninecol.last.noticias", [
    {
      title: ".container.theatre.varticle h2 a | trim",
      summary: ".container.theatre.varticle p a | trim",
      link: ".container.theatre.varticle h2 a@href | trim",
    },
  ]);
  debug("(Primera Plana: %O", primeraPlana);

  const segundaPlana = await xray(site, ".container .varticle", [
    {
      title: ".container .theatre .varticle h2 a | trim",
      summary: ".container .theatre .varticle p a | trim",
      link: ".container .theatre .varticle h2 a@href | trim",
    },
  ]);
  debug("Segunda Plana: %O", segundaPlana);

  return [...primeraPlana, ...segundaPlana];
};
