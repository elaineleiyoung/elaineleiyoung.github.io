import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import Markdown from 'markdown-to-jsx';

import NavRail from '../components/Template/NavRail';
import ContactIcons from '../components/Contact/ContactIcons';
import projectsData from '../data/projects';

// Each section's visible progress window [start, end] with a fade margin
const SECTIONS = [
  { start: 0.00, end: 0.15, fade: 0.05 }, // Arrival
  { start: 0.18, end: 0.53, fade: 0.05 }, // The Wanderer
  { start: 0.58, end: 0.78, fade: 0.05 }, // The Craft
  { start: 0.83, end: 1.00, fade: 0.05 }, // Send Word
];

function calcOpacity(p, start, end, fade) {
  if (p < start - fade || p > end + fade) return 0;
  if (p >= start && p <= end) return 1;
  if (p < start) return (p - (start - fade)) / fade;
  return (end + fade - p) / fade;
}

const Journey = () => {
  const [markdown, setMarkdown] = useState('');
  const sectRefs = useRef([null, null, null, null]);

  useEffect(() => {
    import('../data/about.md').then((res) => {
      fetch(res.default).then((r) => r.text()).then(setMarkdown);
    });
  }, []);

  // Drive overlay visibility via direct DOM writes (no setState → no re-renders)
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
      const refs = sectRefs.current;
      SECTIONS.forEach(({ start, end, fade }, i) => {
        const el = refs[i];
        if (!el) return;
        const op = calcOpacity(prog, start, end, fade);
        el.style.opacity = op;
        el.style.visibility = op > 0.01 ? 'visible' : 'hidden';
        el.style.pointerEvents = op > 0.4 ? 'auto' : 'none';
      });
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    rafId = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const setRef = (i) => (el) => {
    sectRefs.current[i] = el;
  };

  return (
    <>
      <Helmet>
        <title>Elaine Leiyoung</title>
        <meta
          name="description"
          content="Elaine Leiyoung — engineer, researcher, and occasional wanderer."
        />
      </Helmet>
      <NavRail />

      {/* 500vh tall scroll driver — creates the scroll space the camera reads */}
      <div className="scroll-driver">

        {/* ── Arrival ─────────────────────────────────────────────────────── */}
        <section
          ref={setRef(0)}
          className="journey-overlay arrival-overlay"
          aria-label="Arrival"
          style={{ opacity: 1, visibility: 'visible' }}
        >
          <div className="arrival-inner">
            {/* <p className="arrival-eyebrow">Thus I draw from
            the absurd three consequences, which are</p> */}
            <div className="arrival-stroke" aria-hidden="true" />
            <h1 className="arrival-name">Elaine Leiyoung</h1>
            <div className="arrival-stroke" aria-hidden="true" />
            <p className="arrival-tagline">
              Thus I draw from the absurd three consequences, which are
              <br />
              <b>my revolt, my freedom, and my passion.</b>
              <br />
              - Albert Camus
            </p>
            <p className="scroll-hint" aria-hidden="true">↓</p>
          </div>
        </section>

        {/* ── The Wanderer ─────────────────────────────────────────────────── */}
        <section
          ref={setRef(1)}
          className="journey-overlay writing-overlay"
          aria-label="The Wanderer"
          style={{ opacity: 0, visibility: 'hidden', pointerEvents: 'none' }}
        >
          <div className="writing-inner">
            <h2 className="section-title">The Wanderer</h2>
            <div className="writing-content">
              <Markdown>{markdown}</Markdown>
            </div>
          </div>
        </section>

        {/* ── The Craft ────────────────────────────────────────────────────── */}
        <section
          ref={setRef(2)}
          className="journey-overlay work-overlay"
          aria-label="The Craft"
          style={{ opacity: 0, visibility: 'hidden', pointerEvents: 'none' }}
        >
          <div className="work-inner">
            <h2 className="section-title">The Craft</h2>
            <div className="craft-grid">
              {projectsData.map((project) => (
                <div key={project.title} className="craft-card">
                  <h3 className="craft-card-title">{project.title}</h3>
                  <p className="craft-card-sub">{project.subtitle}</p>
                  <p className="craft-card-desc">{project.desc}</p>
                  {project.link && (
                    <a
                      href={project.link}
                      className="craft-card-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Send Word ────────────────────────────────────────────────────── */}
        <section
          ref={setRef(3)}
          className="journey-overlay contact-overlay"
          aria-label="Send Word"
          style={{ opacity: 0, visibility: 'hidden', pointerEvents: 'none' }}
        >
          <div className="contact-inner">
            <h2 className="section-title">Send Word</h2>
            <a
              href="mailto:elaine_leiyoung@berkeley.edu"
              className="contact-email"
            >
              elaine_leiyoung@berkeley.edu
            </a>
            <ContactIcons />
          </div>
        </section>

      </div>
    </>
  );
};

export default Journey;
