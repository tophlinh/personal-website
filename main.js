const SECTIONS = [
  { id: 'about', label: 'About', x: 230, y: 765, title: 'The Tea Drunk Cat', text: "Mrrrow! That’s Tori. 🎮\nCoder by education, Product Manager by day, and illustrator after dark. When I’m not building things, you’ll find me adventuring through cozy games, rolling Nat 1s in D&D, sipping teas, or doodling by the pond 🌱✨" },
  { id: 'work', label: 'Work', x: 625, y: 900, title: 'Work', text: "Disney+ - prev on Platform Tooling, now tinkering around with our Recommendation Models in retrieval and ranking" },
  { id: 'projects', label: 'Projects', x: 660, y: 400, title: 'Projects', text: "Climb NORA - a bouldering gym in Federal Way, WA" },
  { id: 'quest', label: 'Quest Board', x: 680, y: 755, title: 'Quest Board', text: "Current quests:\n☐ Do an artist alley\n☐ Don't stop bouldering\n☐ Ship a tiny game this season\n☑ Adopt a black cat (complete!)" },
  { id: 'quotes', label: 'Quotes', x: 350, y: 1050, title: 'A Little Quote', quotes: [
    '"The octopus eats it own leg" — Takashi Murakami',
    '"We don\'t need the memories" — Haikyuu!!',
    '"A friend, he wrote, would \'choose knowing rather than being known.\' I had always thought it was the other way around" — Stay True, Hua Hsu'
  ], lastQuoteIndex: -1 },
  { id: 'contact', label: 'Contact', x: 735, y: 1050, title: 'Contact', text: "Cast a line my way!\n✉ toriwhen@gmail.com\n☆ github.com/tophlinh\n✎ @tophlinh for my doodles" }
];

const scene = document.getElementById('scene');
const dialog = document.getElementById('dialog');
const dialogTitle = dialog.querySelector('h2');
const dialogText = dialog.querySelector('.text');
const muteButton = document.getElementById('mute');

const music = new Audio('assets/audio/cozy-music.mp3');
music.loop = true;
music.volume = 0.35;
const pop = new Audio('assets/audio/pop.mp3');
pop.volume = 0.6;
let muted = false;
let typingTimer = null;

function fitScene() {
  const scale = Math.min(window.innerWidth / 1008, window.innerHeight / 1224);
  scene.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

function playPop() {
  if (muted) {
    return;
  }
  pop.currentTime = 0;
  pop.play().catch(() => {});
}

function typeText(fullText) {
  clearInterval(typingTimer);
  let index = 0;
  dialogText.textContent = '';
  typingTimer = setInterval(() => {
    index += 1;
    dialogText.textContent = fullText.slice(0, index);
    if (index >= fullText.length) {
      clearInterval(typingTimer);
    }
  }, 18);
}

function getRandomQuote(section) {
  let quoteIndex = Math.floor(Math.random() * section.quotes.length);
  if (section.quotes.length > 1 && quoteIndex === section.lastQuoteIndex) {
    quoteIndex = (quoteIndex + 1 + Math.floor(Math.random() * (section.quotes.length - 1))) % section.quotes.length;
  }
  section.lastQuoteIndex = quoteIndex;
  return section.quotes[quoteIndex];
}

function openDialog(section) {
  playPop();
  dialog.style.display = 'block';
  dialogTitle.textContent = section.title;
  const text = section.quotes ? getRandomQuote(section) : section.text;
  typeText(text);
  window.ProgressLogger?.logProgress('open_section', { id: section.id });
}

function closeDialog() {
  clearInterval(typingTimer);
  dialog.style.display = 'none';
}

function createLabels() {
  SECTIONS.forEach((section, i) => {
    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = section.label;
    label.style.left = `${section.x}px`;
    label.style.top = `${section.y}px`;
    label.style.animationDelay = `${i * 0.3}s`;
    label.addEventListener('click', (event) => {
      event.stopPropagation();
      openDialog(section);
    });
    scene.appendChild(label);
  });
}

function startMusicOnce() {
  if (!muted) {
    music.play().catch(() => {});
  }
}

muteButton.addEventListener('click', (event) => {
  event.stopPropagation();
  muted = !muted;
  muteButton.textContent = muted ? '♪ OFF' : '♪ ON';
  if (muted) {
    music.pause();
  } else {
    music.play().catch(() => {});
  }
});

dialog.addEventListener('click', (event) => {
  event.stopPropagation();
  closeDialog();
});

window.addEventListener('pointerdown', startMusicOnce, { once: true });
window.addEventListener('click', closeDialog);
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeDialog();
  }
});
window.addEventListener('resize', fitScene);

createLabels();
fitScene();
