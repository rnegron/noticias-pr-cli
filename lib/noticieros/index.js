"use strict";

const elnuevodia = require("./elnuevodia");

// Export all available news sites here
module.exports = async site => {
  switch (site) {
    case "www.elnuevodia.com":
      return elnuevodia();
    default:
      throw new Error("Invalid site selected");
  }
};
