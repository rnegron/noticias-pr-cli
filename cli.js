#!/usr/bin/env node
'use strict';

// The sindresorhus block
const got = require('got');
const ora = require('ora');
const isReachable = require('is-reachable');
const ansiEscapes = require('ansi-escapes');
const terminalLink = require('terminal-link');
const terminalImage = require('terminal-image');

const cFonts = require('cfonts');
const logger = require('debug')('noticias-pr');
const htmlToPlainText = require('html2plaintext');
const Mercury = require('@postlight/mercury-parser');

// Custom modules
const exit = require('./lib/exit');
const prompts = require('./lib/prompts');
const formatDate = require('./lib/formatDate');
const retrieveArticlesFromNewsSite = require('./lib/noticieros');

/* istanbul ignore next */
function terminalLinkFallback(text, url) {
  return `${text} ${url}`;
}

/* istanbul ignore next */
function printArticle(articleImage, article) {
  console.log(`
    \n
    ${articleImage}
    \n
    \t\t\tTítulo: ${article.title}
    \t\t\tPublicado: ${formatDate(article.date_published)}
    \t\t\tLeer en la web:  ${terminalLink(article.domain, article.url, {
      fallback: terminalLinkFallback,
    })}
    \n\n
    ${htmlToPlainText(article.content)}
    \n
  `);
}

/* istanbul ignore next */
async function checkConnectionToNewsSite(chosenNewsSite) {
  const reachableSpinner = ora('Verificando conneción...').start();

  const siteIsReachable = await isReachable(chosenNewsSite);
  if (siteIsReachable === true) {
    reachableSpinner.succeed();
  } else {
    reachableSpinner.fail(
      'La connecíon falló! Favor de verificar la conectividad al internet.'
    );
    throw new Error('Site unreachable');
  }
}

async function retrieveNewsSiteChoices() {
  return [
    { title: 'El Nuevo Día', value: 'www.elnuevodia.com' },
    { title: 'Primera Hora', value: 'www.primerahora.com' },
    { title: 'El Vocero', value: 'www.elvocero.com' },
    { title: 'Noticel', value: 'www.noticel.com' },
    { title: 'Salir', value: 'exit' },
  ];
}

/* istanbul ignore next */
async function promptForNewsSite(newsSiteChoices) {
  const newsSiteChoice = await prompts({
    message: 'Escoge un noticiero',
    choices: newsSiteChoices,
  });

  logger('newsSiteChoice: %O', newsSiteChoice);

  return newsSiteChoice.value;
}

async function retrieveArticlesAvailable(chosenNewsSite) {
  // return candidate articles given a news site
  const articleChoices = [];

  const articleLoadingSpinner = ora('Cargando titulares...');

  articleLoadingSpinner.start();
  try {
    const articles = await retrieveArticlesFromNewsSite[chosenNewsSite]();

    for (const article of articles) {
      logger('Article: %O', article);
      articleChoices.push({
        title: article.title,
        value: article.link,
      });
    }

    // Add back option
    articleChoices.push({ title: 'Regresar', value: 'back' });

    articleLoadingSpinner.succeed();
    return articleChoices;
  } catch (err) {
    articleLoadingSpinner.fail(err.message);
    process.exit(1);
  }
}

/* istanbul ignore next */
async function promptForArticle(articleChoices) {
  // Prompt the user to select an article given some choices
  process.stdout.write(ansiEscapes.clearScreen);

  logger('Article choices: %O', articleChoices);

  try {
    const articleResponse = await prompts({
      message: 'Escoge un artículo',
      choices: articleChoices,
    });

    logger('Article choices response: %O', articleResponse);

    // Return to news site selection manually if the user chose to
    if (articleResponse.value === 'back') {
      await cliInitialMenu();
    }

    return articleResponse;
  } catch (err) {
    process.exit(1);
  }
}

async function retrieveArticleData(article) {
  const prepareArticleSpinner = ora('Cargando artículo...');

  // Get article data from Mercury
  try {
    prepareArticleSpinner.start();
    const articleData = await Mercury.parse(article);
    logger('Article Data: %O', articleData);

    prepareArticleSpinner.succeed();

    return articleData;
  } catch (err) {
    prepareArticleSpinner.fail(err.message);
    process.exit(1);
  }
}

async function retrieveArticleImage(article) {
  // Verifies that the article parsed via Mercury has a lead image, and tries to fetch it
  const imageLoadingSpinner = ora('Descargando y preparando imágen...');
  try {
    logger('Working on image: %s', article.lead_image_url);

    imageLoadingSpinner.start();

    // Fetch the image using the "got" package
    const response = await got(article.lead_image_url).buffer();

    // Prepare the image for displaying it in the terminal
    const articleImage = await terminalImage.buffer(response);
    imageLoadingSpinner.succeed();

    return articleImage;
  } catch (err) {
    imageLoadingSpinner.warn('No se pudo desplegar la imágen! ' + err.message);
    return '';
  }
}

/* istanbul ignore next */
async function promptAfterArticle() {
  const afterArticleResponse = await prompts({
    message: 'Opción',
    choices: [
      { title: 'Regresar a noticieros', value: '1' },
      { title: 'Regresar a artículos', value: '2' },
      { title: 'Salir', value: '3' },
    ],
  });

  return afterArticleResponse.value;
}

/* istanbul ignore next */
async function performChosenAction(chosenAction, articlesAvailable) {
  if (chosenAction === '1') {
    // Go back to selecting a news site
    await cliInitialMenu();
  } else if (chosenAction === '2') {
    // Go back to selecting an article
    process.stdout.write(ansiEscapes.clearScreen);
    await cliInitialMenu(articlesAvailable);
  } else {
    // Exit the CLI
    exit();
  }
}

/* istanbul ignore next */
async function cliInitialMenu(articlesAvailable = null) {
  // Menu for picking a news site. Outputs the article chosen by the user.
  // If given an array of article choices, skips the step of choosing the site.
  let articleData;
  let articleImage;

  // If there are no articles available, go through the whole process
  if (articlesAvailable === null) {
    try {
      // Prompt for a news site
      const newsSiteChoices = await retrieveNewsSiteChoices();
      const chosenNewsSite = await promptForNewsSite(newsSiteChoices);

      // Manual exit available
      if (chosenNewsSite === 'exit') exit();

      // If not testing, check network connectivity to the news site
      if (process.env.NODE_ENV !== 'test') {
        await checkConnectionToNewsSite(chosenNewsSite);
      }

      // Obtain available articles from the chosen news site
      articlesAvailable = await retrieveArticlesAvailable(chosenNewsSite);
    } catch (err) {
      process.exit(1);
    }
  }

  // At this point, there are articles available
  try {
    // Prompt for an article
    const chosenArticle = await promptForArticle(articlesAvailable);

    // Parse the article data and image (if possible)
    articleData = await retrieveArticleData(chosenArticle.value);
    articleImage = await retrieveArticleImage(articleData);
  } catch (err) {
    process.exit(1);
  }

  // Render the article in the terminal
  printArticle(articleImage, articleData);

  // After displaying the article, give choices on how to proceed
  const chosenAction = await promptAfterArticle();

  // Execute the choice
  await performChosenAction(chosenAction, articlesAvailable);
}

/* istanbul ignore next */
function entrypoint() {
  // Fancy font intro
  cFonts.say('noticias|PR', {
    font: 'block',
    align: 'center',
    colors: ['system'],
    background: 'transparent',
    letterSpacing: 1,
    lineHeight: 1,
    space: true,
    maxLength: '0',
  });

  // Start at the main menu
  cliInitialMenu();
}

/* istanbul ignore if */
if (process.env.NODE_ENV !== 'test') {
  // Entrypoint to CLI
  entrypoint();
}

// Export retrieval functions for testing purposes
module.exports = {
  retrieveNewsSiteChoices,
  retrieveArticlesAvailable,
  retrieveArticleData,
  retrieveArticleImage,
};
