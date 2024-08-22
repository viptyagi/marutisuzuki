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

    // move the tab's sections before the tab riders.
    [...$sections].forEach(($tabContent) => {
      const name = $tabContent.dataset.tab.toLowerCase().trim();
      const tab = tabs.find((t) => t.name === name);
      if (tab) {
        $tabContent.classList.add('tab-item', 'hidden');
        tab.$content = $tabContent;
      }
    });
    return tabs;
  }

  /**
   * @param {HTMLElement} $block
   */
  export default function decorate($block) {
    const tabs = createTabs($block);

    tabs.forEach((tab, index) => {
      const $button = document.createElement('button');
      const { $tab, title, name } = tab;
      $button.textContent = title;
      $button.setAttribute('data-tab-index', index);
      $tab.replaceChildren($button);

      tab.$content.setAttribute('data-tab-index', index);

      $button.addEventListener('click', () => {
        const $activeButton = $block.querySelector('button.active');
        const blockPosition = $block.getBoundingClientRect().top;
        const offsetPosition = blockPosition + window.scrollY - 80;

        if ($activeButton !== $tab) {
          $activeButton.classList.remove('active');
          $button.classList.add('active');

          tabs.forEach((t) => {
            if (name === t.name) {
              t.$content.classList.remove('hidden');
            } else {
              t.$content.classList.add('hidden');
            }
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth',
            });
          });
        }
      });

      if (index === 0) {
        $button.classList.add('active');
        tab.$content.classList.remove('hidden');
      }
    });
  }
