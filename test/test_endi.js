const fs = require("fs");
const path = require("path");
const expect = require("chai").expect;
const nock = require("nock");
const xray = require("../lib/xray");

const siteUrl = "https://www.elnuevodia.com";

describe("parsing articles", function() {
  context("having internet connection and articles being available", function() {
    const html = fs.readFileSync(path.join(__dirname, "elnuevodia.html"), "utf8");
    beforeEach(() => {
      nock(siteUrl)
        .get("/")
        .reply(200, html);
    });

    it("should return the leading article", async function() {
      const response = await xray(siteUrl, ".bk4-8of12 .featured-stories-primary article", [
        {
          title: ".story-tease-title a | trim",
          summary: ".story-tease-summary p | trim",
          image: ".story-tease-image a img@src | trim",
          link: ".story-tease-title a@href | trim",
        },
      ]);

      console.log("response: " + JSON.stringify(response));

      expect(response)
        .to.be.an("array")
        .and.have.lengthOf(1);
      for (let article of response) {
        expect(article)
          .to.be.an("object")
          .and.to.have.all.keys("title", "summary", "image", "link");
        expect(article.title).to.be.equal(
          `Breaking: "Hacer pruebas en código dismunye los bugs"`
        );
        expect(article.summary).to.be.equal("Vale la pena");
        expect(article.image).to.be.equal("https://noticias.pr/primera");
        expect(article.link).to.be.equal(
          "https://www.elnuevodia.com/noticias/pruebas-codigo-menos-bugs"
        );
      }
    });

    it("should return the secondary articles", async function() {
      const response = await xray(siteUrl, ".bk4-8of12 .featured-stories-secondary article", [
        {
          title: ".story-tease-title a | trim",
          summary: ".story-tease-summary p | trim",
          link: ".story-tease-title a@href | trim",
        },
      ]);

      console.log("response:", response);

      expect(response)
        .to.be.an("array")
        .and.to.have.lengthOf(2);
      for (let article of response) {
        expect(article)
          .to.be.an("object")
          .and.to.have.all.keys("title", "summary", "link");
      }
    });
  });
});
