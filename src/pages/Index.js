import React from 'react';
import { Link } from 'react-router-dom';

import Main from '../layouts/Main';

const Index = () => (
  <Main
    description={
      "Elaine Leiyoung's personal website. SF-based UC Berkeley New Grad, "
      + 'BA in Computer Science & Economics from Boston University, Master of Engineering in Industrial Engineering & Operations Research from UC Berkeley.'
    }
  >
    <article className="post" id="index">
      <header>
        <div className="title">
          <h2>
            {' '}
            Welcome to my website.
          </h2>
        </div>
      </header>
      <p>
        {' '}
        Please feel free to read more{' '}
        <Link to="/about">about me</Link>, or you can check out my{' '}
        <Link to="/resume">resume</Link>, <Link to="/projects">projects</Link>,{' '}
        <Link to="https://elaineleiyoung.github.io/photography/" reloadDocument>photography</Link>, or{' '}
        <Link to="/contact">contact</Link> me.
      </p>
      <p>
        {/* {' '}
        Source available{' '}
        <a href="https://github.com/mldangelo/personal-site">here</a>. */}
      </p>
    </article>
  </Main>
);

export default Index;
