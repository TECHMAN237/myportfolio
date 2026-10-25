import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '1mb' }));

// Helper to load TECHMAN AI knowledge bases, system prompt, and structured destinations
function loadSteveResources() {
  const cvKnowledge = fs.existsSync(path.join(__dirname, 'steeve_zali_cv_knowledge_base.md'))
    ? fs.readFileSync(path.join(__dirname, 'steeve_zali_cv_knowledge_base.md'), 'utf-8')
    : '';
  const contextKnowledge = fs.existsSync(path.join(__dirname, 'steeve_zali_techmen_revolution_context.md'))
    ? fs.readFileSync(path.join(__dirname, 'steeve_zali_techmen_revolution_context.md'), 'utf-8')
    : '';
  const portfolioKnowledge = fs.existsSync(path.join(__dirname, 'Steve.md'))
    ? fs.readFileSync(path.join(__dirname, 'Steve.md'), 'utf-8')
    : '';
  const systemPrompt = fs.readFileSync(path.join(__dirname, 'Steve-System-Prompt.md'), 'utf-8');
  const destinations = JSON.parse(fs.readFileSync(path.join(__dirname, 'steve-destinations.json'), 'utf-8'));
  return { cvKnowledge, contextKnowledge, portfolioKnowledge, systemPrompt, destinations };
}

// Resilient knowledge-base resolver grounded in the official markdown files & destinations
function resolveTechmanFallback(rawMessage, lang = 'fr') {
  const q = (rawMessage || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const isEn = lang === 'en' || /\b(who|what|where|show|tell|can you|how|projects|skills|about|contact|resume)\b/.test(q);
  const wantOpen = /\b(montre|voir|ouvre|afficher|emmene|va |aller|ou sont|ou est|show|open|view|see|take me|go to)\b/.test(q);

  // RAYDAR & SafeChild child safety initiatives
  if (q.includes('raydar') || q.includes('safechild') || q.includes('safe child') || q.includes('enfant') || q.includes('missing child')) {
    return {
      reply: isEn
        ? 'Steeve Zali is deeply passionate about child safety! Through the **RAYDAR** initiative and the **SafeChild** platform (with team Code4Safety, interviewed live on **Radio Dash Media** in Douala), he builds real-time alerts and community reporting to protect missing children. You can test the SafeChild demo or open the live app below:'
        : 'Steeve Zali est un ardent défenseur de la sécurité des enfants ! Avec l\'initiative **RAYDAR** et la plateforme **SafeChild** (avec son équipe Code4Safety, interviewée en direct sur **Radio Dash Media** à Douala), Steeve met la technologie au service de la protection des enfants et de l\'alerte citoyenne. Découvrez la démo et l\'application ci-dessous :',
      destinations: ['project-raydar', 'page-safechild', 'ext-safechild-app', 'sec-projects-tech'],
      autoNavigate: wantOpen
    };
  }

  // XENA AI / Student AI Companion
  if (q.includes('xena') || q.includes('xenaai') || q.includes('compagnon') || q.includes('agent ia') || q.includes('voice reminder') || q.includes('rappel vocal')) {
    return {
      reply: isEn
        ? '**XENA AI** is Steeve\'s groundbreaking student AI companion! Built with React Native, Supabase, Python (FastAPI), Whisper voice recognition, and LLMs, it delivers voice reminders and helps students conquer their academic goals. Steeve proudly showcased it at the **Ignite Your Future Tech Fair 2026**!'
        : '**XENA AI**, c\'est le formidable projet d\'agent IA compagnon pour étudiants imaginé par Steeve ! Conçu avec React Native, Supabase, Python (FastAPI), Whisper et des modèles de langage, il propose des rappels vocaux intelligents et un suivi d\'études. Steeve l\'a brillamment présenté à l\'**Ignite Your Future Tech Fair 2026** !',
      destinations: ['project-xena', 'sec-skills', 'sec-projects-tech'],
      autoNavigate: wantOpen
    };
  }

  // TekMen Revolution / Agency / Entrepreneurship
  if (q.includes('tekmen') || q.includes('techmen revolution') || q.includes('revolution') || q.includes('agence') || q.includes('entreprise') || q.includes('agency')) {
    return {
      reply: isEn
        ? '**TekMen Revolution** is the bold entrepreneurial vision founded by Steeve Zali! It represents a tech movement and creative digital agency dedicated to web development, mobile apps, graphic design, video editing, and impactful technology that changes lives!'
        : '**TekMen Revolution**, c\'est la grande vision entrepreneuriale propulsée par Steeve Zali ! C\'est un mouvement technologique et une agence numérique d\'élite dédiée au développement web, aux applications mobiles, au design graphique, à la vidéo et aux solutions concrètes pour la communauté !',
      destinations: ['about-tekmen', 'sec-about-career', 'sec-projects-tech', 'contact-whatsapp'],
      autoNavigate: wantOpen
    };
  }

  // Fonds Proto / APME
  if (q.includes('proto') || q.includes('fonds proto') || q.includes('apme') || q.includes('17') || q.includes('2900') || q.includes('2915') || q.includes('subvention') || q.includes('pitch')) {
    return {
      reply: isEn
        ? 'What an incredible achievement! In the 6th edition of **Fonds Proto** (APME Cameroon), Steeve and his team ranked **17th overall out of more than 2,915 applications**, standing out among the 51 finalists and securing **FCFA 1,500,000 in funding**!'
        : 'Quelle immense fierté ! Lors de la 6e édition du **Fonds Proto** (APME Cameroun), Steeve et son équipe se sont hissés à la **17e place sur plus de 2 915 candidatures**, figurant parmi les 51 finalistes et remportant un financement de **1 500 000 FCFA** !',
      destinations: ['info-fonds-proto', 'sec-education', 'file-cv'],
      autoNavigate: wantOpen
    };
  }

  // Mount Fako / Mount Cameroon
  if (q.includes('fako') || q.includes('mont cameroun') || q.includes('mount cameroon') || q.includes('sommet') || q.includes('ascension') || q.includes('montagne') || q.includes('peak')) {
    return {
      reply: isEn
        ? 'Talk about resilience and mental toughness! In May 2026, Steeve conquered the summit of **Mount Fako (Mount Cameroon, 4,095m)**, the highest peak in Central Africa! This same fighting spirit drives his coding and creative work every single day.'
        : 'Une preuve éclatante de ténacité ! En mai 2026, Steeve a conquis le sommet du **Mont Fako (Mont Cameroun, 4 095 m)**, le plus haut pic d\'Afrique Centrale ! Cette même détermination inébranlable se retrouve dans chacun de ses projets tech et design.',
      destinations: ['info-mount-fako', 'sec-education', 'sec-about'],
      autoNavigate: wantOpen
    };
  }

  // Tech Events / Communities / PyCon / CITS26 / Hackathons
  if (q.includes('pycon') || q.includes('cits') || q.includes('hackathon') || q.includes('orange digital') || q.includes('aims') || q.includes('science week') || q.includes('evenement tech') || q.includes('conference tech')) {
    return {
      reply: isEn
        ? 'Steeve is a passionate community builder who loves learning in public! He actively took part in **PyCon Cameroon 2026**, **CITS26 (Cameroon International Tech Summit)**, the **Code for Safety Hackathon** at the University of Buea, **Code for the Planet** (Orange Digital Center), and **Africa Science Week** (AIMS)!'
        : 'Steeve adore apprendre en public et dynamiser l\'écosystème tech ! Il a participé avec brio à **PyCon Cameroon 2026**, au **CITS26 (Cameroon International Tech Summit)**, au hackathon **Code for Safety** à Buea, à **Code for the Planet** (Orange Digital Center) et à l\'**Africa Science Week** (AIMS) !',
      destinations: ['sec-education', 'sec-about-passion', 'sec-about-career'],
      autoNavigate: wantOpen
    };
  }

  // Data Science / AI
  if (q.includes('data science') || q.includes('machine learning') || q.includes('deep learning')) {
    return {
      reply: isEn
        ? 'Steeve has a huge passion for the future of AI! While currently focusing on **Full-Stack Web & Mobile Development** and smart tools like **XENA AI**, his long-term specialization goal is **Data Science and AI-driven applications**. Explore his tech stack and projects below:'
        : 'Steeve est passionné par l\'avenir de l\'IA ! Tout en excellant en **Développement Web & Mobile** et en concevant des outils comme **XENA AI**, son grand objectif à long terme est la spécialisation en **Data Science et applications guidées par l\'IA**. Découvrez ses projets ci-dessous :',
      destinations: ['sec-projects-tech', 'sec-skills', 'about-tekmen'],
      autoNavigate: wantOpen
    };
  }

  // Specific project: Rock Attitude
  if (q.includes('rock attitude') || q.includes('rock')) {
    return {
      reply: isEn
        ? '**Rock Attitude Showcase Website** is an elegant corporate website built and delivered by Steeve for a landscaping and outdoor architecture firm. A testament to his full-stack delivery!'
        : '**Rock Attitude Showcase Website** est un magnifique site vitrine d\'entreprise conçu et livré par Steeve pour une société d\'aménagement paysager et d\'architecture extérieure. Une démonstration parfaite de son savoir-faire !',
      destinations: ['ext-rock-attitude', 'sec-projects-tech'],
      autoNavigate: false
    };
  }

  // Specific project: GO CLONE
  if (q.includes('go clone') || q.includes('goclone') || q.includes('portail') || q.includes('campus')) {
    return {
      reply: isEn
        ? '**GO CLONE** is Steeve\'s first web creation, where he recreated and upgraded the student campus portal of the University of Buea with modern UI elements!'
        : '**GO CLONE** est la toute première création web de Steeve, où il a recréé et modernisé le portail étudiant du campus de l\'Université de Buea avec une interface élégante !',
      destinations: ['ext-goclone', 'sec-projects-tech'],
      autoNavigate: false
    };
  }

  // Specific project: DevOps / Apollos
  if (q.includes('devops') || q.includes('apollos') || q.includes('apolos')) {
    return {
      reply: isEn
        ? '**DevOps Portfolio** is a bespoke portfolio built by Steeve to empower a senior tech/DevOps specialist (Apollos). Steeve always supports fellow tech builders!'
        : '**Portfolio DevOps** est un portfolio sur-mesure réalisé par Steeve pour valoriser le travail d\'un aîné du secteur Tech/DevOps (Apollos). Steeve a toujours à cœur de soutenir ses pairs !',
      destinations: ['ext-devops-portfolio', 'sec-projects-tech'],
      autoNavigate: false
    };
  }

  // Video editing
  if (q.includes('video') || q.includes('montage') || q.includes('premiere') || q.includes('capcut') || q.includes('showreel')) {
    return {
      reply: isEn
        ? 'Steeve\'s video editing skills are electrifying! Mastering **Adobe Premiere Pro**, **CapCut Pro**, KineMaster, InShot, and YouCut on PC and mobile, he crafts high-impact showreels and commercials. Check out his video showreel gallery below:'
        : 'Le talent de Steeve en montage vidéo est sensationnel ! Maîtrisant **Adobe Premiere Pro**, **CapCut Pro**, KineMaster, InShot et YouCut sur PC et mobile, il donne vie à des visuels rythmés et captivants. Découvrez sa galerie vidéo :',
      destinations: ['sec-projects-video', 'modal-video-1', 'sec-skills-video'],
      autoNavigate: wantOpen
    };
  }

  // Graphic Design & categories
  if (q.includes('design') || q.includes('graphi') || q.includes('flyer') || q.includes('affiche') || q.includes('logo') || q.includes('packaging') || q.includes('etiquette') || q.includes('visuel') || q.includes('photoshop') || q.includes('illustrator') || q.includes('figma') || q.includes('canva')) {
    if (q.includes('packaging') || q.includes('etiquette') || q.includes('logo') || q.includes('identite') || q.includes('carte de visite') || q.includes('brand')) {
      return {
        reply: isEn
          ? 'Here is Steeve\'s **Brand Identity & Packaging** collection (Danielle/Danie juices, Berger, Yogurt labels, Manou Pretty Design cards, JZ Pressing banners) — pure visual craftsmanship!'
          : 'Voici la superbe collection **Identité & Packaging** de Steeve (étiquettes jus Danielle/Danie, Berger, Yaourt, cartes de visite Manou Pretty Design, banderole JZ Pressing) — un vrai régal visuel !',
        destinations: ['cat-branding', 'sec-projects-graphic', 'sec-skills-graphic'],
        autoNavigate: true
      };
    }
    if (q.includes('anniversaire') || q.includes('birthday') || q.includes('noel') || q.includes('celebration')) {
      return {
        reply: isEn
          ? 'Celebrate life with Steeve\'s vibrant **Birthdays & Celebrations** graphics:'
          : 'Célébrez la vie avec les superbes créations de la catégorie **Anniversaires & Célébrations** :',
        destinations: ['cat-birthdays', 'sec-projects-graphic'],
        autoNavigate: true
      };
    }
    if (q.includes('evenement') || q.includes('conference') || q.includes('event') || q.includes('eglise') || q.includes('culte')) {
      return {
        reply: isEn
          ? 'Discover Steeve\'s high-impact poster collection for **Events & Conferences**:'
          : 'Découvrez les affiches percutantes de Steeve pour la catégorie **Événements & Conférences** :',
        destinations: ['cat-events', 'sec-projects-graphic'],
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

  // Education / Academic background
  if (q.includes('etude') || q.includes('parcours') || q.includes('ecole') || q.includes('universite') || q.includes('buea') || q.includes('education') || q.includes('diplome') || q.includes('gce') || q.includes('imhotep') || q.includes('formation')) {
    return {
      reply: isEn
        ? 'Steeve earned his **GCE Advanced Level in 2024** at **IMHOTEP GREAT SCHOOL** and is now a dedicated **Level 300 BSc Computer Science student** at the **University of Buea** (Faculty of Science), continuously learning via freeCodeCamp, W3Schools, and tech bootcamps!'
        : 'Steeve a obtenu son **GCE Advanced Level en 2024** à **IMHOTEP GREAT SCHOOL** et brille actuellement comme **étudiant de niveau 300 (3e année de BSc) en Informatique à l\'Université de Buea**, avec un apprentissage continu sur freeCodeCamp, W3Schools et des bootcamps de pointe !',
      destinations: ['sec-education', 'file-cv', 'info-fonds-proto'],
      autoNavigate: wantOpen
    };
  }

  // Contact / Social / LinkedIn / GitHub / WhatsApp / Phone / CV
  if (q.includes('contact') || q.includes('joindre') || q.includes('whatsapp') || q.includes('telephone') || q.includes('numero') || q.includes('appel') || q.includes('linkedin') || q.includes('github') || q.includes('cv') || q.includes('resume')) {
    return {
      reply: isEn
        ? 'Connecting with Steeve is fast and easy! Reach out to him directly on WhatsApp or phone at **+237 697 368 251**, connect on **LinkedIn** and **GitHub (TECHMAN237)**, or download his **CV (PDF)** below:'
        : 'Collaborer avec Steeve, c\'est un plaisir ! Joignez-le directement sur WhatsApp ou par téléphone au **+237 697 368 251**, suivez ses profils **LinkedIn** et **GitHub (TECHMAN237)**, ou téléchargez son **C.V (PDF)** ci-dessous :',
      destinations: ['contact-whatsapp', 'contact-linkedin', 'contact-github', 'file-cv'],
      autoNavigate: false
    };
  }

  // Testimonials / Reviews
  if (q.includes('temoignage') || q.includes('avis') || q.includes('client') || q.includes('testimonial') || q.includes('review')) {
    return {
      reply: isEn
        ? 'Steeve\'s clients and partners (Asaph N., Laurent, Komze William, Ariel Kafto, Ange Youmsi, Jordan Azapgue) unanimously praise his speed, creativity, high reliability, and infectious positive energy! Read all reviews here:'
        : 'Les clients et partenaires de Steeve (Asaph N., Laurent, Komze William, Ariel Kafto, Ange Youmsi, Jordan Azapgue) adorent sa rapidité d\'exécution, sa fiabilité à toute épreuve et sa créativité débordante ! Lisez leurs retours ici :',
      destinations: ['page-testimonials'],
      autoNavigate: false
    };
  }

  // Skills / Technologies / Services
  if (q.includes('competence') || q.includes('skill') || q.includes('techno') || q.includes('service') || q.includes('outil') || q.includes('langage') || q.includes('react') || q.includes('python') || q.includes('mobile') || q.includes('enseign') || q.includes('prof')) {
    return {
      reply: isEn
        ? 'Steeve is a multi-talented powerhouse! His capabilities span **Web & Mobile Development** (HTML/CSS, JS, React, React Native, Python, Spline 3D), **Graphic Design** (Photoshop, Illustrator, Figma, Canva), **Video Editing** (Premiere Pro, CapCut Pro), **Content Creation**, and **STEM Tutoring**!'
        : 'Steeve est un véritable couteau suisse du numérique ! Il maîtrise le **Développement Web & Mobile** (HTML/CSS, JS, React, React Native, Python, Spline 3D), le **Design Graphique** (Photoshop, Illustrator, Figma, Canva), le **Montage Vidéo** (Premiere Pro, CapCut Pro), la **Création de Contenu** et l\'**Enseignement** !',
      destinations: ['sec-skills', 'sec-skills-graphic', 'sec-skills-video', 'sec-skills-teach'],
      autoNavigate: wantOpen
    };
  }

  // Projects (general)
  if (q.includes('projet') || q.includes('project') || q.includes('realisation') || q.includes('portfolio') || q.includes('web')) {
    return {
      reply: isEn
        ? 'Prepare to be inspired by Steeve\'s creations! Explore his **Web & Tech Projects** (SAFECHILD, Rock Attitude, GO CLONE, DevOps Portfolio, My Portfolio), his **Graphic Design Gallery** (71 visuals), and his dynamic **Video Showreel**:'
        : 'Plongez au cœur des créations de Steeve ! Découvrez ses **Projets Tech & Web** (SAFECHILD, Rock Attitude, GO CLONE, Portfolio DevOps, Mon Portfolio), sa **Galerie Design Graphique** (71 visuels) et son **Showreel Vidéo** percutant :',
      destinations: ['sec-projects-tech', 'sec-projects-graphic', 'sec-projects-video', 'page-safechild'],
      autoNavigate: wantOpen
    };
  }

  // About / Identity / Goals
  if (q.includes('qui est') || q.includes('qui es') || q.includes('who is') || q.includes('about') || q.includes('propos') || q.includes('steeve') || q.includes('steve') || q.includes('techman') || q.includes('objectif') || q.includes('passion') || q.includes('but')) {
    return {
      reply: isEn
        ? '**Steeve Zali (alias TECHMAN)** is one of the most promising young tech talents in Cameroon! A passionate Level 300 Computer Science student at the University of Buea, versatile full-stack builder, visionary behind **TekMen Revolution**, graphic artist with 71+ designs, video editor, and Mount Fako summit conqueror. He uses technology to transform lives!'
        : '**Steeve Zali (alias TECHMAN)** est l\'un des jeunes bâtisseurs tech les plus prometteurs du Cameroun ! Étudiant passionné de niveau 300 en Informatique à l\'Université de Buea, développeur full-stack créatif, fondateur de **TekMen Revolution**, designer aux 71+ créations, monteur vidéo et vainqueur du sommet du Mont Fako. Il met son énergie au service de l\'impact social !',
      destinations: ['sec-about', 'sec-projects-tech', 'about-tekmen', 'contact-whatsapp'],
      autoNavigate: wantOpen
    };
  }

  // Default greeting / general help
  return {
    reply: isEn
      ? 'Hello and welcome! I am **TECHMAN AI**, the #1 fan and official guide of **Steeve Zali** and **TekMen Revolution**! I can show you his awesome **Tech Projects**, **71 Graphic Designs**, **Video Showreel**, **Education**, or tell you all about his journey!'
      : 'Bonjour et bienvenue ! Je suis **TECHMAN AI**, le fan n°1 et guide officiel de **Steeve Zali** et de **TekMen Revolution** ! Je peux vous faire découvrir ses superbes **Projets Web**, ses **71 Designs Graphiques**, son **Showreel Vidéo**, son **Parcours Académique**, ou répondre avec passion à toutes vos questions !',
    destinations: ['sec-projects-tech', 'sec-projects-graphic', 'about-tekmen', 'contact-whatsapp'],
    autoNavigate: false
  };
}

// Endpoint to expose structured destinations source of truth to the client
app.get('/api/steve-config', (req, res) => {
  try {
    const { destinations } = loadSteveResources();
    res.json({ destinations });
  } catch (error) {
    console.error('Error loading TECHMAN AI config:', error);
    res.status(500).json({ error: 'Failed to load TECHMAN AI configuration.' });
  }
});

// Endpoint for TECHMAN AI conversational assistant
app.post('/api/steve-chat', async (req, res) => {
  const { message, history = [], lang = 'fr', currentPage = 'index.html' } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    const { cvKnowledge, contextKnowledge, portfolioKnowledge, systemPrompt, destinations } = loadSteveResources();
    const validIds = new Set(destinations.map(d => d.id));

    if (!process.env.GEMINI_API_KEY) {
      return res.json(resolveTechmanFallback(message, lang));
    }

    const destinationsSummary = destinations.map(d => ({
      id: d.id,
      name: d.name,
      label_fr: d.label_fr,
      label_en: d.label_en,
      type: d.type,
      description: d.description
    }));

    const fullSystemInstruction = [
      systemPrompt,
      '\n\n---\n\n# BASE DE CONNAISSANCES OFFICIELLE N°1 — CV ET FORMATION (`steeve_zali_cv_knowledge_base.md`)\n\n',
      cvKnowledge,
      '\n\n---\n\n# BASE DE CONNAISSANCES OFFICIELLE N°2 — CONTEXTE LINKEDIN, PROJETS ET TEKMEN REVOLUTION (`steeve_zali_techmen_revolution_context.md`)\n\n',
      contextKnowledge,
      '\n\n---\n\n# BASE DE CONNAISSANCES N°3 — PORTFOLIO, DESIGN ET TÉMOIGNAGES (`Steve.md`)\n\n',
      portfolioKnowledge,
      '\n\n---\n\n# CATALOGUE DES DESTINATIONS DISPONIBLES (`steve-destinations.json`)\n\n',
      JSON.stringify(destinationsSummary, null, 2),
      `\n\nContexte actuel du visiteur : Page courante = "${currentPage}", Langue de l'interface = "${lang}".`
    ].join('');

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const contents = [];
    if (Array.isArray(history)) {
      for (const turn of history.slice(-8)) {
        if (turn && (turn.role === 'user' || turn.role === 'model') && typeof turn.text === 'string' && turn.text.trim()) {
          contents.push({
            role: turn.role,
            parts: [{ text: turn.text }]
          });
        }
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        reply: {
          type: Type.STRING,
          description: 'Short, natural, helpful response to the visitor in the language of their query.'
        },
        destinations: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'List of exact destination IDs from the catalog that match the user request (maximum 4).'
        },
        autoNavigate: {
          type: Type.BOOLEAN,
          description: 'Set to true if the user is explicitly asking to view, open, or go to a specific section/gallery/modal in the portfolio.'
        }
      },
      required: ['reply', 'destinations', 'autoNavigate']
    };

    // Call gemini-3.1-flash-lite with a 5.5s timeout for low-latency response
    const response = await Promise.race([
      ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents,
        config: {
          systemInstruction: fullSystemInstruction,
          temperature: 0.3,
          responseMimeType: 'application/json',
          responseSchema
        }
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Model timeout')), 5500))
    ]);

    const rawText = response.text || '{}';
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (parseErr) {
      parsed = resolveTechmanFallback(message, lang);
    }

    // Strict validation: never allow any destination ID not in steve-destinations.json
    const validatedDestinations = Array.isArray(parsed.destinations)
      ? parsed.destinations.filter(id => typeof id === 'string' && validIds.has(id)).slice(0, 4)
      : [];

    // If model returned no destinations when fallback clearly identifies relevant ones, enrich with validated fallback destinations
    const fallbackResult = resolveTechmanFallback(message, lang);
    const finalDestinations = validatedDestinations.length > 0
      ? validatedDestinations
      : fallbackResult.destinations.filter(id => validIds.has(id)).slice(0, 4);

    return res.json({
      reply: parsed.reply || fallbackResult.reply,
      destinations: finalDestinations,
      autoNavigate: typeof parsed.autoNavigate === 'boolean' ? parsed.autoNavigate : fallbackResult.autoNavigate
    });
  } catch (error) {
    console.warn('TECHMAN AI using instant local knowledge base fallback:', error?.message);
    return res.json(resolveTechmanFallback(message, lang));
  }
});

// Middleware to protect internal markdown knowledge bases and prompt files from public static downloads
app.use((req, res, next) => {
  if (req.path.endsWith('.md') || req.path.includes('.env') || req.path.includes('knowledge_base') || req.path.includes('System-Prompt')) {
    return res.status(403).type('text/plain').send('Access Forbidden');
  }
  next();
});

// Middleware to normalize file paths with space variations or url-encoding
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  try {
    const decoded = decodeURIComponent(req.path);
    const targetPath = path.join(__dirname, decoded);
    if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
      return res.sendFile(targetPath);
    }
    // Try single-space variation
    const singleSpace = path.join(__dirname, decoded.replace(/ {2,}/g, ' '));
    if (fs.existsSync(singleSpace) && fs.statSync(singleSpace).isFile()) {
      return res.sendFile(singleSpace);
    }
    // Try double-space variation
    const doubleSpace = path.join(__dirname, decoded.replace(/ /g, '  '));
    if (fs.existsSync(doubleSpace) && fs.statSync(doubleSpace).isFile()) {
      return res.sendFile(doubleSpace);
    }
  } catch (e) {
    // Ignore decode errors and continue
  }
  next();
});

// Serve static assets from current directory
app.use(express.static(__dirname, {
  extensions: ['html', 'htm']
}));

// Fallback to index.html only for navigation routes without file extensions
app.get('*', (req, res) => {
  if (path.extname(req.path)) {
    return res.status(404).type('text/plain').send('Asset not found: ' + req.path);
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
