import React from 'react';
import { Link } from 'react-router-dom';

import Main from '../layouts/Main';
import ContactIcons from '../components/Contact/ContactIcons';

const Contact = () => (
  <Main
    title="Send Word"
    description="Contact Elaine Leiyoung."
  >
    <article className="post" id="contact">
      <header>
        <div className="title">
          <h2>
            <Link to="/contact">Send Word</Link>
          </h2>
        </div>
      </header>
      <div className="email-at">
        <p>Reach me at:</p>
        <a href="mailto:elaine_leiyoung@berkeley.edu">elaine_leiyoung@berkeley.edu</a>
      </div>
      <ContactIcons />
    </article>
  </Main>
);

export default Contact;
