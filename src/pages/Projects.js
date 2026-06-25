import React from 'react';
import { Link } from 'react-router-dom';

import Main from '../layouts/Main';
import Cell from '../components/Projects/Cell';
import data from '../data/projects';

const Projects = () => (
  <Main title="The Craft" description="Projects by Elaine Leiyoung.">
    <article className="post" id="projects">
      <header>
        <div className="title">
          <h2>
            <Link to="/craft">The Craft</Link>
          </h2>
          <p>Things I have made.</p>
        </div>
      </header>
      <div className="projects-grid">
        {data.map((project) => (
          <Cell data={project} key={project.title} />
        ))}
      </div>
    </article>
  </Main>
);

export default Projects;
