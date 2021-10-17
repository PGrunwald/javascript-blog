"use strict";

const templates = {
  articleLink: Handlebars.compile(
    document.querySelector("#template-article-link").innerHTML
  ),
  tagLink: Handlebars.compile(
    document.querySelector("#template-tag-link").innerHTML
  ),
  authorLink: Handlebars.compile(
    document.querySelector("#template-author-link").innerHTML
  ),
  tagCloudLink: Handlebars.compile(
    document.querySelector("#template-tag-cloud-link").innerHTML
  ),
  authorCloudLink: Handlebars.compile(
    document.querySelector("#template-author-cloud-link").innerHTML
  )
};

const optArticleSelector = ".post",
  optTitleSelector = ".post-title",
  optTitleListSelector = ".titles",
  optArticleTagsSelector = ".post-tags .list",
  optArticleAuthorsSelector = ".post-author",
  optTagsListSelector = ".tag.list",
  optAuthorsListSelector = ".author.list",
  optCloudClassCount = 5,
  optCloudClassPrefix = "tag-size-",
  titleList = document.querySelector(optTitleListSelector),
  articles = document.querySelectorAll(optArticleSelector);

let html = "";

function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;

  const activeLinks = document.querySelectorAll(".titles a.active");

  for (const activeLink of activeLinks) {
    activeLink.classList.remove("active");
  }

  clickedElement.classList.add("active");

  const activeArticles = document.querySelectorAll(".posts .active");

  for (const activeArticle of activeArticles) {
    activeArticle.classList.remove("active");
  }

  const articleSelector = clickedElement.getAttribute("href");

  const targetArticle = document.querySelector(articleSelector);

  targetArticle.classList.add("active");
}

function clearTitles() {
  titleList.innerHTML = "";
}

function generateTitleLinks(customSelector = "") {
  const articles = document.querySelectorAll(
    optArticleSelector + customSelector
  );

  clearTitles();

  let html = "";

  for (const article of articles) {
    const articleId = article.getAttribute("id");

    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    //const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';

    const linkHTMLData = {
      id: articleId,
      title: articleTitle
    };
    const linkHTML = templates.articleLink(linkHTMLData);

    html = html + linkHTML;
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll(".titles a");

  for (const link of links) {
    link.addEventListener("click", titleClickHandler);
  }
}

generateTitleLinks();

function calculateTagsParams(tags) {
  const params = {
    min: 9999,
    max: 0
  };

  for (let tag in tags) {
    if (tags[tag] > params.max) {
      params.max = tags[tag];
    } else if (tags[tag] < params.min) {
      params.min = tags[tag];
    }
  }
  return params;
}

function calculateTagClass(count, params) {
  if (count === 1 && params.min === 1) {
    return optCloudClassPrefix + 1;
  } else {
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);

    return optCloudClassPrefix + classNumber;
  }
}

function generateTags() {
  let allTags = {};
  const allTagsData = {
    tags: []
  };
  const tagList = document.querySelector(".tags");

  for (const article of articles) {
    const tagsWrapper = article.querySelector(optArticleTagsSelector);

    let html = "";

    const articleTags = article.getAttribute("data-tags");
    const articleTagsArray = articleTags.split(" ");

    for (let tag of articleTagsArray) {
      //const linkHTML = '<li><a href="#tag-' + tag + '"><span>' + tag + '</span></a></li>';
      const linkHTMLData = {
        id: tag,
        title: tag
      };
      const linkHTML = templates.tagLink(linkHTMLData);

      html = html + linkHTML;

      if (!allTags.hasOwnProperty(tag)) {
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }

      tagsWrapper.innerHTML = html;
    }
  }

  const tagsParams = calculateTagsParams(allTags);

  //let allTagsHTML = '';
  for (let tag in allTags) {
    //allTagsHTML += '<li><a class="'+calculateTagClass(allTags[tag], tagsParams)+'" href="#tag-' + tag + '"><span>' + tag + ' (' + allTags[tag] + ')</span></a></li>';

    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
  }

  console.log(allTagsData.tags);
  console.log(allTags);

  //tagList.innerHTML = allTagsHTML
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
}

generateTags();

function tagClickHandler(event) {
  event.preventDefault();

  const clickedElement = this;

  const href = clickedElement.getAttribute("href");

  const tag = href.replace("#tag-", "");

  const tagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

  for (const tagLink of tagLinks) {
    tagLink.classList.remove("active");
  }

  const tagLinkshref = document.querySelectorAll('a[href="' + href + '"]');

  for (const tagLinkhref of tagLinkshref) {
    tagLinkhref.classList.add("active");
  }

  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {
  const tags = document.querySelectorAll('a[href^="#tag-"]');

  for (const tag of tags) {
    tag.addEventListener("click", tagClickHandler);
  }
}
addClickListenersToTags();

function generateAuthors() {
  let allAuthors = {};
  const authorList = document.querySelector(".authors");

  for (const article of articles) {
    const authorsWrapper = article.querySelector(optArticleAuthorsSelector);
    const articleAuthor = article.getAttribute("data-author");
    let html = "";

    //const linkHTML = '<a href="#author-' + articleAuthor + '"><span>' + articleAuthor + '</span></a></li>';

    const linkHTMLData = {
      id: articleAuthor,
      title: articleAuthor
    };

    const linkHTML = templates.authorLink(linkHTMLData);

    html = html + linkHTML;
    authorsWrapper.innerHTML = html;

    if (!allAuthors.hasOwnProperty(articleAuthor)) {
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }
  }

  //let allAuthorsHTML = '';
  const allAuthorsData = { authors: [] };
  for (let author in allAuthors) {
    //allAuthorsHTML += '<li><a href="#author-' + author + '">' + author + ' (' + allAuthors[author] + ') ' + '</a></li> ';
    allAuthorsData.authors.push({
      author: author,
      count: allAuthors[author]
    });
  }

  //authorList.innerHTML = allAuthorsHTML;
  authorList.innerHTML = templates.authorCloudLink(allAuthorsData);
}
generateAuthors();

function authorClickHandler() {
  const clickedElement = this;
  const href = clickedElement.getAttribute("href");
  const author = href.replace("#author-", "");
  const authorLinks = document.querySelectorAll('a.active[href^="#author-"]');

  for (const authorLink of authorLinks) {
    authorLink.classList.remove("active");
  }

  const authorLinkshref = document.querySelectorAll('a[href="' + href + '"]');

  for (const authorLinkhref of authorLinkshref) {
    authorLinkhref.classList.add("active");
  }

  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors() {
  const authors = document.querySelectorAll('a[href^="#author-"]');

  for (const author of authors) {
    author.addEventListener("click", authorClickHandler);
  }
}

addClickListenersToAuthors();
