#!/usr/bin/env node
"use strict";

const debug = require("debug")("noticias-pr");

// The sindresorhus block
const got = require("got");
const ora = require("ora");
const isReachable = require("is-reachable");
const clearTerminal = require("clear-terminal");

const terminalImage = require("terminal-image");
const Mercury = require("@postlight/mercury-parser");
const formatDate = require("date-fns").format;

const terminalLink = require("terminal-link");
const htmlToPlainText = require("html2plaintext");

// Custom modules
const prompts = require("./lib/prompts");
const news = require("./lib/noticieros");

function exit() {
  // Exit the application manually
  clearTerminal();
  process.exit(0);
}

async function chooseNewsSite() {
  const articleChoices = [];

  // Obtain news site and articles

  const siteResponse = await prompts({
    message: "Escoge un noticiero",
    choices: [
      { title: "El Nuevo Día", value: "www.elnuevodia.com" },
      { title: "El Vocero", value: "www.elvocero.com", disabled: true },
      { title: "Primera Hora", value: "www.primerahora.com", disabled: true },
      { title: "Salir", value: "exit" },
    ],
  });

  debug("Site response: %O", siteResponse);

  // Exit manually if the user chose to
  if (siteResponse.value === "exit") {
    exit();
  }

  debug("verifying that news site %s is available", siteResponse.value);

  // Verify internet connectivity for the selected news site
  const reachableSpinner = ora("Verificando conneción...").start();
  try {
    if ((await isReachable(siteResponse.value)) === true) {
      // Site is reachable
      reachableSpinner.succeed();
    } else {
      // Site unreachable, throw an error
      throw new Error(
        "La connecíon falló! Favor de verificar la conectividad al internet."
      );
    }
  } catch (err) {
    // Catch the site unreachable error, fail the spinner exit out
    reachableSpinner.fail(err.message);
    process.exit(1);
  }

  return siteResponse.value;
}

async function chooseArticle(articleChoices) {
  // Get articles
  try {
    debug("Choices %O", articleChoices);
    const articleResponse = await prompts({
      message: "Escoge un artículo",
      choices: articleChoices,
    });

    debug("Choices response: %O", articleResponse);

    if (articleResponse.value === "back") {
      await main();
    }

    return articleResponse.value;
  } catch (err) {
    console.error(err.message);
  }
}

async function prepareImage(article) {
  if (article.lead_image_url) {
    const imageLoadingSpinner = ora("Descargando y preparando imágen...");
    try {
      debug("Working on image: %s", article.lead_image_url);
      imageLoadingSpinner.start();
      const { body } = await got(article.lead_image_url, { encoding: null });
      const articleImage = await terminalImage.buffer(body);
      imageLoadingSpinner.succeed();
      return articleImage;
    } catch (err) {
      imageLoadingSpinner.warn("No se pudo desplegar la imágen!" + err.message);
      return "";
    }
  }
}

async function getArticle(articleUrl) {
  // return article
  const prepareArticleSpinner = ora("Cargando artículo...");
  // Get article from Mercury Parse
  let article = {};

  try {
    prepareArticleSpinner.start();
    // Parse article
    article = await Mercury.parse(articleUrl);
    debug("Article: %O", article);
    prepareArticleSpinner.succeed();
    return article;
  } catch (err) {
    prepareArticleSpinner.fail(err);
  }
}

async function getNews(newsSource) {
  // return candidate articles
  const articleChoices = [];
  debug("waiting for articles...");
  const articleLoadingSpinner = ora("Cargando titulares...");

  articleLoadingSpinner.start();
  try {
    const articles = await news(newsSource);

    for (let article of articles) {
      debug("Article: %O", article);
      articleChoices.push({ title: article.title, value: article.link });
    }

    // Add back option
    articleChoices.push({ title: "Regresar", value: "back" });

    articleLoadingSpinner.succeed();
    return articleChoices;
  } catch (err) {
    articleLoadingSpinner.fail(err.message);
    process.exit(1);
  }
}

async function mainMenu() {
  let articleImage = "";
  let article = "";

  try {
    let newsSource = await chooseNewsSite();
    let articleChoices = await getNews(newsSource);
    let articleUrl = await chooseArticle(articleChoices);
    article = await getArticle(articleUrl);
    articleImage = await prepareImage(article);
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }

  console.log(`
    \n
    ${articleImage}
    Título: ${article.title}
    Publicado: ${formatDate(article.date_published, "D/M/YYYY")}
    Leer en la web:  ${terminalLink(article.domain, article.url)}
    \n\n
    ${htmlToPlainText(article.content)}
    \n
  `);

  try {
    const afterArticleResponse = await prompts({
      message: "Opción",
      choices: [
        { title: "Regresar a noticieros", value: "1" },
        { title: "Salir", value: "3" },
      ],
    });

    switch (afterArticleResponse.value) {
      case "1":
        await mainMenu();
        break;
      case "3":
        exit();
    }
  } catch (err) {
    console.error(err.message);
  }
}

// Entrypoint
(async () => {
  // Set window title
  // process.stdout.write("'\x1b]2;noticias-pr\x1b\\'");
  await mainMenu();
})();
