/**
 * @typedef {Object} Position
 * Conforms to https://jsonresume.org/schema/
 *
 * @property {string} name - Name of the company
 * @property {string} position - Position title
 * @property {string} url - Company website
 * @property {string} startDate - Start date of the position in YYYY-MM-DD format
 * @property {string|undefined} endDate - End date of the position in YYYY-MM-DD format.
 * If undefined, the position is still active.
 * @property {string|undefined} summary - html/markdown summary of the position
 * @property {string[]} highlights - plain text highlights of the position (bulleted list)
 */
const work = [
  {
    name: 'Goldman Sachs',
    position: 'Engineering Summer Analyst Intern',
    url: 'https://www.goldmansachs.com/',
    startDate: '2024-06-17',
    endDate: '2024-08-16',
    highlights: [
      'Redesigned and uplifted divisional task tracking portal using React, Django (Python), Celery Distributed Task Queue, and MongoDB, adding search by ID functionality through 30,000 user triggered tasks to improve internal workflow.',
      'Created REST API endpoint and new interface to display millions of automated feed tasks (previously not accessible), expanding the firm’s task troubleshooting capabilities for 100+ internal users.',
      'Developed and implemented a new end-to-end untracked tasks feature that increased access to task information by 200% and followed design procedures by thoroughly understanding requirements, drafting and aligning design proposals, undergoing multiple design reviews, and successfully navigating the MR review and approval process.',
    ],
  },
  {
    name: 'Mobalytics',
    position: 'Gaming Market Research and Analytics Extern',
    url: 'https://mobalytics.gg/',
    startDate: '2024-04-01',
    endDate: '2024-06-01',
    highlights: [
      'Conducted in-depth analysis of various gaming genres, focusing on game mechanisms, key performance indicators (KPIs), revenue models, and player psychology to support strategic planning.',
      'Evaluated specific games within chosen genres to gain firsthand experience and qualitative insights, contributing to a comprehensive analysis.',
      'Summarized research findings and creatde compelling presentations, providing key takeaways and strategic recommendations for market expansion to align with Mobalytics vision and mission.',
    ],
  },
  {
    name: 'Boston University - Department of Computer Science',
    position: 'Undergraduate Researcher',
    url: 'http://bu.edu/cs',
    startDate: '2023-09-01',
    endDate: '2024-02-01',
    highlights: [
      'Formalized mathematical proofs and matrix operations using proof assistant Lean, creating easy-to-use and user-friendly library for educational settings.',
      'Developed Matrix constructor representations making it impossible to index out of bounds and implemented interface for warning messages, reducing user overhead.',
      'Established pretty-printing functionality, allowing students to view matrices and improve conceptualization.',
    ],
  },
  {
    name: 'Nutanix',
    position: 'Hybrid Cloud Data Engineer Intern',
    url: 'http://nutanix.com',
    startDate: '2023-06-01',
    endDate: '2023-08-01',
    highlights: [
      'Collaborated with the File System team to design and develop new features encompassing AWS S3 object stores, leveraging React, Flask, Snowflake, and Linux to allow users access to audit events and activity on S3 objects.',
      'Retrieved file activity and handled 100+ file audit events by implementing REST APIs, fetching data from Snowflake using SQL, and writing data library classes and tests using Python and Unittest.',
      'Leveraged Gerrit and Git for version control, allowing seamless integration of code changes while working on expanding and adding features to the product.',
    ],
  },
  {
    name: 'Major League Hacking',
    position: 'Production Engineering Fellow',
    url: 'https://fellowship.mlh.io/',
    startDate: '2022-06-01',
    endDate: '2022-08-01',
    highlights: [
      'Developed web app with Python, Flask, Jinja, and MySQL; automated testing and deployment with GitHub Actions; and set up container monitoring, alerting, and visualization using Prometheus and Grafana.',
      'Completed 12-weeks of Meta Production Engineering Track training requiring tmux, Bash scripting, regex, test-driven development, unit testing, system services, Docker, Nginx, and CI/CD.',
    ],
  },
];

export default work;
