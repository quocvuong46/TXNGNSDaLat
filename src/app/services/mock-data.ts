import { ProductOrigin } from '../models/interfaces';

export const MOCK_PRODUCT_ORIGINS: ProductOrigin[] = [
  {
    id: 'QR-DAUTAY-001',
    name: 'Dâu tây Đà Lạt (New Zealand)',
    farmName: 'Trang trại Lê Hồng Phong - Đà Lạt',
    location: '35 Lê Hồng Phong, Đà Lạt, Lâm Đồng',
    harvestDate: '2026-03-15',
    certifications: 'VietGAP',
    description: 'Dâu tây giống New Zealand trồng trong nhà kính, tưới nhỏ giọt, thu hoạch sáng sớm giữ độ tươi và vị ngọt dịu.',
    certificationImageUrl: 'https://i.imgur.com/VKaqY2n.jpeg',
    images: [
      'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80'
    ],
    mapEmbedUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=108.4483%2C11.9304%2C108.4683%2C11.9504&layer=mapnik&marker=11.9404%2C108.4583',
    timeline: [
      { date: '2026-01-01', title: 'Xuống giống', detail: 'Trồng tại nhà màng số 3, giống New Zealand, giá thể sạch.' },
      { date: '2026-02-10', title: 'Chăm sóc sinh học', detail: 'Bón phân hữu cơ vi sinh, phun phòng sinh học neem oil.' },
      { date: '2026-03-15', title: 'Thu hoạch & đóng gói', detail: 'Hái lúc 5h sáng, phân loại A, đóng gói mát 4°C.' },
      { date: '2026-03-16', title: 'Vận chuyển', detail: 'Bàn giao cho đơn vị lạnh đi TP.HCM.' }
    ]
  },
  {
    id: 'QR-ATISO-002',
    name: 'Atiso tím Đà Lạt',
    farmName: 'Nông trại Xuân Trường - Đà Lạt',
    location: 'Xã Xuân Trường, Đà Lạt',
    harvestDate: '2026-03-10',
    certifications: 'GlobalGAP',
    description: 'Atiso tím canh tác hữu cơ, giàu chất chống oxy hóa, được chọn lọc và xử lý lạnh ngay sau thu hoạch.',
    certificationImageUrl: 'https://i.imgur.com/VKaqY2n.jpeg',
    images: [
      'https://images.unsplash.com/photo-1506807803488-8eafc15323c1?auto=format&fit=crop&w=900&q=80'
    ],
    mapEmbedUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=108.4483%2C11.9304%2C108.4683%2C11.9504&layer=mapnik&marker=11.9404%2C108.4583',
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
    description: 'Cà chua bi trồng thủy canh, chọn trái đỏ đều, sấy lạnh giữ trọn hương vị và vitamin, đóng gói hút chân không.',
    certificationImageUrl: 'https://i.imgur.com/VKaqY2n.jpeg',
    images: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80'
    ],
    mapEmbedUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=108.4483%2C11.9304%2C108.4683%2C11.9504&layer=mapnik&marker=11.9404%2C108.4583',
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
    description: 'Combo rau củ (bông cải xanh, cà rốt baby, khoai tây vàng) canh tác an toàn, rửa ozone và đóng gói mát.',
    certificationImageUrl: 'https://i.imgur.com/VKaqY2n.jpeg',
    images: [
      'https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=900&q=80'
    ],
    mapEmbedUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=108.4483%2C11.9304%2C108.4683%2C11.9504&layer=mapnik&marker=11.9404%2C108.4583',
    timeline: [
      { date: '2025-12-28', title: 'Chuẩn bị luống', detail: 'Làm luống, phủ màng nông nghiệp.' },
      { date: '2026-01-20', title: 'Gieo hạt', detail: 'Gieo bông cải, cà rốt, khoai tây vàng.' },
      { date: '2026-03-14', title: 'Thu hoạch đóng gói', detail: 'Rửa ozone, đóng gói mát 5°C.' }
    ]
  }
];

export function findOriginByCode(code: string): ProductOrigin | null {
  const normalized = code.trim();
  // chấp nhận cả dạng qr url chứa mã ở cuối
  const match = MOCK_PRODUCT_ORIGINS.find(p => p.id.toLowerCase() === normalized.toLowerCase());
  if (match) return match;

  // thử tìm theo tên đơn giản (nếu user gõ tên)
  const lower = normalized.toLowerCase();
  return MOCK_PRODUCT_ORIGINS.find(p => p.name.toLowerCase().includes(lower)) ?? null;
}

export function searchMockProducts(keyword: string): ProductOrigin[] {
  const lower = keyword.trim().toLowerCase();
  if (!lower) return MOCK_PRODUCT_ORIGINS;
  return MOCK_PRODUCT_ORIGINS.filter(p =>
    p.id.toLowerCase().includes(lower) ||
    p.name.toLowerCase().includes(lower) ||
    p.farmName.toLowerCase().includes(lower) ||
    p.certifications.toLowerCase().includes(lower)
  );
}