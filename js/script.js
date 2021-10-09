'use strict';

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorsSelector = '.post-author',
  titleList = document.querySelector(optTitleListSelector),
  articles = document.querySelectorAll(optArticleSelector);

let html = '';


function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;

  /* remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for (const activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  /* add class 'active' to the clicked link */
  clickedElement.classList.add('active');

  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts .active');

  for (const activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');

  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector)

  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
}


function clearTitles() {
  titleList.innerHTML = '';
}

function generateTitleLinks(customSelector = '') {
  const articles = document.querySelectorAll(optArticleSelector + customSelector);

  /* remove contents of titleList */
  clearTitles();

  let html = '';

  /* for each article */
  for (const article of articles) {
    /* get the article id */
    const articleId = article.getAttribute('id');

    /* find the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    /* create HTML of the link */
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';

    /* insert link into titleList */
    html = html + linkHTML;

  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');

  for (const link of links) {
    link.addEventListener('click', titleClickHandler);
  }

}

generateTitleLinks();


function generateTags() {

  /* START LOOP: for every article: */
  for (const article of articles) {
    /* find tags wrapper */
    const tagsWrapper = article.querySelector(optArticleTagsSelector);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    /* START LOOP: for each tag */
    for (let tag of articleTagsArray) {
      /* generate HTML of the link */
      const linkHTML = '<li><a href="#tag-' + tag + '"><span>' + tag + '</span></a></li>';
      /* add generated code to html variable */
      html = html + linkHTML;
      /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html;
    /* END LOOP: for every article: */
  }
}

generateTags();



function tagClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');

  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  /* find all tag links with class active */
  const tagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

  /* START LOOP: for each active tag link */
  for (const tagLink of tagLinks) {
    /* remove class active */
    tagLink.classList.remove('active');
    /* END LOOP: for each active tag link */
  }

  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagLinkshref = document.querySelectorAll('a[href="' + href + '"]')
  /* START LOOP: for each found taaddg link */

  for (const tagLinkhref of tagLinkshref) {
    /* add class active */
    tagLinkhref.classList.add('active');
  }
  /* END LOOP: for each found tag link *
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {
  /* find all links to tags */

  const tags = document.querySelectorAll('a[href^="#tag-"]');

  /* START LOOP: for each link */
  for (const tag of tags) {
    tag.addEventListener('click', tagClickHandler);
  }
}

function generateAuthors() {
  for (const article of articles) {

    const authorsWrapper = article.querySelector(optArticleAuthorsSelector);
    const articleAuthor = article.getAttribute('data-author');
    const linkHTML = '<a href="#author-' + articleAuthor + '"><span>' + articleAuthor + '</span></a></li>';
    authorsWrapper.innerHTML = linkHTML;

  }
}

generateAuthors();

function authorClickHandler() {

  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const author = href.replace('#author-', '');
  const authorLinks = document.querySelectorAll('a.active[href^="#author-"]');

  for (const authorLink of authorLinks) {
    authorLink.classList.remove('active');
  }

  const authorLinkshref = document.querySelectorAll('a[href="' + href + '"]');

  for (const authorLinkhref of authorLinkshref) {
    authorLinkhref.classList.add('active');
  }

  generateTitleLinks('[data-author="' + author + '"]');

}

function addClickListenersToAuthors() {

  const authors = document.querySelectorAll('a[href^="#author-"]');

  for (const author of authors) {
    author.addEventListener('click', authorClickHandler);
  }
}

addClickListenersToAuthors()