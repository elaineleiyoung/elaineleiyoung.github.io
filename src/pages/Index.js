import React from 'react';
import { Link } from 'react-router-dom';

import Main from '../layouts/Main';

const Index = () => (
  <Main
    description="Elaine Leiyoung — engineer, researcher, and occasional wanderer."
    fullPage
  >
    <div className="enter-hero">
      <div className="enter-inner">
        {/* <p className="enter-eyebrow">San Francisco</p> */}
        <h1 className="enter-name">Elaine Leiyoung</h1>
        <div className="enter-stroke" aria-hidden="true" />
        <p className="enter-tagline">
          I build things, ask questions,<br />
          and pay attention.
        </p>
        <nav className="enter-nav" aria-label="Pages">
          <Link to="/about">The Wanderer</Link>
          <span className="enter-sep" aria-hidden="true">·</span>
          <Link to="/record">The Record</Link>
          <span className="enter-sep" aria-hidden="true">·</span>
          <Link to="/craft">The Craft</Link>
          <span className="enter-sep" aria-hidden="true">·</span>
          <Link to="/observe">Observe</Link>
          <span className="enter-sep" aria-hidden="true">·</span>
          <Link to="/contact">Send Word</Link>
        </nav>
      </div>
    </div>
  </Main>
);

export default Index;
