/**
 *
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 *
 * Dependencies: None
 *
 * JS Version: ES2015/ES6
 *
 * JS Standard: ESlint
 *
*/

/**
 * Define Global Variables
 *
*/
const allSections = document.querySelectorAll('section');
const navList = document.querySelector('#navbar__list');
const topButton = document.querySelector('#btn');
const navBar = document.querySelector(".page__header");
/**
 * End Global Variables
 * Start Helper Functions
 *
*/

//Helper function to check whether or not certain element is in viewport, returns true or false
function isInViewport(element){
  const bounding = element.getBoundingClientRect();
  return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

//Helper function: scrolls to top when button is clicked
function scrollToTop(){
  console.log("button was clicked");
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });

}

//Helper function: shows "back to top" button when user scrolls to bottom
function scrollFunction() {
  const h = document.documentElement.scrollHeight - window.innerHeight - 500;

  //determine when we are at bottom of the page
  if (document.body.scrollTop >= h || document.documentElement.scrollTop >= h) {
    topButton.style.display = "block";
  } else {
    topButton.style.display = "none";
  }
}

//Hide navigation bar while not scrolling
function hideNavMenu(){
  const ph = document.querySelector(".page__header");
  var isScrolling;
  window.clearTimeout(isScrolling);

  isScrolling = setTimeout(function(){
    console.log("stoppeds scrolling.");
    ph.style.display = "none";
  }, 5000);

    ph.style.display = "block";
}


/**
 * End Helper Functions
 * Begin Main Functions
 *
*/

// build the navigation bar
function buildNav(){

  for(let i = 0; i < allSections.length; i++){

      //create new list item element with class menu__link
      const newLi = document.createElement("li");
      newLi.className = "menu__link";

      //create new anchor and set its href and text content
      const newAn = document.createElement("a");

      const string = "#" + allSections[i].getAttribute("id");
      newAn.setAttribute("href", string);
      newAn.textContent = allSections[i].getAttribute("data-nav");

      //append new anchor to new list item then new list item to navigation list
      newLi.appendChild(newAn);
      navList.appendChild(newLi);
  }

}

// Add active state to section that is in viewport, and additionally add active state to corresponding item on navigation menu
function addActive(){
  for(let i = 0; i < allSections.length; i++){
    //active state to navigation items, create string to select the corresponding item on navigation menu
    let s1 = '#' + allSections[i].getAttribute("id");
    let s2 = "a[href='"+ s1 +"']";
    let navItem = document.querySelector(s2);

    if(isInViewport(allSections[i])){
      allSections[i].classList.add('your-active-class');
      navItem.parentElement.classList.add('active');
    }
    else{
      allSections[i].classList.remove('your-active-class');
      navItem.parentElement.classList.remove('active');
    }
  }
}

// Scroll to anchor ID using scrollTO event (parameter is the clicked event target)
function scrollToAnchor(link){
  //get element from anchor id then scroll into its view smoothly
  const element = document.querySelector(link.getAttribute('href'));
  element.scrollIntoView({behavior: "smooth"});
}

/**
 * End Main Functions
 * Begin Events
 *
*/

// Build menu
document.addEventListener('DOMContentLoaded', buildNav());

// Scroll to section on link click
navList.addEventListener('click', function (evt) {
    evt.preventDefault();
    console.log('A link was clicked with text ' + evt.target.textContent);
    scrollToAnchor(evt.target);
});

// Set sections as active, and hide navigation bar when not scrolling
window.addEventListener('scroll', ()=>{
  addActive();
  hideNavMenu();
});

//Show "back to top" button
window.onscroll = function() {scrollFunction()};

//Scroll to top when button is clicked
topButton.addEventListener('click', scrollToTop);
