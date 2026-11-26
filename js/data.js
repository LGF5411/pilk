/* Pilk — catalogue data: formats, packs, prices, designs */
(function () {
  var P = window.PILK = window.PILK || {};

  /* w,h = real size (px or mm). lw,lh = layout pixels for print sizes. */
  P.formats = {
    '300x250': { w: 300, h: 250, n: 'Medium rectangle', where: 'Google Display', g: 'display' },
    '336x280': { w: 336, h: 280, n: 'Large rectangle', where: 'Google Display', g: 'display' },
    '728x90': { w: 728, h: 90, n: 'Leaderboard', where: 'Desktop sites', g: 'display' },
    '300x600': { w: 300, h: 600, n: 'Half page', where: 'Desktop sites', g: 'display' },
    '160x600': { w: 160, h: 600, n: 'Wide skyscraper', where: 'Desktop sites', g: 'display' },
    '320x50': { w: 320, h: 50, n: 'Mobile leaderboard', where: 'Phones', g: 'display' },
    '320x100': { w: 320, h: 100, n: 'Large mobile banner', where: 'Phones', g: 'display' },
    '970x250': { w: 970, h: 250, n: 'Billboard', where: 'Site headers', g: 'display' },
    '970x90': { w: 970, h: 90, n: 'Large leaderboard', where: 'Desktop sites', g: 'display' },
    '468x60': { w: 468, h: 60, n: 'Banner', where: 'Older placements', g: 'display' },
    '250x250': { w: 250, h: 250, n: 'Square', where: 'Google Display', g: 'display' },
    '200x200': { w: 200, h: 200, n: 'Small square', where: 'Google Display', g: 'display' },
    '1080x1080': { w: 1080, h: 1080, n: 'Square post', where: 'Instagram, Facebook', g: 'social' },
    '1080x1350': { w: 1080, h: 1350, n: 'Portrait post', where: 'Instagram, Facebook', g: 'social' },
    '1080x1920': { w: 1080, h: 1920, n: 'Story / Reel', where: 'Instagram, TikTok', g: 'social', safe: 1 },
    '1200x628': { w: 1200, h: 628, n: 'Link ad', where: 'Facebook, LinkedIn', g: 'social' },
    '1584x396': { w: 1584, h: 396, n: 'Page cover', where: 'LinkedIn', g: 'social' },
    '1500x500': { w: 1500, h: 500, n: 'Header', where: 'X', g: 'social' },
    '1280x720': { w: 1280, h: 720, n: 'Thumbnail', where: 'YouTube', g: 'social' },
    '1000x1500': { w: 1000, h: 1500, n: 'Pin', where: 'Pinterest', g: 'social' },
    'rollup': { w: 850, h: 2000, u: 'mm', lw: 680, lh: 1600, n: 'Roll-up', where: 'Fairs, lobbies', g: 'print' },
    'billboard': { w: 6000, h: 3000, u: 'mm', lw: 1200, lh: 600, n: 'Billboard', where: 'Streets, roads', g: 'print' },
    'citylight': { w: 1185, h: 1750, u: 'mm', lw: 711, lh: 1050, n: 'Citylight', where: 'Bus stops', g: 'print' },
    'mesh': { w: 3000, h: 1000, u: 'mm', lw: 1200, lh: 400, n: 'Mesh banner', where: 'Fences, facades', g: 'print' },
    'a1': { w: 594, h: 841, u: 'mm', lw: 594, lh: 841, n: 'Poster A1', where: 'Shop windows', g: 'print' },
    'a5': { w: 148, h: 210, u: 'mm', lw: 592, lh: 840, n: 'Flyer A5', where: 'Counters, mail', g: 'print' }
  };

  var DISPLAY = ['300x250', '336x280', '728x90', '300x600', '160x600', '320x50', '320x100', '970x250', '970x90', '468x60', '250x250', '200x200'];
  var SOCIAL = ['1080x1080', '1080x1350', '1080x1920', '1200x628', '1584x396', '1500x500', '1280x720', '1000x1500'];
  var PRINT = ['rollup', 'billboard', 'citylight', 'mesh', 'a1', 'a5'];
  P.packs = {
    display: { n: 'Display pack', short: 'Display', sizes: DISPLAY, icon: 'monitor', plain: 'Google Ads and website banners' },
    social: { n: 'Social pack', short: 'Social', sizes: SOCIAL, icon: 'smartphone', plain: 'Posts, stories, covers and link ads' },
    print: { n: 'Print pack', short: 'Print', sizes: PRINT, icon: 'printer', plain: 'Roll-up, billboard, citylight, posters' },
    all: { n: 'Everything', short: 'All', sizes: DISPLAY.concat(SOCIAL, PRINT), icon: 'layers', plain: 'All 26 sizes from one design' }
  };
  P.tiers = {
    a: { display: 49, social: 39, print: 35, all: 89 },
    b: { display: 59, social: 49, print: 39, all: 99 },
    c: { display: 69, social: 55, print: 45, all: 119 }
  };
  P.extras = {
    anim: { n: 'Animated HTML5', p: 30, plain: 'Moves gently, stays under 600 KB, the Google Ads limit for HTML5.' },
    edit: { n: 'We fill in your text', p: 25, plain: 'Send us the words, get finished files within 24 working hours.' }
  };
  P.cats = { sale: 'Sale', food: 'Food & drink', launch: 'Launch', event: 'Event', beauty: 'Beauty', tech: 'Tech', hiring: 'Hiring & study', estate: 'Real estate' };
  P.styles = { bold: 'Bold', soft: 'Soft', calm: 'Calm' };

  /* Designs. font: a = Anybody, m = Mona Sans. wk = how much letter width follows the format (0 = fixed). r = button radius (share of height). */
  P.designs = [
    { id: 'soft-sale', name: 'Soft Sale', cat: 'sale', style: 'soft', tier: 'b', anim: 1, pop: 98, isNew: 0,
      bg: '#ffd6c2', ink: '#4a1d2f', a1: '#ff9373', a2: '#fff3ea', a3: '#ffb89e', cta: '#4a1d2f', ctaInk: '#ffeadf', font: 'a', wt: 780, wk: 1, r: .3, motif: 'sun',
      t: { brand: 'Kodu Store', head: 'Winter sale −30%', sub: 'Until 8 December', cta: 'Shop now' },
      about: 'Warm and quiet. The discount reads first, the button last, nothing shouts in between.' },
    { id: 'launch-day', name: 'Launch Day', cat: 'launch', style: 'bold', tier: 'c', anim: 1, pop: 91, isNew: 1,
      bg: '#14233f', ink: '#eaf6ff', a1: '#7ef0c6', a2: '#2a4675', a3: '#ffd56b', cta: '#7ef0c6', ctaInk: '#0b1830', font: 'a', wt: 860, wk: 1, r: .18, motif: 'arcs',
      t: { brand: 'Volt', head: 'Meet Volt Mini', sub: 'Pocket charger · from €39', cta: 'Pre-order' },
      about: 'A night-blue stage for one new thing. Rising arcs carry the eye to the product name.' },
    { id: 'lunch-story', name: 'Lunch Story', cat: 'food', style: 'soft', tier: 'a', anim: 1, pop: 95, isNew: 0,
      bg: '#ffe68f', ink: '#7a1616', a1: '#ff6c47', a2: '#fff7d3', a3: '#ffb56b', cta: '#7a1616', ctaInk: '#ffeeb0', font: 'a', wt: 820, wk: .9, r: .5, motif: 'rings',
      t: { brand: 'Mõnus', head: 'Soup + bread €7.90', sub: 'Weekdays 11–15', cta: 'See the menu' },
      about: 'Lunch-hour yellow with a plate seen from above. The price is the headline.' },
    { id: 'late-gallery', name: 'Late Gallery', cat: 'event', style: 'calm', tier: 'b', anim: 0, pop: 70, isNew: 0,
      bg: '#f3efe7', ink: '#171717', a1: '#b9c3ff', a2: '#e3ddd1', a3: '#ff9f87', cta: '#171717', ctaInk: '#f3efe7', font: 'm', wt: 520, wk: .5, r: 0, motif: 'arches',
      t: { brand: 'Valge Gallery', head: 'Open late on Fridays', sub: 'Free entry 18–22', cta: 'Plan a visit' },
      about: 'Paper white, three arches and a light grotesk. For culture that wants to stay calm.' },
    { id: 'fresh-hire', name: 'Fresh Hire', cat: 'hiring', style: 'soft', tier: 'a', anim: 1, pop: 76, isNew: 0,
      bg: '#ccf1df', ink: '#0f3b2c', a1: '#3aa877', a2: '#effff6', a3: '#ffe082', cta: '#0f3b2c', ctaInk: '#ccf1df', font: 'a', wt: 760, wk: 1, r: .3, motif: 'dots',
      t: { brand: 'Rattur', head: 'We’re hiring couriers', sub: 'Flexible hours · €14 per hour', cta: 'Apply now' },
      about: 'Mint and friendly. Pay and hours sit right under the job, because that is what people check.' },
    { id: 'glow-serum', name: 'Glow Serum', cat: 'beauty', style: 'soft', tier: 'c', anim: 1, pop: 88, isNew: 1,
      bg: '#ffe3ec', ink: '#5a2e2a', a1: '#ffadc3', a2: '#fff8fa', a3: '#ffd9a8', cta: '#5a2e2a', ctaInk: '#ffe3ec', font: 'm', wt: 430, wk: .6, r: .5, motif: 'orb',
      t: { brand: 'Sõnajalg', head: 'Glow in seven days', sub: 'Vitamin C serum · 30 ml', cta: 'Try it' },
      about: 'Blush pink with one soft glowing drop. Light letters for a product that should feel gentle.' },
    { id: 'big-number', name: 'Big Number', cat: 'sale', style: 'bold', tier: 'a', anim: 1, pop: 93, isNew: 0,
      bg: '#c92d1c', ink: '#fff8ef', a1: '#ffd43f', a2: '#a92314', a3: '#ff8a5c', cta: '#fff8ef', ctaInk: '#a81f10', font: 'a', wt: 900, wk: 1.15, r: .12, motif: 'burst',
      t: { brand: 'Tehnika+', head: '−50% on headphones', sub: 'Black Friday · 28.11', cta: 'Grab the deal' },
      about: 'For the one week a year when the number has to win. Heavy letters, a burst, no extras.' },
    { id: 'calm-finance', name: 'Calm Finance', cat: 'tech', style: 'calm', tier: 'b', anim: 1, pop: 64, isNew: 0,
      bg: '#dbeeff', ink: '#0d2a4a', a1: '#5b93ff', a2: '#ffffff', a3: '#ffcf5c', cta: '#0d2a4a', ctaInk: '#dbeeff', font: 'm', wt: 640, wk: .7, r: .3, motif: 'grid',
      t: { brand: 'Sääst', head: 'Save without thinking', sub: 'Round-ups from €1 a day', cta: 'Get the app' },
      about: 'Sky blue and a line that goes up. Trust comes from calm, not from more claims.' },
    { id: 'sea-sound', name: 'Sea Sound', cat: 'event', style: 'bold', tier: 'c', anim: 1, pop: 84, isNew: 1,
      bg: '#0f3d32', ink: '#ffd9bb', a1: '#ff9d78', a2: '#1f5c4c', a3: '#ffe9a8', cta: '#ffd9bb', ctaInk: '#0f3d32', font: 'a', wt: 850, wk: 1.1, r: .5, motif: 'waves',
      t: { brand: 'Merehääl', head: 'Live by the sea', sub: '12–14 June · Tallinn', cta: 'Get tickets' },
      about: 'Deep sea green, peach type and sound waves that keep moving in the animated version.' },
    { id: 'open-house', name: 'Open House', cat: 'estate', style: 'calm', tier: 'b', anim: 0, pop: 58, isNew: 0,
      bg: '#f1e5d6', ink: '#3a281e', a1: '#d8794b', a2: '#e5cfb7', a3: '#8fb3a0', cta: '#3a281e', ctaInk: '#f1e5d6', font: 'm', wt: 600, wk: .6, r: .2, motif: 'houses',
      t: { brand: 'Kodulinn', head: 'Open house on Sunday', sub: '2-room flats from €129,000', cta: 'Book a slot' },
      about: 'Sand and clay tones with a row of roofs. Date first, price second, booking last.' },
    { id: 'summer-camp', name: 'Summer Camp', cat: 'event', style: 'soft', tier: 'a', anim: 1, pop: 67, isNew: 0,
      bg: '#c3e4ff', ink: '#11396a', a1: '#ffd64d', a2: '#ff8fb3', a3: '#ffffff', cta: '#11396a', ctaInk: '#ffe680', font: 'a', wt: 820, wk: 1, r: .5, motif: 'confetti',
      t: { brand: 'Suvi Camp', head: 'Summer camp is back', sub: 'Ages 7–12 · Pärnu', cta: 'Sign up' },
      about: 'A sky full of confetti. Parents see the age range at once, kids see the fun.' },
    { id: 'bike-season', name: 'Bike Season', cat: 'launch', style: 'bold', tier: 'b', anim: 1, pop: 73, isNew: 0,
      bg: '#d9f36f', ink: '#1a1e0c', a1: '#1a1e0c', a2: '#f4ffd2', a3: '#ff7a59', cta: '#1a1e0c', ctaInk: '#d9f36f', font: 'a', wt: 880, wk: 1.1, r: .2, motif: 'wheels',
      t: { brand: 'Rattur', head: 'Bike season is open', sub: 'Full service from €25', cta: 'Book service' },
      about: 'Spring lime and two turning wheels. Loud enough for the street, simple enough for a phone.' },
    { id: 'clear-webinar', name: 'Clear Webinar', cat: 'tech', style: 'calm', tier: 'a', anim: 0, pop: 61, isNew: 0,
      bg: '#ffffff', ink: '#1b3a8c', a1: '#e8edff', a2: '#ffcd57', a3: '#c6d1fb', cta: '#1b3a8c', ctaInk: '#ffffff', font: 'm', wt: 660, wk: .6, r: .25, motif: 'squares',
      t: { brand: 'Kaubik', head: 'Free webinar: selling online', sub: 'Thu 4 Dec · 14:00', cta: 'Save a seat' },
      about: 'White, blue and one yellow square. Date and time stay readable even at 320 × 50.' },
    { id: 'coffee-club', name: 'Coffee Club', cat: 'food', style: 'soft', tier: 'a', anim: 1, pop: 80, isNew: 0,
      bg: '#ecd9c6', ink: '#3a2418', a1: '#c48c5d', a2: '#f7ece1', a3: '#ffffff', cta: '#3a2418', ctaInk: '#ecd9c6', font: 'a', wt: 740, wk: .9, r: .5, motif: 'cup',
      t: { brand: 'Mõnus', head: 'Every 6th coffee is free', sub: 'Join the club in the app', cta: 'Join' },
      about: 'Latte tones and cup rings. A loyalty offer that explains itself in one line.' },
    { id: 'wool-edit', name: 'The Edit', cat: 'launch', style: 'calm', tier: 'c', anim: 0, pop: 69, isNew: 1,
      bg: '#efeae3', ink: '#1d1b19', a1: '#b8a28b', a2: '#ddd3c7', a3: '#8c6f57', cta: '#1d1b19', ctaInk: '#efeae3', font: 'm', wt: 340, wk: .8, upper: 1, track: .06, r: 0, motif: 'stripes',
      t: { brand: 'HÕBE', head: 'The wool edit', sub: 'New in · 24 pieces', cta: 'Shop the edit' },
      about: 'Editorial and quiet: light capitals, knit-like stripes, lots of air.' },
    { id: 'spa-weekend', name: 'Spa Weekend', cat: 'beauty', style: 'calm', tier: 'b', anim: 1, pop: 66, isNew: 0,
      bg: '#cfe4d7', ink: '#1f3a2c', a1: '#ffffff', a2: '#a9cab6', a3: '#f7d9b8', cta: '#1f3a2c', ctaInk: '#cfe4d7', font: 'm', wt: 460, wk: .6, r: .5, motif: 'ripples',
      t: { brand: 'Laine Spa', head: 'Two nights, one quiet bill', sub: 'Weekend for two from €249', cta: 'Book' },
      about: 'Sage green and slow ripples. The price per two people answers the first question.' },
    { id: 'grand-opening', name: 'Grand Opening', cat: 'event', style: 'bold', tier: 'a', anim: 1, pop: 72, isNew: 0,
      bg: '#ff9575', ink: '#2a0f22', a1: '#ffe27a', a2: '#ffc5b1', a3: '#7a2b5c', cta: '#2a0f22', ctaInk: '#ffe27a', font: 'a', wt: 880, wk: 1, r: .3, motif: 'balloons',
      t: { brand: 'Pood 24', head: 'We open on Saturday', sub: 'A gift for the first 100 guests', cta: 'Find us' },
      about: 'Coral and balloons. The day is the headline; the gift is the reason to come early.' },
    { id: 'ux-course', name: 'Next Step', cat: 'hiring', style: 'bold', tier: 'c', anim: 1, pop: 62, isNew: 1,
      bg: '#0e4c58', ink: '#e8fbff', a1: '#7fe0ee', a2: '#166778', a3: '#ffd36b', cta: '#7fe0ee', ctaInk: '#0a3740', font: 'a', wt: 820, wk: 1, r: .25, motif: 'steps',
      t: { brand: 'Õpe Lab', head: 'Learn UX in 12 weeks', sub: 'Next group starts 12 January', cta: 'Apply' },
      about: 'Deep teal and steps going up. For courses and jobs where the next move is the message.' }
  ];


  /* size guide: one rule per size + the file note key */
  P.files = { d: '150 KB image · 600 KB HTML5', s: 'PNG or JPG, kept light', p: 'Vector PDF, CMYK, bleed', p10: 'Vector PDF, CMYK, bleed, made at 1:10' };
  P.rules = {
    '300x250': ['The size advertisers buy most. Two lines of headline at most.', 'd'], '336x280': ['Same layout as 300 × 250, a little more air.', 'd'],
    '728x90': ['One line for everything; the second line goes.', 'd'], '300x600': ['Tall art on top, words below, button last.', 'd'],
    '160x600': ['Narrow letters keep their height. Stack the words.', 'd'], '320x50': ['The hardest size: four or five words, a one-word button.', 'd'],
    '320x100': ['Room for one line more than 320 × 50, no more.', 'd'], '970x250': ['Header size: a second line and a big button fit.', 'd'],
    '970x90': ['Like 728 × 90, wider. The logo can stay.', 'd'], '468x60': ['An older size, still sold. Keep it to one line.', 'd'],
    '250x250': ['Square and small: one shape, few words.', 'd'], '200x200': ['The smallest square. Headline only, plus the button.', 'd'],
    '1080x1080': ['Feed square: big shape, words low.', 's'], '1080x1350': ['Takes the most feed height on phones.', 's'],
    '1080x1920': ['Keep words clear of roughly the top 250 px and bottom 340 px: app buttons sit there.', 's'], '1200x628': ['Link image: the platform prints its own headline under it.', 's'],
    '1584x396': ['The page logo covers the lower left corner. Keep words right.', 's'], '1500x500': ['The profile photo overlaps the lower left. Keep words right of centre.', 's'],
    '1280x720': ['The video length sits in the bottom right. Keep it clear.', 's'], '1000x1500': ['2:3, the ratio Pinterest recommends.', 's'],
    'rollup': ['People stand in front of the bottom 20 cm. Keep words above it.', 'p'], 'billboard': ['Read at driving speed: four words, letters about 40 cm tall.', 'p10'],
    'citylight': ['Lit from behind at bus stops. Dark text on light reads best.', 'p'], 'mesh': ['Wind passes through the holes; thin lines vanish. Keep shapes bold.', 'p'],
    'a1': ['Read from two or three metres in a shop window.', 'p'], 'a5': ['3 mm bleed on each side, 5 mm safe margin inside.', 'p']
  };

  /* Pilk's own banner: the one in the hero. */
  P.pilk = { id: 'pilk', name: 'Pilk', bg: '#701067', ink: '#fff0cf', a1: '#ffc4e9', a2: '#8f2a85', a3: '#ffd36e', pupil: '#2a0b27',
    cta: '#ffd36e', ctaInk: '#2a0b27', font: 'a', wt: 820, wk: 1, r: .32, motif: 'eye', anim: 1,
    t: { brand: 'pilk', head: 'Seen in a glance.', sub: 'Banner sets in every size', cta: 'Get yours' } };
})();
