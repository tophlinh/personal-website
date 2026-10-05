interface Project {
  title: string
  org: string
  year: string
  description: string
  tags: string[]
}

const projects: Project[] = [
  {
    title: 'Multi-Interest Content Retrieval',
    org: 'Disney+',
    year: '2026',
    description:
      'Replacing single-vector user embeddings with multi-interest representations to surface a wider range of content — so the recommendation system can hold more than one idea of who you are.',
    tags: ['ML', 'Retrieval', 'User Modeling'],
  },
  {
    title: 'Recommendation Diversity Audit',
    org: 'Disney+',
    year: '2026',
    description:
      'Analyzed 4B+ impressions across 44.9M profiles to measure how much the system favored familiar content over discovery. Quantified long-tail suppression and built a case for retrieval changes.',
    tags: ['Fairness', 'Data Analysis', 'Retrieval'],
  },
  {
    title: 'Content Badging System',
    org: 'Disney+ / Hulu',
    year: '2025',
    description:
      'Configurable badges surfacing content signals (new episodes, trending, leaving soon) that drove +0.13% CTR and +0.12% sessions. Small UI, measurable behavior shift.',
    tags: ['A/B Testing', 'Product Design', 'Personalization'],
  },
  {
    title: 'Editorial Override Governance',
    org: 'Disney+',
    year: '2025',
    description:
      'A human-in-the-loop framework giving editorial teams controlled override power over algorithmic recommendations — balancing creative intent with system optimization.',
    tags: ['Tooling', 'UX Research', 'Workflow Design'],
  },
  {
    title: 'Climb NORA',
    org: 'Co-founder',
    year: '2023–present',
    description:
      'Co-founded Federal Way\'s first bouldering gym. Led market research, community design, and brand identity from a napkin sketch to a physical space.',
    tags: ['Community', 'Design', 'Market Research'],
  },
  {
    title: 'Distributed Training Reliability',
    org: 'Disney ML Platform',
    year: '2026',
    description:
      'Quantified a 71% pipeline failure rate wasting 867 GPU-hours/month. Built the product case for checkpoint-resume architecture to save ~$912K/year.',
    tags: ['ML Infrastructure', 'Product Brief'],
  },
]

function renderProjects() {
  const grid = document.getElementById('project-grid')
  if (!grid) return

  grid.innerHTML = projects
    .map(
      (p) => `
    <article class="project-card" data-reveal>
      <div class="project-card-header">
        <h3 class="project-card-title">${p.title}</h3>
        <span class="project-card-meta">${p.org} &middot; ${p.year}</span>
      </div>
      <p class="project-card-desc">${p.description}</p>
      <div class="project-card-tags">
        ${p.tags.map((t) => `<span class="tag">${t}</span>`).join('')}
      </div>
    </article>`
    )
    .join('')
}

export function init() {
  renderProjects()
}
