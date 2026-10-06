/**
 * ─────────────────────────────────────────────────────────────
 *  PROJECTS
 *  Add, remove or reorder objects — the UI adapts automatically.
 *
 *  Required:  slug, title, category, year, description, technologies
 *  Optional:  image, github, live, featured, accent, cover, details …
 *
 *  • `placeholder: true` shows a striped "REPLACE ME" sticker on the
 *    card + case study. Set it to false once the content is real.
 *  • `image` — put screenshots in /public/images/projects/ and use a
 *    path like '/images/projects/my-project.webp'. Leave it '' and a
 *    generative cover is drawn instead (see `cover`).
 *  • `accent` — one of: pink | coral | yellow | lime | purple
 *  • `cover`  — generative placeholder style:
 *               grid | rings | bars | dots | wave | bloom
 *  • `github` / `live` — leave '' to hide the button.
 * ─────────────────────────────────────────────────────────────
 */

export const projects = [
  {
    slug: 'Research Project',
    placeholder: true,
    title: 'Secure DSS using SHA-256 Share Authentication',
    titleLines: ['DSS', 'using', 'SHA-256'],
    tags: ['Research','Education', 'Social Impact'],
    year: '2026',
    type: 'Team project',
    description:
  'A Document Secret Sharing system that splits any file into n shares using Shamir\'s (k,n) scheme, so any k shares rebuild it exactly and fewer reveal nothing. Every share is SHA-256 authenticated, and a Tkinter GUI handles splitting and reconstruction.',
technologies: ['Python', 'Shamir Secret Sharing', 'SHA-256', 'Tkinter'],
image: '/images/projects/cover.png',
github: 'https://github.com/muskaanjaggi/Secure-Document-Secret-Sharing-System-using-SHA-256-',
featured: true,
accent: 'pink',
cover: 'grid',
details: {
  team: '3 students, with a faculty guide',
  problem:
    'Sensitive documents are exposed whenever they sit on one device, cloud account or network path, and one stolen copy or one ransomware attack puts all of it at risk. Ordinary encryption only moves the problem to protecting a single key. Existing secret-sharing work mostly targets images, and few systems check whether a share has been tampered with before it is used.',
  idea: 'Apply secret sharing to whole documents, not just images, and authenticate every share with SHA-256. The file is split into independent shares, so stealing fewer than k of them reveals nothing, and tampered shares are rejected before reconstruction. Because it works on raw bytes, the same approach handles PDFs, Word files, slides and images.',
  howItWorks: [
    'The document is read in binary and split into fixed 132-byte chunks, with the last chunk padded.',
    'Each chunk becomes the constant term of a random degree k−1 polynomial over a large prime field, which is evaluated at n points to produce the shares. Each share is saved as a text file of (x, y) pairs.',
    'A SHA-256 hash of every share is computed and stored in hashes.json along with the metadata.',
    'To reconstruct, the GUI loads the shares, verifies each hash, rejects tampered shares and warns if fewer than k valid ones remain. Lagrange interpolation then recovers each chunk and the original file is rebuilt.',
  ],
  contribution: [
    'Built the share generator (part1_generator.py): chunking, polynomial generation and SHA-256 hashing',
    'Chose SHA-256 per-share authentication so tampered shares are rejected before reconstruction',
    'Tested reconstruction on PDF, DOCX, PPTX and image files and verified bit-exact hash matches',
  ],
  result:
    'Published in the Grenze International Journal of Engineering and Technology (January issue). In testing, all PDF, image, Word and PowerPoint files reconstructed with matching SHA-256 hashes. Share size grew by about 4–5.5%. Tampered shares were rejected and too few shares triggered a warning. Processing took under about 4 seconds for files up to 10 MB across (2,3) to (5,8) schemes.',
  architecture: ['Input document', 'Chunking (132 bytes)', 'Shamir (k,n) sharing', 'SHA-256 share hashing', 'Tkinter GUI', 'Hash check + Lagrange reconstruction'],
  },
  },
  {
    slug: 'Time Series Project',
    placeholder: true,
    title: 'Mumbai AQI Fluctuations',
    titleLines: ['Mumbai', 'AQI', 'Fluctuations'],
    category: 'Time Series Project',
    tags: ['ARIMA', 'Data'],
    year: '2025',
    type: 'Research project',
    description:
  'A data science project that models Mumbai\'s daily Air Quality Index as a stochastic time series. It uses STL decomposition, ARIMA forecasting with confidence intervals and Markov Chain analysis, and is deployed as an interactive Streamlit app.',
    technologies: ['Python', 'Streamlit', 'Plotly', 'Statsmodels', 'Pandas', 'SciPy'],
    image: '/images/projects/covertwo.png',
    github: 'https://github.com/muskaanjaggi/mumbai_aqi_model',
    live: 'https://mumbaiaqimodel-6vghqbhzfmumiqgx2kfdo8.streamlit.app/',
    featured: true,
    accent: 'pink',
    cover: 'grid',
    details: {
    team: 'Solo Project',
    problem:
    'Mumbai\'s air quality swings from day to day and season to season, which makes it hard to tell what is normal, what is a real spike and what to expect next. Raw AQI numbers alone don\'t show the trend, the seasonal pattern or the chance of a clean day turning into a bad one.',
    idea: 'Treat daily AQI as a stochastic process, not just a chart. Split it into trend, seasonality and noise, test whether it is stationary, then fit an ARIMA model to forecast it with uncertainty bands. A Markov Chain adds the probability of moving between air-quality categories, plus the long-run share of days in each.',
    howItWorks: [
    'Load 2,431 daily AQI readings for Mumbai (May 2018 – Dec 2024), sourced from CPCB data.',
    'Decompose the series with STL and check stationarity with the ADF and KPSS tests.',
    'Use ACF and PACF plots to pick the ARIMA(p,d,q) order, then forecast with 95% confidence intervals.',
    'Build a Markov Chain transition matrix and its stationary distribution from AQI categories.',
    'Present everything in an interactive Streamlit dashboard with Plotly charts.',
  ],
    contribution: [
    'Built the ARIMA pipeline and the Streamlit dashboard',
    'Chose ARIMA order using ACF/PACF after stationarity tests',
    'Fixed missing/irregular dates in the raw data.',
  ],
    result:
    'Shipped as a live Streamlit app that anyone can open in the browser, with the full analysis (decomposition, stationarity tests, ARIMA forecast and Markov Chain) in one place.',
    architecture: ['CPCB AQI data', 'Pandas cleaning', 'STL + ADF/KPSS', 'ARIMA + Markov Chain', 'Streamlit + Plotly UI'],
    gallery: [],
  },
},
  {
    slug: 'smart-study',
    placeholder: false,
    title: 'Smart Study Planner',
    titleLines: ['Smart', 'Study', 'Planner'],
    category: 'Creative Technology',
    tags: ['Python', 'Creative coding'],
    year: '2026',
    type: 'Solo project',
    description:
  'StudyFlow is a smart study planner that turns your subjects, deadlines and difficulty into a day-by-day schedule, tracks Pomodoro sessions and progress, and uses a small machine-learning model to warn you when your plan risks burnout.',
technologies: ['Python', 'Flask', 'scikit-learn', 'JavaScript', 'REST API', 'Gunicorn'],
image: '/images/projects/coverthree.png',
github: 'https://github.com/muskaanjaggi/Smart_Study_Planner',
featured: true,
accent: 'pink',
cover: 'grid',
details: {
  team: 'Solo Project',
  problem:
    'Students juggle several subjects with different deadlines and difficulty, and most either over-study the easy ones or cram the hard ones at the last minute. Planning by hand is tedious, and nothing tells you when the plan you made is unrealistic for how much you sleep and how stressed you are.',
  idea: 'Give every subject a priority score that blends difficulty with how close its deadline is, then split each day\'s study hours in proportion to those scores, recalculated daily as deadlines get closer. A separate regression model looks at sleep, breaks, stress and workload to say whether the plan is sustainable, so the planner protects you from burnout as well as scheduling you.',
  howItWorks: [
    'The student adds subjects with a deadline (in days) and a difficulty (easy, medium or hard), and says how many hours they can study per day.',
    'The scheduler scores each subject as 0.6 × difficulty + 0.4 × (1 ÷ days left). Each day\'s hours are shared out in proportion to those scores, with a 0.5-hour minimum per subject, and subjects drop off once their deadline passes.',
    'The student enters sleep, breaks, stress level and planned hours, and a linear regression model returns a recommended workload and a burnout risk level with tips.',
    'Rule-based suggestions flag urgent deadlines, hard subjects and the top priority for today.',
    'Pomodoro sessions and per-subject progress are saved through the Flask API and shown in the web UI.',
  ],
  contribution: [
    'Designed the priority-score scheduler and the Flask API routes',
    'Weighted difficulty (0.6) above urgency (0.4) and set a 0.5h minimum so no subject gets a tiny sliver of time',
    'Normalising hours so each day always adds up exactly to the student\'s available time',
  ],
  result:
    'Built a working full-stack study planner with a Flask backend (schedule, burnout prediction, suggestions, progress and session-history endpoints), a web frontend, and a Procfile and Gunicorn setup for deployment. The burnout model is trained on synthetic data, so it is a proof of concept rather than a clinically validated tool.',
  gallery: [],
    },
  },
]

export const projectCategories = [
  'AI / ML',
  'Data Science',
  'Web Development',
  'Creative Technology',
  'Research',
  'Experiments',
]

export const getProject = (slug) => projects.find((p) => p.slug === slug)
