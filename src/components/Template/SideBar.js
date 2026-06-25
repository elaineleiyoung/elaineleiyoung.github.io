import React from 'react';
import { Link } from 'react-router-dom';

import ContactIcons from '../Contact/ContactIcons';

const { PUBLIC_URL } = process.env;

const SideBar = () => (
  <section id="sidebar">
    <section id="intro">
      <Link to="/" className="logo">
        <img src={`${PUBLIC_URL}/images/me.jpg`} alt="" />
      </Link>
      <header>
        <h2>Elaine Leiyoung</h2>
        <p>
          <a href="mailto:elaine_leiyoung@berkeley.edu">elaine_leiyoung@berkeley.edu</a>
        </p>
      </header>
    </section>

    <section className="blurb">
      <h2>About</h2>
      <p>
        Engineer and researcher based in San Francisco.
        MEng at <a href="https://ieor.berkeley.edu/">UC Berkeley IEOR</a>,
        previously CS &amp; Economics at Boston University.
      </p>
      <ul className="actions">
        <li>
          {!window.location.pathname.includes('/record') ? (
            <Link to="/record" className="button">The Record</Link>
          ) : (
            <Link to="/about" className="button">The Wanderer</Link>
          )}
        </li>
      </ul>
    </section>

    <section id="footer">
      <ContactIcons />
      <p className="copyright">
        &copy; Elaine Leiyoung &mdash; <Link to="/">elaineleiyoung.github.io</Link>
      </p>
    </section>
  </section>
);

export default SideBar;
