function initActiveNav() {
  const links = Array.from(
    document.querySelectorAll<HTMLAnchorElement>('[data-nav]'),
  );
  if (links.length === 0) return;

  const sections = links
    .map((link) => {
      const id = link.dataset.nav;
      return id ? document.getElementById(id) : null;
    })
    .filter((section): section is HTMLElement => Boolean(section));

  if (sections.length === 0) return;

  const setActive = (id: string) => {
    for (const link of links) {
      const isActive = link.dataset.nav === id;
      if (isActive) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    }
  };

  for (const link of links) {
    link.addEventListener('click', () => {
      const id = link.dataset.nav;
      if (id) setActive(id);
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      const top = visible[0]?.target;
      if (top?.id) setActive(top.id);
    },
    {
      rootMargin: '-35% 0px -45% 0px',
      threshold: [0, 0.1, 0.25, 0.5, 0.75],
    },
  );

  for (const section of sections) observer.observe(section);

  const hash = window.location.hash.replace('#', '');
  setActive(hash && sections.some((s) => s.id === hash) ? hash : sections[0].id);
}

function initProjectsToggle() {
  const toggle = document.querySelector<HTMLButtonElement>('[data-projects-toggle]');
  const panel = document.querySelector<HTMLElement>('[data-projects-panel]');
  if (!toggle || !panel) return;

  const label = toggle.querySelector('span');
  const textNode = label?.childNodes[0];

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    const next = !expanded;
    toggle.setAttribute('aria-expanded', String(next));
    panel.hidden = !next;
    if (textNode) {
      textNode.textContent = next ? 'Show fewer projects' : 'View Full Project Archive';
    }
  });
}

function init() {
  initActiveNav();
  initProjectsToggle();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
