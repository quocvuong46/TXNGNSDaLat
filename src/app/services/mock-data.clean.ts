import { ProductOrigin } from '../models/interfaces';

const BASE_PRODUCTS: ProductOrigin[] = [
  {
    id: 'QR-DAUTAY-001',
    name: 'Dâu tây Đà Lạt (New Zealand)',
    farmName: 'Trang trại Lê Hồng Phong - Đà Lạt',
    location: '35 Lê Hồng Phong, Đà Lạt, Lâm Đồng',
    harvestDate: '2026-03-15',
    certifications: 'VietGAP',
    description: 'Dâu tây trồng nhà kính, thu hoạch sáng sớm giữ độ tươi.',
    certificationImageUrl: 'https://i.imgur.com/VKaqY2n.jpeg',
    images: [
      'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=900&q=80'
    ],
    mapEmbedUrl:
      'https://www.openstreetmap.org/export/embed.html?bbox=108.4483%2C11.9304%2C108.4683%2C11.9504&layer=mapnik&marker=11.9404%2C108.4583',
    timeline: [
      { date: '2026-01-01', title: 'Xuống giống', detail: 'Trồng tại nhà màng số 3, giống New Zealand, giá thể sạch.' },
      { date: '2026-02-10', title: 'Chăm sóc sinh học', detail: 'Bón phân hữu cơ vi sinh, phun phòng sinh học neem oil.' },
      { date: '2026-03-15', title: 'Thu hoạch & đóng gói', detail: 'Hái lúc 5h sáng, phân loại A, đóng gói mát 4°C.' }
    ]
  },
  {
    id: 'QR-ATISO-002',
    name: 'Atiso tím Đà Lạt',
    farmName: 'Nông trại Xuân Trường - Đà Lạt',
    location: 'Xã Xuân Trường, Đà Lạt',
    harvestDate: '2026-03-10',
    certifications: 'GlobalGAP',
    description: 'Atiso tím canh tác hữu cơ, giàu chất chống oxy hóa.',
    certificationImageUrl: 'https://i.imgur.com/VKaqY2n.jpeg',
    images: [
      'https://images.unsplash.com/photo-1506807803488-8eafc15323c1?auto=format&fit=crop&w=900&q=80'
    ],
    mapEmbedUrl:
      'https://www.openstreetmap.org/export/embed.html?bbox=108.4483%2C11.9304%2C108.4683%2C11.9504&layer=mapnik&marker=11.9404%2C108.4583',
    timeline: [
      { date: '2026-01-05', title: 'Chăm đất', detail: 'Làm đất, phủ bạt, chuẩn bị luống hữu cơ.' },
      { date: '2026-02-05', title: 'Bón phân hữu cơ', detail: 'Phân vi sinh + chế phẩm Trichoderma.' },
      { date: '2026-03-10', title: 'Thu hoạch', detail: 'Cắt búp sáng sớm, xử lý lạnh ngay.' }
    ]
  },
  {
    id: 'QR-CACHUABI-003',
    name: 'Cà chua bi sấy lạnh',
    farmName: 'Farm Xuân Thọ - Đà Lạt',
    location: 'Xã Xuân Thọ, Đà Lạt',
    harvestDate: '2026-03-12',
    certifications: 'VietGAP',
    description: 'Cà chua bi trồng thủy canh, sấy lạnh giữ hương vị.',
    certificationImageUrl: 'https://i.imgur.com/VKaqY2n.jpeg',
    images: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80'
    ],
    mapEmbedUrl:
      'https://www.openstreetmap.org/export/embed.html?bbox=108.4483%2C11.9304%2C108.4683%2C11.9504&layer=mapnik&marker=11.9404%2C108.4583',
    timeline: [
      { date: '2026-01-08', title: 'Ươm giống', detail: 'Ươm hạt giống bi đỏ trong khay xơ dừa.' },
      { date: '2026-02-12', title: 'Chăm sóc', detail: 'Dinh dưỡng thủy canh chuẩn, kiểm soát EC/PH.' },
      { date: '2026-03-12', title: 'Thu hoạch & sấy', detail: 'Thu trái đỏ 95%, sấy lạnh 18h, đóng gói hút chân không.' }
    ]
  },
  {
    id: 'QR-RAUCU-004',
    name: 'Rau củ mix Đà Lạt',
    farmName: 'HTX Rau sạch Trại Mát',
    location: 'Trại Mát, Đà Lạt',
    harvestDate: '2026-03-14',
    certifications: 'VietGAP',
    description: 'Combo rau củ canh tác an toàn, rửa ozone, đóng gói mát.',
    certificationImageUrl: 'https://i.imgur.com/VKaqY2n.jpeg',
    images: [
      'https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=900&q=80'
    ],
    mapEmbedUrl:
      'https://www.openstreetmap.org/export/embed.html?bbox=108.4483%2C11.9304%2C108.4683%2C11.9504&layer=mapnik&marker=11.9404%2C108.4583',
    timeline: [
      { date: '2025-12-28', title: 'Chuẩn bị luống', detail: 'Làm luống, phủ màng nông nghiệp.' },
      { date: '2026-01-20', title: 'Gieo hạt', detail: 'Gieo bông cải, cà rốt, khoai tây vàng.' },
      { date: '2026-03-14', title: 'Thu hoạch đóng gói', detail: 'Rửa ozone, đóng gói mát 5°C.' }
    ]
  }
];

const VARIANTS: Array<Pick<ProductOrigin, 'certifications' | 'description' | 'location'>> = [
  { certifications: 'VietGAP', description: 'Canh tác hữu cơ, tưới nhỏ giọt, truy xuất đầy đủ.', location: 'Đà Lạt, Lâm Đồng' },
  { certifications: 'GlobalGAP', description: 'Quy trình GlobalGAP, kiểm soát thuốc BVTV nghiêm ngặt.', location: 'Xuân Trường, Đà Lạt' },
  { certifications: 'Organic', description: 'Canh tác hữu cơ, không hóa chất tổng hợp.', location: 'Trại Mát, Đà Lạt' },
  { certifications: 'HACCP', description: 'Đóng gói chuẩn HACCP, chuỗi lạnh 4°C.', location: 'Đức Trọng, Lâm Đồng' },
  { certifications: 'VietGAP+', description: 'VietGAP nâng cao, kiểm soát dư lượng định kỳ.', location: 'Liên Nghĩa, Đức Trọng' }
];

function buildMockProducts(total = 50): ProductOrigin[] {
  const products: ProductOrigin[] = [];

  BASE_PRODUCTS.forEach((p, index) => {
    products.push({ ...p, id: p.id, name: `${p.name} #${index + 1}` });
  });

  const photos = [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1506807803488-8eafc15323c1?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=900&q=80'
  ];

  for (let i = products.length; i < total; i++) {
    const variant = VARIANTS[i % VARIANTS.length];
    const code = `QR-PROD-${(i + 1).toString().padStart(3, '0')}`;
    const baseName = ['Rau', 'Củ', 'Quả', 'Hoa', 'Trà', 'Mật ong'][i % 6];
    const item: ProductOrigin = {
      id: code,
      name: `${baseName} đặc sản Đà Lạt ${i + 1}`,
      farmName: `Trang trại cao nguyên ${((i % 5) + 1)}`,
      location: variant.location,
      harvestDate: '2026-03-01',
      certifications: variant.certifications,
      description: variant.description,
      certificationImageUrl: 'https://i.imgur.com/VKaqY2n.jpeg',
      images: [photos[i % photos.length]],
      mapEmbedUrl: BASE_PRODUCTS[0].mapEmbedUrl,
      timeline: [
        { date: '2026-01-15', title: 'Gieo trồng', detail: 'Gieo trồng và chăm sóc tiêu chuẩn cao nguyên.' },
        { date: '2026-02-15', title: 'Chăm sóc', detail: 'Kiểm tra sâu bệnh, tưới nhỏ giọt, bón phân hữu cơ.' },
        { date: '2026-03-01', title: 'Thu hoạch', detail: 'Thu hoạch sáng sớm, đóng gói mát.' }
      ]
    };
    products.push(item);
  }

  return products;
}

export const MOCK_PRODUCT_ORIGINS: ProductOrigin[] = buildMockProducts(50);

export function findOriginByCode(code: string): ProductOrigin | null {
  const normalized = code.trim();
  const match = MOCK_PRODUCT_ORIGINS.find((p) => p.id.toLowerCase() === normalized.toLowerCase());
  if (match) return match;

  const lower = normalized.toLowerCase();
  return (
    MOCK_PRODUCT_ORIGINS.find(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.farmName.toLowerCase().includes(lower) ||
        p.certifications.toLowerCase().includes(lower)
    ) ?? null
  );
}

export function searchMockProducts(keyword: string): ProductOrigin[] {
  const lower = keyword.trim().toLowerCase();
  if (!lower) return MOCK_PRODUCT_ORIGINS;
  return MOCK_PRODUCT_ORIGINS.filter(
    (p) =>
      p.id.toLowerCase().includes(lower) ||
      p.name.toLowerCase().includes(lower) ||
      p.farmName.toLowerCase().includes(lower) ||
      p.certifications.toLowerCase().includes(lower)
  );
}

export function getAllMockProducts(): ProductOrigin[] {
  return MOCK_PRODUCT_ORIGINS;
}
