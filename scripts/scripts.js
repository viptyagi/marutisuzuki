import {
  sampleRUM,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
  readBlockConfig,
  buildBlock,
} from './aem.js';

const LCP_BLOCKS = []; // add your LCP blocks to the list

/**
 * Moves all the attributes from a given element to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveAttributes(from, to, attributes) {
  if (!attributes) {
    // eslint-disable-next-line no-param-reassign
    attributes = [...from.attributes].map(({ nodeName }) => nodeName);
  }
  attributes.forEach((attr) => {
    const value = from.getAttribute(attr);
    if (value) {
      to.setAttribute(attr, value);
      from.removeAttribute(attr);
    }
  });
}

/**
 * Move instrumentation attributes from a given element to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveInstrumentation(from, to) {
  moveAttributes(
    from,
    to,
    [...from.attributes]
      .map(({ nodeName }) => nodeName)
      .filter((attr) => attr.startsWith('data-aue-') || attr.startsWith('data-richtext-')),
  );
}

/**
 * Load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Builds tabs from sections in the main container.
 * @param {Element} main The container element
 */
 function buildTabs(main) {
   const tabs = [...main.querySelectorAll(':scope > div')]
     .map((section) => {
       const sectionMeta = section.querySelector('div.section-metadata');
       if (sectionMeta) {
         const meta = readBlockConfig(sectionMeta);
         if (meta.tab) {
          return [section, meta.tab];
         }
        //  if (meta.style) {
        //   return [section, meta.style];
        //  }
       }
       return null;
     })
     .filter((el) => !!el);
   if (tabs.length) {
     const section = document.createElement('div');
     section.className = 'section';
     const ul = document.createElement('ul');
     ul.append(...tabs
       .map(([, tab]) => {
         const li = document.createElement('li');
         li.innerText = tab;
         return li;
       }));
     const tabsBlock = buildBlock('tabs', [[ul]]);
     section.append(tabsBlock);
     tabs[0][0].insertAdjacentElement('beforebegin', section);
   }
 }

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
     buildTabs(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
export function decorateMain(main) {
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Run template specific decoration code.
 * @param {Element} main The container element
 * @author ashishrajconcentrix
 */
async function decorateTemplates() {
  const block = document.querySelector('main > div.section.nexa-cars');
  try {
        const cssLoaded = loadCSS(`${window.hlx.codeBasePath}/blocks/nexa-cars/nexa-cars.css`);
        const decorationComplete = new Promise((resolve) => {
          (async () => {
            try {
              const mod = await import(
                `${window.hlx.codeBasePath}/blocks/nexa-cars/nexa-cars.js`
              );
              if (mod.default) {
                await mod.default(block);
              }
            } catch (error) {
              // eslint-disable-next-line no-console
              console.log('failed to load module for nexa-cars', error);
            }
            resolve();
          })();
        });
        await Promise.all([cssLoaded, decorationComplete]);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('failed to load block nexa-cars', error);
      }
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    await decorateTemplates(main);
    decorateMain(main);
    document.body.classList.add('appear');
    await waitForLCP(LCP_BLOCKS);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();

  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  window.setTimeout(() => import('./delayed.js'), 3000);
  import('./sidekick.js').then(({ initSidekick }) => initSidekick());
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
