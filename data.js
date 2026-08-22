// ---------- Product catalog ----------
// Images use picsum.photos with a fixed seed so each product gets a
// consistent (but placeholder) photo. Swap these for real photos later.
//
// Optional field: `salePrice` — when present and lower than `price`,
// product cards and the detail page show a discount badge and a
// strikethrough original price.

const PRODUCTS = [
  {
    id: "p01",
    name: "Aria Wireless Headphones",
    category: "Headphones",
    price: 4999,
    salePrice: 3999,
    image: "https://picsum.photos/seed/ariaheadphones/600/600",
    description:
      "Over-ear wireless headphones with active noise cancellation and 30 hours of battery life. Foldable design with a travel case included.",
    stock: 18,
    tag: "Bestseller",
  },
  {
    id: "p02",
    name: "Pulse Earbuds",
    category: "Headphones",
    price: 2499,
    image: "https://picsum.photos/seed/pulseearbuds/600/600",
    description:
      "True wireless earbuds with a compact charging case, touch controls, and 6 hours of playback per charge.",
    stock: 34,
    tag: "New",
  },
  {
    id: "p03",
    name: "Studio Pro Headphones",
    category: "Headphones",
    price: 7999,
    image: "https://picsum.photos/seed/studioproheadphones/600/600",
    description:
      "Reference-grade wired headphones built for mixing and mastering, with a detachable cable and plush earpads.",
    stock: 9,
    tag: null,
  },
  {
    id: "p04",
    name: "Kids Headphones, Volume-Limited",
    category: "Headphones",
    price: 1299,
    image: "https://picsum.photos/seed/kidsheadphones/600/600",
    description:
      "Lightweight on-ear headphones with a built-in 85dB volume limiter, made for young listeners.",
    stock: 22,
    tag: null,
  },
  {
    id: "p05",
    name: "Orbit Bluetooth Speaker",
    category: "Speakers",
    price: 3299,
    salePrice: 2799,
    image: "https://picsum.photos/seed/orbitspeaker/600/600",
    description:
      "A compact, waterproof speaker with 360-degree sound and 12 hours of battery — small enough to clip to a bag.",
    stock: 27,
    tag: "Bestseller",
  },
  {
    id: "p06",
    name: "Basecamp Party Speaker",
    category: "Speakers",
    price: 8999,
    image: "https://picsum.photos/seed/basecampspeaker/600/600",
    description:
      "A large-format speaker with built-in LED lighting and deep bass, designed for outdoor gatherings.",
    stock: 7,
    tag: null,
  },
  {
    id: "p07",
    name: "Desk Duo Speaker Set",
    category: "Speakers",
    price: 2199,
    image: "https://picsum.photos/seed/deskduospeakers/600/600",
    description:
      "A pair of compact USB-powered desktop speakers with a warm, clear sound for music and calls.",
    stock: 15,
    tag: "New",
  },
  {
    id: "p08",
    name: "Mini Shower Speaker",
    category: "Speakers",
    price: 999,
    image: "https://picsum.photos/seed/showerspeaker/600/600",
    description:
      "A palm-sized, fully waterproof speaker with a suction mount, built for the bathroom or the pool.",
    stock: 41,
    tag: null,
  },
  {
    id: "p09",
    name: "Pulse Fit Smartwatch",
    category: "Wearables",
    price: 6499,
    salePrice: 5499,
    image: "https://picsum.photos/seed/pulsefitwatch/600/600",
    description:
      "A fitness-focused smartwatch with heart rate tracking, sleep monitoring, and a 10-day battery life.",
    stock: 12,
    tag: "New",
  },
  {
    id: "p10",
    name: "Trackband Fitness Tracker",
    category: "Wearables",
    price: 1999,
    image: "https://picsum.photos/seed/trackband/600/600",
    description:
      "A lightweight fitness band with step counting, heart rate sensing, and phone notifications on a simple display.",
    stock: 30,
    tag: null,
  },
  {
    id: "p11",
    name: "Ring Mic Clip-On",
    category: "Wearables",
    price: 1499,
    image: "https://picsum.photos/seed/ringmicclip/600/600",
    description:
      "A discreet clip-on lapel microphone with a built-in receiver, popular for video calls and short-form video.",
    stock: 19,
    tag: null,
  },
  {
    id: "p12",
    name: "Braided USB-C Cable, 2m",
    category: "Accessories",
    price: 499,
    image: "https://picsum.photos/seed/braidedusbc/600/600",
    description:
      "A durable braided USB-C to USB-C cable rated for 100W fast charging, in a 2 meter length.",
    stock: 60,
    tag: null,
  },
  {
    id: "p13",
    name: "45W GaN Wall Charger",
    category: "Accessories",
    price: 1799,
    salePrice: 1399,
    image: "https://picsum.photos/seed/ganwallcharger/600/600",
    description:
      "A compact dual-port fast charger using GaN technology, small enough to carry in any bag.",
    stock: 24,
    tag: "Bestseller",
  },
  {
    id: "p14",
    name: "Hardshell Earbuds Case",
    category: "Accessories",
    price: 349,
    image: "https://picsum.photos/seed/hardshellcase/600/600",
    description:
      "A protective carabiner-clip case for earbuds and small cables, keeping everything tangle-free on the go.",
    stock: 45,
    tag: null,
  },
];

const CATEGORIES = [...new Set(PRODUCTS.map((p) => p.category))];
