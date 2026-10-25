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
    { id: 'action-lang-toggle', label_fr: 'Changer la langue (FR/EN)', label_en: 'Switch Language (FR/EN)', type: 'action', destination: 'javascript:toggleLanguage()' },
    { id: 'project-raydar', label_fr: 'Initiative RAYDAR & SafeChild', label_en: 'RAYDAR & SafeChild Initiative', type: 'route', destination: 'safechild-info.html' },
    { id: 'project-xena', label_fr: 'XENA AI (Agent IA Étudiant)', label_en: 'XENA AI (Student AI Agent)', type: 'section', destination: 'index.html?dest=sec-skills' },
    { id: 'about-tekmen', label_fr: 'TekMen Revolution (Vision & Agence)', label_en: 'TekMen Revolution (Vision & Agency)', type: 'sub-section', destination: 'index.html?dest=sec-about-career' },
    { id: 'info-fonds-proto', label_fr: 'Fonds Proto (Lauréat APME)', label_en: 'Fonds Proto (APME Laureate)', type: 'section', destination: 'index.html?dest=sec-education' },
    { id: 'info-mount-fako', label_fr: 'Ascension Mont Fako (4095m)', label_en: 'Mount Fako Summit (4095m)', type: 'section', destination: 'index.html?dest=sec-education' }
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

  // Client-side knowledge base fallback so TECHMAN AI radiates the passionate fan persona even offline
  function resolveClientFallback(rawMessage, lang) {
    const q = (rawMessage || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const isEn = lang === 'en' || /\b(who|what|where|show|tell|can you|how|projects|skills|about|contact|resume)\b/.test(q);
    const wantOpen = /\b(montre|voir|ouvre|afficher|emmene|va |aller|ou sont|ou est|show|open|view|see|take me|go to)\b/.test(q);

    if (q.includes('raydar') || q.includes('safechild') || q.includes('safe child') || q.includes('enfant') || q.includes('missing child')) {
      return {
        reply: isEn
          ? 'Steeve Zali is deeply committed to child safety! Through the **RAYDAR** initiative and the **SafeChild** platform (with team Code4Safety, interviewed live on **Radio Dash Media** in Douala), he builds real-time alerts and community reporting to protect missing children. You can test the SafeChild demo or open the live app below:'
          : 'Steeve Zali est un ardent défenseur de la sécurité des enfants ! Avec l\'initiative **RAYDAR** et la plateforme **SafeChild** (avec son équipe Code4Safety, interviewée en direct sur **Radio Dash Media** à Douala), Steeve met la technologie au service de la protection des enfants et de l\'alerte citoyenne. Découvrez la démo et l\'application ci-dessous :',
        destinations: ['project-raydar', 'page-safechild', 'ext-safechild-app', 'sec-projects-tech'],
        autoNavigate: wantOpen
      };
    }
    if (q.includes('xena') || q.includes('xenaai') || q.includes('compagnon') || q.includes('agent ia') || q.includes('voice reminder') || q.includes('rappel vocal')) {
      return {
        reply: isEn
          ? '**XENA AI** is Steeve\'s groundbreaking student AI companion! Built with React Native, Supabase, Python (FastAPI), Whisper voice recognition, and LLMs, it delivers smart voice reminders and academic tracking. Steeve showcased it at the **Ignite Your Future Tech Fair 2026**!'
          : '**XENA AI**, c\'est le formidable projet d\'agent IA compagnon pour étudiants imaginé par Steeve ! Conçu avec React Native, Supabase, Python (FastAPI), Whisper et des modèles de langage, il propose des rappels vocaux intelligents et un suivi d\'études. Steeve l\'a brillamment présenté à l\'**Ignite Your Future Tech Fair 2026** !',
        destinations: ['project-xena', 'sec-skills', 'sec-projects-tech'],
        autoNavigate: wantOpen
      };
    }
    if (q.includes('tekmen') || q.includes('techmen revolution') || q.includes('revolution') || q.includes('agence') || q.includes('entreprise') || q.includes('agency')) {
      return {
        reply: isEn
          ? '**TekMen Revolution** is the bold entrepreneurial vision founded by Steeve Zali! It represents a tech movement and creative digital agency dedicated to web development, mobile apps, graphic design, video editing, and impactful technology that changes lives!'
          : '**TekMen Revolution**, c\'est la grande vision entrepreneuriale propulsée par Steeve Zali ! C\'est un mouvement technologique et une agence numérique d\'élite dédiée au développement web, aux applications mobiles, au design graphique, à la vidéo et aux solutions concrètes pour la communauté !',
        destinations: ['about-tekmen', 'sec-about-career', 'sec-projects-tech', 'contact-whatsapp'],
        autoNavigate: wantOpen
      };
    }
    if (q.includes('proto') || q.includes('fonds proto') || q.includes('apme') || q.includes('17') || q.includes('2900') || q.includes('2915') || q.includes('subvention') || q.includes('pitch')) {
      return {
        reply: isEn
          ? 'What an incredible achievement! In the 6th edition of **Fonds Proto** (APME Cameroon), Steeve and his team ranked **17th overall out of more than 2,915 applications**, standing out among the 51 finalists and securing **FCFA 1,500,000 in funding**!'
          : 'Quelle immense fierté ! Lors de la 6e édition du **Fonds Proto** (APME Cameroun), Steeve et son équipe se sont hissés à la **17e place sur plus de 2 915 candidatures**, figurant parmi les 51 finalistes et remportant un financement de **1 500 000 FCFA** !',
        destinations: ['info-fonds-proto', 'sec-education', 'file-cv'],
        autoNavigate: wantOpen
      };
    }
    if (q.includes('fako') || q.includes('mont cameroun') || q.includes('mount cameroon') || q.includes('sommet') || q.includes('ascension') || q.includes('montagne') || q.includes('peak')) {
      return {
        reply: isEn
          ? 'Talk about resilience and mental toughness! In May 2026, Steeve conquered the summit of **Mount Fako (Mount Cameroon, 4,095m)**, the highest peak in Central Africa! This same fighting spirit drives his coding and creative work every single day.'
          : 'Une preuve éclatante de ténacité ! En mai 2026, Steeve a conquis le sommet du **Mont Fako (Mont Cameroun, 4 095 m)**, le plus haut pic d\'Afrique Centrale ! Cette même détermination inébranlable se retrouve dans chacun de ses projets tech et design.',
        destinations: ['info-mount-fako', 'sec-education', 'sec-about'],
        autoNavigate: wantOpen
      };
    }
    if (q.includes('pycon') || q.includes('cits') || q.includes('hackathon') || q.includes('orange digital') || q.includes('aims') || q.includes('science week')) {
      return {
        reply: isEn
          ? 'Steeve is a passionate community builder who loves learning in public! He actively took part in **PyCon Cameroon 2026**, **CITS26 (Cameroon International Tech Summit)**, the **Code for Safety Hackathon** at the University of Buea, **Code for the Planet** (Orange Digital Center), and **Africa Science Week** (AIMS)!'
          : 'Steeve adore apprendre en public et dynamiser l\'écosystème tech ! Il a participé avec brio à **PyCon Cameroon 2026**, au **CITS26 (Cameroon International Tech Summit)**, au hackathon **Code for Safety** à Buea, à **Code for the Planet** (Orange Digital Center) et à l\'**Africa Science Week** (AIMS) !',
        destinations: ['sec-education', 'sec-about-passion', 'sec-about-career'],
        autoNavigate: wantOpen
      };
    }
    if (q.includes('data science') || q.includes('machine learning') || q.includes('deep learning')) {
      return {
        reply: isEn
          ? 'Steeve has a huge passion for the future of AI! While currently focusing on **Full-Stack Web & Mobile Development** and smart tools like **XENA AI**, his long-term specialization goal is **Data Science and AI-driven applications**. Explore his tech stack and projects below:'
          : 'Steeve est passionné par l\'avenir de l\'IA ! Tout en excellant en **Développement Web & Mobile** et en concevant des outils comme **XENA AI**, son grand objectif à long terme est la spécialisation en **Data Science et applications guidées par l\'IA**. Découvrez ses projets ci-dessous :',
        destinations: ['sec-projects-tech', 'sec-skills', 'about-tekmen'],
        autoNavigate: wantOpen
      };
    }
    if (q.includes('video') || q.includes('montage') || q.includes('premiere') || q.includes('capcut') || q.includes('showreel')) {
      return {
        reply: isEn
          ? 'Steeve\'s video editing skills are electrifying! Mastering **Adobe Premiere Pro**, **CapCut Pro**, KineMaster, InShot, and YouCut on PC and mobile, he crafts high-impact showreels and commercials. Check out his video showreel gallery below:'
          : 'Le talent de Steeve en montage vidéo est sensationnel ! Maîtrisant **Adobe Premiere Pro**, **CapCut Pro**, KineMaster, InShot et YouCut sur PC et mobile, il donne vie à des visuels rythmés et captivants. Découvrez sa galerie vidéo :',
        destinations: ['sec-projects-video', 'modal-video-1', 'sec-skills-video'],
        autoNavigate: wantOpen
      };
    }
    if (q.includes('design') || q.includes('graphi') || q.includes('flyer') || q.includes('affiche') || q.includes('logo') || q.includes('packaging') || q.includes('etiquette') || q.includes('visuel')) {
      if (q.includes('packaging') || q.includes('etiquette') || q.includes('logo') || q.includes('identite') || q.includes('carte de visite') || q.includes('brand')) {
        return {
          reply: isEn
            ? 'Here is Steeve\'s **Brand Identity & Packaging** collection (Danielle/Danie juices, Berger, Yogurt labels, Manou Pretty Design cards, JZ Pressing banners) — pure visual craftsmanship!'
            : 'Voici la superbe collection **Identité & Packaging** de Steeve (étiquettes jus Danielle/Danie, Berger, Yaourt, cartes de visite Manou Pretty Design, banderole JZ Pressing) — un vrai régal visuel !',
          destinations: ['cat-branding', 'sec-projects-graphic', 'sec-skills-graphic'],
          autoNavigate: true
        };
      }
      return {
        reply: isEn
          ? 'Steeve has created over **71 validated graphic design pieces** organized into 5 rich categories, perfected on Photoshop, Illustrator, Figma, Canva, and PixelLab! Prepare to be impressed:'
          : 'Steeve compte plus de **71 créations graphiques remarquables** réparties en 5 univers thématiques, conçues avec Photoshop, Illustrator, Figma, Canva et PixelLab ! Laissez-vous inspirer :',
        destinations: ['sec-projects-graphic', 'sec-projects-graphic-cats', 'cat-branding', 'sec-skills-graphic'],
        autoNavigate: wantOpen
      };
    }
    if (q.includes('etude') || q.includes('parcours') || q.includes('ecole') || q.includes('universite') || q.includes('buea') || q.includes('education') || q.includes('diplome') || q.includes('gce') || q.includes('imhotep')) {
      return {
        reply: isEn
          ? 'Steeve earned his **GCE Advanced Level in 2024** at **IMHOTEP GREAT SCHOOL** and is now a dedicated **Level 300 BSc Computer Science student** at the **University of Buea** (Faculty of Science), continuously learning via freeCodeCamp, W3Schools, and tech bootcamps!'
          : 'Steeve a obtenu son **GCE Advanced Level en 2024** à **IMHOTEP GREAT SCHOOL** et brille actuellement comme **étudiant de niveau 300 (3e année de BSc) en Informatique à l\'Université de Buea**, avec un apprentissage continu sur freeCodeCamp, W3Schools et des bootcamps de pointe !',
        destinations: ['sec-education', 'file-cv', 'info-fonds-proto'],
        autoNavigate: wantOpen
      };
    }
    if (q.includes('contact') || q.includes('joindre') || q.includes('whatsapp') || q.includes('telephone') || q.includes('linkedin') || q.includes('github') || q.includes('cv') || q.includes('resume')) {
      return {
        reply: isEn
          ? 'Connecting with Steeve is fast and easy! Reach out to him directly on WhatsApp or phone at **+237 697 368 251**, connect on **LinkedIn** and **GitHub (TECHMAN237)**, or download his **CV (PDF)** below:'
          : 'Collaborer avec Steeve, c\'est un plaisir ! Joignez-le directement sur WhatsApp ou par téléphone au **+237 697 368 251**, suivez ses profils **LinkedIn** et **GitHub (TECHMAN237)**, ou téléchargez son **C.V (PDF)** ci-dessous :',
        destinations: ['contact-whatsapp', 'contact-linkedin', 'contact-github', 'file-cv'],
        autoNavigate: false
      };
    }
    if (q.includes('temoignage') || q.includes('avis') || q.includes('testimonial')) {
      return {
        reply: isEn
          ? 'Steeve\'s clients and partners (Asaph N., Laurent, Komze William, Ariel Kafto, Ange Youmsi, Jordan Azapgue) unanimously praise his speed, creativity, high reliability, and infectious positive energy! Read all reviews here:'
          : 'Les clients et partenaires de Steeve (Asaph N., Laurent, Komze William, Ariel Kafto, Ange Youmsi, Jordan Azapgue) adorent sa rapidité d\'exécution, sa fiabilité à toute épreuve et sa créativité débordante ! Lisez leurs retours ici :',
        destinations: ['page-testimonials'],
        autoNavigate: false
      };
    }
    if (q.includes('competence') || q.includes('skill') || q.includes('service') || q.includes('techno') || q.includes('react')) {
      return {
        reply: isEn
          ? 'Steeve is a multi-talented powerhouse! His capabilities span **Web & Mobile Development** (HTML/CSS, JS, React, React Native, Python, Spline 3D), **Graphic Design** (Photoshop, Illustrator, Figma, Canva), **Video Editing** (Premiere Pro, CapCut Pro), **Content Creation**, and **STEM Tutoring**!'
          : 'Steeve est un véritable couteau suisse du numérique ! Il maîtrise le **Développement Web & Mobile** (HTML/CSS, JS, React, React Native, Python, Spline 3D), le **Design Graphique** (Photoshop, Illustrator, Figma, Canva), le **Montage Vidéo** (Premiere Pro, CapCut Pro), la **Création de Contenu** et l\'**Enseignement** !',
        destinations: ['sec-skills', 'sec-skills-graphic', 'sec-skills-video', 'sec-skills-teach'],
        autoNavigate: wantOpen
      };
    }
    if (q.includes('projet') || q.includes('project') || q.includes('web') || q.includes('realisation')) {
      return {
        reply: isEn
          ? 'Prepare to be inspired by Steeve\'s creations! Explore his **Web & Tech Projects** (SAFECHILD, Rock Attitude, GO CLONE, DevOps Portfolio, My Portfolio), his **Graphic Design Gallery** (71 visuals), and his dynamic **Video Showreel**:'
          : 'Plongez au cœur des créations de Steeve ! Découvrez ses **Projets Tech & Web** (SAFECHILD, Rock Attitude, GO CLONE, Portfolio DevOps, Mon Portfolio), sa **Galerie Design Graphique** (71 visuels) et son **Showreel Vidéo** percutant :',
        destinations: ['sec-projects-tech', 'sec-projects-graphic', 'sec-projects-video', 'page-safechild'],
        autoNavigate: wantOpen
      };
    }
    return {
      reply: isEn
        ? '**Steeve Zali (alias TECHMAN)** is one of the most promising young tech talents in Cameroon! A passionate Level 300 Computer Science student at the University of Buea, versatile full-stack builder, visionary behind **TekMen Revolution**, graphic artist with 71+ designs, video editor, and Mount Fako summit conqueror. He uses technology to transform lives!'
        : '**Steeve Zali (alias TECHMAN)** est l\'un des jeunes bâtisseurs tech les plus prometteurs du Cameroun ! Étudiant passionné de niveau 300 en Informatique à l\'Université de Buea, développeur full-stack créatif, fondateur de **TekMen Revolution**, designer aux 71+ créations, monteur vidéo et vainqueur du sommet du Mont Fako. Il met son énergie au service de l\'impact social !',
      destinations: ['sec-about', 'sec-projects-tech', 'about-tekmen', 'contact-whatsapp'],
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
      case 'info-fonds-proto':
      case 'info-mount-fako':
        window.adddiv1();
        break;
      case 'project-xena':
        window.addButtons();
        break;
      case 'about-tekmen':
        window.addAbout();
        highlightSubMenuIndex(2);
        window.renderSubContent(window.getT('about_career'), window.getT('about_career_desc'));
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
      subtitle: 'Fan n°1 & Guide de Steeve Zali',
      placeholder: 'Posez une question sur Steeve ou ses projets...',
      send: 'Envoyer',
      welcome: 'Bonjour et bienvenue ! Je suis **TECHMAN AI**, le fan n°1 et guide officiel de **Steeve Zali** et de **TekMen Revolution** ! Posez-moi toutes vos questions sur son parcours, ses projets innovants (**RAYDAR**, **SafeChild**, **XENA AI**), ses créations ou son ascension du Mont Fako !',
      typing: 'TECHMAN AI répond avec passion...',
      clear: 'Effacer la conversation',
      close: 'Fermer',
      chips: [
        { label: '🚀 Qui est Steeve ?', query: 'Parle-moi de Steeve Zali et de son parcours !' },
        { label: '🛡️ RAYDAR & SafeChild', query: 'C\'est quoi l\'initiative RAYDAR et SafeChild ?' },
        { label: '🤖 Projet XENA AI', query: 'Présente-moi le projet XENA AI !' },
        { label: '⚡ TekMen Revolution', query: 'Parle-moi de TekMen Revolution et de sa vision !' },
        { label: '🎨 71 Designs Graphiques', query: 'Montre-moi ses 71 réalisations en design graphique' },
        { label: '🏔️ Mont Fako (4095m)', query: 'Parle-moi de son ascension du sommet du Mont Fako !' }
      ]
    },
    en: {
      title: 'TECHMAN AI',
      subtitle: '#1 Fan & Guide to Steeve Zali',
      placeholder: 'Ask about Steeve, his projects, or vision...',
      send: 'Send',
      welcome: 'Welcome! I am **TECHMAN AI**, the #1 fan and official guide of **Steeve Zali** and **TekMen Revolution**! Ask me anything about his journey, his breakthrough projects (**RAYDAR**, **SafeChild**, **XENA AI**), his 71+ graphic designs, or his Mount Fako summit victory!',
      typing: 'TECHMAN AI is enthusiastically replying...',
      clear: 'Clear chat',
      close: 'Close',
      chips: [
        { label: '🚀 Who is Steeve?', query: 'Tell me all about Steeve Zali and his journey!' },
        { label: '🛡️ RAYDAR & SafeChild', query: 'What is the RAYDAR and SafeChild initiative?' },
        { label: '🤖 XENA AI Project', query: 'Tell me about the XENA AI companion project!' },
        { label: '⚡ TekMen Revolution', query: 'What is TekMen Revolution and its vision?' },
        { label: '🎨 71 Graphic Designs', query: 'Show me Steeve\'s 71 graphic design creations' },
        { label: '🏔️ Mount Fako (4095m)', query: 'Tell me about his Mount Fako summit victory!' }
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
