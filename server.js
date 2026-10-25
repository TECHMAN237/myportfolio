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

// Helper to load TECHMAN AI knowledge base, system prompt, and structured destinations
function loadSteveResources() {
  const knowledgeBase = fs.readFileSync(path.join(__dirname, 'Steve.md'), 'utf-8');
  const systemPrompt = fs.readFileSync(path.join(__dirname, 'Steve-System-Prompt.md'), 'utf-8');
  const destinations = JSON.parse(fs.readFileSync(path.join(__dirname, 'steve-destinations.json'), 'utf-8'));
  return { knowledgeBase, systemPrompt, destinations };
}

// Resilient knowledge-base resolver grounded in Steve.md & steve-destinations.json
function resolveTechmanFallback(rawMessage, lang = 'fr') {
  const q = (rawMessage || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const isEn = lang === 'en' || /\b(who|what|where|show|tell|can you|how|projects|skills|about|contact|resume)\b/.test(q);
  const wantOpen = /\b(montre|voir|ouvre|afficher|emmene|va |aller|ou sont|ou est|show|open|view|see|take me|go to)\b/.test(q);

  // Check for non-existent projects / domains explicitly mentioned in prompt
  if (q.includes('raydar')) {
    return {
      reply: isEn
        ? 'There is no project named **RAYDAR** in Steeve Zali\'s portfolio. However, you can explore his actual web projects (**SAFECHILD**, **Rock Attitude**, **GO CLONE**, **DevOps Portfolio**, **My Portfolio**) or his graphic design & video galleries below:'
        : 'Le projet **RAYDAR** ne figure pas dans le portfolio de Steeve Zali (TECHMAN). En revanche, voici ses véritables projets web (**SAFECHILD**, **Rock Attitude**, **GO CLONE**, **Portfolio DevOps**) ainsi que sa galerie de design :',
      destinations: ['sec-projects-tech', 'page-safechild', 'sec-projects-graphic'],
      autoNavigate: false
    };
  }

  if (q.includes('data science') || q.includes('machine learning') || q.includes('deep learning')) {
    return {
      reply: isEn
        ? 'Steeve\'s portfolio does not currently include dedicated Data Science projects. His technical work focuses on **Web & Software Development**, **Mobile Apps**, **Database Management**, **Graphic Design**, and **Video Editing**.'
        : 'Le portfolio de Steeve ne contient pas de projets dédiés à la Data Science. Il se spécialise principalement en **Développement Web & Logiciel**, **Applications Mobiles**, **Bases de données**, **Design Graphique** et **Montage Vidéo**.',
      destinations: ['sec-projects-tech', 'sec-skills', 'sec-projects-graphic'],
      autoNavigate: false
    };
  }

  // Specific project: SAFECHILD
  if (q.includes('safechild') || q.includes('safe child') || q.includes('enfant')) {
    return {
      reply: isEn
        ? '**SAFECHILD** is a web platform created by Steeve to help reduce the rate of missing children in the community. You can view the access page (demo login: `user@test.com` / `user123`) or launch the live app directly:'
        : '**SAFECHILD** est une plateforme web conçue par Steeve pour réduire le taux d\'enfants disparus dans la communauté. Vous pouvez ouvrir la page d\'accès (identifiants démo : `user@test.com` / `user123`) ou lancer l\'application en ligne :',
      destinations: ['page-safechild', 'ext-safechild-app', 'sec-projects-tech'],
      autoNavigate: false
    };
  }

  // Specific project: Rock Attitude
  if (q.includes('rock attitude') || q.includes('rock')) {
    return {
      reply: isEn
        ? '**Rock Attitude Showcase Website** is an enterprise showcase website developed and delivered by Steeve Zali for the company Rock Attitude.'
        : '**Rock Attitude Showcase Website** est un site vitrine professionnel conçu et livré par Steeve Zali pour l\'entreprise Rock Attitude.',
      destinations: ['ext-rock-attitude', 'sec-projects-tech'],
      autoNavigate: false
    };
  }

  // Specific project: GO CLONE
  if (q.includes('go clone') || q.includes('goclone') || q.includes('portail') || q.includes('campus')) {
    return {
      reply: isEn
        ? '**GO CLONE** is a web development project by Steeve aiming to clone and modernize the student campus portal of the University of Buea.'
        : '**GO CLONE** est un projet web visant à cloner le portail étudiant du campus de l\'Université de Buea.',
      destinations: ['ext-goclone', 'sec-projects-tech'],
      autoNavigate: false
    };
  }

  // Specific project: DevOps / Apollos
  if (q.includes('devops') || q.includes('apollos') || q.includes('apolos')) {
    return {
      reply: isEn
        ? '**DevOps Portfolio** is a professional portfolio website built by Steeve to assist a senior specialist in the tech/DevOps domain (Apollos).'
        : '**Portfolio DevOps** est un site portfolio réalisé par Steeve pour accompagner un aîné du domaine Tech/DevOps (Apollos).',
      destinations: ['ext-devops-portfolio', 'sec-projects-tech'],
      autoNavigate: false
    };
  }

  // Video editing
  if (q.includes('video') || q.includes('montage') || q.includes('premiere') || q.includes('capcut') || q.includes('showreel')) {
    return {
      reply: isEn
        ? 'Steeve is an experienced **Video Editor** mastering Adobe Premiere Pro, CapCut Pro, KineMaster, InShot, and YouCut on PC and mobile. Here is direct access to his video gallery and editing skills:'
        : 'Steeve maîtrise le **Montage Vidéo** sur PC et mobile (Adobe Premiere Pro, CapCut Pro, KineMaster, InShot, YouCut). Voici l\'accès direct à sa galerie vidéo et à ses compétences :',
      destinations: ['sec-projects-video', 'modal-video-1', 'sec-skills-video'],
      autoNavigate: wantOpen
    };
  }

  // Graphic Design & specific categories
  if (q.includes('design') || q.includes('graphi') || q.includes('flyer') || q.includes('affiche') || q.includes('logo') || q.includes('packaging') || q.includes('etiquette') || q.includes('visuel') || q.includes('photoshop') || q.includes('illustrator') || q.includes('figma') || q.includes('canva')) {
    if (q.includes('packaging') || q.includes('etiquette') || q.includes('logo') || q.includes('identite') || q.includes('carte de visite') || q.includes('brand')) {
      return {
        reply: isEn
          ? 'Here is Steeve\'s **Brand Identity & Packaging** collection (product labels for Danielle/Danie juices, Berger, Yogurt, Manou Pretty Design business cards, JZ Pressing banners):'
          : 'Voici la catégorie **Identité & Packaging** de Steeve (étiquettes jus Danielle/Danie, Berger, Yaourt, cartes de visite Manou Pretty Design, banderole JZ Pressing) :',
        destinations: ['cat-branding', 'sec-projects-graphic', 'sec-skills-graphic'],
        autoNavigate: true
      };
    }
    if (q.includes('anniversaire') || q.includes('birthday') || q.includes('noel') || q.includes('celebration')) {
      return {
        reply: isEn
          ? 'Here is the **Birthdays & Celebrations** graphic design category:'
          : 'Voici les réalisations de la catégorie **Anniversaires & Célébrations** :',
        destinations: ['cat-birthdays', 'sec-projects-graphic'],
        autoNavigate: true
      };
    }
    if (q.includes('evenement') || q.includes('conference') || q.includes('event') || q.includes('eglise') || q.includes('culte')) {
      return {
        reply: isEn
          ? 'Here is the **Events & Conferences** poster collection:'
          : 'Voici les affiches de la catégorie **Événements & Conférences** :',
        destinations: ['cat-events', 'sec-projects-graphic'],
        autoNavigate: true
      };
    }
    return {
      reply: isEn
        ? 'Steeve has over **71 graphic design creations** organized into 5 categories (Business Flyers, Events, Birthdays, Branding & Packaging, Social Media), mastered with Photoshop, Illustrator, Figma, Canva, and PixelLab.'
        : 'Steeve compte plus de **71 créations en Design Graphique** réparties en 5 catégories (Entreprises & Services, Événements, Anniversaires, Identité & Packaging, Réseaux Sociaux), réalisées avec Photoshop, Illustrator, Figma, Canva et PixelLab.',
      destinations: ['sec-projects-graphic', 'sec-projects-graphic-cats', 'cat-branding', 'sec-skills-graphic'],
      autoNavigate: wantOpen
    };
  }

  // Education / Academic background
  if (q.includes('etude') || q.includes('parcours') || q.includes('ecole') || q.includes('universite') || q.includes('buea') || q.includes('education') || q.includes('diplome') || q.includes('gce') || q.includes('imhotep') || q.includes('formation')) {
    return {
      reply: isEn
        ? 'Steeve Zali obtained his **GCE Advanced Level in 2024** at **IMHOTEP GREAT SCHOOL** and is currently a **Level 300 BSc Computer Science student** at the **University of Buea** (Faculty of Science), complemented by freeCodeCamp and W3Schools certifications.'
        : 'Steeve Zali a obtenu son **GCE Advanced Level en 2024** à **IMHOTEP GREAT SCHOOL** et est actuellement **étudiant de niveau 300 (3e année de licence BSc) en Informatique à l\'Université de Buea**, complété par des formations sur freeCodeCamp et W3Schools.',
      destinations: ['sec-education', 'file-cv'],
      autoNavigate: wantOpen
    };
  }

  // Contact / Social / LinkedIn / GitHub / WhatsApp / Phone / CV
  if (q.includes('contact') || q.includes('joindre') || q.includes('whatsapp') || q.includes('telephone') || q.includes('numero') || q.includes('appel') || q.includes('linkedin') || q.includes('github') || q.includes('cv') || q.includes('resume')) {
    return {
      reply: isEn
        ? 'You can reach Steeve Zali (TECHMAN) directly by phone or WhatsApp at **+237 697 368 251**, connect on **LinkedIn** and **GitHub (TECHMAN237)**, or download his **CV (PDF)** below:'
        : 'Vous pouvez contacter Steeve Zali (TECHMAN) par téléphone ou WhatsApp au **+237 697 368 251**, consulter ses profils **LinkedIn** et **GitHub (TECHMAN237)**, ou télécharger directement son **C.V (PDF)** ci-dessous :',
      destinations: ['contact-whatsapp', 'contact-linkedin', 'contact-github', 'file-cv'],
      autoNavigate: false
    };
  }

  // Testimonials / Reviews
  if (q.includes('temoignage') || q.includes('avis') || q.includes('client') || q.includes('testimonial') || q.includes('review')) {
    return {
      reply: isEn
        ? 'Clients and collaborators (Asaph N., Laurent, Komze William, Ariel Kafto, Ange Youmsi, Jordan Azapgue) praise Steeve\'s reliability, speed, creativity, and professionalism. You can read all testimonials here:'
        : 'Les clients et partenaires de Steeve (Asaph N., Laurent, Komze William, Ariel Kafto, Ange Youmsi, Jordan Azapgue) soulignent sa fiabilité, sa rapidité et sa créativité. Découvrez tous les témoignages ici :',
      destinations: ['page-testimonials'],
      autoNavigate: false
    };
  }

  // Skills / Technologies / Services
  if (q.includes('competence') || q.includes('skill') || q.includes('techno') || q.includes('service') || q.includes('outil') || q.includes('langage') || q.includes('react') || q.includes('python') || q.includes('mobile') || q.includes('enseign') || q.includes('prof')) {
    return {
      reply: isEn
        ? 'Steeve offers skills and services across **Web & Mobile Development** (HTML/CSS, JS, React, Python, Bootstrap, Tailwind, Spline 3D), **Graphic Design** (Photoshop, Illustrator, Figma, Canva), **Video Editing** (Premiere Pro, CapCut Pro), **Content Creation**, and **STEM Tutoring**.'
        : 'Steeve maîtrise le **Développement Web & Mobile** (HTML/CSS, JS, React.js, Python, Bootstrap, Tailwind, Spline 3D), le **Design Graphique** (Photoshop, Illustrator, Figma, Canva), le **Montage Vidéo** (Premiere Pro, CapCut Pro), la **Création de Contenu** et l\'**Enseignement** (Maths, Sciences, Informatique).',
      destinations: ['sec-skills', 'sec-skills-graphic', 'sec-skills-video', 'sec-skills-teach'],
      autoNavigate: wantOpen
    };
  }

  // Projects (general)
  if (q.includes('projet') || q.includes('project') || q.includes('realisation') || q.includes('portfolio') || q.includes('web')) {
    return {
      reply: isEn
        ? 'Here are Steeve\'s main project categories: **Web & Tech Projects** (SAFECHILD, Rock Attitude, GO CLONE, DevOps Portfolio, My Portfolio), **Graphic Design Gallery** (71 visuals), and **Video Editing Showreel**:'
        : 'Voici les projets de Steeve : ses **Projets Tech & Web** (SAFECHILD, Rock Attitude, GO CLONE, Portfolio DevOps, Mon Portfolio), sa **Galerie Design Graphique** (71 visuels) et ses réalisations en **Montage Vidéo** :',
      destinations: ['sec-projects-tech', 'sec-projects-graphic', 'sec-projects-video', 'page-safechild'],
      autoNavigate: wantOpen
    };
  }

  // About / Identity / Goals
  if (q.includes('qui est') || q.includes('qui es') || q.includes('who is') || q.includes('about') || q.includes('propos') || q.includes('steeve') || q.includes('steve') || q.includes('techman') || q.includes('objectif') || q.includes('passion') || q.includes('but')) {
    return {
      reply: isEn
        ? '**Steeve Zali (TECHMAN)** is a Level 300 Computer Science student at the University of Buea, web developer, graphic designer, video editor, and tutor. His ambition is to become a versatile Software Engineer and Tech Director building impactful digital solutions.'
        : '**Steeve Zali (alias TECHMAN)** est étudiant de niveau 300 en Informatique à l\'Université de Buea, développeur web, designer graphique, monteur vidéo et enseignant. Il allie rigueur technique et créativité visuelle pour concevoir des solutions numériques à fort impact.',
      destinations: ['sec-about', 'sec-about-passion', 'sec-about-career', 'sec-projects-tech'],
      autoNavigate: wantOpen
    };
  }

  // Default greeting / general help
  return {
    reply: isEn
      ? 'Hello! I am **TECHMAN AI**, Steeve Zali\'s assistant. I can guide you to his **Tech Projects**, **Graphic Design Gallery**, **Video Showreel**, **Skills**, **Education**, or answer any question about him!'
      : 'Bonjour ! Je suis **TECHMAN AI**, l\'assistant de Steeve Zali (TECHMAN). Je peux vous diriger directement vers ses **Projets Web**, sa **Galerie Design**, ses **Vidéos**, ses **Compétences**, ou répondre à toutes vos questions sur son profil !',
    destinations: ['sec-projects-tech', 'sec-projects-graphic', 'sec-about', 'contact-whatsapp'],
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
    const { knowledgeBase, systemPrompt, destinations } = loadSteveResources();
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
      '\n\n---\n\n# BASE DE CONNAISSANCES (`Steve.md`)\n\n',
      knowledgeBase,
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
