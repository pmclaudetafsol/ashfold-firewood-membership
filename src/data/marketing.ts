import type { FaqItem, Testimonial } from '@/types';

/** DEMONSTRATION CONTENT — marketing copy for the public website. */

export const testimonials: Testimonial[] = [
  {
    id: 'test-001',
    quote:
      'We used to spend every October chasing a supplier and hoping the logs were properly dry. Now eight deliveries just appear, and the wood lights first time, every time.',
    name: 'Eleanor W.',
    location: 'Godalming, Surrey',
    plan: 'Moderate User',
    rating: 5,
    memberSince: 'Member since 2024',
  },
  {
    id: 'test-002',
    quote:
      'The farmhouse gets through an enormous amount of wood. Having it arrive on a schedule, at a price fixed for the year, took the whole thing off my mind.',
    name: 'Duncan M.',
    location: 'Peebles, Scottish Borders',
    plan: 'Heavy User',
    rating: 5,
    memberSince: 'Member since 2023',
  },
  {
    id: 'test-003',
    quote:
      'I live in a first-floor flat and assumed this would not work for me. They carry it up, stack it neatly and take the packaging away. Genuinely faultless.',
    name: 'Priya R.',
    location: 'Bath, Somerset',
    plan: 'Light User',
    rating: 5,
    memberSince: 'Member since 2025',
  },
  {
    id: 'test-004',
    quote:
      'One delivery slipped a week after a breakdown. They texted before I noticed, explained why, and offered a new date. That is how it should be done.',
    name: 'Michael T.',
    location: 'Tunbridge Wells, Kent',
    plan: 'Moderate User',
    rating: 4,
    memberSince: 'Member since 2024',
  },
  {
    id: 'test-005',
    quote:
      'Under 20% moisture on every crate, and they show you the reading. The difference in the stove against what we used to buy is not subtle.',
    name: 'Robert F.',
    location: 'Ludlow, Shropshire',
    plan: 'Heavy User',
    rating: 5,
    memberSince: 'Member since 2023',
  },
  {
    id: 'test-006',
    quote:
      'Three friends have joined on my code now. The credit has covered most of a delivery, which feels like a rather good deal for sending a link.',
    name: 'Charlotte N.',
    location: 'Edinburgh',
    plan: 'Moderate User',
    rating: 5,
    memberSince: 'Member since 2025',
  },
];

export const faqs: FaqItem[] = [
  /* ── Membership and billing ── */
  {
    id: 'faq-001',
    category: 'Membership and billing',
    question: 'How does the annual membership work?',
    answer:
      'You pay once for the year and receive eight scheduled deliveries across the burning season. The price is fixed at the moment you join, so a cold winter or a rise in timber prices does not change what you pay. There is nothing to reorder and no per-delivery charge.',
  },
  {
    id: 'faq-002',
    category: 'Membership and billing',
    question: 'When am I charged?',
    answer:
      'The full membership is taken on the day you join, and again on your renewal date each year. You will receive an email reminder thirty days before renewal with the price for the coming season.',
  },
  {
    id: 'faq-003',
    category: 'Membership and billing',
    question: 'Can I pay monthly?',
    answer:
      'Yes. Moderate and Heavy memberships can be spread over twelve monthly instalments by Direct Debit at no extra cost. You can switch between annual and monthly at any renewal.',
  },
  {
    id: 'faq-004',
    category: 'Membership and billing',
    question: 'Is VAT included in the price?',
    answer:
      'All prices shown include VAT at the applicable rate. Domestic firewood for household heating currently attracts the reduced rate of 5%. Your invoice shows the breakdown in full.',
  },
  {
    id: 'faq-005',
    category: 'Membership and billing',
    question: 'What happens if a payment fails?',
    answer:
      'We retry after three days and email you straight away with a secure link to update your card. Your deliveries continue as normal for fourteen days while the payment is resolved.',
  },

  /* ── Deliveries ── */
  {
    id: 'faq-006',
    category: 'Deliveries',
    question: 'How often do deliveries arrive?',
    answer:
      'Eight times across your membership year, roughly every four to six weeks, weighted towards the colder months. You see the full schedule in your dashboard the moment you join.',
  },
  {
    id: 'faq-007',
    category: 'Deliveries',
    question: 'Will I know when a delivery is coming?',
    answer:
      'Yes. You get an email when a date is confirmed, a text three days before, and another on the morning of the delivery once the driver has loaded. Every stage is also visible in your dashboard.',
  },
  {
    id: 'faq-008',
    category: 'Deliveries',
    question: 'Do I need to be at home?',
    answer:
      'Not usually. Most members leave access instructions — a side gate, a log store, a neighbour — and we follow them. If we cannot deliver safely without you, we will agree a date when you are in.',
  },
  {
    id: 'faq-009',
    category: 'Deliveries',
    question: 'Will you stack the wood for me?',
    answer:
      'Stacking is included as standard on the Heavy membership and available on request for Moderate members. Light members can add it to any delivery for a small charge.',
  },

  /* ── Delivery areas ── */
  {
    id: 'faq-010',
    category: 'Delivery areas',
    question: 'Where do you deliver?',
    answer:
      'We currently cover most of England, Wales and southern Scotland. Enter your postcode at sign-up and we will confirm your area immediately. If we do not reach you yet, we will let you know when we do.',
  },
  {
    id: 'faq-011',
    category: 'Delivery areas',
    question: 'Can you reach a rural property or a narrow lane?',
    answer:
      'In most cases, yes. Our vehicles range from small flatbeds to 7.5 tonne lorries, and we ask about access when you join so the right one is sent. Tell us about soft tracks, low branches or tight turns and we will plan around them.',
  },

  /* ── Firewood quantities ── */
  {
    id: 'faq-012',
    category: 'Firewood quantities',
    question: 'How much wood is in a delivery?',
    answer:
      'A crate holds roughly 0.8m³ of loose kiln-dried hardwood, about 250kg. Light members receive one crate per delivery, Moderate members two, and Heavy members three.',
  },
  {
    id: 'faq-013',
    category: 'Firewood quantities',
    question: 'Which plan is right for my house?',
    answer:
      'As a guide: Light suits a flat or cottage with two or three fires a week, Moderate suits a family home with a stove in daily use, and Heavy suits larger properties where wood is the main heat source. You can change plan at any renewal, and mid-season if you find you have chosen wrong.',
  },
  {
    id: 'faq-014',
    category: 'Firewood quantities',
    question: 'What if I run out between deliveries?',
    answer:
      'Order a top-up crate from your dashboard and it joins the next route through your area, usually within five working days. Heavy members receive two emergency top-ups a year at no charge.',
  },

  /* ── Rescheduling and cancellation ── */
  {
    id: 'faq-015',
    category: 'Rescheduling and cancellation',
    question: 'Can I move a delivery?',
    answer:
      'Yes, from the delivery calendar in your dashboard, up to 48 hours before the scheduled date. There is no charge and no limit on how many you move.',
  },
  {
    id: 'faq-016',
    category: 'Rescheduling and cancellation',
    question: 'Can I pause my membership?',
    answer:
      'You can pause for up to three months — for building work, a long trip, or a mild spell. Your remaining deliveries are held and your renewal date moves by the same period.',
  },
  {
    id: 'faq-017',
    category: 'Rescheduling and cancellation',
    question: 'What is the cancellation policy?',
    answer:
      'Cancel within fourteen days of joining for a full refund if no delivery has been made. After that, you can cancel at any time and we refund the value of your undelivered crates, less any promotional discount already used.',
  },

  /* ── Referrals ── */
  {
    id: 'faq-018',
    category: 'Referral rewards',
    question: 'How does the referral programme work?',
    answer:
      'Share your personal code. When a friend joins, you both receive £15 in credit. Credit is applied automatically against your next renewal or any additional order.',
  },
  {
    id: 'faq-019',
    category: 'Referral rewards',
    question: 'Is there a limit on referrals?',
    answer:
      'No. There is no cap on how many friends you can refer or how much credit you can build up. Several members cover an entire delivery this way each season.',
  },
  {
    id: 'faq-020',
    category: 'Referral rewards',
    question: 'When does referral credit appear?',
    answer:
      'As soon as your friend’s first payment clears. You will see it in the Referral Centre in your dashboard and receive a notification.',
  },
];

export const faqCategories = Array.from(new Set(faqs.map((faq) => faq.category)));

/* ─────────────────────────── How it works ─────────────────────────── */

export const journeySteps = [
  {
    number: 1,
    title: 'Choose a membership plan',
    summary: 'Pick the plan that matches how much you burn.',
    detail:
      'Three plans cover everything from a weekend fire to a farmhouse running on wood. Each includes eight deliveries; they differ only in how much arrives each time. Not sure? Start on Moderate — you can change plan mid-season without penalty.',
  },
  {
    number: 2,
    title: 'Add your delivery information',
    summary: 'Tell us where the wood goes and how to reach you.',
    detail:
      'Your address, a gate code, the side path, the neighbour who takes parcels. We ask about access once, so every driver for the rest of the year already knows how your property works.',
  },
  {
    number: 3,
    title: 'Receive eight scheduled deliveries',
    summary: 'Your whole season is planned before it starts.',
    detail:
      'The moment you join, all eight dates appear in your calendar, weighted towards the colder months. Nothing to reorder, nothing to remember, no scramble in the first cold week of November.',
  },
  {
    number: 4,
    title: 'Get reminders before every delivery',
    summary: 'An email, a text three days ahead, and one on the morning.',
    detail:
      'You always know what is coming and when. If anything changes — a breakdown, a kiln shutdown, snow on the route — you hear it from us first, with a new date already offered.',
  },
  {
    number: 5,
    title: 'Track everything from your dashboard',
    summary: 'Every delivery, invoice and reward in one place.',
    detail:
      'See what has been delivered, what is coming, and the moisture reading on each crate. Move a date, add a top-up, download an invoice or share your referral code — all from the same screen.',
  },
];

/* ─────────────────────────── Kiln-dried benefits ─────────────────────────── */

export const kilnBenefits = [
  {
    title: 'Under 20% moisture, always',
    detail:
      'Every crate is tested before it leaves the yard and the reading is recorded against your delivery. Wet wood is the single biggest cause of poor burns and blocked flues.',
  },
  {
    title: 'Lights first time',
    detail:
      'Kiln-dried hardwood catches quickly and burns cleanly, so you use less kindling, less firelighter and less patience on a cold evening.',
  },
  {
    title: 'More heat from less wood',
    detail:
      'Energy that would be spent boiling off water goes into the room instead. Properly dried logs deliver noticeably more heat per crate than seasoned wood.',
  },
  {
    title: 'Cleaner glass and flue',
    detail:
      'Less smoke and far less creosote. Your stove glass stays clear and your annual sweep has considerably less to do.',
  },
  {
    title: 'Ready to Burn compliant',
    detail:
      'Dry wood is a legal requirement for domestic sale in England under the Air Quality regulations. Everything we deliver meets that standard.',
  },
  {
    title: 'No storage guesswork',
    detail:
      'Wood arrives ready to use. There is no need to buy a year ahead, build a drying stack, or hope the summer was warm enough.',
  },
];

/* ─────────────────────────────── About ─────────────────────────────── */

export const aboutSections = {
  mission: {
    title: 'Our mission',
    body: [
      'Buying firewood in Britain has changed very little in fifty years. You ring around in October, take a chance on a load of unknown moisture content, and hope it turns up before the first frost. If it burns badly, you have a full winter to regret it.',
      'We built this membership to remove all of that. One decision, made once a year, and eight properly dried deliveries that arrive when they should. The price is fixed, the quality is measured, and the schedule is set before the season starts.',
      'It is a small idea, but it turns the most frustrating household purchase of the year into something you never have to think about again.',
    ],
  },
  kilnDrying: {
    title: 'The kiln-drying process',
    body: [
      'Hardwood arrives at our partner yards already air-dried for twelve to eighteen months, which does the slow work of bringing moisture down towards forty per cent.',
      'It then spends between three and seven days in a low-temperature kiln, where warm air is circulated until the core moisture falls below twenty per cent. Low and slow matters: rushing it splits the timber and scorches the surface while the centre stays wet.',
      'Every batch is probe-tested at the core, not the surface, before it is crated. The reading is recorded against the crate and appears on your delivery record — so if a member ever asks what they were sent, we can answer precisely.',
    ],
  },
  quality: {
    title: 'What is actually in the crate',
    body: [
      'Mixed British hardwood — predominantly ash, oak, beech and birch. Ash and birch light readily and give quick heat; oak and beech burn long and hot once the fire is established. The mix is deliberate.',
      'Logs are cut to 25cm as standard, which suits the great majority of UK stoves, with 20cm and 33cm available on request. Anything undersized, rotten or excessively knotted is taken out by hand at the crating stage.',
      'No softwood, no pallet offcuts, no treated timber, and nothing painted. Those burn hot and dirty and have no place in a domestic stove.',
    ],
  },
  sustainability: {
    title: 'Sustainability',
    body: [
      'All of our timber comes from managed British woodland within roughly a hundred miles of the yard that processes it, which keeps transport emissions low and supports woodland that is actively worked rather than neglected.',
      'Thinnings and windfall make up the majority of what we take. Well-managed coppice and thinning improves the health of the remaining stand and lets light back down to the woodland floor.',
      'The kilns at our partner yards run largely on the waste from the process itself — sawdust, bark and offcuts that would otherwise be discarded. Crates are returned, repaired and reused rather than replaced.',
    ],
  },
  suppliers: {
    title: 'Supplier standards',
    body: [
      'We work with a small number of established regional yards rather than a single central depot. It shortens every journey and means a delivery in Yorkshire is handled by people who know Yorkshire.',
      'Every partner is audited before joining and reviewed quarterly on moisture compliance, on-time performance and member feedback. The thresholds are published to them in advance and we act on them.',
      'Partners who fall below standard are given one season to correct it, with support. Those who do not are replaced — a member should never carry the cost of a supplier problem.',
    ],
  },
  service: {
    title: 'Our promise to members',
    body: [
      'If a delivery is going to be late, you will hear it from us before you notice, with the reason and a new date already offered.',
      'If a crate is not right — wet, undersized, the wrong species mix — tell us and we replace it. There is no form to complete and no argument to have.',
      'Our support line is staffed by people who can actually change your schedule, not read from a script. Monday to Friday, 9:00am to 5:30pm, and extended hours through December and January.',
    ],
  },
};

export const companyStats = [
  { value: '1,600+', label: 'Members across Britain' },
  { value: '12,800', label: 'Deliveries completed' },
  { value: '<20%', label: 'Moisture on every crate' },
  { value: '95.1%', label: 'Delivered in the promised window' },
];
