import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const navConfig = {
  'NEXA CARS': {
        type: 'list',
        items: [
          { name: 'Service 1', url: '/service1' },
          { name: 'Service 2', url: '/service2' },
          { name: 'Service 3', url: '/service3' },
          { name: 'Service 4', url: '/service4' },
        ],
      },
      'BUYER GUIDE': {
        type: 'grid',
        items: [
          {
            name: 'Product 1', image: 'Showroom-locator.jpg', url: '/product1', details: 'Details about product 1',
          },
          {
            name: 'Product 2', image: 'Showroom-locator2.jpg', url: '/product1', details: 'Details about product 2',
          },
        ],
      },
    };

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');
function generateList(config) {
    if (config) {
        const content = document.createElement(config.type === 'list' ? 'ul' : 'div');
        if (config.type === 'list') {
          config.items.forEach((item) => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = item.url;
            link.textContent = item.name;
            content.className = 'nav-list-items';
            listItem.appendChild(link);
            content.appendChild(listItem);
          });
        } else if (config.type === 'grid') {
          config.items.forEach((item) => {
            const gridItem = document.createElement('div');
            const image = document.createElement('img');
            image.alt = item.name;
            image.src = item.image;
            gridItem.appendChild(image);
            content.className = 'img-list-items';
            content.appendChild(gridItem);
          });
          return content;
        }
    }
}

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
* Toggles all nav sections
* @param {Element} sections The container element
* @param {Boolean} expanded Whether the element should be expanded or collapsed
*/
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
* Toggles the entire nav
* @param {Element} nav The container element
* @param {Element} navSections The nav sections within the container element
* @param {*} forceExpanded Optional param to force nav expand behavior when not null
*/
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('role', 'button');
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('role');
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }
  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}

/**
* loads and decorates the header, mainly the nav
* @param {Element} block The header block element
*/
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

const navSections = nav.querySelector('.nav-sections');
if (navSections) {
  navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
    if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
    navSection.addEventListener('click', () => {
      if (isDesktop.matches) {
        const expanded = navSection.getAttribute('aria-expanded') === 'true';
        toggleAllNavSections(navSections);
        navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      }
    });

    // Create and append the headerShadowCard div
   let headerShadowCard = document.createElement('div'); // Renamed the variable
    // headerShadowCard.className = 'header-shadow-card';
    // headerShadowCard.innerHTML = '<p>This is the header shadow card content.</p>';
    // Replace with your actual content
    // headerShadowCard.style.display = 'none';
    // navSection.appendChild(headerShadowCard);

    // Handle hover event to toggle the visibility of the header-shadow-card div
    const navTitle = navSection.textContent.trim();
    navSection.addEventListener('mouseenter', () => {
      if (isDesktop.matches) {
        const expanded = navSection.getAttribute('aria-expanded') === 'true';
        navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        const content = generateList(navConfig[navTitle]);
        headerShadowCard.innerHTML = '';
        headerShadowCard = navSection.appendChild(content);
        headerShadowCard.style.display = 'block';
      }
    });

    navSection.addEventListener('mouseleave', () => {
      if (isDesktop.matches) {
        navSection.setAttribute('aria-expanded', false);
        headerShadowCard.remove();
      }
    });
  });
}

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
