import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';

import NavRail from '../components/Template/NavRail';
import ContactIcons from '../components/Contact/ContactIcons';
import { CONTACT_QUOTE } from '../data/contact';
import {
  QUOTE, TABS, BACKGROUND, EXPERIENCES, CURRENT,
} from '../data/about';
import {
  WORKS_QUOTE, PHOTOGRAPHY, SUBSTACK, CODE,
} from '../data/works';

// Each section's visible progress window [start, end] with a fade margin
const SECTIONS = [
  { start: 0.00, end: 0.15, fade: 0.05 }, // Arrival
  { start: 0.18, end: 0.53, fade: 0.05 }, // The Wanderer
  { start: 0.58, end: 0.78, fade: 0.05 }, // The Craft
  { start: 0.83, end: 1.00, fade: 0.05 }, // Contact
];

function calcOpacity(p, start, end, fade) {
  if (p < start - fade || p > end + fade) return 0;
  if (p >= start && p <= end) return 1;
  if (p < start) return (p - (start - fade)) / fade;
  return (end + fade - p) / fade;
}

const Journey = () => {
  const [activeTab, setActiveTab] = useState('quote');
  const sectRefs = useRef([null, null, null, null]);

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

        <section
          ref={setRef(0)}
          className="journey-overlay arrival-overlay"
          aria-label="Arrival"
          style={{ opacity: 1, visibility: 'visible' }}
        >
          <div className="arrival-inner" style={{ fontSize: '0.9em' }}>
            <div className="arrival-stroke" aria-hidden="true" />
            <h1 className="arrival-name">Elaine Leiyoung</h1>
            <div className="arrival-stroke" aria-hidden="true" />
            <p className="arrival-tagline">
              Here is the little stone, smooth as an asphodel.
              <br />
              It is at the beginning of everything.
              <br />
              <p3>
                - Albert Camus
              </p3>
            </p>
            <p className="scroll-hint" aria-hidden="true">↓</p>
          </div>
        </section>

        {/* ── About Section ─────────────────────────────────────────────────── */}
        <section
          ref={setRef(1)}
          className="journey-overlay writing-overlay"
          aria-label="About"
          style={{ opacity: 0, visibility: 'hidden', pointerEvents: 'none' }}
        >
          <div className="writing-inner">

            {/* Tab bar */}
            <nav className="about-tabs" aria-label="About sections">
              {TABS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  className={`about-tab${activeTab === id ? ' active' : ''}`}
                  onClick={() => setActiveTab(id)}
                >
                  {label}
                </button>
              ))}
            </nav>

            {/* All panels rendered simultaneously; grid stacking keeps height = tallest panel */}
            <div className="about-body">

              <div className={`about-panel${activeTab === 'quote' ? ' active' : ''}`}>
                <blockquote className="about-quote">{QUOTE.text}</blockquote>
                <cite className="about-cite">
                  {'— '}
                  {QUOTE.author}
                  {', '}
                  <em>{QUOTE.work}</em>
                </cite>
              </div>

              <div className={`about-panel${activeTab === 'background' ? ' active' : ''}`}>
                <div className="about-text">
                  {BACKGROUND.map((para) => (
                    <p key={para.slice(0, 32)}>{para}</p>
                  ))}
                </div>
              </div>

              <div className={`about-panel${activeTab === 'experiences' ? ' active' : ''}`}>
                <ul className="about-exp-list">
                  {EXPERIENCES.map((exp) => (
                    <li key={exp.title} className="about-exp-item">
                      <p className="about-exp-title">{exp.title}</p>
                      <p className="about-exp-meta">
                        {exp.org}
                        {' · '}
                        {exp.period}
                      </p>
                      <p className="about-exp-desc">{exp.desc}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`about-panel${activeTab === 'current' ? ' active' : ''}`}>
                <div className="about-text">
                  {CURRENT.map((para) => (
                    <p key={para.slice(0, 32)}>{para}</p>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Works ────────────────────────────────────────────────────────── */}
        <section
          ref={setRef(2)}
          className="journey-overlay works-overlay"
          aria-label="Works"
          style={{ opacity: 0, visibility: 'hidden', pointerEvents: 'none' }}
        >
          <div className="works-inner">

            <div className="works-header">
              <blockquote className="works-quote">{WORKS_QUOTE.text}</blockquote>
              <cite className="works-cite">
                {'— '}
                {WORKS_QUOTE.author}
                {', '}
                <em>{WORKS_QUOTE.work}</em>
              </cite>
            </div>

            <div className="works-cards">

              <div className="works-card">
                <p className="works-card-label">Photography</p>
                <p className="works-card-desc">{PHOTOGRAPHY.desc}</p>
                <a
                  href={PHOTOGRAPHY.url}
                  className="works-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {PHOTOGRAPHY.label}
                  {' →'}
                </a>
              </div>

              <div className="works-card">
                <p className="works-card-label">Writing</p>
                <ul className="works-post-list">
                  {SUBSTACK.posts.map((post) => (
                    <li key={post.title} className="works-post-item">
                      <a
                        href={post.url}
                        className="works-post-title"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {post.title}
                      </a>
                      <span className="works-post-date">{post.date}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={SUBSTACK.url}
                  className="works-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View all on Substack
                  {' →'}
                </a>
              </div>

              <div className="works-card">
                <p className="works-card-label">Code</p>
                <ul className="works-post-list">
                  {CODE.repos.map((repo) => (
                    <li key={repo.name + repo.desc} className="works-post-item">
                      <a
                        href={repo.url}
                        className="works-post-title"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {repo.name}
                      </a>
                      <span className="works-post-date">{repo.lang}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={CODE.githubUrl}
                  className="works-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View GitHub
                  {' →'}
                </a>
              </div>

            </div>
          </div>
        </section>

        {/* ── Contact ──────────────────────────────────────────────────────── */}
        <section
          ref={setRef(3)}
          className="journey-overlay contact-overlay"
          aria-label="Contact"
          style={{ opacity: 0, visibility: 'hidden', pointerEvents: 'none' }}
        >
          <div className="contact-inner">
            <blockquote className="works-quote">{CONTACT_QUOTE.text}</blockquote>
            <cite className="works-cite">
              {'— '}
              {CONTACT_QUOTE.author}
              {', '}
              <em>{CONTACT_QUOTE.work}</em>
            </cite>
            <div className="contact-divider" />
            <a
              href="mailto:elaineleiyoung@gmail.com"
              className="contact-email"
            >
              elaineleiyoung@gmail.com
            </a>
            <ContactIcons />
          </div>
        </section>

      </div>
    </>
  );
};

export default Journey;
