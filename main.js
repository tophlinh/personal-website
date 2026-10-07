const SECTIONS = [
  { id: 'about', label: 'About', x: 230, y: 765, title: 'The Tea Drunk Cat', text: "Mrrrow! That’s Tori. 🎮\nCoder by education, Product Manager by day, and illustrator after dark. When I’m not building things, you’ll find me adventuring through cozy games, rolling Nat 1s in D&D, sipping teas, or doodling by the pond 🌱✨" },
  { id: 'work', label: 'Work', x: 625, y: 900, title: 'Work', text: "Disney+ and Hulu - previously on platform tooling, now on recommendations" },
  { id: 'projects', label: 'Projects', x: 660, y: 400, title: 'Projects', html: '<a class="dialog-link" href="https://climbnora.com/" target="_blank" rel="noopener">Climb NORA</a> - concepting for bouldering gym in Federal Way, WA; designed rank system, pins, merch, etc.\n<span class="tshirt-link" data-img="assets/rest-day-hero.webp">Jesse Firestone Coaching</span> - PNW cornerstone, designed \'Rest Day Hero\' t-shirt 👕' },
  { id: 'quest', label: 'Quest Board', x: 680, y: 755, title: 'Quest Board', text: "Current quests:\n☐ Do an artist alley\n☐ Don't stop bouldering\n☐ Ship a tiny game this season\n☑ Adopt a black cat (complete!)" },
  { id: 'quotes', label: 'Quotes', x: 350, y: 1050, title: 'A Little Quote', quotes: [
    '"The octopus eats it own leg" — Takashi Murakami',
    '"We don\'t need the memories" — Haikyuu!!',
    '"A friend, he wrote, would \'choose knowing rather than being known.\' I had always thought it was the other way around" — Stay True, Hua Hsu',
    '"In another life, I would really have liked just doing laundry and taxes with you (如果有来生, 我还是会选择和你一起报税, 开洗衣店)" — Waymond, Everything Everywhere All at Once',
    '"But the truth I learned here is, you had to leave because you\'re you. And the reason I liked you is because you\'re you. And who you are is a person who leaves. But for him, you\'re the person who stays." — Haesung, Past Lives',
    '”There is a word in Korean. In-Yun. It means “providence” or “fate”. But it\'s specifically about relationships between people. I think it comes from Buddhism and reincarnation. It\'s an In-Yun if two strangers even walk by each other in the street and their clothes accidentally brush. Because it means there must have been something between them in their past lives. If two people get married, they say it\'s because there have been 8,000 layers of In-Yun over 8,000 lifetimes.” — Nora, Past Lives',
    '”Sharing tea with a fascinating stranger is one of life\'s true delights.” — Uncle Iroh, Avatar the Last Airbender',
    '”I am not looking for anyone\'s approval. I know who I am.” — Toph Beifong, Avatar the Last Airbender',
    '”I am the greatest Earthbender in the world. Don\'t you two dunderheads ever forget!” — Toph Beifong, Avatar the Last Airbender',
    '”Sometimes, a person reaches a point in their life when it becomes absolutely essential to get the fuck out of the city.” — A Psalm for the Wild Built',
    '”Friendship was witnessing another\'s slow drip of miseries, and long bouts of boredom, and occasional triumphs. It was feeling honored by the privilege of getting to be present for another person\'s most dismal moments, and knowing that you could be dismal around him in return.” — Hanya Yanagihara'
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

function typeText(fullText, onComplete) {
  clearInterval(typingTimer);
  let index = 0;
  dialogText.textContent = '';
  typingTimer = setInterval(() => {
    index += 1;
    dialogText.textContent = fullText.slice(0, index);
    if (index >= fullText.length) {
      clearInterval(typingTimer);
      if (onComplete) onComplete();
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
  if (section.html) {
    typeText(section.html.replace(/<[^>]*>/g, ''), () => {
      dialogText.innerHTML = section.html.replace(/\n/g, '<br>');
    });
  } else {
    const text = section.quotes ? getRandomQuote(section) : section.text;
    typeText(text);
  }
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
  if (event.target.closest('.tshirt-link')) {
    event.stopPropagation();
    const link = event.target.closest('.tshirt-link');
    imgPopup.querySelector('img').src = link.dataset.img;
    imgPopup.style.display = 'flex';
    return;
  }
  if (event.target.closest('.dialog-link')) {
    event.stopPropagation();
    return;
  }
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

const imgPopup = document.createElement('div');
imgPopup.id = 'img-popup';
imgPopup.innerHTML = '<img />';
document.body.appendChild(imgPopup);

imgPopup.addEventListener('click', () => {
  imgPopup.style.display = 'none';
});

document.addEventListener('click', (event) => {
  const link = event.target.closest('.tshirt-link');
  if (link) {
    event.stopPropagation();
    imgPopup.querySelector('img').src = link.dataset.img;
    imgPopup.style.display = 'flex';
  }
});

createLabels();
fitScene();
