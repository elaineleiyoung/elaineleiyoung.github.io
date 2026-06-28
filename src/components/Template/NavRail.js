import React, { useEffect, useRef } from 'react';

// Section definitions: target = where clicking scrolls, active = threshold
const NAV_SECTIONS = [
  {
    id: 'arrival',
    label: 'Arrival',
    target: 0,
    active: 0,
  },
  {
    id: 'writing',
    label: 'The Wanderer',
    target: 0.20,
    active: 0.18,
  },
  {
    id: 'work',
    label: 'Works',
    target: 0.66,
    active: 0.58,
  },
  {
    id: 'contact',
    label: 'Contact',
    target: 0.90,
    active: 0.83,
  },
];

const NavRail = () => {
  const dotRefs = useRef([]);

  useEffect(() => {
    let rafId;
    let prog = 0;
    let target = 0;

    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      target = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };

    const tick = () => {
      prog += (target - prog) * 0.06;

      // Determine active section: last one whose 'active' threshold ≤ progress
      let activeIdx = 0;
      for (let i = 0; i < NAV_SECTIONS.length; i += 1) {
        if (prog >= NAV_SECTIONS[i].active) activeIdx = i;
      }

      for (let i = 0; i < dotRefs.current.length; i += 1) {
        const el = dotRefs.current[i];
        if (el) {
          if (i === activeIdx) {
            el.classList.add('active');
          } else {
            el.classList.remove('active');
          }
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    rafId = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const scrollTo = (targetProgress) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: targetProgress * maxScroll, behavior: 'smooth' });
  };

  return (
    <nav className="nav-rail" aria-label="Journey sections">
      <ul className="nav-rail-list">
        {NAV_SECTIONS.map((section, i) => (
          <li key={section.id}>
            <button
              type="button"
              ref={(el) => { dotRefs.current[i] = el; }}
              className="nav-rail-item"
              onClick={() => scrollTo(section.target)}
              aria-label={`Go to ${section.label}`}
            >
              <span className="nav-rail-dot" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavRail;
