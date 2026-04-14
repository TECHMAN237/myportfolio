
function renderSubContent(title, placeholder) {
  let targetContainer = document.getElementById('sub-content');
  if (!targetContainer) {
      targetContainer = document.getElementById('new-content');
  }
  
  targetContainer.innerHTML = `
  <style>
  .card-template {
    width: 100%;
    max-width: 800px;
    background-color: rgba(246, 242, 242, 0.85);
    border-radius: 20px;
    padding: 30px 40px;
    margin: 0;
    box-sizing: border-box;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
  .card-template h1 {
    color: rgb(209, 92, 8);
    font-size: 2.2rem;
    margin-bottom: 20px;
    border-bottom: 2px solid rgba(209, 92, 8, 0.3);
    padding-bottom: 10px;
  }
  .card-template p, .card-template ul {
    color: #333;
    font-size: 1.1rem;
    line-height: 1.6;
  }
  </style>
  <div class="card-template">
    <h1>${title}</h1>
    ${placeholder}
  </div>
  `;
}

function addpro(){
  renderSubContent("In TECHFields", "<p>I am a computer science student with a strong foundation in programming and software development. I have experience in web development, mobile application development, and database management. I am passionate about technology and constantly learning new skills to stay updated with the latest trends in the industry.</p><ul><li>[web Developement and Design]</li><li>[Mobile Dev]</li></ul>");
} 

function addlinks(){
  renderSubContent("As Content Creator", "<p>I am a content creator with a passion for creating engaging and informative content. I have experience in video editing, graphic design, and social media management. I am passionate about creating content that helps people learn and grow.</p><p></p>");
} 


function openVideo(videoId) {
    const overlay = document.getElementById('videoModal');
    const player = document.getElementById('mainPlayer');
    
    // Switch to nocookie domain and add explicit origin to satisfy YouTube's security check
    const origin = window.location.protocol + "//" + window.location.host;
    const youtubeUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&rel=0&origin=${origin}&widget_referrer=${origin}`;
    
    player.innerHTML = `<iframe 
        width="100%" 
        height="100%" 
        src="${youtubeUrl}" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        referrerpolicy="strict-origin-when-cross-origin" 
        allowfullscreen>
    </iframe>`;
    
    overlay.style.display = 'flex';
}

function closeVideo() {
  const modal = document.getElementById("videoModal");
  const player = document.getElementById("mainPlayer");

  if (player) player.innerHTML = ""; // Stop YouTube video by clearing iframe
  if (modal) modal.style.display = "none";
}


function openImageModal(imgSrc) {
    let modal = document.getElementById('img-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'img-modal';
        modal.innerHTML = '<div id="modal-bg" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:9999;display:flex;justify-content:center;align-items:center;cursor:pointer;"><img id="modal-img" style="max-width:90%;max-height:90%;border:5px solid white;border-radius:10px;box-shadow:0 10px 25px rgba(0,0,0,0.5);"></div>';
        document.body.appendChild(modal);
        modal.onclick = () => modal.style.display = 'none';
    }
    document.getElementById('modal-img').src = imgSrc;
    modal.style.display = 'flex';
}

function resetNav() {
    document.querySelectorAll('nav li a').forEach(a => a.classList.remove('active-nav'));
    const newContent = document.getElementById('new-content');
    if (newContent) {
        newContent.style.width = '';
        newContent.style.maxWidth = '';
        newContent.style.overflow = '';
    }
}

function addButtons(){
  resetNav();
  const projBtn = document.getElementById('skills-btn');
  if (projBtn) projBtn.classList.add('active-nav');

const newContent = document.getElementById('new-content');
  newContent.style.width = '85%';
  newContent.style.maxWidth = '1200px';
  newContent.style.overflow = 'visible';
  newContent.innerHTML=`
    <div class="sub-layout">
              <div id="sub-menu" class="sub-menu-col"></div>
              <div id="sub-content" class="sub-content-area"></div>
          </div>
  `;
  const subMenu = document.getElementById('sub-menu');
        const project=[
            {text:'TECHFields', url:'javascript:renderSubContent("Skills: TECHFields", "<p>I am a computer science student with a strong foundation in programming and software development. I have experience in web development, mobile application development, and database management. I am passionate about technology and constantly learning new skills to stay updated with the latest trends in the industry.</p>")'},
            {text:'Graphic Design', url:'javascript:renderSubContent("Skills: Graphic Design", "<p>Master Design Softwares Like :<br>On PC<br>Adobe photoshop <br>Adobe illustrator<br>Figma<br>Canva<br>On Phone (Android et I.O.S)<br>POSTMYWALL<br>CANVA<br>FLYERS MAKER<br>PIXElLAB</p>")'},
            {text:'Video Editing', url:'javascript:renderSubContent("Skills: Video Editing", "<p>Master in Video Software such as:<br>On PC<br>Adobe premiere pro<br>Capcut Pro<br>Kinemaster<br>On PHONE (Androide et I.O.S)<br>Capcut pro<br>Kinemaster pro<br>Inshot<br>YouCut</p>")'},
            {text:'Teaching Field', url:'javascript:renderSubContent("Skills: Teaching Field", "<p>I am a teacher with a passion for teaching and helping students learn. I have experience in teaching mathematics, science, and computer science to students of all ages. I am passionate about creating a positive and supportive learning environment for my students.</p>")'},
            {text:'Content Creation', url:'javascript:renderSubContent("Skills: Content Creation", "<p>I am a content creator with a passion for creating engaging and informative content. I have experience in video editing, graphic design, and social media management. I am passionate about creating content that helps people learn and grow.</p>")'}
        ];
        project.forEach(project=>{const button = document.createElement('a');
            button.textContent = project.text;
            button.href = project.url;
            button.classList.add('button');
       button.onclick = function() {
           document.querySelectorAll('#sub-menu a').forEach(a => a.classList.remove('active-sub'));
           this.classList.add('active-sub');
       };
            subMenu.appendChild(button);
          });
        }

  function addAbout(){
    resetNav();
    const projBtn = document.getElementById('about-btn');
    if (projBtn) projBtn.classList.add('active-nav');

const newContent = document.getElementById('new-content');
    newContent.style.width = '85%';
    newContent.style.maxWidth = '1200px';
    newContent.style.overflow = 'visible';
    newContent.innerHTML=`
      <div class="sub-layout">
                <div id="sub-menu" class="sub-menu-col"></div>
                <div id="sub-content" class="sub-content-area"></div>
            </div>
    `;
    const subMenu = document.getElementById('sub-menu');
        const project=[
            { text:'Who Am I', url:'javascript:renderSubContent("Who Am I", "<p>Hello! I am Steeve Zali (also known as TECHMAN), a dynamic and innovation-driven Level 300 Computer Science student at the University of Buea. I specialize in applying technology to solve real-world problems and creating engaging digital content.</p><br><p>With a strong background in graphic design and video editing alongside my academic pursuits in computer science, I blend technical analytical skills with creative thinking to deliver professional and unique solutions.</p>")'},
            { text:'Passion and Interest', url:'javascript:renderSubContent("Passion and Interest", "<p>My deepest passions lie at the intersection of technology, creative design, and community impact. I am fascinated by software development, visual aesthetics, and the power of digital media to communicate powerful stories.</p><br><p>When I am not coding or studying, you will find me designing flyers, editing high-quality videos, learning new creative tools, or collaborating with peers to brainstorm exciting tech projects.</p>")'},
            { text:'Career Goal', url:'javascript:renderSubContent("Career Goal", "<p>In the short term, I aim to graduate with top honors in Computer Science while continuing to expand my portfolio as a freelance creative designer and video editor.</p><br><p>My long-term career ambition is to become a versatile Software Engineer and Tech Director, building innovative technological products while leading creative campaigns that leave a lasting impact on society.</p>")'}
        ];
        project.forEach(project=>{const button = document.createElement('a');
            button.textContent = project.text;
            button.href = project.url;
            button.classList.add('button');
         button.onclick = function() {
             document.querySelectorAll('#sub-menu a').forEach(a => a.classList.remove('active-sub'));
             this.classList.add('active-sub');
         };
            subMenu.appendChild(button);
          });
        }
  
      function addproject(){
          resetNav();
          const projBtn = document.getElementById('project-btn');
          if (projBtn) projBtn.classList.add('active-nav');

      const newContent = document.getElementById('new-content');
          newContent.style.width = '85%';
          newContent.style.maxWidth = '1200px';
          newContent.style.overflow = 'visible';
          newContent.innerHTML=`
            <div class="sub-layout">
                <div id="sub-menu" class="sub-menu-col"></div>
                <div id="sub-content" class="sub-content-area"></div>
            </div>
          `;
          const subMenu = document.getElementById('sub-menu');
           const project=[{text:'In TECHFields',url:'javascript:addpro()'},{ text:'In Graphic Design',url:'javascript:addGraphicDesignGallery()'},{ text:'In Video Editing',url:'javascript:addvideo()'},{ text:'In Teaching Field',url:'javascript:renderSubContent(\"Teaching Field\", \"<p>I am a teacher with a passion for teaching and helping students learn. I have experience in teaching mathematics, science, and computer science to students of all ages. I am passionate about creating a positive and supportive learning environment for my students.</p>\")'},{ text:'As Content Creator',url:'javascript:addlinks()'}];
           project.forEach(project=>{const button = document.createElement('a');
               button.textContent = project.text;
               button.href = project.url;
               button.classList.add('button');
               button.onclick = function() {
                   document.querySelectorAll('#sub-menu a').forEach(a => a.classList.remove('active-sub'));
                   this.classList.add('active-sub');
               };
               subMenu.appendChild(button);
             });
           }

function addGraphicDesignGallery() {
    let targetContainer = document.getElementById('sub-content');
    if (!targetContainer) {
        targetContainer = document.getElementById('new-content');
        targetContainer.innerHTML = '';
    }
    const images = [
        "ANANAS DANIELLE.png", "ANTI-DRUG.jpg", "BAK2SCHOOL 4.jpg", "BAK2SCHOOL B1.jpg", 
        "BANDEROLE JZ L.jpg", "BAOBAB DANIE.png", "EMMA BIRTHDAY1.jpg", "EMMA BIRTHDAY2.jpg", 
        "FINAL FRONT.png", "FINAL.png", "GHANA SOAP.jpg", "Home tutoring.jpg", "ISRAEL.jpg", 
        "JORDAN.jpg", "LED LIGHT SMARTPHONE - Copie.jpg", "MANOU FLYER2.jpg", "MEGANE.jpg", 
        "MOCK UP 11 FEV VERT.jpg", "MOCK UP 11 FEV.jpg", "MOCKUP 11 FEV e.jpg", 
        "MOCKUP 11 FEV f.jpg", "MOCKUP 11 FEV n.jpg", "MOCKUP 11 FEV-Récupéré-Récupéré.jpg", 
        "MOCKUP 11 FEV3.jpg", "October welcome25.jpg", "PRISCILLE BIRTHDAY.jpg", "PUB 2.jpg", 
        "SALIM.png", "STEVE MAYEGA3.jpg", "Sans titre-1.jpg", "TANDONG 2.jpg", 
        "WELCOME TO NOVEMBER 2.jpg", "bissap danie.png", "cbc10.jpg", "cbc11.jpg", 
        "chez les spies.jpg", "facebook post.jpg", "flyer manou3.png", "happychristmas.jpg", 
        "jeunesse.jpg", "kkumayas.jpg", "le vrai ndem4.jpg", "mjn.png", "mo up 2.jpg", 
        "mo up 3.jpg", "mo up 4.jpg", "mock up carte.jpg", "multi clone.jpg", "pascal 3.png", 
        "pro.jpg", "pub graphism2.jpg", "pub3 - Copy.png", "service declaration tole branche n.jpg", 
        "stephane 2.png", "suit.jpg", "techman happychristmas.jpg"
    ];

    let galleryItems = images.map(img => `
        <div class="gal-item">
            <a href="javascript:void(0)" onclick="openImageModal('graphic_designs/${img}')"><img loading="lazy" src="graphic_designs/${img}" class="gal-img"></a>
        </div>
    `).join('');

    targetContainer.innerHTML = `
         <style>
          .gal-container {
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              gap: 20px;
              padding: 20px;
              min-height: 400px;
              width: 100%;
              max-width: 800px;
              background-color: rgba(255, 255, 255, 0.6);
              border-radius: 20px;
              z-index: 0;
              overflow-y: auto;
          }
          .gal-item {
              display: flex;
              justify-content: center;
              align-items: center;
          }
          .gal-img {
              width: 150px;
              height: 150px;
              object-fit: cover;
              border-radius: 10px;
              transition: transform 0.3s ease;
              box-shadow: 0 4px 8px rgba(0,0,0,0.2);
              opacity: 1;
          }
          .gal-img:hover {
              transform: scale(1.05);
          }
        </style>
        <div class="gal-container">
            ${galleryItems}
        </div>
    `;
}
   
  function adddiv1(){
            resetNav();
            const eduBtn = document.getElementById('education-btn');
            if (eduBtn) eduBtn.classList.add('active-nav');
   const newContent = document.getElementById('new-content');
   newContent.innerHTML=`
   <div class="joel">
  <h1>EDUCATIONAL BACKGROUND</h1><br><br>
  <h2>ACADEMIC-BACKGROUND</h2>
  <h3>-I have obtained my GCE Avance Level in 2024 at IMHOTEP GREAT SCHOOL</h3><br>
  <h3>-Currently Enrolled at the University of buea studying a Computer science under the faculty of science for a Bsc program</h3><br><br>
  <h2>OTHER SOURCES</h1>
  <h3>Free-code camp<h3>
  <h3>W3school<h3>
  <h3>Free-code camp<h3>
  <h3>Youtube Tutorials <h3>
   </div>     
    `;
}
   
  function adddiv1(){
            resetNav();
            const eduBtn = document.getElementById('education-btn');
            if (eduBtn) eduBtn.classList.add('active-nav');
   const newContent = document.getElementById('new-content');
   newContent.innerHTML=`
   <style>
   .san{
  height: 450px;
  width:100%;
  max-width: 800px;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius:30px;
  padding:20px;
  margin: 0 auto;
  overflow-y: scroll;
  }

   </style>
   <div class="san">
  <h1>EDUCATIONAL BACKGROUND</h1><br><br>
  <h2>ACADEMIC-BACKGROUND</h2>
  <ul>
  <li><h3>I have obtained my GCE Avance Level in 2024 at IMHOTEP GREAT SCHOOL</h3></li>
  <li><h3>Currently Enrolled at the University of buea studying a Computer science under the faculty of   science for a Bsc program</h3></li><br>
  </ul>
  <h2>OTHER SOURCES</h1>
  <ul>
  <li><h3>Free-code camp<h3></li>
  <li><h3>W3school<h3></li>
  <li><h3>Free-code camp<h3></li>
  <li><h3>Youtube Tutorials <h3></li>
   </ul></div>     
    `;
  } 


  function addvideo(){
    let targetContainer = document.getElementById('sub-content');
    if (!targetContainer) {
        targetContainer = document.getElementById('new-content');
        targetContainer.innerHTML = '';
    }
    targetContainer.innerHTML = `
    <style>
      .vid-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 15px;
        padding: 20px;
        min-height: 300px;
        width: 100%;
        max-width: 800px;
        background-color: rgba(255, 255, 255, 0.6);
        border-radius: 20px;
        overflow-y: auto;
      }

      .vid-container .thumb {
    width: 120px;
    height: 80px; /* Ajoute une hauteur pour la régularité */
    object-fit: cover; /* Pour que l'image ne soit pas déformée */
    cursor: pointer;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease;
}


      .vid-container video {
        width: 120px;
        cursor: pointer;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        transition: transform 0.3s ease;
      }
      .vid-container video:hover {
        transform: scale(1.05);
      }
    </style>
    <div class="vid-container">
    <img src="https://img.youtube.com/vi/9D5w6qTOuUA/0.jpg" onclick="openVideo('9D5w6qTOuUA')" class="thumb">
    <img src="https://img.youtube.com/vi/t7pexa5JySY/0.jpg" onclick="openVideo('t7pexa5JySY')" class="thumb">
    <img src="https://img.youtube.com/vi/Ub6IsIlkAcg/0.jpg" onclick="openVideo('Ub6IsIlkAcg')" class="thumb">
    <img src="https://img.youtube.com/vi/lNiMXG3ZmEQ/0.jpg" onclick="openVideo('lNiMXG3ZmEQ')" class="thumb">
    <img src="https://img.youtube.com/vi/SWgAKGH0WhA/0.jpg" onclick="openVideo('SWgAKGH0WhA')" class="thumb">
    <img src="https://img.youtube.com/vi/upt6BKQpFpY/0.jpg" onclick="openVideo('upt6BKQpFpY')" class="thumb">
</div>
  <div id="videoModal" style="
    display:none;
    position:fixed;
    top:0; left:0;
    width:100%;
    height:100%;
    background:black;
    justify-content:center;
    align-items:center;
    z-index:1000;
  ">

    <div id="mainPlayer" style="
      width:90%;
      height:80%;
      max-height:90%;
    "></div>
    <button onclick="closeVideo()" style="
      position:absolute;
      top:20px;
      right:20px;
      font-size:20px;
      background:white;
      border:none;
      cursor:pointer;
    ">✖</button>

  </div>
  `;
} 

  

  function addhome(){
    resetNav();
    const homeBtn = document.getElementById('home-btn');
    if (homeBtn) homeBtn.classList.add('active-nav');
    const newContent = document.getElementById('new-content');
    newContent.innerHTML=`
    <div class="joel">
      <h1>Hi i am </h1>
  <P class="techman-title"><b>TECHMAN</b></P>
  <h2><center>A computer science level300 student in UB in the Faculty of science</center></h2>
  
    
  `;
  }  
window.addEventListener('DOMContentLoaded', () => {
    addhome();
});