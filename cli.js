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
const formatDate = require('date-fns').format;
const logger = require('debug')('noticias-pr');
const htmlToPlainText = require('html2plaintext');
const Mercury = require('@postlight/mercury-parser');

// Custom modules
const prompts = require('./lib/prompts');
const news = require('./lib/noticieros');

function exit () {
  // Exit the application manually
  process.stdout.write(ansiEscapes.clearScreen);
  process.exit(0);
}

async function chooseNewsSite () {
  // Prompts the user to select a news site, checks for internet connection,
  // then calls the function for fetching the top articles for that site

  // Prompt for selecting news site
  const siteResponse = await prompts({
    message: 'Escoge un noticiero',
    choices: [
      { title: 'El Nuevo Día', value: 'www.elnuevodia.com' },
      { title: 'El Vocero', value: 'www.elvocero.com', disabled: true },
      { title: 'Primera Hora', value: 'www.primerahora.com', disabled: true },
      { title: 'Salir', value: 'exit' }
    ]
  });

  logger('Site response: %O', siteResponse);

  // Exit manually if the user chose to
  if (siteResponse.value === 'exit') {
    exit();
  }

  logger('verifying that news site %s is available', siteResponse.value);

  // Verify internet connectivity for the selected news site
  const reachableSpinner = ora('Verificando conneción...').start();
  try {
    let siteIsReachable = await isReachable(siteResponse.value);
    if (siteIsReachable === true) {
      // Site is reachable
      reachableSpinner.succeed();

      // Continue down the chain, go to fetching article for selected news site
      return await getNews(siteResponse.value);
    } else {
      // Site unreachable, fail the spinner and throw an error
      reachableSpinner.fail('La connecíon falló! Favor de verificar la conectividad al internet.');
      throw new Error('Site unreachable');
    }
  } catch (err) {
    // Catch the site unreachable error, exit out
    process.exit(1);
  }
}

async function chooseArticle (articleChoices) {
  process.stdout.write(ansiEscapes.clearScreen);

  // Prompt the user to select an article given some choices
  logger('Choices %O', articleChoices);

  try {
    const articleResponse = await prompts({
      message: 'Escoge un artículo',
      choices: articleChoices
    });

    logger('Article choices response: %O', articleResponse);

    // Return to news site selection manually if the user chose to
    if (articleResponse.value === 'back') {
      await mainMenu();
    }

    // Continue down the chain
    return await getArticle(articleResponse.value);
  } catch (err) {
    // Crash on error
    process.exit(1);
  }
}

async function prepareImage (article) {
  // Verifies that the article parsed via Mercury has a lead image, and tries to fetch it
  if (article.lead_image_url) {
    const imageLoadingSpinner = ora('Descargando y preparando imágen...');
    try {
      logger('Working on image: %s', article.lead_image_url);

      imageLoadingSpinner.start();
      // Fetch the image using got
      const { body } = await got(article.lead_image_url, { encoding: null });

      // Prepare the image for displaying it in the terminal
      const articleImage = await terminalImage.buffer(body);
      imageLoadingSpinner.succeed();

      // Return prepared image
      return articleImage;
    } catch (err) {
      imageLoadingSpinner.warn('No se pudo desplegar la imágen!' + err.message);

      // Return no image
      return '';
    }
  } else {
    // Return no image
    return '';
  }
}

async function getArticle (articleUrl) {
  // Return parsed article
  const prepareArticleSpinner = ora('Cargando artículo...');

  // Get article from Mercury Parse
  try {
    prepareArticleSpinner.start();
    // Parse article
    const article = await Mercury.parse(articleUrl);
    prepareArticleSpinner.succeed();

    logger('Article: %O', article);

    // Return parsed article
    return article;
  } catch (err) {
    // Display warning in spinner and crash
    prepareArticleSpinner.fail(err.message);
    process.exit(1);
  }
}

async function getNews (newsSource) {
  // return candidate articles
  const articleChoices = [];

  logger('waiting for articles...');

  const articleLoadingSpinner = ora('Cargando titulares...');

  articleLoadingSpinner.start();
  try {
    const articles = await news(newsSource);

    for (let article of articles) {
      logger('Article: %O', article);
      articleChoices.push({ title: article.title, value: article.link });
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

async function mainMenu (articleChoices = null) {
  // Menu for picking a news site. Outputs the article chosen by the user.
  // If given an array of article choices, skips the step of choosing the site.
  let article = '';
  let articleImage = '';

  if (articleChoices !== null) {
    //
    try {
      // Returning flow, pick an article from the already chosen news site
      article = await chooseArticle(articleChoices);
      articleImage = await prepareImage(article);
    } catch (err) {
      // Crash on error
      process.exit(1);
    }
  } else {
    try {
      // First-time flow, pick a news site and then obtain article and image
      articleChoices = await chooseNewsSite();
      article = await chooseArticle(articleChoices);
      articleImage = await prepareImage(article);
    } catch (err) {
      // Crash on error
      process.exit(1);
    }
  }

  // Display the article
  console.log(`
    \n
    ${articleImage}
    \n
    \t\t\tTítulo: ${article.title}
    \t\t\tPublicado: ${formatDate(article.date_published, 'D/M/YYYY')}
    \t\t\tLeer en la web:  ${terminalLink(article.domain, article.url)}
    \n\n
    ${htmlToPlainText(article.content)}
    \n
  `);

  // Prompt the user after the article is displaying for what to do next
  try {
    const afterArticleResponse = await prompts({
      message: 'Opción',
      choices: [
        { title: 'Regresar a noticieros', value: '1' },
        { title: 'Regresar a artículos', value: '2' },
        { title: 'Salir', value: '3' }
      ]
    });

    // After displaying the article, give choices on how to proceed
    switch (afterArticleResponse.value) {
      // Go back to selecting a news site
      case '1':
        await mainMenu();
        break;

      // Go back to selecting an article
      case '2':
        process.stdout.write(ansiEscapes.clearScreen);
        await mainMenu(articleChoices);
        break;

      // Exit the CLI
      case '3':
        exit();
    }
  } catch (err) {
    process.exit(1);
  }
}

// Fancy font intro
cFonts.say('noticias|PR', {
  font: 'block',
  align: 'center',
  colors: ['system'],
  background: 'transparent',
  letterSpacing: 1,
  lineHeight: 1,
  space: true,
  maxLength: '0'
});

// Entrypoint
mainMenu();
