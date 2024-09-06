import React from 'react';
import { Link } from 'react-router-dom';

import ContactIcons from '../Contact/ContactIcons';

const { PUBLIC_URL } = process.env; // set automatically from package.json:homepage

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
        Hi, I&apos;m Elaine. I am a{' '}
        Masters student at<a href="https://grad.berkeley.edu/">UC Berkeley</a>, pursuing my degree in
        <a href="https://ieor.berkeley.edu/"> Industrial Engineering and Operations Research</a>, with a concentration in
        <a href="https://ieor.berkeley.edu/academics/master-of-engineering/concentrations/"> Fintech</a>.
      </p>
      <ul className="actions">
        <li>
          {!window.location.pathname.includes('/resume') ? (
            <Link to="/resume" className="button">
              Learn More
            </Link>
          ) : (
            <Link to="/about" className="button">
              About Me
            </Link>
          )}
        </li>
      </ul>
    </section>

    <section id="footer">
      <ContactIcons />
      <p className="copyright">
        &copy; Elaine Leiyoung <Link to="/">elaineleiyoung.github.io</Link>.
      </p>
    </section>
  </section>
);

export default SideBar;
