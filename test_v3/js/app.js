// ==========================================================================
// PUERTO HYPE - MAYOREO STREETWEAR
// Frontend Application Logic & Wholesale Cart System
// ==========================================================================

// Catálogo de Productos (Stock y Preorder)
const STOCK_PRODUCTS = [
  {
    id: 'ph-01',
    name: 'Foam Slide / Croc Hype',
    category: 'sneakers',
    price: 199,
    retailPrice: 350,
    badge: 'MÁS VENDIDO',
    badgeType: 'badge-hot',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80',
    sizes: ['25 MX', '26 MX', '27 MX', '28 MX', '29 MX']
  },
  {
    id: 'ph-02',
    name: 'Hoodie Graphic Streetwear Oversize',
    category: 'hoodies',
    price: 289,
    retailPrice: 450,
    badge: 'NUEVO',
    badgeType: 'badge-new',
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=600&auto=format&fit=crop&q=80',
    sizes: ['CH', 'M', 'G', 'XL']
  },
  {
    id: 'ph-03',
    name: 'Pants Cargo Táctico Black',
    category: 'pants',
    price: 310,
    retailPrice: 500,
    badge: 'TENDENCIA',
    badgeType: 'badge-trend',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80',
    sizes: ['28', '30', '32', '34', '36']
  },
  {
    id: 'ph-04',
    name: 'Chamarra Puffer Reflectiva Glossy',
    category: 'chamarras',
    price: 449,
    retailPrice: 750,
    badge: 'PREMIUM',
    badgeType: 'badge-hot',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=80',
    sizes: ['M', 'G', 'XL']
  },
  {
    id: 'ph-05',
    name: 'Crocs Clogs Platform White',
    category: 'sneakers',
    price: 210,
    retailPrice: 380,
    badge: 'NUEVO',
    badgeType: 'badge-new',
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80',
    sizes: ['23 MX', '24 MX', '25 MX', '26 MX', '27 MX']
  },
  {
    id: 'ph-06',
    name: 'Suéter Knit Acid Wash Oversize',
    category: 'hoodies',
    price: 270,
    retailPrice: 460,
    badge: 'EXCLUSIVO',
    badgeType: 'badge-exclusive',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop&q=80',
    sizes: ['CH', 'M', 'G', 'XL']
  },
  {
    id: 'ph-07',
    name: 'Pants Cargo Militar Olive',
    category: 'pants',
    price: 310,
    retailPrice: 500,
    badge: 'OFERTA',
    badgeType: 'badge-sale',
    image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=600&auto=format&fit=crop&q=80',
    sizes: ['30', '32', '34', '36']
  },
  {
    id: 'ph-08',
    name: 'Windbreaker Techwear Street',
    category: 'chamarras',
    price: 330,
    retailPrice: 550,
    badge: 'TENDENCIA',
    badgeType: 'badge-new',
    image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&auto=format&fit=crop&q=80',
    sizes: ['M', 'G', 'XL']
  }
];

// Estado global de la aplicación
// Catálogo de Pre-orden (Generado)
const PREORDER_PRODUCTS = [
  {
    "id": "po-001",
    "name": "Hellstar #HE-183",
    "brand": "Hellstar",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhaichaoyijia1688%2F4f0d5b8c%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-002",
    "name": "Hellstar #HE-179",
    "brand": "Hellstar",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhaichaoyijia1688%2F5b6fbeca%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-003",
    "name": "Hellstar #HE-170",
    "brand": "Hellstar",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhaichaoyijia1688%2Feed36843%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-004",
    "name": "Hellstar #HE-171",
    "brand": "Hellstar",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhaichaoyijia1688%2F25170e21%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-005",
    "name": "Hellstar #HE-413",
    "brand": "Hellstar",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhaichaoyijia1688%2F5efa7e04%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-006",
    "name": "Hellstar #HE-418",
    "brand": "Hellstar",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhaichaoyijia1688%2F896cb566%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-007",
    "name": "Hellstar #HE-440",
    "brand": "Hellstar",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhaichaoyijia1688%2Ff5f7fcdcc2%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-008",
    "name": "Hellstar #HE-383",
    "brand": "Hellstar",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhaichaoyijia1688%2F54d276ec%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-009",
    "name": "Hellstar #HE-384",
    "brand": "Hellstar",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhaichaoyijia1688%2Fb74f8a53%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-010",
    "name": "Hellstar #HE-403",
    "brand": "Hellstar",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhaichaoyijia1688%2F31896fba8c%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-011",
    "name": "Hellstar #HE-166",
    "brand": "Hellstar",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhaichaoyijia1688%2Fce1852f1%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-012",
    "name": "Hellstar #HE-354",
    "brand": "Hellstar",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhaichaoyijia1688%2F5ea90756%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-013",
    "name": "Crocs crs-SIZE",
    "brand": "Crocs",
    "section": "preorder",
    "category": "sneakers",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://chunchimayorista.com/wp-content/uploads/2026/09/洞洞鞋尺码.png",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "24 MX",
      "25 MX",
      "26 MX",
      "27 MX",
      "28 MX"
    ]
  },
  {
    "id": "po-014",
    "name": "Crocs crs-0999-20MXN",
    "brand": "Crocs",
    "section": "preorder",
    "category": "sneakers",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://chunchimayorista.com/wp-content/uploads/2026/09/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20260908040003_3330_2.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "24 MX",
      "25 MX",
      "26 MX",
      "27 MX",
      "28 MX"
    ]
  },
  {
    "id": "po-015",
    "name": "Crocs crs-0147-1",
    "brand": "Crocs",
    "section": "preorder",
    "category": "sneakers",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://chunchimayorista.com/wp-content/uploads/2026/09/O1CN010hhBl92KNPK1chua_3362817479-0-cib.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "24 MX",
      "25 MX",
      "26 MX",
      "27 MX",
      "28 MX"
    ]
  },
  {
    "id": "po-016",
    "name": "Crocs crs-0147-1-1",
    "brand": "Crocs",
    "section": "preorder",
    "category": "sneakers",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://chunchimayorista.com/wp-content/uploads/2026/09/O1CN01IoszEz1KtgH1chua_3362817479-0-cib.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "24 MX",
      "25 MX",
      "26 MX",
      "27 MX",
      "28 MX"
    ]
  },
  {
    "id": "po-017",
    "name": "Crocs crs-0046",
    "brand": "Crocs",
    "section": "preorder",
    "category": "sneakers",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://chunchimayorista.com/wp-content/uploads/2026/09/46-3.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "24 MX",
      "25 MX",
      "26 MX",
      "27 MX",
      "28 MX"
    ]
  },
  {
    "id": "po-018",
    "name": "Crocs crs-0045",
    "brand": "Crocs",
    "section": "preorder",
    "category": "sneakers",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://chunchimayorista.com/wp-content/uploads/2026/09/45.png",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "24 MX",
      "25 MX",
      "26 MX",
      "27 MX",
      "28 MX"
    ]
  },
  {
    "id": "po-019",
    "name": "Crocs crs-0047",
    "brand": "Crocs",
    "section": "preorder",
    "category": "sneakers",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://chunchimayorista.com/wp-content/uploads/2026/09/47-3.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "24 MX",
      "25 MX",
      "26 MX",
      "27 MX",
      "28 MX"
    ]
  },
  {
    "id": "po-020",
    "name": "Crocs crs-0048",
    "brand": "Crocs",
    "section": "preorder",
    "category": "sneakers",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://chunchimayorista.com/wp-content/uploads/2026/09/48-3.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "24 MX",
      "25 MX",
      "26 MX",
      "27 MX",
      "28 MX"
    ]
  },
  {
    "id": "po-021",
    "name": "Crocs crs-0049",
    "brand": "Crocs",
    "section": "preorder",
    "category": "sneakers",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://chunchimayorista.com/wp-content/uploads/2026/09/49-3.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "24 MX",
      "25 MX",
      "26 MX",
      "27 MX",
      "28 MX"
    ]
  },
  {
    "id": "po-022",
    "name": "Crocs crs-0050",
    "brand": "Crocs",
    "section": "preorder",
    "category": "sneakers",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://chunchimayorista.com/wp-content/uploads/2026/09/50-3.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "24 MX",
      "25 MX",
      "26 MX",
      "27 MX",
      "28 MX"
    ]
  },
  {
    "id": "po-023",
    "name": "Crocs crs-0051",
    "brand": "Crocs",
    "section": "preorder",
    "category": "sneakers",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://chunchimayorista.com/wp-content/uploads/2026/09/51-3.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "24 MX",
      "25 MX",
      "26 MX",
      "27 MX",
      "28 MX"
    ]
  },
  {
    "id": "po-024",
    "name": "Crocs crs-0052",
    "brand": "Crocs",
    "section": "preorder",
    "category": "sneakers",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://chunchimayorista.com/wp-content/uploads/2026/09/52-3.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "24 MX",
      "25 MX",
      "26 MX",
      "27 MX",
      "28 MX"
    ]
  },
  {
    "id": "po-025",
    "name": "Hellstar #HP-1",
    "brand": "Hellstar",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhaichaoyijia1688%2F0d26a15f%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-026",
    "name": "Hellstar #HP-10",
    "brand": "Hellstar",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhaichaoyijia1688%2F3b197cc5%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-027",
    "name": "Hellstar #HP-100",
    "brand": "Hellstar",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhaichaoyijia1688%2Fdb461d71e2%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-028",
    "name": "Hellstar #HP-101",
    "brand": "Hellstar",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhaichaoyijia1688%2Fda5e99e7ac%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-029",
    "name": "Hellstar #HP-102",
    "brand": "Hellstar",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhaichaoyijia1688%2F2932593787%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-030",
    "name": "Hellstar #HP-103",
    "brand": "Hellstar",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhaichaoyijia1688%2F8813bb0bcc%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-031",
    "name": "Hellstar #HP-104",
    "brand": "Hellstar",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhaichaoyijia1688%2Fe2f9c7e7ff%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-032",
    "name": "Hellstar #HP-105",
    "brand": "Hellstar",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhaichaoyijia1688%2F6dc0d14213%2Fsmall.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-033",
    "name": "Hellstar #HP-106",
    "brand": "Hellstar",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhaichaoyijia1688%2F1dc43df2ea%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-034",
    "name": "Hellstar #HP-107",
    "brand": "Hellstar",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhaichaoyijia1688%2F57e3fac25f%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-035",
    "name": "Hellstar #HP-108",
    "brand": "Hellstar",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhaichaoyijia1688%2Fd91969d3df%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-036",
    "name": "Hellstar #HP-109",
    "brand": "Hellstar",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhaichaoyijia1688%2F8f7583c9b7%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-037",
    "name": "Chrome Hearts #CH-1",
    "brand": "Chrome Hearts",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fall-brands888%2F11e82cdcf0%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-038",
    "name": "Chrome Hearts #CH-100",
    "brand": "Chrome Hearts",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fall-brands888%2F305c5c9383%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-039",
    "name": "Chrome Hearts #CH-101",
    "brand": "Chrome Hearts",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fall-brands888%2F6dbd550584%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-040",
    "name": "Chrome Hearts #CH-104",
    "brand": "Chrome Hearts",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fall-brands888%2Fbe684b61f6%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-041",
    "name": "Chrome Hearts #CH-105",
    "brand": "Chrome Hearts",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fall-brands888%2Ffd4d7a4a0c%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-042",
    "name": "Chrome Hearts #CH-106",
    "brand": "Chrome Hearts",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fall-brands888%2F4770127122%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-043",
    "name": "Chrome Hearts #CH-109",
    "brand": "Chrome Hearts",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fall-brands888%2Fdd44bc0e3a%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-044",
    "name": "Chrome Hearts #CH-11",
    "brand": "Chrome Hearts",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fall-brands888%2F2260e6bcbb%2Fsmall.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-045",
    "name": "Chrome Hearts #CH-110",
    "brand": "Chrome Hearts",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fall-brands888%2Fa94d560a3e%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-046",
    "name": "Chrome Hearts #CH-111",
    "brand": "Chrome Hearts",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fall-brands888%2F112296fe0e%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-047",
    "name": "Chrome Hearts #CH-112",
    "brand": "Chrome Hearts",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fall-brands888%2F2e05b6845d%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-048",
    "name": "Chrome Hearts #CH-113",
    "brand": "Chrome Hearts",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fall-brands888%2F61af546737%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-049",
    "name": "Amiri #AM-1",
    "brand": "Amiri",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2Fbba3162d%2Fsmall.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-050",
    "name": "Amiri #AM-10",
    "brand": "Amiri",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2F9738a0d9fd%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-051",
    "name": "Amiri #AM-100",
    "brand": "Amiri",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2F72fd3b99cf%2Fsmall.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-052",
    "name": "Amiri #AM-101",
    "brand": "Amiri",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2F1252dacd94%2Fsmall.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-053",
    "name": "Amiri #AM-102",
    "brand": "Amiri",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2F8855b322c4%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-054",
    "name": "Amiri #AM-103",
    "brand": "Amiri",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2Fc11fb08159%2Fsmall.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-055",
    "name": "Amiri #AM-104",
    "brand": "Amiri",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2F823789fb33%2Fsmall.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-056",
    "name": "Amiri #AM-105",
    "brand": "Amiri",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2Fe9c6510a34%2Fsmall.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-057",
    "name": "Amiri #AM-106",
    "brand": "Amiri",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2F51bf1bdbd1%2Fsmall.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-058",
    "name": "Amiri #AM-107",
    "brand": "Amiri",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2F7b638031d5%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-059",
    "name": "Amiri #AM-108",
    "brand": "Amiri",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2Ff1fb1c9b72%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-060",
    "name": "Amiri #AM-109",
    "brand": "Amiri",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2Fe5f9d7ac3f%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-061",
    "name": "Bape #BS-51",
    "brand": "Bape",
    "section": "preorder",
    "category": "hoodies",
    "price": 350,
    "retailPrice": 613,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fsnow1688%2Fa58c0a3a%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-062",
    "name": "Bape #BS-52",
    "brand": "Bape",
    "section": "preorder",
    "category": "hoodies",
    "price": 350,
    "retailPrice": 613,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fsnow1688%2F783f655c%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-063",
    "name": "Bape #BS-53",
    "brand": "Bape",
    "section": "preorder",
    "category": "hoodies",
    "price": 350,
    "retailPrice": 613,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fsnow1688%2F580001df%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-064",
    "name": "Bape #BS-54",
    "brand": "Bape",
    "section": "preorder",
    "category": "hoodies",
    "price": 350,
    "retailPrice": 613,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fsnow1688%2F2c8a35f1%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-065",
    "name": "Bape #BS-55",
    "brand": "Bape",
    "section": "preorder",
    "category": "hoodies",
    "price": 350,
    "retailPrice": 613,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fsnow1688%2Fbb4db305%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-066",
    "name": "Bape #BS-56",
    "brand": "Bape",
    "section": "preorder",
    "category": "hoodies",
    "price": 350,
    "retailPrice": 613,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fsnow1688%2Ffaae01b0%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-067",
    "name": "Bape #BS-57",
    "brand": "Bape",
    "section": "preorder",
    "category": "hoodies",
    "price": 350,
    "retailPrice": 613,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fsnow1688%2F05ed63dc%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-068",
    "name": "Bape #BS-59",
    "brand": "Bape",
    "section": "preorder",
    "category": "hoodies",
    "price": 350,
    "retailPrice": 613,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fsnow1688%2F50bc3ee9%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-069",
    "name": "Bape #BS-60",
    "brand": "Bape",
    "section": "preorder",
    "category": "hoodies",
    "price": 350,
    "retailPrice": 613,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fsnow1688%2Fedebf9ee%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-070",
    "name": "Bape #BS-61",
    "brand": "Bape",
    "section": "preorder",
    "category": "hoodies",
    "price": 350,
    "retailPrice": 613,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fsnow1688%2Ff19815f2%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-071",
    "name": "Bape #BS-62",
    "brand": "Bape",
    "section": "preorder",
    "category": "hoodies",
    "price": 350,
    "retailPrice": 613,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fsnow1688%2Fc4470c71%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-072",
    "name": "Bape #BS-63",
    "brand": "Bape",
    "section": "preorder",
    "category": "hoodies",
    "price": 350,
    "retailPrice": 613,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fsnow1688%2F223d576c%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-073",
    "name": "Amiri #AP-1",
    "brand": "Amiri",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2F2cd73462%2Fsmall.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-074",
    "name": "Amiri #AP-10",
    "brand": "Amiri",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2F4a5eb059%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-075",
    "name": "Amiri #AP-11",
    "brand": "Amiri",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2Ff56c7e63%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-076",
    "name": "Amiri #AP-13",
    "brand": "Amiri",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2F05a11b2d%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-077",
    "name": "Amiri #AP-14",
    "brand": "Amiri",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2Ffb8f0955%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-078",
    "name": "Amiri #AP-15",
    "brand": "Amiri",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2F2102c808%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-079",
    "name": "Amiri #AP-16",
    "brand": "Amiri",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2Fc42544b8%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-080",
    "name": "Amiri #AP-17",
    "brand": "Amiri",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2Fa9332be7%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-081",
    "name": "Amiri #AP-18",
    "brand": "Amiri",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2Fb6cdd2c4%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-082",
    "name": "Amiri #AP-19",
    "brand": "Amiri",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2F3255b9bc5e%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-083",
    "name": "Amiri #AP-21",
    "brand": "Amiri",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2F2d79894d%2Fsmall.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-084",
    "name": "Amiri #AP-22",
    "brand": "Amiri",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2F65344c1a%2Fsmall.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-085",
    "name": "Denim Tears #DT-1",
    "brand": "Denim Tears",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhellstar888%2Fa332f638%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-086",
    "name": "Denim Tears #DT-10",
    "brand": "Denim Tears",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhellstar888%2F334c3bf8%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-087",
    "name": "Denim Tears #DT-11",
    "brand": "Denim Tears",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhellstar888%2F08e2ba83%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-088",
    "name": "Denim Tears #DT-12",
    "brand": "Denim Tears",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhellstar888%2F84ee9c68%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-089",
    "name": "Denim Tears #DT-13",
    "brand": "Denim Tears",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhellstar888%2Fc4ef3295%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-090",
    "name": "Denim Tears #DT-14",
    "brand": "Denim Tears",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhellstar888%2Ff5d2f8e5%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-091",
    "name": "Denim Tears #DT-15",
    "brand": "Denim Tears",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhellstar888%2Ffb8db9df%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-092",
    "name": "Denim Tears #DT-16",
    "brand": "Denim Tears",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhellstar888%2Fe171a7dd%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-093",
    "name": "Denim Tears #DT-17",
    "brand": "Denim Tears",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhellstar888%2Feafa91f9%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-094",
    "name": "Denim Tears #DT-18",
    "brand": "Denim Tears",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhellstar888%2F72b6b50f%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-095",
    "name": "Denim Tears #DT-19",
    "brand": "Denim Tears",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhellstar888%2Fddff9027%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-096",
    "name": "Denim Tears #DT-2",
    "brand": "Denim Tears",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhellstar888%2F50bc8764%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-097",
    "name": "Jordan jdm-0024",
    "brand": "Jordan",
    "section": "preorder",
    "category": "accesorios",
    "price": 290,
    "retailPrice": 508,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://chunchimayorista.com/wp-content/uploads/2026/09/24-6.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "Unitalla"
    ]
  },
  {
    "id": "po-098",
    "name": "Jordan jdm-0023",
    "brand": "Jordan",
    "section": "preorder",
    "category": "accesorios",
    "price": 290,
    "retailPrice": 508,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://chunchimayorista.com/wp-content/uploads/2026/09/23-6.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "Unitalla"
    ]
  },
  {
    "id": "po-099",
    "name": "Jordan jdm-0022",
    "brand": "Jordan",
    "section": "preorder",
    "category": "accesorios",
    "price": 290,
    "retailPrice": 508,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://chunchimayorista.com/wp-content/uploads/2026/09/22-6.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "Unitalla"
    ]
  },
  {
    "id": "po-100",
    "name": "Jordan jdm-0021",
    "brand": "Jordan",
    "section": "preorder",
    "category": "accesorios",
    "price": 290,
    "retailPrice": 508,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://chunchimayorista.com/wp-content/uploads/2026/09/21-6.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "Unitalla"
    ]
  },
  {
    "id": "po-101",
    "name": "Jordan jdm-0020",
    "brand": "Jordan",
    "section": "preorder",
    "category": "accesorios",
    "price": 290,
    "retailPrice": 508,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://chunchimayorista.com/wp-content/uploads/2026/09/20-6.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "Unitalla"
    ]
  },
  {
    "id": "po-102",
    "name": "Jordan jdm-0019",
    "brand": "Jordan",
    "section": "preorder",
    "category": "accesorios",
    "price": 290,
    "retailPrice": 508,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://chunchimayorista.com/wp-content/uploads/2026/09/19-6.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "Unitalla"
    ]
  },
  {
    "id": "po-103",
    "name": "Jordan jdm-0018",
    "brand": "Jordan",
    "section": "preorder",
    "category": "accesorios",
    "price": 290,
    "retailPrice": 508,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://chunchimayorista.com/wp-content/uploads/2026/09/18-6.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "Unitalla"
    ]
  },
  {
    "id": "po-104",
    "name": "Jordan jdm-0017",
    "brand": "Jordan",
    "section": "preorder",
    "category": "accesorios",
    "price": 290,
    "retailPrice": 508,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://chunchimayorista.com/wp-content/uploads/2026/09/17-6.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "Unitalla"
    ]
  },
  {
    "id": "po-105",
    "name": "Jordan jdm-0016",
    "brand": "Jordan",
    "section": "preorder",
    "category": "accesorios",
    "price": 290,
    "retailPrice": 508,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://chunchimayorista.com/wp-content/uploads/2026/09/16-6.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "Unitalla"
    ]
  },
  {
    "id": "po-106",
    "name": "Jordan jdm-0015",
    "brand": "Jordan",
    "section": "preorder",
    "category": "accesorios",
    "price": 290,
    "retailPrice": 508,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://chunchimayorista.com/wp-content/uploads/2026/09/15-6.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "Unitalla"
    ]
  },
  {
    "id": "po-107",
    "name": "Jordan jdm-0014",
    "brand": "Jordan",
    "section": "preorder",
    "category": "accesorios",
    "price": 290,
    "retailPrice": 508,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://chunchimayorista.com/wp-content/uploads/2026/09/14-6.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "Unitalla"
    ]
  },
  {
    "id": "po-108",
    "name": "Jordan jdm-0013",
    "brand": "Jordan",
    "section": "preorder",
    "category": "accesorios",
    "price": 290,
    "retailPrice": 508,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://chunchimayorista.com/wp-content/uploads/2026/09/13-6.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "Unitalla"
    ]
  },
  {
    "id": "po-109",
    "name": "Amiri #AJ-1",
    "brand": "Amiri",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/m/nfccc888888/bbd9919110/small.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-110",
    "name": "Amiri #AJ-10",
    "brand": "Amiri",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/m/nfccc888888/da978bdef3/small.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-111",
    "name": "Amiri #AJ-11",
    "brand": "Amiri",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/m/nfccc888888/7cf140469d/small.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-112",
    "name": "Amiri #AJ-12",
    "brand": "Amiri",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/m/nfccc888888/a3a86a74f1/small.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-113",
    "name": "Amiri #AJ-13",
    "brand": "Amiri",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/m/nfccc888888/f70ac2a85a/small.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-114",
    "name": "Amiri #AJ-14",
    "brand": "Amiri",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/m/nfccc888888/05bc63c073/small.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-115",
    "name": "Amiri #AJ-15",
    "brand": "Amiri",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/m/nfccc888888/c1cf31d879/small.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-116",
    "name": "Amiri #AJ-16",
    "brand": "Amiri",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/m/nfccc888888/7d6875adc0/small.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-117",
    "name": "Amiri #AJ-17",
    "brand": "Amiri",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/m/nfccc888888/56599deb8d/small.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-118",
    "name": "Amiri #AJ-18",
    "brand": "Amiri",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/m/nfccc888888/eea842ced6/small.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-119",
    "name": "Amiri #AJ-19",
    "brand": "Amiri",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/m/nfccc888888/0267bbfca1/small.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-120",
    "name": "Amiri #AJ-2",
    "brand": "Amiri",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/m/nfccc888888/187814f054/small.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-121",
    "name": "Bape #BP-1",
    "brand": "Bape",
    "section": "preorder",
    "category": "hoodies",
    "price": 350,
    "retailPrice": 613,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhellstar888%2F1bc0da29%2Fsmall.png",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-122",
    "name": "Bape #BP-10",
    "brand": "Bape",
    "section": "preorder",
    "category": "hoodies",
    "price": 350,
    "retailPrice": 613,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhellstar888%2Faa79f532%2Fsmall.png",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-123",
    "name": "Bape #BP-100",
    "brand": "Bape",
    "section": "preorder",
    "category": "hoodies",
    "price": 350,
    "retailPrice": 613,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhellstar888%2F365f2578%2Fsmall.png",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-124",
    "name": "Bape #BP-101",
    "brand": "Bape",
    "section": "preorder",
    "category": "hoodies",
    "price": 350,
    "retailPrice": 613,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhellstar888%2F610cdf41%2Fsmall.png",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-125",
    "name": "Bape #BP-102",
    "brand": "Bape",
    "section": "preorder",
    "category": "hoodies",
    "price": 350,
    "retailPrice": 613,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhellstar888%2F68769aea%2Fsmall.png",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-126",
    "name": "Bape #BP-103",
    "brand": "Bape",
    "section": "preorder",
    "category": "hoodies",
    "price": 350,
    "retailPrice": 613,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhellstar888%2Fc57191f5%2Fsmall.png",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-127",
    "name": "Bape #BP-104",
    "brand": "Bape",
    "section": "preorder",
    "category": "hoodies",
    "price": 350,
    "retailPrice": 613,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhellstar888%2Fefedde21%2Fsmall.png",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-128",
    "name": "Bape #BP-105",
    "brand": "Bape",
    "section": "preorder",
    "category": "hoodies",
    "price": 350,
    "retailPrice": 613,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhellstar888%2Fd77b9f44%2Fsmall.png",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-129",
    "name": "Bape #BP-106",
    "brand": "Bape",
    "section": "preorder",
    "category": "hoodies",
    "price": 350,
    "retailPrice": 613,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhellstar888%2F402561ec%2Fsmall.png",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-130",
    "name": "Bape #BP-107",
    "brand": "Bape",
    "section": "preorder",
    "category": "hoodies",
    "price": 350,
    "retailPrice": 613,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhellstar888%2Fee937779%2Fsmall.png",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-131",
    "name": "Bape #BP-108",
    "brand": "Bape",
    "section": "preorder",
    "category": "hoodies",
    "price": 350,
    "retailPrice": 613,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhellstar888%2Fc25bd53f%2Fsmall.png",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-132",
    "name": "Bape #BP-109",
    "brand": "Bape",
    "section": "preorder",
    "category": "hoodies",
    "price": 350,
    "retailPrice": 613,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhellstar888%2F1fe46c0c%2Fsmall.png",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-133",
    "name": "Stussy #ST-1",
    "brand": "Stussy",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2Fb615b354%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-134",
    "name": "Stussy #ST-10",
    "brand": "Stussy",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2Fabdc645d%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-135",
    "name": "Stussy #ST-100",
    "brand": "Stussy",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2F40b87976%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-136",
    "name": "Stussy #ST-101",
    "brand": "Stussy",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2Fe05054be%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-137",
    "name": "Stussy #ST-102",
    "brand": "Stussy",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2F440eb096%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-138",
    "name": "Stussy #ST-103",
    "brand": "Stussy",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2F04993419%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-139",
    "name": "Stussy #ST-104",
    "brand": "Stussy",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2Fd7f6068c%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-140",
    "name": "Stussy #ST-105",
    "brand": "Stussy",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2Ff3cc9fea%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-141",
    "name": "Stussy #ST-106",
    "brand": "Stussy",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2Fe5b2697d%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-142",
    "name": "Stussy #ST-107",
    "brand": "Stussy",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2Ff5f34bd4%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-143",
    "name": "Stussy #ST-108",
    "brand": "Stussy",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2Fc04c6913%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-144",
    "name": "Stussy #ST-109",
    "brand": "Stussy",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2F1b516199%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-145",
    "name": "Sp5der #SS-1",
    "brand": "Sp5der",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhellstar888%2Febea9ffe71%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-146",
    "name": "Sp5der #SS-10",
    "brand": "Sp5der",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/m/hellstar888/8c7e0188e4/small.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-147",
    "name": "Sp5der #SS-11",
    "brand": "Sp5der",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/m/hellstar888/5ecdd1681f/small.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-148",
    "name": "Sp5der #SS-12",
    "brand": "Sp5der",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhellstar888%2F3b23ac0fc1%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-149",
    "name": "Sp5der #SS-13",
    "brand": "Sp5der",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhellstar888%2Fdda26365cc%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-150",
    "name": "Sp5der #SS-14",
    "brand": "Sp5der",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhellstar888%2F55bb697330%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-151",
    "name": "Sp5der #SS-15",
    "brand": "Sp5der",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhellstar888%2F91a88a8c%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-152",
    "name": "Sp5der #SS-16",
    "brand": "Sp5der",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhellstar888%2Fca1d7b45%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-153",
    "name": "Sp5der #SS-17",
    "brand": "Sp5der",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhellstar888%2F03cbbcbe%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-154",
    "name": "Sp5der #SS-18",
    "brand": "Sp5der",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhellstar888%2F59259c7c%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-155",
    "name": "Sp5der #SS-19",
    "brand": "Sp5der",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhellstar888%2F00b3d98c%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-156",
    "name": "Sp5der #SS-2",
    "brand": "Sp5der",
    "section": "preorder",
    "category": "hoodies",
    "price": 260,
    "retailPrice": 455,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2Fhellstar888%2F9f93767674%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-157",
    "name": "Essentials #ES-19",
    "brand": "Essentials",
    "section": "preorder",
    "category": "hoodies",
    "price": 270,
    "retailPrice": 473,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2F8f0340e6%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-158",
    "name": "Essentials #ES-20",
    "brand": "Essentials",
    "section": "preorder",
    "category": "hoodies",
    "price": 270,
    "retailPrice": 473,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2F6e61b5ea%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-159",
    "name": "Essentials #ES-10",
    "brand": "Essentials",
    "section": "preorder",
    "category": "hoodies",
    "price": 270,
    "retailPrice": 473,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2Ffb4b028b2f%2Fsmall.jpg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-160",
    "name": "Essentials #ES-100",
    "brand": "Essentials",
    "section": "preorder",
    "category": "hoodies",
    "price": 270,
    "retailPrice": 473,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2F64141e36%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-161",
    "name": "Essentials #ES-101",
    "brand": "Essentials",
    "section": "preorder",
    "category": "hoodies",
    "price": 270,
    "retailPrice": 473,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2F70e7949b%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-162",
    "name": "Essentials #ES-102",
    "brand": "Essentials",
    "section": "preorder",
    "category": "hoodies",
    "price": 270,
    "retailPrice": 473,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2Fdc88b362%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-163",
    "name": "Essentials #ES-103",
    "brand": "Essentials",
    "section": "preorder",
    "category": "hoodies",
    "price": 270,
    "retailPrice": 473,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2Fc7620e13%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-164",
    "name": "Essentials #ES-104",
    "brand": "Essentials",
    "section": "preorder",
    "category": "hoodies",
    "price": 270,
    "retailPrice": 473,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2F688cd6dc4d%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-165",
    "name": "Essentials #ES-105",
    "brand": "Essentials",
    "section": "preorder",
    "category": "hoodies",
    "price": 270,
    "retailPrice": 473,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2F5fa2a795e2%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-166",
    "name": "Essentials #ES-106",
    "brand": "Essentials",
    "section": "preorder",
    "category": "hoodies",
    "price": 270,
    "retailPrice": 473,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2F7804f065d5%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-167",
    "name": "Essentials #ES-107",
    "brand": "Essentials",
    "section": "preorder",
    "category": "hoodies",
    "price": 270,
    "retailPrice": 473,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2F22d31ccd%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-168",
    "name": "Essentials #ES-108",
    "brand": "Essentials",
    "section": "preorder",
    "category": "hoodies",
    "price": 270,
    "retailPrice": 473,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2F0902e024%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-169",
    "name": "Essentials #EP-1",
    "brand": "Essentials",
    "section": "preorder",
    "category": "hoodies",
    "price": 270,
    "retailPrice": 473,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2F91e16150%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-170",
    "name": "Essentials #EP-10",
    "brand": "Essentials",
    "section": "preorder",
    "category": "hoodies",
    "price": 270,
    "retailPrice": 473,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2F0b9a66eb%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-171",
    "name": "Essentials #EP-100",
    "brand": "Essentials",
    "section": "preorder",
    "category": "hoodies",
    "price": 270,
    "retailPrice": 473,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2F327ebed1%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-172",
    "name": "Essentials #EP-102",
    "brand": "Essentials",
    "section": "preorder",
    "category": "hoodies",
    "price": 270,
    "retailPrice": 473,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2Fdbe053b4%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-173",
    "name": "Essentials #EP-103",
    "brand": "Essentials",
    "section": "preorder",
    "category": "hoodies",
    "price": 270,
    "retailPrice": 473,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2F11e2bc91%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-174",
    "name": "Essentials #EP-104",
    "brand": "Essentials",
    "section": "preorder",
    "category": "hoodies",
    "price": 270,
    "retailPrice": 473,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2Faf8b2e68%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-175",
    "name": "Essentials #EP-105",
    "brand": "Essentials",
    "section": "preorder",
    "category": "hoodies",
    "price": 270,
    "retailPrice": 473,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2F716ad6b3%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-176",
    "name": "Essentials #EP-106",
    "brand": "Essentials",
    "section": "preorder",
    "category": "hoodies",
    "price": 270,
    "retailPrice": 473,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2Fd4122c39%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-177",
    "name": "Essentials #EP-109",
    "brand": "Essentials",
    "section": "preorder",
    "category": "hoodies",
    "price": 270,
    "retailPrice": 473,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2Fc42c06a4%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-178",
    "name": "Essentials #EP-11",
    "brand": "Essentials",
    "section": "preorder",
    "category": "hoodies",
    "price": 270,
    "retailPrice": 473,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2F323fe02c%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-179",
    "name": "Essentials #EP-110",
    "brand": "Essentials",
    "section": "preorder",
    "category": "hoodies",
    "price": 270,
    "retailPrice": 473,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2Fb6380de0%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  },
  {
    "id": "po-180",
    "name": "Essentials #EP-111",
    "brand": "Essentials",
    "section": "preorder",
    "category": "hoodies",
    "price": 270,
    "retailPrice": 473,
    "badge": "15-20 DÍAS",
    "badgeType": "badge-preorder",
    "image": "https://yoo.fozogutruong.workers.dev/img?url=https%3A%2F%2Fphoto.yupoo.com%2F18588679886%2F8f5eed73%2Fsmall.jpeg",
    "deliveryTime": "15 a 20 días",
    "sizes": [
      "CH",
      "M",
      "G",
      "XL"
    ]
  }
];


// Add mode to AppState
const AppState = {
  currentMode: 'stock', // 'stock' or 'preorder'
  cart: JSON.parse(localStorage.getItem('puerto_hype_cart') || '[]'),
  currentFilter: 'all',
  searchQuery: '',
  whatsappNumber: '5212294135613'
};

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  setupEventListeners();
  updateCartUI();
});

// Renderizar la cuadrícula de productos con filtrado
function renderProducts() {
  const container = document.getElementById('products-grid');
  if (!container) return;

  const currentProducts = AppState.currentMode === 'stock' ? STOCK_PRODUCTS : PREORDER_PRODUCTS;

  const filtered = currentProducts.filter(prod => {
    const matchesCategory = AppState.currentFilter === 'all' || 
                            prod.category === AppState.currentFilter || 
                            prod.brand === AppState.currentFilter;
    const matchesSearch = prod.name.toLowerCase().includes(AppState.searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });


  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px 10px; color: var(--text-muted);">
        <p style="font-size: 1.1rem; font-weight: 800; font-family: var(--font-display); color: #fff; margin-bottom: 6px;">
          No se encontraron productos
        </p>
        <p style="font-size: 0.8rem;">Intenta con otra palabra clave o selecciona otra categoría.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(product => `
    <article class="product-card" data-id="${product.id}">
      <div class="product-thumb">
        <span class="product-badge ${product.badgeType}">${product.badge}</span>
        <img 
          class="product-img" 
          src="${product.image}" 
          alt="${product.name}" 
          loading="lazy" 
          onerror="this.src='https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&auto=format&fit=crop&q=80'"
        />
      </div>
      <div class="product-body">
        <h3 class="product-name">${product.name}</h3>
        <div class="product-pricing">
          <span class="price-wholesale">$${product.price} MXN</span>
          <span class="price-retail">$${product.retailPrice}</span>
        </div>
        <div class="product-actions">
          <button class="btn-add-cart" onclick="addToCart('${product.id}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            AGREGAR
          </button>
        </div>
      </div>
    </article>
  `).join('');
}

// Configurar escuchadores de eventos interactivos
// Configurar escuchadores de eventos interactivos
function setupEventListeners() {
  // Modo de compra
  const btnStock = document.getElementById('btn-stock');
  const btnPreorder = document.getElementById('btn-preorder');
  const filtersStock = document.getElementById('filters-stock');
  const filtersPreorder = document.getElementById('filters-preorder');
  const bannerPreorder = document.getElementById('preorder-banner');
  const sectionTag = document.getElementById('section-tag-dynamic');
  const sectionTitle = document.getElementById('section-title-dynamic');

  if (btnStock && btnPreorder) {
    btnStock.addEventListener('click', () => {
      AppState.currentMode = 'stock';
      AppState.currentFilter = 'all';
      
      btnStock.style.background = 'var(--neon-lime)';
      btnStock.style.color = 'var(--text-dark)';
      btnStock.style.border = '2px solid var(--neon-lime)';
      
      btnPreorder.style.background = '#12141a';
      btnPreorder.style.color = 'var(--text-secondary)';
      btnPreorder.style.border = '2px solid var(--bg-card-border)';
      
      filtersStock.style.display = 'flex';
      filtersPreorder.style.display = 'none';
      bannerPreorder.style.display = 'none';
      
      sectionTag.textContent = '🔥 HOT DE LA SEMANA';
      sectionTag.style.color = 'var(--neon-red)';
      sectionTitle.textContent = 'EN STOCK (ENVÍO HOY)';
      
      // Reset filters UI
      document.querySelectorAll('#filters-stock .filter-pill').forEach(b => b.classList.remove('active'));
      document.querySelector('#filters-stock .filter-pill[data-filter="all"]').classList.add('active');
      
      renderProducts();
    });

    btnPreorder.addEventListener('click', () => {
      AppState.currentMode = 'preorder';
      AppState.currentFilter = 'all';
      
      btnPreorder.style.background = 'var(--neon-lime)';
      btnPreorder.style.color = 'var(--text-dark)';
      btnPreorder.style.border = '2px solid var(--neon-lime)';
      
      btnStock.style.background = '#12141a';
      btnStock.style.color = 'var(--text-secondary)';
      btnStock.style.border = '2px solid var(--bg-card-border)';
      
      filtersStock.style.display = 'none';
      filtersPreorder.style.display = 'flex';
      bannerPreorder.style.display = 'block';
      
      sectionTag.textContent = '✈️ IMPORTACIÓN DIRECTA';
      sectionTag.style.color = 'var(--neon-lime)';
      sectionTitle.textContent = 'CATÁLOGO POR PEDIDO';
      
      // Reset filters UI
      document.querySelectorAll('#filters-preorder .filter-pill').forEach(b => b.classList.remove('active'));
      document.querySelector('#filters-preorder .filter-pill[data-filter="all"]').classList.add('active');
      
      renderProducts();
    });
  }

  // Filtros de categoría

  const filterBtns = document.querySelectorAll('.filter-pill');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      AppState.currentFilter = e.currentTarget.dataset.filter || 'all';
      renderProducts();
    });
  });

  // Barra de búsqueda
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      AppState.searchQuery = e.target.value.trim();
      renderProducts();
    });
  }

  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
      AppState.searchQuery = searchInput.value.trim();
      renderProducts();
      // Scroll to products
      document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // FAQ Accordions
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(i => i.classList.remove('open'));
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  // Drawer Carrito
  const openCartBtns = document.querySelectorAll('.btn-open-cart');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartDrawer = document.getElementById('cart-drawer');

  openCartBtns.forEach(b => b.addEventListener('click', () => toggleCart(true)));
  if (closeCartBtn) closeCartBtn.addEventListener('click', () => toggleCart(false));
  if (cartOverlay) cartOverlay.addEventListener('click', () => toggleCart(false));

  // Botón de Checkout por WhatsApp en Carrito
  const whatsappCheckoutBtn = document.getElementById('btn-whatsapp-checkout');
  if (whatsappCheckoutBtn) {
    whatsappCheckoutBtn.addEventListener('click', sendOrderViaWhatsApp);
  }
}

// Control del Carrito (Abrir / Cerrar)
function toggleCart(isOpen) {
  const overlay = document.getElementById('cart-overlay');
  const drawer = document.getElementById('cart-drawer');
  if (isOpen) {
    overlay.classList.add('open');
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  } else {
    overlay.classList.remove('open');
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Agregar producto al carrito
// Agregar producto al carrito
function addToCart(productId) {
  const product = STOCK_PRODUCTS.find(p => p.id === productId) || PREORDER_PRODUCTS.find(p => p.id === productId);

  if (!product) return;

  const existing = AppState.cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    AppState.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      retailPrice: product.retailPrice,
      image: product.image,
      size: product.sizes[0] || 'Unitalla',
      quantity: 1
    });
  }

  saveCart();
  updateCartUI();
  showToast(`¡${product.name} agregado al carrito!`);
}

// Modificar cantidad
function updateQuantity(productId, delta) {
  const item = AppState.cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    AppState.cart = AppState.cart.filter(i => i.id !== productId);
  }

  saveCart();
  updateCartUI();
}

// Eliminar producto
function removeFromCart(productId) {
  AppState.cart = AppState.cart.filter(i => i.id !== productId);
  saveCart();
  updateCartUI();
}

// Guardar en LocalStorage
function saveCart() {
  localStorage.setItem('puerto_hype_cart', JSON.stringify(AppState.cart));
}

// Calcular totales y escala de descuentos
function calculateWholesaleSummary() {
  const totalPieces = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = AppState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Escala de descuentos por volumen adicional
  let extraDiscountPercent = 0;
  let tierLabel = 'Menudeo (No califica aún)';

  if (totalPieces >= 50) {
    extraDiscountPercent = 25; // Distribuidor VIP
    tierLabel = 'Distribuidor VIP (-25% extra)';
  } else if (totalPieces >= 24) {
    extraDiscountPercent = 18;
    tierLabel = 'Mayorista Alto (-18% extra)';
  } else if (totalPieces >= 12) {
    extraDiscountPercent = 10;
    tierLabel = 'Mayorista Medio (-10% extra)';
  } else if (totalPieces >= 6) {
    extraDiscountPercent = 0;
    tierLabel = 'Precio Mayoreo Base (Mínimo cumplido)';
  }

  const discountAmount = Math.round(subtotal * (extraDiscountPercent / 100));
  const total = subtotal - discountAmount;

  return {
    totalPieces,
    subtotal,
    extraDiscountPercent,
    discountAmount,
    total,
    tierLabel,
    isWholesaleQualified: totalPieces >= 6
  };
}

// Actualizar la interfaz del carrito y contadores
function updateCartUI() {
  const summary = calculateWholesaleSummary();
  
  // Actualizar badges de contador
  const badges = document.querySelectorAll('.cart-count-badge');
  badges.forEach(b => {
    b.textContent = summary.totalPieces;
    b.style.display = summary.totalPieces > 0 ? 'flex' : 'none';
  });

  // Barra de progreso de mínimo de 6 piezas
  const progressFill = document.getElementById('wholesale-progress-fill');
  const progressText = document.getElementById('wholesale-progress-text');
  if (progressFill && progressText) {
    const percent = Math.min(100, Math.round((summary.totalPieces / 6) * 100));
    progressFill.style.width = `${percent}%`;

    if (summary.totalPieces === 0) {
      progressText.innerHTML = `Llevas <strong>0 / 6 piezas</strong> para activar precio mayoreo`;
    } else if (summary.totalPieces < 6) {
      const faltan = 6 - summary.totalPieces;
      progressText.innerHTML = `Te faltan <span style="color: var(--neon-lime);">${faltan} pieza${faltan > 1 ? 's' : ''}</span> para precio mayoreo`;
    } else {
      progressText.innerHTML = `<span style="color: var(--neon-mint);">¡PRECIO MAYOREO ACTIVADO! 🎉 (${summary.totalPieces} pzas)</span>`;
    }
  }

  // Lista de items en Drawer
  const itemsContainer = document.getElementById('cart-items-container');
  if (itemsContainer) {
    if (AppState.cart.length === 0) {
      itemsContainer.innerHTML = `
        <div class="cart-empty">
          <svg style="width: 48px; height: 48px; opacity: 0.4;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <p style="font-family: var(--font-display); font-weight: 800; color: #fff;">Tu carrito está vacío</p>
          <p style="font-size: 0.75rem;">Agrega al menos 6 prendas o calzado para iniciar tu pedido mayorista.</p>
        </div>
      `;
    } else {
      itemsContainer.innerHTML = AppState.cart.map(item => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-thumb">
          <div class="cart-item-info">
            <div>
              <h4 class="cart-item-name">${item.name}</h4>
              <div style="font-size: 0.68rem; color: var(--text-muted); margin-top: 2px;">Talla: ${item.size}</div>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 6px;">
              <span class="cart-item-price">$${item.price * item.quantity} MXN</span>
              <div class="cart-item-qty">
                <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                <span class="qty-val">${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                <button class="btn-remove-item" onclick="removeFromCart('${item.id}')" title="Eliminar">✕</button>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  // Totales en Drawer
  const subtotalEl = document.getElementById('cart-subtotal');
  const discountRow = document.getElementById('cart-discount-row');
  const discountEl = document.getElementById('cart-discount-amount');
  const totalEl = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('btn-whatsapp-checkout');

  if (subtotalEl) subtotalEl.textContent = `$${summary.subtotal.toLocaleString()} MXN`;
  if (totalEl) totalEl.textContent = `$${summary.total.toLocaleString()} MXN`;

  if (discountRow && discountEl) {
    if (summary.extraDiscountPercent > 0) {
      discountRow.style.display = 'flex';
      discountEl.textContent = `-${summary.extraDiscountPercent}% ($${summary.discountAmount.toLocaleString()} MXN)`;
    } else {
      discountRow.style.display = 'none';
    }
  }

  if (checkoutBtn) {
    if (summary.totalPieces === 0) {
      checkoutBtn.disabled = true;
      checkoutBtn.style.opacity = '0.5';
      checkoutBtn.style.pointerEvents = 'none';
    } else {
      checkoutBtn.disabled = false;
      checkoutBtn.style.opacity = '1';
      checkoutBtn.style.pointerEvents = 'auto';
    }
  }
}

// Generar pedido por WhatsApp
function sendOrderViaWhatsApp() {
  const summary = calculateWholesaleSummary();
  if (AppState.cart.length === 0) return;

  let message = `🔥 *PEDIDO MAYORISTA - PUERTO HYPE* 🔥\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `Hola! Quiero cotizar y apartar las siguientes piezas para mi negocio:\n\n`;

  AppState.cart.forEach((item, index) => {
    message += `• *${item.quantity}x* ${item.name} (${item.size}) — *$${item.price * item.quantity} MXN*\n`;
  });

  message += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `📦 *Total de piezas:* ${summary.totalPieces} pzas\n`;
  message += `💰 *Subtotal Mayoreo:* $${summary.subtotal.toLocaleString()} MXN\n`;
  if (summary.extraDiscountPercent > 0) {
    message += `🏷️ *Descuento por volumen (-${summary.extraDiscountPercent}%):* -$${summary.discountAmount.toLocaleString()} MXN\n`;
  }
  message += `💳 *TOTAL FINAL ESTIMADO:* $${summary.total.toLocaleString()} MXN\n\n`;
  
  if (!summary.isWholesaleQualified) {
    message += `⚠️ *Nota:* Aún no llego al mínimo de 6 piezas, favor de asesorarme sobre precios y opciones de envío.\n\n`;
  } else {
    message += `✅ *Estatus:* Califica para precios de mayoreo con envío prioritario.\n\n`;
  }

  message += `¿Tienen disponibilidad en estas tallas para pago y envío hoy mismo? Gracias!`;

  const url = `https://wa.me/${AppState.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

// Mostrar Toast
function showToast(text) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span style="color: var(--neon-lime);">✔</span>
    <span>${text}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2200);
}
