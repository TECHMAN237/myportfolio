/**
 * TECHMAN AI — Intelligent Portfolio Assistant & Navigation Engine
 * Independently integrated into Steeve Zali's (TECHMAN) Portfolio
 */
(function () {
  const STORAGE_KEY_HISTORY = 'techman_ai_chat_history_v2';
  const STORAGE_KEY_OPEN = 'techman_ai_widget_open_v2';

  const ROBOT_IMG_PATH = '/src/assets/images/techman_metallic_robot_1791327325797.jpg';

  // High-craft 3D Metallic Chrome White/Black Robot Avatar with resilient SVG fallback
  const ROBOT_AVATAR_HTML = `
    <div class="techman-robot-wrap">
      <img
        src="${ROBOT_IMG_PATH}"
        alt="TECHMAN AI Robot"
        class="techman-robot-img"
        referrerPolicy="no-referrer"
        onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='block';"
      />
      <svg class="techman-robot-svg" style="display:none;" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="metalShell" x1="12" y1="10" x2="52" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#FFFFFF" />
            <stop offset="45%" stop-color="#E5E9F0" />
            <stop offset="75%" stop-color="#CBD2DC" />
            <stop offset="100%" stop-color="#F8FAFC" />
          </linearGradient>
          <linearGradient id="metalRim" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#FFFFFF" />
            <stop offset="50%" stop-color="#94A3B8" />
            <stop offset="100%" stop-color="#1E293B" />
          </linearGradient>
          <linearGradient id="visorGlass" x1="17" y1="20" x2="47" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#1E2430" />
            <stop offset="40%" stop-color="#090B10" />
            <stop offset="100%" stop-color="#050608" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="30" fill="url(#metalShell)" stroke="url(#metalRim)" stroke-width="2" />
        <rect x="30" y="6" width="4" height="7" rx="2" fill="url(#metalRim)" />
        <circle cx="32" cy="5.5" r="3" fill="#0F172A" stroke="#E2E8F0" stroke-width="1.2" />
        <rect x="7" y="24" width="5.5" height="15" rx="2.75" fill="#0F172A" stroke="#CBD5E1" stroke-width="1.2" />
        <rect x="51.5" y="24" width="5.5" height="15" rx="2.75" fill="#0F172A" stroke="#CBD5E1" stroke-width="1.2" />
        <rect x="11.5" y="13.5" width="41" height="35" rx="16" fill="url(#metalShell)" stroke="#1E293B" stroke-width="2.2" />
        <path d="M19 18C24 15.8 40 15.8 45 18" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" />
        <rect x="16.5" y="21" width="31" height="17.5" rx="8.75" fill="url(#visorGlass)" stroke="#475569" stroke-width="1.2" />
        <path d="M20 23.5H32" stroke="rgba(255,255,255,0.35)" stroke-width="1.3" stroke-linecap="round" />
        <circle cx="25.5" cy="29.8" r="3.6" fill="#FFFFFF" />
        <circle cx="38.5" cy="29.8" r="3.6" fill="#FFFFFF" />
        <circle cx="26.6" cy="28.6" r="1.1" fill="#090B10" />
        <circle cx="39.6" cy="28.6" r="1.1" fill="#090B10" />
        <path d="M28.5 34.5C29.8 35.5 34.2 35.5 35.5 34.5" stroke="#E2E8F0" stroke-width="1.6" stroke-linecap="round" />
      </svg>
    </div>
  `;

  // Structured destination catalog (synced with steve-destinations.json)
  let DESTINATIONS_MAP = {};
  const DEFAULT_DESTINATIONS = [
    { id: 'sec-home', label_fr: 'Accueil', label_en: 'Home', type: 'section', destination: 'index.html?dest=sec-home' },
    { id: 'sec-about', label_fr: 'À Propos (Qui suis-je)', label_en: 'About Me (Who Am I)', type: 'section', destination: 'index.html?dest=sec-about' },
    { id: 'sec-about-passion', label_fr: 'Passions & Intérêts', label_en: 'Passions & Interests', type: 'sub-section', destination: 'index.html?dest=sec-about-passion' },
    { id: 'sec-about-career', label_fr: 'Objectifs de Carrière', label_en: 'Career Goals', type: 'sub-section', destination: 'index.html?dest=sec-about-career' },
    { id: 'sec-skills', label_fr: 'Compétences Tech & Dev', label_en: 'Tech & Dev Skills', type: 'section', destination: 'index.html?dest=sec-skills' },
    { id: 'sec-skills-graphic', label_fr: 'Compétences Design Graphique', label_en: 'Graphic Design Skills', type: 'sub-section', destination: 'index.html?dest=sec-skills-graphic' },
    { id: 'sec-skills-video', label_fr: 'Compétences Montage Vidéo', label_en: 'Video Editing Skills', type: 'sub-section', destination: 'index.html?dest=sec-skills-video' },
    { id: 'sec-skills-teach', label_fr: 'Compétences Enseignement', label_en: 'Teaching Skills', type: 'sub-section', destination: 'index.html?dest=sec-skills-teach' },
    { id: 'sec-skills-content', label_fr: 'Compétences Création de Contenu', label_en: 'Content Creation Skills', type: 'sub-section', destination: 'index.html?dest=sec-skills-content' },
    { id: 'sec-projects-tech', label_fr: 'Voir les Projets Tech & Web', label_en: 'View Tech & Web Projects', type: 'section', destination: 'index.html?dest=sec-projects-tech' },
    { id: 'sec-projects-graphic', label_fr: 'Galerie Design Graphique', label_en: 'Graphic Design Gallery', type: 'section', destination: 'index.html?dest=sec-projects-graphic' },
    { id: 'sec-projects-graphic-cats', label_fr: 'Catégories Design Graphique', label_en: 'Graphic Design Categories', type: 'sub-section', destination: 'index.html?dest=sec-projects-graphic-cats' },
    { id: 'cat-business-flyers', label_fr: 'Design : Entreprises & Services', label_en: 'Design: Business & Services', type: 'category', destination: 'index.html?dest=cat-business-flyers' },
    { id: 'cat-events', label_fr: 'Design : Événements & Conférences', label_en: 'Design: Events & Conferences', type: 'category', destination: 'index.html?dest=cat-events' },
    { id: 'cat-birthdays', label_fr: 'Design : Anniversaires & Célébrations', label_en: 'Design: Birthdays & Celebrations', type: 'category', destination: 'index.html?dest=cat-birthdays' },
    { id: 'cat-branding', label_fr: 'Design : Identité & Packaging', label_en: 'Design: Branding & Packaging', type: 'category', destination: 'index.html?dest=cat-branding' },
    { id: 'cat-social-media', label_fr: 'Design : Réseaux Sociaux & Digital', label_en: 'Design: Social Media & Digital', type: 'category', destination: 'index.html?dest=cat-social-media' },
    { id: 'sec-projects-video', label_fr: 'Galerie Montage Vidéo', label_en: 'Video Editing Gallery', type: 'section', destination: 'index.html?dest=sec-projects-video' },
    { id: 'modal-video-1', label_fr: 'Lire la Vidéo #1', label_en: 'Play Video #1', type: 'modal', destination: 'index.html?dest=modal-video-1' },
    { id: 'sec-projects-teach', label_fr: 'Expérience Enseignement', label_en: 'Teaching Experience', type: 'sub-section', destination: 'index.html?dest=sec-projects-teach' },
    { id: 'sec-projects-content', label_fr: 'Expérience Créateur de Contenu', label_en: 'Content Creator Experience', type: 'sub-section', destination: 'index.html?dest=sec-projects-content' },
    { id: 'sec-education', label_fr: 'Parcours & Éducation', label_en: 'Education & Background', type: 'section', destination: 'index.html?dest=sec-education' },
    { id: 'page-safechild', label_fr: 'Projet SAFECHILD (Accès & Démo)', label_en: 'SAFECHILD Project (Access & Demo)', type: 'route', destination: 'safechild-info.html' },
    { id: 'ext-safechild-app', label_fr: 'Ouvrir SAFECHILD Live', label_en: 'Open SAFECHILD Web App', type: 'external', destination: 'https://safechild.vercel.app/' },
    { id: 'ext-myportfolio', label_fr: 'Voir Mon Portfolio (Vercel)', label_en: 'View My Portfolio (Vercel)', type: 'external', destination: 'https://myportfolio-alpha-pearl.vercel.app/' },
    { id: 'ext-devops-portfolio', label_fr: 'Voir le Portfolio DevOps', label_en: 'View DevOps Portfolio', type: 'external', destination: 'https://portfolio-apollos.vercel.app/' },
    { id: 'ext-goclone', label_fr: 'Voir le projet GO CLONE', label_en: 'View GO CLONE Project', type: 'external', destination: 'https://student-portal-seven-nu.vercel.app/' },
    { id: 'ext-rock-attitude', label_fr: 'Voir le site Rock Attitude', label_en: 'View Rock Attitude Website', type: 'external', destination: 'https://rock-attitude-website.vercel.app/' },
    { id: 'page-testimonials', label_fr: 'Voir les Témoignages', label_en: 'View Testimonials', type: 'route', destination: 'testimonials.html' },
    { id: 'file-cv', label_fr: 'Télécharger le C.V (PDF)', label_en: 'Download C.V (PDF)', type: 'file', destination: 'ZALI.pdf' },
    { id: 'contact-linkedin', label_fr: 'Profil LinkedIn', label_en: 'LinkedIn Profile', type: 'external', destination: 'https://www.linkedin.com/in/steeve-zali-5a70b6379' },
    { id: 'contact-github', label_fr: 'Profil GitHub', label_en: 'GitHub Profile', type: 'external', destination: 'https://github.com/TECHMAN237' },
    { id: 'contact-whatsapp', label_fr: 'Contacter sur WhatsApp', label_en: 'Chat on WhatsApp', type: 'external', destination: 'https://wa.me/+237697368251' },
    { id: 'contact-phone', label_fr: 'Appeler (+237 697 368 251)', label_en: 'Call (+237 697 368 251)', type: 'external', destination: 'tel:+237697368251' },
    { id: 'action-lang-toggle', label_fr: 'Changer la langue (FR/EN)', label_en: 'Switch Language (FR/EN)', type: 'action', destination: 'javascript:toggleLanguage()' }
  ];

  DEFAULT_DESTINATIONS.forEach(d => {
    DESTINATIONS_MAP[d.id] = d;
  });

  function getActiveLang() {
    if (typeof currentLang !== 'undefined' && (currentLang === 'fr' || currentLang === 'en')) {
      return currentLang;
    }
    return localStorage.getItem('lang') || 'fr';
  }

  // Client-side knowledge base fallback so TECHMAN AI works even offline
  function resolveClientFallback(rawMessage, lang) {
    const q = (rawMessage || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const isEn = lang === 'en' || /\b(who|what|where|show|tell|can you|how|projects|skills|about|contact|resume)\b/.test(q);
    const wantOpen = /\b(montre|voir|ouvre|afficher|emmene|va |aller|ou sont|ou est|show|open|view|see|take me|go to)\b/.test(q);

    if (q.includes('raydar')) {
      return {
        reply: isEn
          ? 'There is no project named **RAYDAR** in Steeve Zali\'s portfolio. Here are his actual web projects (**SAFECHILD**, **Rock Attitude**, **GO CLONE**, **DevOps Portfolio**) and design galleries:'
          : 'Le projet **RAYDAR** ne figure pas dans le portfolio de Steeve Zali (TECHMAN). Voici en revanche ses véritables projets web (**SAFECHILD**, **Rock Attitude**, **GO CLONE**, **Portfolio DevOps**) ainsi que sa galerie de design :',
        destinations: ['sec-projects-tech', 'page-safechild', 'sec-projects-graphic'],
        autoNavigate: false
      };
    }
    if (q.includes('safechild') || q.includes('safe child') || q.includes('enfant')) {
      return {
        reply: isEn
          ? '**SAFECHILD** is a web platform designed by Steeve to reduce the rate of missing children in the community (demo login: `user@test.com` / `user123`).'
          : '**SAFECHILD** est une plateforme web conçue par Steeve pour réduire le taux d\'enfants disparus dans la communauté (identifiants démo : `user@test.com` / `user123`).',
        destinations: ['page-safechild', 'ext-safechild-app', 'sec-projects-tech'],
        autoNavigate: false
      };
    }
    if (q.includes('video') || q.includes('montage') || q.includes('premiere') || q.includes('capcut')) {
      return {
        reply: isEn
          ? 'Here is Steeve\'s **Video Editing Gallery** and software skills (Adobe Premiere Pro, CapCut Pro, KineMaster, InShot, YouCut):'
          : 'Voici la **Galerie de Montage Vidéo** de Steeve ainsi que ses compétences (Adobe Premiere Pro, CapCut Pro, KineMaster, InShot, YouCut) :',
        destinations: ['sec-projects-video', 'modal-video-1', 'sec-skills-video'],
        autoNavigate: wantOpen
      };
    }
    if (q.includes('design') || q.includes('graphi') || q.includes('flyer') || q.includes('affiche') || q.includes('logo') || q.includes('packaging')) {
      return {
        reply: isEn
          ? 'Steeve has **71 graphic design works** across 5 categories (Business Flyers, Events, Birthdays, Branding & Packaging, Social Media).'
          : 'Steeve présente **71 réalisations en Design Graphique** réparties en 5 catégories (Entreprises, Événements, Anniversaires, Identité & Packaging, Réseaux Sociaux).',
        destinations: ['sec-projects-graphic', 'sec-projects-graphic-cats', 'cat-branding'],
        autoNavigate: wantOpen
      };
    }
    if (q.includes('etude') || q.includes('parcours') || q.includes('ecole') || q.includes('universite') || q.includes('buea') || q.includes('education')) {
      return {
        reply: isEn
          ? 'Steeve obtained his **GCE Advanced Level in 2024** at **IMHOTEP GREAT SCHOOL** and is a **Level 300 Computer Science student** at the **University of Buea**.'
          : 'Steeve a obtenu son **GCE Advanced Level en 2024** à **IMHOTEP GREAT SCHOOL** et est étudiant de **niveau 300 en Informatique à l\'Université de Buea**.',
        destinations: ['sec-education', 'file-cv'],
        autoNavigate: wantOpen
      };
    }
    if (q.includes('contact') || q.includes('whatsapp') || q.includes('telephone') || q.includes('linkedin') || q.includes('github') || q.includes('cv')) {
      return {
        reply: isEn
          ? 'You can contact Steeve via WhatsApp/Phone at **+237 697 368 251**, visit his **LinkedIn** or **GitHub (TECHMAN237)**, or download his **CV (PDF)**:'
          : 'Vous pouvez contacter Steeve par téléphone/WhatsApp au **+237 697 368 251**, visiter son **LinkedIn** ou **GitHub (TECHMAN237)**, ou télécharger son **C.V (PDF)** :',
        destinations: ['contact-whatsapp', 'contact-linkedin', 'contact-github', 'file-cv'],
        autoNavigate: false
      };
    }
    if (q.includes('temoignage') || q.includes('avis') || q.includes('testimonial')) {
      return {
        reply: isEn
          ? 'Here are the testimonials from Steeve\'s clients, partners, and peers:'
          : 'Voici la page des témoignages des clients et partenaires de Steeve :',
        destinations: ['page-testimonials'],
        autoNavigate: false
      };
    }
    if (q.includes('competence') || q.includes('skill') || q.includes('service') || q.includes('techno') || q.includes('react')) {
      return {
        reply: isEn
          ? 'Steeve\'s skills include **Web & Mobile Development** (HTML/CSS, JS, React, Python), **Graphic Design**, **Video Editing**, **Content Creation**, and **Teaching**.'
          : 'Les compétences de Steeve couvrent le **Développement Web & Mobile** (HTML/CSS, JS, React, Python), le **Design Graphique**, le **Montage Vidéo**, la **Création de Contenu** et l\'**Enseignement**.',
        destinations: ['sec-skills', 'sec-skills-graphic', 'sec-skills-video'],
        autoNavigate: wantOpen
      };
    }
    if (q.includes('projet') || q.includes('project') || q.includes('web')) {
      return {
        reply: isEn
          ? 'Here are Steeve\'s **Tech & Web Projects** (SAFECHILD, Rock Attitude, GO CLONE, DevOps Portfolio, My Portfolio), **Graphic Design Gallery**, and **Video Showreel**:'
          : 'Voici les **Projets Tech & Web** de Steeve (SAFECHILD, Rock Attitude, GO CLONE, Portfolio DevOps, Mon Portfolio), sa **Galerie Design** et ses **Vidéos** :',
        destinations: ['sec-projects-tech', 'sec-projects-graphic', 'sec-projects-video'],
        autoNavigate: wantOpen
      };
    }
    return {
      reply: isEn
        ? '**Steeve Zali (TECHMAN)** is a Level 300 Computer Science student at the University of Buea, Web Developer, Graphic Designer, and Video Editor. Explore his sections below:'
        : '**Steeve Zali (TECHMAN)** est étudiant de niveau 300 en Informatique à l\'Université de Buea, développeur web, designer graphique et monteur vidéo. Voici les accès rapides :',
      destinations: ['sec-about', 'sec-projects-tech', 'sec-projects-graphic', 'contact-whatsapp'],
      autoNavigate: wantOpen
    };
  }

  function highlightSubMenuIndex(index) {
    const links = document.querySelectorAll('#sub-menu a');
    links.forEach((a, idx) => {
      if (idx === index) {
        a.classList.add('active-sub');
      } else {
        a.classList.remove('active-sub');
      }
    });
  }

  /**
   * Executes internal JavaScript navigation or page routing for any valid destination ID
   */
  window.navigatePortfolioSection = function (destId) {
    const dest = DESTINATIONS_MAP[destId];
    if (!dest) return false;

    const isMainPortfolioPage = typeof window.addhome === 'function' && typeof window.addproject === 'function';

    if (dest.type === 'route') {
      window.location.href = dest.destination;
      return true;
    }
    if (dest.type === 'file') {
      const a = document.createElement('a');
      a.href = dest.destination;
      a.download = dest.destination;
      document.body.appendChild(a);
      a.click();
      a.remove();
      return true;
    }
    if (dest.type === 'external') {
      if (dest.destination.startsWith('tel:')) {
        window.location.href = dest.destination;
      } else {
        const a = document.createElement('a');
        a.href = dest.destination;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
      return true;
    }
    if (destId === 'action-lang-toggle') {
      if (typeof window.toggleLanguage === 'function') {
        window.toggleLanguage();
        updateWidgetLanguageUI();
      }
      return true;
    }

    if (!isMainPortfolioPage) {
      window.location.href = `index.html?dest=${encodeURIComponent(destId)}`;
      return true;
    }

    switch (destId) {
      case 'sec-home':
        window.addhome();
        break;
      case 'sec-about':
        window.addAbout();
        break;
      case 'sec-about-passion':
        window.addAbout();
        highlightSubMenuIndex(1);
        window.renderSubContent(window.getT('about_passion'), window.getT('about_passion_desc'));
        break;
      case 'sec-about-career':
        window.addAbout();
        highlightSubMenuIndex(2);
        window.renderSubContent(window.getT('about_career'), window.getT('about_career_desc'));
        break;
      case 'sec-skills':
        window.addButtons();
        break;
      case 'sec-skills-graphic':
        window.addButtons();
        highlightSubMenuIndex(1);
        window.renderSubContent(window.getT('skill_graphic'), window.getT('skill_graphic_desc'));
        break;
      case 'sec-skills-video':
        window.addButtons();
        highlightSubMenuIndex(2);
        window.renderSubContent(window.getT('skill_video'), window.getT('skill_video_desc'));
        break;
      case 'sec-skills-teach':
        window.addButtons();
        highlightSubMenuIndex(3);
        window.renderSubContent(window.getT('skill_teach'), window.getT('skill_teach_desc'));
        break;
      case 'sec-skills-content':
        window.addButtons();
        highlightSubMenuIndex(4);
        window.renderSubContent(window.getT('skill_content'), window.getT('skill_content_desc'));
        break;
      case 'sec-projects-tech':
        window.addproject();
        break;
      case 'sec-projects-graphic':
        window.addproject();
        highlightSubMenuIndex(1);
        window.addGraphicDesignGallery();
        window.setGraphicGalleryMode('all');
        break;
      case 'sec-projects-graphic-cats':
        window.addproject();
        highlightSubMenuIndex(1);
        window.addGraphicDesignGallery();
        window.setGraphicGalleryMode('categories');
        break;
      case 'cat-business-flyers':
        window.addproject();
        highlightSubMenuIndex(1);
        window.addGraphicDesignGallery();
        window.openGraphicCategory('Business & Service Flyers');
        break;
      case 'cat-events':
        window.addproject();
        highlightSubMenuIndex(1);
        window.addGraphicDesignGallery();
        window.openGraphicCategory('Events & Conferences');
        break;
      case 'cat-birthdays':
        window.addproject();
        highlightSubMenuIndex(1);
        window.addGraphicDesignGallery();
        window.openGraphicCategory('Birthdays & Celebrations');
        break;
      case 'cat-branding':
        window.addproject();
        highlightSubMenuIndex(1);
        window.addGraphicDesignGallery();
        window.openGraphicCategory('Brand Identity & Packaging');
        break;
      case 'cat-social-media':
        window.addproject();
        highlightSubMenuIndex(1);
        window.addGraphicDesignGallery();
        window.openGraphicCategory('Social Media & Digital');
        break;
      case 'sec-projects-video':
        window.addproject();
        highlightSubMenuIndex(2);
        window.addvideo();
        break;
      case 'modal-video-1':
        window.addproject();
        highlightSubMenuIndex(2);
        window.addvideo();
        setTimeout(() => {
          if (typeof window.openVideo === 'function') {
            window.openVideo('9D5w6qTOuUA');
          }
        }, 120);
        break;
      case 'sec-projects-teach':
        window.addproject();
        highlightSubMenuIndex(3);
        window.renderSubContent(window.getT('skill_teach'), window.getT('skill_teach_desc'));
        break;
      case 'sec-projects-content':
        window.addproject();
        highlightSubMenuIndex(4);
        window.addlinks();
        break;
      case 'sec-education':
        window.adddiv1();
        break;
      default:
        return false;
    }

    const contentEl = document.getElementById('new-content');
    if (contentEl) {
      contentEl.style.transition = 'transform 0.2s ease';
      contentEl.style.transform = 'scale(0.99)';
      setTimeout(() => {
        contentEl.style.transform = 'scale(1)';
      }, 160);
    }
    return true;
  };

  const UI_TEXT = {
    fr: {
      title: 'TECHMAN AI',
      subtitle: 'Assistant intelligent du portfolio',
      placeholder: 'Posez une question ou cherchez un projet...',
      send: 'Envoyer',
      welcome: 'Bonjour ! Je suis **TECHMAN AI**, l\'assistant de Steeve Zali (TECHMAN). Je peux vous diriger vers n\'importe quelle section ou répondre à vos questions sur son parcours, ses projets et ses compétences.',
      typing: 'TECHMAN AI répond...',
      clear: 'Effacer la conversation',
      close: 'Fermer',
      chips: [
        { label: 'Voir les projets', query: 'Montre-moi tes projets' },
        { label: 'Design Graphique', query: 'Je veux voir tes réalisations en design graphique' },
        { label: 'Qui est Steeve ?', query: 'Parle-moi de Steeve Zali et de son parcours' },
        { label: 'Contact & CV', query: 'Comment contacter Steeve et télécharger son CV ?' }
      ]
    },
    en: {
      title: 'TECHMAN AI',
      subtitle: 'Intelligent Portfolio Assistant',
      placeholder: 'Ask a question or find a project...',
      send: 'Send',
      welcome: 'Hi! I am **TECHMAN AI**, Steeve Zali\'s (TECHMAN) portfolio assistant. I can take you directly to any project or section, or answer questions about his skills, background, and services.',
      typing: 'TECHMAN AI is replying...',
      clear: 'Clear chat',
      close: 'Close',
      chips: [
        { label: 'View Projects', query: 'Show me your projects' },
        { label: 'Graphic Design', query: 'Show me your graphic design portfolio' },
        { label: 'About Steeve', query: 'Who is Steeve Zali and what is his background?' },
        { label: 'Contact & CV', query: 'How can I contact Steeve and download his CV?' }
      ]
    }
  };

  let chatHistory = [];
  let isOpen = false;
  let isSending = false;

  function loadStoredState() {
    try {
      const savedHistory = sessionStorage.getItem(STORAGE_KEY_HISTORY);
      if (savedHistory) {
        chatHistory = JSON.parse(savedHistory);
      }
      const savedOpen = sessionStorage.getItem(STORAGE_KEY_OPEN);
      if (savedOpen === 'true') {
        isOpen = true;
      }
    } catch (e) {
      chatHistory = [];
    }
  }

  function saveStoredState() {
    try {
      sessionStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(chatHistory.slice(-20)));
      sessionStorage.setItem(STORAGE_KEY_OPEN, isOpen ? 'true' : 'false');
    } catch (e) {
      // Ignore storage quota errors
    }
  }

  function formatMessageHtml(text) {
    if (!text) return '';
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return escaped
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="steve-inline-code">$1</code>')
      .replace(/\n/g, '<br>');
  }

  function createDestinationElement(destId) {
    const dest = DESTINATIONS_MAP[destId];
    if (!dest) return null;
    const lang = getActiveLang();
    const label = (lang === 'fr' ? dest.label_fr : dest.label_en) || dest.name || destId;

    if (dest.type === 'external') {
      const a = document.createElement('a');
      a.className = 'steve-dest-btn';
      a.href = dest.destination;
      if (!dest.destination.startsWith('tel:')) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }
      a.innerHTML = `<span>${label}</span><span class="steve-dest-arrow">↗</span>`;
      return a;
    }

    if (dest.type === 'file') {
      const a = document.createElement('a');
      a.className = 'steve-dest-btn';
      a.href = dest.destination;
      a.setAttribute('download', dest.destination);
      a.innerHTML = `<span>${label}</span><span class="steve-dest-arrow">↓</span>`;
      return a;
    }

    if (dest.type === 'route') {
      const a = document.createElement('a');
      a.className = 'steve-dest-btn';
      a.href = dest.destination;
      a.innerHTML = `<span>${label}</span><span class="steve-dest-arrow">→</span>`;
      return a;
    }

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'steve-dest-btn';
    btn.innerHTML = `<span>${label}</span><span class="steve-dest-arrow">→</span>`;
    btn.addEventListener('click', () => {
      window.navigatePortfolioSection(destId);
      if (window.innerWidth <= 640) {
        toggleChatWidget(false);
      }
    });
    return btn;
  }

  function renderMessages() {
    const listEl = document.getElementById('steve-ai-messages');
    if (!listEl) return;
    listEl.innerHTML = '';

    const lang = getActiveLang();
    const t = UI_TEXT[lang] || UI_TEXT.fr;

    const welcomeEl = document.createElement('div');
    welcomeEl.className = 'steve-msg steve-msg-bot';
    welcomeEl.innerHTML = `<div class="steve-msg-bubble">${formatMessageHtml(t.welcome)}</div>`;
    listEl.appendChild(welcomeEl);

    if (chatHistory.length === 0) {
      const chipsWrap = document.createElement('div');
      chipsWrap.className = 'steve-chips-wrap';
      t.chips.forEach(chip => {
        const chipBtn = document.createElement('button');
        chipBtn.type = 'button';
        chipBtn.className = 'steve-chip-btn';
        chipBtn.textContent = chip.label;
        chipBtn.addEventListener('click', () => {
          sendUserMessage(chip.query);
        });
        chipsWrap.appendChild(chipBtn);
      });
      listEl.appendChild(chipsWrap);
    }

    chatHistory.forEach(item => {
      const msgWrap = document.createElement('div');
      msgWrap.className = `steve-msg ${item.role === 'user' ? 'steve-msg-user' : 'steve-msg-bot'}`;

      const bubble = document.createElement('div');
      bubble.className = 'steve-msg-bubble';
      bubble.innerHTML = formatMessageHtml(item.text);
      msgWrap.appendChild(bubble);

      if (item.role === 'model' && Array.isArray(item.destinations) && item.destinations.length > 0) {
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'steve-dest-list';
        item.destinations.forEach(destId => {
          const btnEl = createDestinationElement(destId);
          if (btnEl) actionsContainer.appendChild(btnEl);
        });
        if (actionsContainer.childNodes.length > 0) {
          msgWrap.appendChild(actionsContainer);
        }
      }

      listEl.appendChild(msgWrap);
    });

    listEl.scrollTop = listEl.scrollHeight;
  }

  function showTypingIndicator(show) {
    const listEl = document.getElementById('steve-ai-messages');
    if (!listEl) return;
    const existing = document.getElementById('steve-typing-row');
    if (existing) existing.remove();

    if (show) {
      const lang = getActiveLang();
      const t = UI_TEXT[lang] || UI_TEXT.fr;
      const typingRow = document.createElement('div');
      typingRow.id = 'steve-typing-row';
      typingRow.className = 'steve-msg steve-msg-bot';
      typingRow.innerHTML = `
        <div class="steve-msg-bubble steve-typing-bubble">
          <span class="steve-dot"></span>
          <span class="steve-dot"></span>
          <span class="steve-dot"></span>
          <span class="steve-typing-label">${t.typing}</span>
        </div>
      `;
      listEl.appendChild(typingRow);
      listEl.scrollTop = listEl.scrollHeight;
    }
  }

  async function sendUserMessage(rawText) {
    const text = (rawText || '').trim();
    if (!text || isSending) return;

    const inputEl = document.getElementById('steve-ai-input');
    if (inputEl) inputEl.value = '';

    chatHistory.push({ role: 'user', text });
    saveStoredState();
    renderMessages();

    isSending = true;
    showTypingIndicator(true);

    const lang = getActiveLang();
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    try {
      const response = await fetch('/api/steve-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: chatHistory.slice(0, -1).map(h => ({ role: h.role, text: h.text })),
          lang,
          currentPage
        })
      });

      const data = await response.json();
      showTypingIndicator(false);
      isSending = false;

      const resolved = (!response.ok || data.error || !data.reply)
        ? resolveClientFallback(text, lang)
        : data;

      const validDestinations = Array.isArray(resolved.destinations)
        ? resolved.destinations.filter(id => Boolean(DESTINATIONS_MAP[id]))
        : [];

      chatHistory.push({
        role: 'model',
        text: resolved.reply,
        destinations: validDestinations
      });
      saveStoredState();
      renderMessages();

      if (resolved.autoNavigate && validDestinations.length > 0) {
        const primaryDestId = validDestinations[0];
        const primaryDest = DESTINATIONS_MAP[primaryDestId];
        if (primaryDest && ['section', 'sub-section', 'category', 'modal'].includes(primaryDest.type)) {
          window.navigatePortfolioSection(primaryDestId);
        }
      }
    } catch (err) {
      showTypingIndicator(false);
      isSending = false;
      const fallback = resolveClientFallback(text, lang);
      chatHistory.push({
        role: 'model',
        text: fallback.reply,
        destinations: fallback.destinations
      });
      saveStoredState();
      renderMessages();

      if (fallback.autoNavigate && fallback.destinations.length > 0) {
        const primaryDestId = fallback.destinations[0];
        const primaryDest = DESTINATIONS_MAP[primaryDestId];
        if (primaryDest && ['section', 'sub-section', 'category', 'modal'].includes(primaryDest.type)) {
          window.navigatePortfolioSection(primaryDestId);
        }
      }
    }
  }

  function toggleChatWidget(forceState) {
    isOpen = typeof forceState === 'boolean' ? forceState : !isOpen;
    const panel = document.getElementById('steve-ai-panel');
    const fab = document.getElementById('steve-ai-fab');
    if (panel) {
      if (isOpen) {
        panel.classList.add('steve-open');
        setTimeout(() => {
          const inputEl = document.getElementById('steve-ai-input');
          if (inputEl && window.innerWidth > 640) inputEl.focus();
        }, 150);
      } else {
        panel.classList.remove('steve-open');
      }
    }
    if (fab) {
      fab.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }
    saveStoredState();
  }

  function updateWidgetLanguageUI() {
    const lang = getActiveLang();
    const t = UI_TEXT[lang] || UI_TEXT.fr;
    const subEl = document.getElementById('steve-ai-subtitle');
    const inputEl = document.getElementById('steve-ai-input');
    const clearBtn = document.getElementById('steve-ai-clear');
    const closeBtn = document.getElementById('steve-ai-close');
    if (subEl) subEl.textContent = t.subtitle;
    if (inputEl) inputEl.placeholder = t.placeholder;
    if (clearBtn) clearBtn.title = t.clear;
    if (closeBtn) closeBtn.title = t.close;
    renderMessages();
  }

  function injectWidgetStylesAndDOM() {
    if (document.getElementById('steve-ai-root')) return;

    const styleEl = document.createElement('style');
    styleEl.id = 'steve-ai-styles';
    styleEl.textContent = `
      #steve-ai-root {
        position: fixed;
        bottom: 88px;
        right: 24px;
        z-index: 9500;
        font-family: 'Inter', sans-serif;
      }
      @media (max-width: 768px) {
        #steve-ai-root {
          bottom: 20px;
          right: 16px;
        }
      }
      /* Round Metallic Floating Icon Button with 3D White/Black Metallic Robot Inside */
      .steve-fab {
        position: relative;
        width: 60px;
        height: 60px;
        padding: 3px;
        border-radius: 50%;
        background: linear-gradient(145deg, #FFFFFF 0%, #D8DEE9 48%, #94A3B8 78%, #F8FAFC 100%);
        border: 1.5px solid rgba(255, 255, 255, 0.95);
        box-shadow: 0 12px 28px rgba(0, 0, 0, 0.32), inset 0 2px 3px rgba(255, 255, 255, 0.9), 0 0 0 2px rgba(15, 23, 42, 0.85);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
      }
      .steve-fab:hover {
        transform: translateY(-3px) scale(1.06);
        box-shadow: 0 16px 34px rgba(0, 0, 0, 0.4), inset 0 2px 4px #FFFFFF, 0 0 0 2.5px #0F172A;
      }
      .steve-fab:active {
        transform: translateY(0) scale(0.96);
      }
      .techman-robot-wrap {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background: radial-gradient(circle at 30% 25%, #FFFFFF, #CBD5E1 70%, #64748B 100%);
      }
      .techman-robot-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
        display: block;
      }
      .steve-fab .techman-robot-svg {
        width: 100%;
        height: 100%;
        display: block;
      }
      .steve-fab-status-dot {
        position: absolute;
        top: 1px;
        right: 1px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #10B981;
        border: 2px solid #FFFFFF;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        z-index: 2;
      }
      /* Compact, Narrower Chat Interface */
      .steve-panel {
        position: absolute;
        bottom: 72px;
        right: 0;
        width: 286px;
        max-width: calc(100vw - 28px);
        height: 420px;
        max-height: calc(100vh - 175px);
        background: rgba(255, 255, 255, 0.92);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border: 1px solid rgba(255, 255, 255, 0.92);
        border-radius: 20px;
        box-shadow: 0 20px 48px rgba(0, 0, 0, 0.22), inset 0 1px 1px rgba(255, 255, 255, 0.95);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        opacity: 0;
        pointer-events: none;
        transform: translateY(12px) scale(0.97);
        transform-origin: bottom right;
        transition: opacity 0.18s cubic-bezier(0.16, 1, 0.3, 1), transform 0.18s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .steve-panel.steve-open {
        opacity: 1;
        pointer-events: auto;
        transform: translateY(0) scale(1);
      }
      .steve-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 12px;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(241, 245, 249, 0.85) 100%);
        border-bottom: 1px solid rgba(15, 23, 42, 0.08);
      }
      .steve-header-left {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
      }
      .steve-header-avatar-box {
        width: 34px;
        height: 34px;
        padding: 2px;
        border-radius: 50%;
        background: linear-gradient(145deg, #FFFFFF 0%, #CBD5E1 60%, #64748B 100%);
        border: 1.5px solid #0F172A;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.14);
      }
      .steve-header-avatar-box .techman-robot-svg {
        width: 100%;
        height: 100%;
      }
      .steve-header-info {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }
      .steve-header-title {
        font-size: 0.86rem;
        font-weight: 800;
        color: #0F172A;
        margin: 0;
        line-height: 1.2;
        letter-spacing: -0.2px;
      }
      .steve-header-sub {
        font-size: 0.68rem;
        color: #475569;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .steve-header-actions {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .steve-icon-btn {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        border: 1px solid rgba(15, 23, 42, 0.12);
        background: #FFFFFF;
        color: #0F172A;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 0.78rem;
        transition: background-color 0.15s ease, color 0.15s ease, transform 0.15s ease;
      }
      .steve-icon-btn:hover {
        background: #0F172A;
        color: #FFFFFF;
        border-color: #0F172A;
      }
      .steve-messages {
        flex: 1;
        overflow-y: auto;
        padding: 12px 11px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        scrollbar-width: thin;
        scrollbar-color: rgba(15, 23, 42, 0.22) transparent;
      }
      .steve-msg {
        display: flex;
        flex-direction: column;
        max-width: 90%;
      }
      .steve-msg-bot {
        align-self: flex-start;
      }
      .steve-msg-user {
        align-self: flex-end;
      }
      .steve-msg-bubble {
        padding: 8px 11px;
        border-radius: 14px;
        font-size: 0.80rem;
        line-height: 1.45;
        word-wrap: break-word;
      }
      .steve-msg-bot .steve-msg-bubble {
        background: #FFFFFF;
        color: #0F172A;
        border: 1px solid rgba(15, 23, 42, 0.09);
        border-bottom-left-radius: 4px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
      }
      .steve-msg-user .steve-msg-bubble {
        background: #0F172A;
        color: #FFFFFF;
        border-bottom-right-radius: 4px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.16);
      }
      .steve-inline-code {
        background: rgba(15, 23, 42, 0.08);
        color: #0F172A;
        padding: 1px 4px;
        border-radius: 4px;
        font-family: monospace;
        font-size: 0.76rem;
      }
      .steve-chips-wrap {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        margin-top: 2px;
      }
      .steve-chip-btn {
        background: #FFFFFF;
        border: 1px solid rgba(15, 23, 42, 0.18);
        color: #0F172A;
        border-radius: 8px;
        padding: 5px 9px;
        font-size: 0.73rem;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.15s ease, color 0.15s ease, transform 0.15s ease;
        white-space: nowrap;
      }
      .steve-chip-btn:hover {
        background: #0F172A;
        color: #FFFFFF;
        transform: translateY(-1px);
      }
      .steve-dest-list {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        margin-top: 6px;
      }
      .steve-dest-btn {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 5px 10px;
        border-radius: 8px;
        background: rgb(209, 92, 8);
        color: #ffffff !important;
        border: 1px solid rgba(255, 255, 255, 0.35);
        font-family: 'Inter', sans-serif;
        font-size: 0.73rem;
        font-weight: 600;
        text-decoration: none !important;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(209, 92, 8, 0.22);
        transition: transform 0.15s ease, background-color 0.15s ease;
        white-space: nowrap;
      }
      .steve-dest-btn:hover {
        background: rgb(175, 72, 0);
        transform: translateY(-1px);
      }
      .steve-dest-arrow {
        font-size: 0.78rem;
        line-height: 1;
      }
      .steve-input-bar {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 10px;
        background: rgba(255, 255, 255, 0.92);
        border-top: 1px solid rgba(15, 23, 42, 0.08);
      }
      .steve-input {
        flex: 1;
        min-width: 0;
        border: 1px solid rgba(15, 23, 42, 0.18);
        background: #FFFFFF;
        color: #0F172A;
        border-radius: 10px;
        padding: 7px 10px;
        font-family: 'Inter', sans-serif;
        font-size: 0.79rem;
        outline: none;
        transition: border-color 0.15s ease;
      }
      .steve-input:focus {
        border-color: #0F172A;
      }
      .steve-send-btn {
        height: 32px;
        padding: 0 11px;
        border-radius: 10px;
        border: none;
        background: #0F172A;
        color: #FFFFFF;
        font-family: 'Inter', sans-serif;
        font-weight: 600;
        font-size: 0.76rem;
        cursor: pointer;
        white-space: nowrap;
        transition: background-color 0.15s ease, transform 0.15s ease;
      }
      .steve-send-btn:hover {
        background: rgb(209, 92, 8);
      }
      .steve-typing-bubble {
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
      .steve-typing-label {
        font-size: 0.72rem;
        color: #64748B;
        margin-left: 3px;
      }
      .steve-dot {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: #0F172A;
        animation: stevePulse 1.2s infinite ease-in-out;
      }
      .steve-dot:nth-child(2) { animation-delay: 0.2s; }
      .steve-dot:nth-child(3) { animation-delay: 0.4s; }
      @keyframes stevePulse {
        0%, 80%, 100% { opacity: 0.3; transform: scale(0.85); }
        40% { opacity: 1; transform: scale(1.1); }
      }
    `;
    document.head.appendChild(styleEl);

    const lang = getActiveLang();
    const t = UI_TEXT[lang] || UI_TEXT.fr;

    const root = document.createElement('div');
    root.id = 'steve-ai-root';
    root.innerHTML = `
      <div id="steve-ai-panel" class="steve-panel" role="dialog" aria-label="TECHMAN AI Portfolio Assistant">
        <div class="steve-header">
          <div class="steve-header-left">
            <div class="steve-header-avatar-box">${ROBOT_AVATAR_HTML}</div>
            <div class="steve-header-info">
              <h4 class="steve-header-title">TECHMAN AI</h4>
              <p id="steve-ai-subtitle" class="steve-header-sub">${t.subtitle}</p>
            </div>
          </div>
          <div class="steve-header-actions">
            <button type="button" id="steve-ai-clear" class="steve-icon-btn" title="${t.clear}" aria-label="${t.clear}">↺</button>
            <button type="button" id="steve-ai-close" class="steve-icon-btn" title="${t.close}" aria-label="${t.close}">✕</button>
          </div>
        </div>
        <div id="steve-ai-messages" class="steve-messages"></div>
        <form id="steve-ai-form" class="steve-input-bar">
          <input type="text" id="steve-ai-input" class="steve-input" placeholder="${t.placeholder}" autocomplete="off" />
          <button type="submit" id="steve-ai-send" class="steve-send-btn">${t.send}</button>
        </form>
      </div>
      <button type="button" id="steve-ai-fab" class="steve-fab" aria-label="TECHMAN AI" title="TECHMAN AI" aria-expanded="false">
        ${ROBOT_AVATAR_HTML}
        <span class="steve-fab-status-dot"></span>
      </button>
    `;
    document.body.appendChild(root);

    document.getElementById('steve-ai-fab').addEventListener('click', () => toggleChatWidget());
    document.getElementById('steve-ai-close').addEventListener('click', () => toggleChatWidget(false));
    document.getElementById('steve-ai-clear').addEventListener('click', () => {
      chatHistory = [];
      saveStoredState();
      renderMessages();
    });
    document.getElementById('steve-ai-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const inputEl = document.getElementById('steve-ai-input');
      if (inputEl) sendUserMessage(inputEl.value);
    });

    if (typeof window.toggleLanguage === 'function' && !window.__steveLangWrapped) {
      const origToggle = window.toggleLanguage;
      window.toggleLanguage = function () {
        origToggle.apply(this, arguments);
        updateWidgetLanguageUI();
      };
      window.__steveLangWrapped = true;
    }
  }

  async function syncDestinationsFromServer() {
    try {
      const res = await fetch('/api/steve-config');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.destinations)) {
          data.destinations.forEach(d => {
            if (d && d.id) DESTINATIONS_MAP[d.id] = d;
          });
        }
      }
    } catch (e) {
      // Uses built-in DEFAULT_DESTINATIONS fallback seamlessly
    }
  }

  function handleUrlDestParameter() {
    try {
      const params = new URLSearchParams(window.location.search);
      const destId = params.get('dest');
      if (destId && DESTINATIONS_MAP[destId]) {
        setTimeout(() => {
          window.navigatePortfolioSection(destId);
          const cleanUrl = window.location.pathname + window.location.hash;
          window.history.replaceState({}, document.title, cleanUrl);
        }, 60);
      }
    } catch (e) {
      // Ignore URL parse issues
    }
  }

  function initSteveAI() {
    loadStoredState();
    injectWidgetStylesAndDOM();
    renderMessages();
    if (isOpen) {
      toggleChatWidget(true);
    }
    syncDestinationsFromServer();
    handleUrlDestParameter();
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initSteveAI);
  } else {
    initSteveAI();
  }
})();
