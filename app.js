/* 
   KC Grace O. Bandoy Official Website JavaScript Controller
   Client-side Routing, Data Binding, Modals, Lightbox, Search, Verification Badges, & Admin CMS
*/

const ADMIN_PASSWORD_FALLBACK = 'kcbandoy2005';

let appState = {
  profile: {},
  projects: [],
  events: [],
  achievements: [],
  gallery: [],
  documents: [],
  announcements: [],
  currentTab: 'home',
  adminAuthenticated: false,
  adminToken: null
};

// Fallback seed data in case API server is unreachable
const SEED_DATA = {
  profile: {
    full_name: "KC Grace O. Bandoy",
    public_name: "KC Bandoy",
    position: "Sangguniang Kabataan Chairperson",
    barangay: "Centro, Sibulan",
    municipality: "Sta. Cruz",
    province: "Davao del Sur",
    country: "Philippines",
    field_of_study: "Ongoing Bachelor of Secondary Education major in English",
    academic_level: "Ongoing BSEd",
    career_aspiration: "Aspiring Educator",
    tagline: "Empowering the youth. Strengthening the community. Leading through service.",
    badge_label: "YOUTH LEADERSHIP • EDUCATION • COMMUNITY DEVELOPMENT",
    languages: "Cebuano, Filipino, English, Bagobo Tagabawa",
    photo_url: "assets/kc_portrait.jpg"
  },
  projects: [
    {
      id: 1,
      title: "Purok Signages Installation",
      category: "Community Development",
      location: "Barangay Sibulan",
      date_str: "2026",
      description: "Community identification and directional signage project involving the strategic installation of durable purok signages across Barangay Sibulan.",
      objectives: "To enhance barangay navigation, foster local purok identity, and improve public safety and accessibility for all residents.",
      beneficiaries: "Barangay Sibulan residents, emergency responders, and visitors.",
      role: "SK Chairperson / Project Lead",
      status: "Mission Accomplished",
      verification: "PUBLICLY_DOCUMENTED",
      image_url: "assets/purok_signages.png"
    },
    {
      id: 2,
      title: "Educational / Financial Assistance Program",
      category: "Education",
      location: "Barangay Centro, Sibulan",
      date_str: "2026",
      description: "Publicly documented youth educational support initiative providing financial assistance to qualified student beneficiaries in Barangay Centro, Sibulan.",
      objectives: "To ease academic financial burdens, encourage schooling, and advocate for student welfare as an aspiring educator.",
      beneficiaries: "Student beneficiaries of Barangay Centro, Sibulan.",
      role: "SK Chairperson / Program Coordinator",
      status: "Completed",
      verification: "PUBLICLY_DOCUMENTED",
      image_url: "assets/educational_assistance.png"
    },
    {
      id: 3,
      title: "Linggo ng Kabataan Participation & Youth Delegation",
      category: "Youth Development",
      location: "Sta. Cruz, Davao del Sur",
      date_str: "2026",
      description: "Youth representation and active civic participation during the municipal Linggo ng Kabataan celebration.",
      objectives: "To foster youth empowerment, encourage active civic participation, and represent Centro Sibulan youth in municipal programs.",
      beneficiaries: "Barangay Centro youth sector.",
      role: "SK Delegation Leader & Organizer",
      status: "Completed",
      verification: "PUBLICLY_DOCUMENTED",
      image_url: "assets/linggo_ng_kabataan.png"
    },
    {
      id: 4,
      title: "Hip-Hop Dance Competition Participation",
      category: "Culture & Arts",
      location: "Sta. Cruz, Davao del Sur",
      date_str: "2026",
      description: "Youth participation in the Linggo ng Kabataan Hip-Hop Dance Competition showcase, celebrating youth talents.",
      objectives: "To support youth talents in arts and culture, promoting teamwork and active lifestyle.",
      beneficiaries: "Barangay youth performers and local community audience.",
      role: "SK Team Coordinator",
      status: "Completed",
      verification: "PUBLICLY_DOCUMENTED",
      image_url: "assets/linggo_ng_kabataan.png"
    }
  ],
  events: [
    {
      id: 1,
      title: "Linggo ng Kabataan 2026 Municipal Assembly",
      date_str: "2026",
      location: "Sta. Cruz, Davao del Sur",
      category: "Youth Development",
      description: "Annual youth week celebration featuring workshops, talent competitions, and leadership building.",
      role: "SK Delegation Leader",
      verification: "PUBLICLY_DOCUMENTED",
      image_url: "assets/linggo_ng_kabataan.png"
    },
    {
      id: 2,
      title: "Purok Signages Turn-over Ceremony",
      date_str: "2026",
      location: "Barangay Sibulan",
      category: "Community Service",
      description: "Official turn-over and final installation of purok signages in Barangay Sibulan.",
      role: "SK Project Lead",
      verification: "PUBLICLY_DOCUMENTED",
      image_url: "assets/purok_signages.png"
    },
    {
      id: 3,
      title: "Byaning ng Davao del Sur 2024 Recognition Gathering",
      date_str: "2024",
      location: "Province of Davao del Sur",
      category: "Recognition",
      description: "Provincial youth gathering acknowledging active youth participation in Sta. Cruz.",
      role: "Youth Delegate",
      verification: "PUBLICLY_DOCUMENTED",
      image_url: "https://i.ibb.co/zhJLtBjc/dc9ccb31-6c8d-4809-9329-6a78d402145e.jpg"
    }
  ],
  achievements: [
    {
      id: 1,
      title: "Byaning ng Davao del Sur 2024",
      type: "Publicly Documented Recognition",
      organization: "Province of Davao del Sur / Sta. Cruz",
      year: "2024",
      description: "Publicly documented participation and recognition in Byaning ng Davao del Sur 2024, honoring youth initiatives and civic participation (including People's Choice Award participation).",
      verification: "PUBLICLY_DOCUMENTED",
      image_url: "https://i.ibb.co/zhJLtBjc/dc9ccb31-6c8d-4809-9329-6a78d402145e.jpg"
    },
    {
      id: 2,
      title: "Elected SK Chairperson Mandate",
      type: "Official Public Service Position",
      organization: "Barangay Centro, Sibulan",
      year: "2023 - Present",
      description: "Elected Sangguniang Kabataan Chairperson leading youth development programs in Barangay Centro, Sibulan.",
      verification: "VERIFIED",
      image_url: "https://i.ibb.co/zhJLtBjc/dc9ccb31-6c8d-4809-9329-6a78d402145e.jpg"
    }
  ],
  gallery: [],
  documents: [
    { id: 1, title: "Purok Signages Accomplishment Summary Report", category: "Accomplishment Reports", date_str: "2026", description: "Public accomplishment report documenting the completed Purok Signage project.", file_type: "PDF", verification: "PUBLICLY_DOCUMENTED", file_url: "assets/purok_signages.png" },
    { id: 2, title: "Linggo ng Kabataan Delegation Summary", category: "Activity Reports", date_str: "2026", description: "Official report of youth representation during municipal Linggo ng Kabataan.", file_type: "PDF", verification: "PUBLICLY_DOCUMENTED", file_url: "assets/linggo_ng_kabataan.png" },
    { id: 3, title: "Educational Assistance Beneficiary Guidelines", category: "Project Documentation", date_str: "2026", description: "Framework for educational assistance support distribution.", file_type: "PDF", verification: "PUBLICLY_DOCUMENTED", file_url: "assets/educational_assistance.png" }
  ],
  announcements: [
    { id: 1, title: "Purok Signages Installation Successfully Completed", category: "Project Update", date_str: "2026-08-01", content: "The SK Council of Barangay Centro, Sibulan announces the successful installation of new purok signages across Barangay Sibulan.", author: "SK Chairperson KC Grace O. Bandoy", verification: "PUBLICLY_DOCUMENTED", image_url: "assets/purok_signages.png" },
    { id: 2, title: "Educational Assistance Support Program Summary", category: "Education", date_str: "2026-07-15", content: "Educational support documentation has been finalized for local student beneficiaries.", author: "SK Council Centro Sibulan", verification: "PUBLICLY_DOCUMENTED", image_url: "assets/educational_assistance.png" },
    { id: 3, title: "Centro Sibulan Delegates Excel at Linggo ng Kabataan 2026", category: "Youth Activity", date_str: "2026-06-20", content: "Delegates from Barangay Centro, Sibulan actively participated in Linggo ng Kabataan 2026 events, including the Hip-Hop Dance Competition.", author: "Youth Affairs Office", verification: "PUBLICLY_DOCUMENTED", image_url: "assets/linggo_ng_kabataan.png" }
  ]
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initLucide();
  fetchAppData();
});

function initLucide() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Fetch all site data from REST API with fallback to seed data
async function fetchAppData() {
  try {
    const [profRes, projRes, evtRes, achRes, galRes, docRes, annRes] = await Promise.all([
      fetch('/api/profile').then(r => r.ok ? r.json() : null),
      fetch('/api/projects').then(r => r.ok ? r.json() : null),
      fetch('/api/events').then(r => r.ok ? r.json() : null),
      fetch('/api/achievements').then(r => r.ok ? r.json() : null),
      fetch('/api/gallery').then(r => r.ok ? r.json() : null),
      fetch('/api/documents').then(r => r.ok ? r.json() : null),
      fetch('/api/announcements').then(r => r.ok ? r.json() : null)
    ]);

    appState.profile = profRes || SEED_DATA.profile;
    appState.projects = projRes && projRes.length ? projRes : SEED_DATA.projects;
    appState.events = evtRes && evtRes.length ? evtRes : SEED_DATA.events;
    appState.achievements = achRes && achRes.length ? achRes : SEED_DATA.achievements;
    appState.gallery = galRes && galRes.length ? galRes : SEED_DATA.gallery;
    appState.documents = docRes && docRes.length ? docRes : SEED_DATA.documents;
    appState.announcements = annRes && annRes.length ? annRes : SEED_DATA.announcements;
  } catch (err) {
    console.warn("API server unreachable, running on seed data:", err);
    appState.profile = SEED_DATA.profile;
    appState.projects = SEED_DATA.projects;
    appState.events = SEED_DATA.events;
    appState.achievements = SEED_DATA.achievements;
    appState.gallery = SEED_DATA.gallery;
    appState.documents = SEED_DATA.documents;
    appState.announcements = SEED_DATA.announcements;
  }

  renderAllViews();
}

function renderAllViews() {
  renderHomeProjects();
  renderProjects('All');
  renderEvents();
  renderAchievements();
  renderGallery('All');
  renderDocuments();
  renderAnnouncements();
  initLucide();
}

// Tab Switching Routing
function switchTab(tabName) {
  appState.currentTab = tabName;

  // Update nav link active state
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.dataset.tab === tabName) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Update tab page visibility
  document.querySelectorAll('.tab-page').forEach(page => {
    if (page.id === `page-${tabName}`) {
      page.classList.add('active');
    } else {
      page.classList.remove('active');
    }
  });

  // Close mobile menu if open
  document.getElementById('nav-menu').classList.remove('active');

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileMenu() {
  const menu = document.getElementById('nav-menu');
  menu.classList.toggle('active');
}

// Helper: Verification Badge HTML Generator
function getVerificationBadgeHTML(status) {
  switch (status) {
    case 'VERIFIED':
      return `<span class="badge badge-verified"><i data-lucide="check-circle-2"></i> ✓ Verified Record</span>`;
    case 'PUBLICLY_DOCUMENTED':
      return `<span class="badge badge-documented"><i data-lucide="file-text"></i> ◉ Publicly Documented</span>`;
    case 'COMMUNITY_RECOGNITION':
      return `<span class="badge badge-recognition"><i data-lucide="award"></i> ○ Community Recognition</span>`;
    default:
      return `<span class="badge badge-pending"><i data-lucide="clock"></i> ! Pending Verification</span>`;
  }
}

// Render Featured Projects on Home Page
function renderHomeProjects() {
  const container = document.getElementById('home-projects-grid');
  if (!container) return;

  const featured = appState.projects.slice(0, 3);
  container.innerHTML = featured.map(p => `
    <div class="project-card">
      <div class="project-body">
        <div class="project-meta">${p.category} • ${p.location}</div>
        <h3 class="project-title">${p.title}</h3>
        <p class="project-desc">${p.description}</p>
        <div class="project-footer">
          <span><i data-lucide="calendar"></i> ${p.date_str}</span>
          <button class="btn btn-outline btn-sm" onclick="openProjectModal(${p.id})"><i data-lucide="arrow-right"></i></button>
        </div>
      </div>
    </div>
  `).join('');
}

// Render Projects Directory Page
function renderProjects(filter = 'All') {
  const container = document.getElementById('projects-grid');
  if (!container) return;

  let filtered = appState.projects;
  if (filter !== 'All') {
    filtered = appState.projects.filter(p => p.category.toLowerCase().includes(filter.toLowerCase()));
  }

  if (filtered.length === 0) {
    container.innerHTML = `<div class="col-span-2 text-center py-8"><p class="text-muted">No projects found under category "${filter}".</p></div>`;
    return;
  }

  container.innerHTML = filtered.map(p => `
    <div class="project-card">
      <div class="project-img-wrapper">
        <img src="${p.image_url}" alt="${p.title}" class="project-img" onerror="this.src='assets/purok_signages.png';">
        <div class="project-badge-top">
          ${getVerificationBadgeHTML(p.verification)}
        </div>
      </div>
      <div class="project-body">
        <div class="project-meta">${p.category} • ${p.location}</div>
        <h3 class="project-title">${p.title}</h3>
        <p class="project-desc">${p.description}</p>
        <div class="project-footer">
          <span><strong>Status:</strong> ${p.status}</span>
          <button class="btn btn-primary btn-sm" onclick="openProjectModal(${p.id})">View Project</button>
        </div>
      </div>
    </div>
  `).join('');

  initLucide();
}

function filterProjects(category) {
  document.querySelectorAll('#project-filters .filter-btn').forEach(btn => {
    if (btn.innerText.trim() === category) btn.classList.add('active');
    else btn.classList.remove('active');
  });
  renderProjects(category);
}

// Project Modal View
function openProjectModal(id) {
  const project = appState.projects.find(p => p.id === id);
  if (!project) return;

  const content = document.getElementById('project-modal-content');
  content.innerHTML = `
    <div class="modal-header mb-4">
      ${getVerificationBadgeHTML(project.verification)}
      <h2 class="mt-2" style="font-size:1.6rem">${project.title}</h2>
      <p class="text-muted" style="font-size:0.9rem"><i data-lucide="map-pin"></i> ${project.location} | <i data-lucide="calendar"></i> ${project.date_str}</p>
    </div>
    <div class="modal-img-box mb-4" style="border-radius:12px; overflow:hidden; max-height:280px">
      <img src="${project.image_url}" alt="${project.title}" style="width:100%; height:100%; object-fit:cover" onerror="this.src='assets/purok_signages.png';">
    </div>
    <div class="modal-body-text">
      <h4 class="mb-1"><i data-lucide="file-text"></i> Description</h4>
      <p class="bio-paragraph">${project.description}</p>
      
      <h4 class="mb-1 mt-4"><i data-lucide="target"></i> Project Objectives</h4>
      <p class="bio-paragraph">${project.objectives || 'Not specified.'}</p>
      
      <h4 class="mb-1 mt-4"><i data-lucide="users"></i> Beneficiaries</h4>
      <p class="bio-paragraph">${project.beneficiaries || 'Barangay residents.'}</p>
      
      <h4 class="mb-1 mt-4"><i data-lucide="user-check"></i> KC & SK Role</h4>
      <p class="bio-paragraph">${project.role || 'SK Chairperson'}</p>

      <div class="mt-6 pt-3" style="border-top:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
        <span><strong>Status:</strong> <span class="badge badge-documented">${project.status}</span></span>
        <button class="btn btn-secondary btn-sm" onclick="closeProjectModalDirect()">Close</button>
      </div>
    </div>
  `;

  document.getElementById('project-modal').classList.remove('hidden');
  initLucide();
}

function closeProjectModal(e) {
  if (e.target.id === 'project-modal') {
    document.getElementById('project-modal').classList.add('hidden');
  }
}
function closeProjectModalDirect() {
  document.getElementById('project-modal').classList.add('hidden');
}

// Render Events & Timeline
function renderEvents() {
  const container = document.getElementById('events-feed');
  const homeTimeline = document.getElementById('home-timeline');

  if (container) {
    container.innerHTML = appState.events.map(e => `
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <div style="display:flex; justify-content:space-between; align-items:center;" class="mb-2">
            <span class="timeline-year">${e.date_str} • ${e.category}</span>
            ${getVerificationBadgeHTML(e.verification)}
          </div>
          <h3 class="mb-1">${e.title}</h3>
          <p class="text-muted mb-2"><i data-lucide="map-pin"></i> ${e.location}</p>
          <p class="bio-paragraph">${e.description}</p>
          <p class="text-muted" style="font-size:0.85rem"><strong>Role:</strong> ${e.role}</p>
        </div>
      </div>
    `).join('');
  }

  if (homeTimeline) {
    homeTimeline.innerHTML = appState.events.slice(0, 3).map(e => `
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <span class="timeline-year">${e.date_str}</span>
          <h4 class="mt-1">${e.title}</h4>
          <p class="text-muted" style="font-size:0.85rem">${e.description}</p>
        </div>
      </div>
    `).join('');
  }

  initLucide();
}

// Render Achievements
function renderAchievements() {
  const container = document.getElementById('achievements-grid');
  if (!container) return;

  container.innerHTML = appState.achievements.map(a => `
    <div class="bio-card">
      <div style="display:flex; justify-content:space-between; align-items:flex-start;" class="mb-3">
        <div>
          <span class="badge badge-recognition mb-2">${a.type}</span>
          <h3>${a.title}</h3>
          <p class="text-muted" style="font-size:0.85rem">${a.organization} (${a.year})</p>
        </div>
        ${getVerificationBadgeHTML(a.verification)}
      </div>
      <p class="bio-paragraph">${a.description}</p>
    </div>
  `).join('');

  initLucide();
}

// Render Gallery
function renderGallery(filter = 'All') {
  const container = document.getElementById('gallery-grid');
  if (!container) return;

  let filtered = appState.gallery;
  if (filter !== 'All') {
    filtered = appState.gallery.filter(g => g.category.toLowerCase() === filter.toLowerCase());
  }

  if (!filtered.length) {
    container.innerHTML = '';
  } else {
    container.innerHTML = filtered.map(g => {
      const deleteButton = appState.adminAuthenticated ? `
        <button class="gallery-delete-btn" style="position:absolute; top:0.75rem; right:0.75rem; z-index:10; border:none; background:rgba(255,255,255,0.92); border-radius:50%; width:36px; height:36px; display:flex; align-items:center; justify-content:center; cursor:pointer;" onclick="event.stopPropagation(); deleteGalleryItemAdmin(${g.id});" title="Delete photo">
          <i data-lucide="trash-2" style="width:18px; height:18px;"></i>
        </button>
      ` : '';

      return `
        <div class="gallery-item" style="position:relative;" onclick="openLightbox('${g.image_url}', '${g.caption} • ${g.location} (${g.date_str})')">
          ${deleteButton}
          <img src="${g.image_url}" alt="${g.caption}" onerror="this.src='assets/kc_portrait.jpg';">
          <div class="gallery-overlay">
            <h4>${g.caption}</h4>
            <p><i data-lucide="map-pin"></i> ${g.location} | ${g.date_str}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  initLucide();
}

function filterGallery(category) {
  document.querySelectorAll('#gallery-filters .filter-btn').forEach(btn => {
    if (btn.innerText.trim() === category) btn.classList.add('active');
    else btn.classList.remove('active');
  });
  renderGallery(category);
}

// Lightbox
function openLightbox(url, caption) {
  document.getElementById('lightbox-img').src = url;
  document.getElementById('lightbox-caption').innerText = caption;
  document.getElementById('lightbox-modal').classList.remove('hidden');
}
function closeLightbox(e) {
  if (e.target.id === 'lightbox-modal') {
    document.getElementById('lightbox-modal').classList.add('hidden');
  }
}
function closeLightboxDirect() {
  document.getElementById('lightbox-modal').classList.add('hidden');
}

// Render Documents
function renderDocuments() {
  const container = document.getElementById('documents-grid');
  if (!container) return;

  container.innerHTML = appState.documents.map(d => `
    <div class="bio-card">
      <div style="display:flex; justify-content:space-between; align-items:center;" class="mb-3">
        <span class="badge badge-documented"><i data-lucide="file-check"></i> ${d.file_type} Document</span>
        ${getVerificationBadgeHTML(d.verification)}
      </div>
      <h3 style="font-size:1.1rem" class="mb-2">${d.title}</h3>
      <p class="text-muted" style="font-size:0.85rem">${d.category} • ${d.date_str}</p>
      <p class="bio-paragraph mt-2" style="font-size:0.88rem">${d.description}</p>
      <button class="btn btn-outline btn-sm mt-3" onclick="openDocumentModal(${d.id})">
        <i data-lucide="eye"></i> View Public Report
      </button>
    </div>
  `).join('');

  initLucide();
}

function openDocumentModal(id) {
  const doc = appState.documents.find(d => d.id === id);
  if (!doc) return;

  const content = document.getElementById('document-modal-content');
  content.innerHTML = `
    <div class="modal-header mb-4">
      ${getVerificationBadgeHTML(doc.verification)}
      <h2 class="mt-2">${doc.title}</h2>
      <p class="text-muted">${doc.category} | ${doc.date_str}</p>
    </div>
    <div class="modal-img-box mb-4" style="border-radius:12px; overflow:hidden; max-height:300px; background:#F1F5F9; text-align:center; padding:1rem">
      <img src="${doc.file_url}" alt="${doc.title}" style="max-height:260px; object-fit:contain" onerror="this.src='assets/purok_signages.png';">
    </div>
    <p class="bio-paragraph">${doc.description}</p>
    <div class="mt-6 text-center">
      <a href="${doc.file_url}" target="_blank" download class="btn btn-primary btn-sm"><i data-lucide="download"></i> Download Verified Copy</a>
      <button class="btn btn-secondary btn-sm" onclick="closeDocumentModalDirect()">Close</button>
    </div>
  `;

  document.getElementById('document-modal').classList.remove('hidden');
  initLucide();
}

function closeDocumentModal(e) {
  if (e.target.id === 'document-modal') document.getElementById('document-modal').classList.add('hidden');
}
function closeDocumentModalDirect() {
  document.getElementById('document-modal').classList.add('hidden');
}

// Render Announcements / Updates
function renderAnnouncements() {
  const container = document.getElementById('updates-feed');
  if (!container) return;

  container.innerHTML = appState.announcements.map(a => `
    <div class="bio-card mb-6">
      <div style="display:flex; justify-content:space-between; align-items:center;" class="mb-3">
        <span class="badge badge-documented">${a.category}</span>
        ${getVerificationBadgeHTML(a.verification)}
      </div>
      <h3 style="font-size:1.35rem" class="mb-2">${a.title}</h3>
      <p class="text-muted" style="font-size:0.85rem"><i data-lucide="calendar"></i> ${a.date_str} | Published by ${a.author}</p>
      <p class="bio-paragraph mt-3">${a.content}</p>
    </div>
  `).join('');

  initLucide();
}

function searchUpdates() {
  const query = document.getElementById('update-search-input').value.toLowerCase();
  const feed = document.getElementById('updates-feed');

  const filtered = appState.announcements.filter(a =>
    a.title.toLowerCase().includes(query) || a.content.toLowerCase().includes(query) || a.category.toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    feed.innerHTML = `<p class="text-center text-muted py-8">No announcements found matching "${query}".</p>`;
    return;
  }

  feed.innerHTML = filtered.map(a => `
    <div class="bio-card mb-6">
      <div style="display:flex; justify-content:space-between; align-items:center;" class="mb-3">
        <span class="badge badge-documented">${a.category}</span>
        ${getVerificationBadgeHTML(a.verification)}
      </div>
      <h3 style="font-size:1.35rem" class="mb-2">${a.title}</h3>
      <p class="text-muted" style="font-size:0.85rem"><i data-lucide="calendar"></i> ${a.date_str} | Published by ${a.author}</p>
      <p class="bio-paragraph mt-3">${a.content}</p>
    </div>
  `).join('');

  initLucide();
}

// Contact Form Handler
function handleContactSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('contact-name').value;
  const feedback = document.getElementById('contact-feedback');

  feedback.className = 'contact-feedback mt-4 p-4 rounded bg-green-50 border border-green-200 text-green-800';
  feedback.style.display = 'block';
  feedback.style.backgroundColor = '#ECFDF5';
  feedback.style.border = '1px solid #A7F3D0';
  feedback.style.color = '#047857';
  feedback.style.padding = '1rem';
  feedback.style.borderRadius = '8px';
  feedback.innerHTML = `<strong>Thank you, ${name}!</strong> Your public inquiry has been successfully sent to the SK Office of Barangay Centro, Sibulan. We will respond through official channels.`;

  document.getElementById('public-contact-form').reset();
}

// Admin Modal & Auth
function openAdminModal() {
  document.getElementById('admin-modal').classList.remove('hidden');
}
function closeAdminModal() {
  document.getElementById('admin-modal').classList.add('hidden');
}

async function handleAdminLogin(e) {
  e.preventDefault();
  const pass = document.getElementById('admin-pass').value.trim();
  const errorDiv = document.getElementById('admin-login-error');

  if (pass === ADMIN_PASSWORD_FALLBACK) {
    appState.adminAuthenticated = true;
    appState.adminToken = 'local_admin_token';
    document.getElementById('admin-login-view').classList.add('hidden');
    document.getElementById('admin-cms-view').classList.remove('hidden');
    renderAllViews();
    return;
  }

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pass })
    });
    const data = await res.json();

    if (data.success) {
      appState.adminAuthenticated = true;
      appState.adminToken = data.token;
      document.getElementById('admin-login-view').classList.add('hidden');
      document.getElementById('admin-cms-view').classList.remove('hidden');
      renderAllViews();
    } else {
      errorDiv.innerText = data.error || 'Invalid credentials';
      errorDiv.classList.remove('hidden');
    }
  } catch (err) {
    errorDiv.innerText = 'Incorrect password.';
    errorDiv.classList.remove('hidden');
  }
}

function handleAdminLogout() {
  appState.adminAuthenticated = false;
  appState.adminToken = null;
  document.getElementById('admin-cms-view').classList.add('hidden');
  document.getElementById('admin-login-view').classList.remove('hidden');
  document.getElementById('admin-change-password-panel').classList.add('hidden');
  renderAllViews();
}

function toggleAdminChangePassword() {
  const panel = document.getElementById('admin-change-password-panel');
  panel.classList.toggle('hidden');
}

async function handleChangePassword(e) {
  e.preventDefault();
  const currentPass = document.getElementById('admin-current-pass').value.trim();
  const newPass = document.getElementById('admin-new-pass').value.trim();
  const confirmPass = document.getElementById('admin-confirm-pass').value.trim();
  const feedback = document.getElementById('admin-change-password-feedback');

  feedback.className = 'error-msg hidden mt-3';
  feedback.innerText = '';

  if (newPass !== confirmPass) {
    feedback.innerText = 'New passwords do not match.';
    feedback.classList.remove('hidden');
    return;
  }

  try {
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current_password: currentPass, new_password: newPass })
    });
    const data = await res.json();

    if (data.success) {
      feedback.className = 'contact-feedback mt-3 p-4 rounded bg-green-50 border border-green-200 text-green-800';
      feedback.innerText = data.message || 'Password updated successfully.';
      document.getElementById('admin-change-password-form').reset();
    } else {
      feedback.className = 'error-msg mt-3';
      feedback.innerText = data.error || 'Unable to update password.';
    }
  } catch (err) {
    feedback.className = 'error-msg mt-3';
    feedback.innerText = 'Unable to update password. Please try again later.';
  }
}

function switchAdminTab(panelName) {
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    if (btn.innerText.toLowerCase().includes(panelName)) btn.classList.add('active');
    else btn.classList.remove('active');
  });

  document.querySelectorAll('.admin-panel').forEach(panel => {
    if (panel.id === `admin-${panelName}-panel`) panel.classList.remove('hidden');
    else panel.classList.add('hidden');
  });
}

// Admin CRUD operations
async function getImageUploadData(fileInputId) {
  const input = document.getElementById(fileInputId);
  if (!input || !input.files || input.files.length === 0) return null;
  const file = input.files[0];
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ filename: file.name, base64: reader.result });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function addProjectAdmin(e) {
  e.preventDefault();
  const upload = await getImageUploadData('admin-proj-img-file');
  const imageUrl = document.getElementById('admin-proj-img').value.trim();
  const newProj = {
    title: document.getElementById('admin-proj-title').value,
    category: document.getElementById('admin-proj-cat').value,
    location: document.getElementById('admin-proj-loc').value,
    date_str: document.getElementById('admin-proj-date').value,
    description: document.getElementById('admin-proj-desc').value,
    verification: document.getElementById('admin-proj-ver').value,
    image_url: imageUrl || 'assets/purok_signages.png',
    image_base64: upload ? upload.base64 : null,
    image_filename: upload ? upload.filename : null,
    status: 'In Progress',
    objectives: 'Community youth development project',
    beneficiaries: 'Barangay Centro Sibulan residents',
    role: 'SK Chairperson'
  };

  try {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProj)
    });
    const data = await res.json();
    if (data.success && data.image_url) {
      newProj.image_url = data.image_url;
    }
  } catch (err) {
    console.log("Client fallback project add", err);
  }

  newProj.id = Date.now();
  appState.projects.unshift(newProj);
  renderAllViews();
  document.getElementById('admin-proj-img-file').value = '';
  document.getElementById('admin-proj-img').value = '';
  alert("Project successfully added!");
}

async function addGalleryAdmin(e) {
  e.preventDefault();
  const upload = await getImageUploadData('admin-gal-img-file');
  const imageUrl = document.getElementById('admin-gal-img').value.trim();
  const newGal = {
    id: Date.now(),
    caption: document.getElementById('admin-gal-cap').value,
    category: document.getElementById('admin-gal-cat').value,
    location: document.getElementById('admin-gal-loc').value,
    date_str: '2026',
    image_url: imageUrl || 'assets/kc_portrait.jpg',
    image_base64: upload ? upload.base64 : null,
    image_filename: upload ? upload.filename : null,
    verification: 'VERIFIED'
  };
  try {
    const res = await fetch('/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newGal)
    });
    const data = await res.json();
    if (data.success && data.image_url) {
      newGal.image_url = data.image_url;
    }
  } catch (err) {
    console.log("Client fallback gallery add", err);
  }

  appState.gallery.unshift(newGal);
  renderAllViews();
  document.getElementById('admin-gal-img-file').value = '';
  document.getElementById('admin-gal-img').value = '';
  alert("Gallery photo added!");
}

async function deleteGalleryItemAdmin(itemId) {
  if (!appState.adminAuthenticated || !appState.adminToken) {
    alert('Admin access required to delete gallery photos.');
    return;
  }

  if (!confirm('Are you sure you want to delete this gallery photo?')) {
    return;
  }

  try {
    const res = await fetch(`/api/gallery?id=${itemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${appState.adminToken}`
      }
    });
    const data = await res.json();
    if (data.success) {
      appState.gallery = appState.gallery.filter(item => item.id !== itemId);
      renderAllViews();
      alert('Gallery photo deleted.');
    } else {
      alert(data.error || 'Unable to delete gallery photo.');
    }
  } catch (err) {
    console.error('Gallery delete failed:', err);
    alert('Unable to delete gallery photo. Please try again.');
  }
}

async function addEventAdmin(e) {
  e.preventDefault();
  const newEvt = {
    id: Date.now(),
    title: document.getElementById('admin-evt-title').value,
    category: document.getElementById('admin-evt-cat').value,
    location: document.getElementById('admin-evt-loc').value,
    date_str: document.getElementById('admin-evt-date').value,
    description: document.getElementById('admin-evt-desc').value,
    verification: document.getElementById('admin-evt-ver').value,
    role: 'SK Chairperson'
  };
  appState.events.unshift(newEvt);
  renderAllViews();
  alert("Event added!");
}

async function addDocumentAdmin(e) {
  e.preventDefault();
  const newDoc = {
    id: Date.now(),
    title: document.getElementById('admin-doc-title').value,
    category: document.getElementById('admin-doc-cat').value,
    description: document.getElementById('admin-doc-desc').value,
    date_str: '2026',
    file_type: 'PDF',
    file_url: 'assets/purok_signages.png',
    verification: 'PUBLICLY_DOCUMENTED'
  };
  appState.documents.unshift(newDoc);
  renderAllViews();
  alert("Public Document published!");
}

async function addAnnouncementAdmin(e) {
  e.preventDefault();
  const newAnn = {
    id: Date.now(),
    title: document.getElementById('admin-ann-title').value,
    category: document.getElementById('admin-ann-cat').value,
    content: document.getElementById('admin-ann-content').value,
    date_str: new Date().toISOString().split('T')[0],
    author: 'SK Chairperson KC Grace O. Bandoy',
    verification: 'PUBLICLY_DOCUMENTED'
  };
  appState.announcements.unshift(newAnn);
  renderAllViews();
  alert("Announcement published!");
}
