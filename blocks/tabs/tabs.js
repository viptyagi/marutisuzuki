export function createTabs($block) {
  const $ul = $block.querySelector('ul');
  if (!$ul) {
    return null;
  }

  /** @type TabInfo[] */
  const tabs = [...$ul.querySelectorAll('li')].map(($li) => {
    const title = $li.textContent;
    const name = title.toLowerCase().trim();
    return {
      title,
      name,
      $tab: $li,
    };
  });

  // move $ul below section div
  $block.replaceChildren($ul);

  // search referenced sections and move them inside the tab-container
  const $sections = document.querySelectorAll('[data-tab]');

  // Wrap sections in a container to allow sliding
  const $tabContentWrapper = document.createElement('div');
  $tabContentWrapper.classList.add('tab-content-wrapper');
  $sections.forEach(($tabContent) => {
    const name = $tabContent.dataset.tab.toLowerCase().trim();
    const tab = tabs.find((t) => t.name === name);
    if (tab) {
      $tabContent.classList.add('tab-item');
      tab.$content = $tabContent;
      $tabContentWrapper.appendChild($tabContent);
    }
  });

  $block.appendChild($tabContentWrapper);

  return tabs;
}

/**
 * @param {HTMLElement} $block
 */
export default function decorate($block) {
  const tabs = createTabs($block);
  const $tabContentWrapper = $block.querySelector('.tab-content-wrapper');

  tabs.forEach((tab, index) => {
    const $button = document.createElement('button');
    const { $tab, title, name } = tab;
    $button.textContent = title;
    $button.setAttribute('data-tab-index', index);
    $tab.replaceChildren($button);

    tab.$content.setAttribute('data-tab-index', index);

    $button.addEventListener('click', () => {
      const $activeButton = $block.querySelector('button.active');
      const $activeContent = $tabContentWrapper.querySelector('.tab-item.active');
      const blockPosition = $block.getBoundingClientRect().top;
      const offsetPosition = blockPosition + window.scrollY - 80;

      if ($activeButton !== $button) {
        $activeButton.classList.remove('active');
        $button.classList.add('active');

        if ($activeContent) {
          $activeContent.classList.remove('active');
          setTimeout(() => {
            tabs.forEach((t) => {
              if (name === t.name) {
                t.$content.classList.add('active');
              }
            });
          }, 300); // Wait for the sliding effect to complete
        } else {
          tabs.forEach((t) => {
            if (name === t.name) {
              t.$content.classList.add('active');
            }
          });
        }

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    });

    if (index === 0) {
      $button.classList.add('active');
      tab.$content.classList.add('active');
    }
  });
}
