import React, { useEffect } from 'react';

import Main from '../layouts/Main';

const Observe = () => {
  useEffect(() => {
    window.location.href = 'https://elaineleiyoung.github.io/photography/';
  }, []);

  return (
    <Main title="Observe" description="Photography by Elaine Leiyoung.">
      <article className="post" id="observe">
        <header>
          <div className="title">
            <h2>Observe</h2>
          </div>
        </header>
        <p>
          Redirecting to photography portfolio&hellip;{' '}
          <a href="https://elaineleiyoung.github.io/photography/">
            Click here if you are not redirected.
          </a>
        </p>
      </article>
    </Main>
  );
};

export default Observe;
