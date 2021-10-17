'use strict';

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorsSelector = '.post-author',
  optTagsListSelector = '.tag.list',
  optAuthorsListSelector='.author.list',
  optCloudClassCount=5,
  optCloudClassPrefix='tag-size-',
  titleList = document.querySelector(optTitleListSelector),
  articles = document.querySelectorAll(optArticleSelector);

let html = '';


function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;

  const activeLinks = document.querySelectorAll('.titles a.active');

  for (const activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  clickedElement.classList.add('active');

  const activeArticles = document.querySelectorAll('.posts .active');

  for (const activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  const articleSelector = clickedElement.getAttribute('href');

  const targetArticle = document.querySelector(articleSelector)

  targetArticle.classList.add('active');
}


function clearTitles() {
  titleList.innerHTML = '';
}

function generateTitleLinks(customSelector = '') {
  const articles = document.querySelectorAll(optArticleSelector + customSelector);

  clearTitles();

  let html = '';

  for (const article of articles) {

    const articleId = article.getAttribute('id');

    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';

    html = html + linkHTML;
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');

  for (const link of links) {
    link.addEventListener('click', titleClickHandler);
  }

}

generateTitleLinks();

function calculateTagsParams(tags) {
  const params = {
    min: 9999,
    max: 0,
  };

  for (let tag in tags) {
    if (tags[tag] > params.max) {
      params.max = tags[tag];
    }
    else if (tags[tag] < params.min) {
      params.min = tags[tag]
    }
  }
  return params;
}

function calculateTagClass(count,params){
 
  if(count === 1 && params.min === 1) {
    return optCloudClassPrefix + 1
  } else {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );
 
  return optCloudClassPrefix + classNumber  ;
  }
}

function generateTags() {
  let allTags = {};

  for (const article of articles) {

    const tagsWrapper = article.querySelector(optArticleTagsSelector);
   
    let html = '';
  
    const articleTags = article.getAttribute('data-tags');
   
    const articleTagsArray = articleTags.split(' ');
   
    for (let tag of articleTagsArray) {

      const linkHTML = '<li><a href="#tag-' + tag + '"><span>' + tag + '</span></a></li>';

      html = html + linkHTML;

      if (!allTags.hasOwnProperty(tag)) {
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }

      tagsWrapper.innerHTML = html;

      const tagList = document.querySelector('.tags');

      const tagsParams = calculateTagsParams(allTags);

      let allTagsHTML = '';
      for (let tag in allTags) {
        allTagsHTML += '<li><a class="'+calculateTagClass(allTags[tag], tagsParams)+'" href="#tag-' + tag + '"><span>' + tag + ' (' + allTags[tag] + ')</span></a></li>';
      }
      
      tagList.innerHTML = allTagsHTML
    }
  }
}

generateTags();

function tagClickHandler(event) {
  
  event.preventDefault();
  
  const clickedElement = this;

  const href = clickedElement.getAttribute('href');

  const tag = href.replace('#tag-', '');

  const tagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

  for (const tagLink of tagLinks) {
    
    tagLink.classList.remove('active');
  }

  const tagLinkshref = document.querySelectorAll('a[href="' + href + '"]')

  for (const tagLinkhref of tagLinkshref) {
 
    tagLinkhref.classList.add('active');
  }

  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {

  const tags = document.querySelectorAll('a[href^="#tag-"]');

  for (const tag of tags) {
    tag.addEventListener('click', tagClickHandler);
  }
}
addClickListenersToTags()

function generateAuthors() {

  let allAuthors = {};

  for (const article of articles) {

    const authorsWrapper = article.querySelector(optArticleAuthorsSelector);
    const articleAuthor = article.getAttribute('data-author');
    let html = '';

    const linkHTML = '<a href="#author-' + articleAuthor + '"><span>' + articleAuthor + '</span></a></li>';
    html = html + linkHTML;
    authorsWrapper.innerHTML = html;

    if (!allAuthors.hasOwnProperty(articleAuthor)) {
        allAuthors[articleAuthor] = 1;
    } else {
        allAuthors[articleAuthor]++;
    }

    const authorList = document.querySelector('.authors');
  
    let allAuthorsHTML = '';
    
    for (let author in allAuthors) {
     allAuthorsHTML += '<li><a href="#author-' + author + '">' + author + ' (' + allAuthors[author] + ') ' + '</a></li> ';
    }

    authorList.innerHTML = allAuthorsHTML;
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

addClickListenersToAuthors();