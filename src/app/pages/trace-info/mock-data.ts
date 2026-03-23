export interface ProductDetail {
  id: string;
  name: string;
  coverImage: string;
  description: string;
  price?: number;
  unit?: string;
  stock?: number;
  status?: 'available' | 'soldout';
  scanCount?: number;
  certifications?: string[];
  originInfo: {
    origin: string;
    harvestDate: string;
    farmName: string;
    address: string;
    contactName?: string;
    contactPhone?: string;
    storage?: string;
  };
  certificate: {
    name: string;
    url: string;
  };
  batch?: {
    lot: string;
    packDate: string;
    expiryDate?: string;
    storage?: string;
  };
  mapCoordinates: {
    lat: number;
    lng: number;
  };
  nutrition?: {
    calories?: number;
    carbs?: number;
    protein?: number;
    fat?: number;
    fiber?: number;
    vitamins?: string[];
  };
  usage?: {
    tips?: string[];
    recipes?: string[];
  };
  timeline: Array<{
    date: string;
    title: string;
    content: string;
  }>;
}

const baseCoords = { lat: 11.94, lng: 108.45 };
const jitter = (value: number, delta: number) => value + (Math.random() - 0.5) * delta;

export const PRODUCT_DETAIL_MOCKS: ProductDetail[] = [
  {
    id: 'qr-dalat-001',
    name: 'Dâu tây New Zealand',
    coverImage: 'https://firebasestorage.googleapis.com/v0/b/traceability-d2da8.firebasestorage.app/o/dau-newzeland.jpg?alt=media&token=1f00974a-4eb9-49fa-865f-5f98f1912cde',
    description: 'Dâu tây giống New Zealand trồng nhà kính, tưới nhỏ giọt, thu hoạch lúc 5h sáng.',
    price: 180000,
    unit: 'kg',
    stock: 45,
    status: 'available',
    scanCount: 320,
    certifications: ['VietGAP'],
    originInfo: {
      origin: 'Đà Lạt, Lâm Đồng',
      harvestDate: '2026-03-15',
      farmName: 'Trang trại Lê Hồng Phong',
      address: '35 Lê Hồng Phong, Đà Lạt',
      contactName: 'Anh Phong',
      contactPhone: '0903 123 456',
      storage: 'Bảo quản mát 4-8°C, dùng trong 3 ngày'
    },
    certificate: { name: 'VietGAP', url: 'https://www.vietgap.com.vn/' },
    batch: {
      lot: 'LOT-DT-1503',
      packDate: '2026-03-15',
      expiryDate: '2026-03-20',
      storage: 'Nhiệt độ 4°C'
    },
    nutrition: {
      calories: 32,
      carbs: 7.7,
      protein: 0.7,
      fiber: 2,
      vitamins: ['Vitamin C', 'Mangan']
    },
    usage: {
      tips: ['Rửa nhẹ dưới vòi nước, để ráo trước khi dùng', 'Ăn trực tiếp hoặc làm salad, smoothie'],
      recipes: ['Salad dâu tây sữa chua', 'Smoothie dâu chuối hạnh nhân']
    },
    mapCoordinates: { lat: jitter(baseCoords.lat, 0.02), lng: jitter(baseCoords.lng, 0.02) },
    timeline: [
      { date: '2026-01-01', title: 'Xuống giống', content: 'Giống New Zealand, giá thể sạch.' },
      { date: '2026-02-10', title: 'Chăm sóc sinh học', content: 'Bón phân hữu cơ, phun neem oil.' },
      { date: '2026-03-15', title: 'Thu hoạch & đóng gói', content: 'Hái 5h sáng, đóng gói mát 4°C.' }
    ]
  },
  {
    id: 'qr-dalat-002',
    name: 'Atiso tím Đà Lạt',
    coverImage: 'https://firebasestorage.googleapis.com/v0/b/traceability-d2da8.firebasestorage.app/o/atiso-tim.jpg?alt=media&token=b4c191c1-83bd-443e-97ed-c3506f3a36b5',
    description: 'Atiso tím canh tác hữu cơ, giàu chất chống oxy hóa, xử lý lạnh ngay sau thu hoạch.',
    price: 95000,
    unit: 'kg',
    stock: 60,
    status: 'available',
    scanCount: 210,
    certifications: ['GlobalGAP'],
    originInfo: {
      origin: 'Xuân Trường, Đà Lạt',
      harvestDate: '2026-03-10',
      farmName: 'Nông trại Xuân Trường',
      address: 'Thôn Đa Lộc, Xuân Trường',
      contactName: 'Chị Thảo',
      contactPhone: '0938 222 333',
      storage: 'Bảo quản mát 6-10°C'
    },
    certificate: { name: 'GlobalGAP', url: 'https://www.globalgap.org/' },
    batch: {
      lot: 'LOT-AT-1003',
      packDate: '2026-03-10',
      expiryDate: '2026-03-25'
    },
    nutrition: {
      calories: 47,
      carbs: 11,
      fiber: 5.4,
      vitamins: ['Vitamin C', 'Folate']
    },
    usage: {
      tips: ['Chần nhẹ trước khi nấu để giữ màu tím đẹp'],
      recipes: ['Canh atiso hầm xương', 'Trà atiso mật ong']
    },
    mapCoordinates: { lat: jitter(baseCoords.lat, 0.02), lng: jitter(baseCoords.lng, 0.02) },
    timeline: [
      { date: '2025-12-20', title: 'Chuẩn bị đất', content: 'Làm đất, phủ bạt, hữu cơ.' },
      { date: '2026-01-15', title: 'Gieo trồng', content: 'Mật độ thưa, tưới nhỏ giọt.' },
      { date: '2026-03-10', title: 'Thu hoạch', content: 'Cắt búp sáng sớm, xử lý lạnh.' }
    ]
  },
  {
    id: 'qr-dalat-003',
    name: 'Cà chua bi chùm',
    coverImage: 'https://firebasestorage.googleapis.com/v0/b/traceability-d2da8.firebasestorage.app/o/ca-chua-bi-chum.jpg?alt=media&token=d59b074b-8a79-49c7-9f4e-bed06a0e4083',
    description: 'Cà chua bi trồng thủy canh, quả chùm ngọt, rửa ozone trước đóng gói.',
    price: 52000,
    unit: 'kg',
    stock: 120,
    status: 'available',
    scanCount: 185,
    certifications: ['VietGAP'],
    originInfo: {
      origin: 'Xuân Thọ, Đà Lạt',
      harvestDate: '2026-03-12',
      farmName: 'Farm Xuân Thọ',
      address: 'Xã Xuân Thọ, Đà Lạt',
      contactName: 'Anh Tín',
      contactPhone: '0977 444 555',
      storage: 'Bảo quản mát 8-12°C'
    },
    certificate: { name: 'VietGAP', url: 'https://www.vietgap.com.vn/' },
    batch: {
      lot: 'LOT-CT-1203',
      packDate: '2026-03-12',
      expiryDate: '2026-03-26'
    },
    nutrition: {
      calories: 18,
      carbs: 3.9,
      protein: 0.9,
      fiber: 1.2,
      vitamins: ['Vitamin A', 'Vitamin C']
    },
    usage: {
      tips: ['Không bảo quản chung với hành tây để tránh ám mùi'],
      recipes: ['Salad caprese mini', 'Cà chua bi nướng mật ong']
    },
    mapCoordinates: { lat: jitter(baseCoords.lat, 0.02), lng: jitter(baseCoords.lng, 0.02) },
    timeline: [
      { date: '2026-01-05', title: 'Ươm giống', content: 'Ươm hạt bi đỏ trong khay xơ dừa.' },
      { date: '2026-02-05', title: 'Chăm sóc', content: 'Dinh dưỡng thủy canh, kiểm soát EC/PH.' },
      { date: '2026-03-12', title: 'Thu hoạch & đóng gói', content: 'Thu quả đỏ 95%, đóng gói hút chân không.' }
    ]
  },
  {
    id: 'qr-dalat-004',
    name: 'Khoai lang mật',
    coverImage: 'https://firebasestorage.googleapis.com/v0/b/traceability-d2da8.firebasestorage.app/o/khoai-lang-mat.jpg?alt=media&token=a38edae4-af38-4e77-b89d-29e8e3c208f8',
    description: 'Khoai lang mật ruột vàng, trồng trên đất bazan, ngọt đậm, nướng dẻo.',
    price: 35000,
    unit: 'kg',
    stock: 80,
    status: 'available',
    scanCount: 140,
    certifications: ['VietGAP+'],
    originInfo: {
      origin: 'Đức Trọng, Lâm Đồng',
      harvestDate: '2026-02-28',
      farmName: 'HTX Rau sạch Trại Mát',
      address: 'Thôn Liên Hiệp, Đức Trọng',
      contactName: 'Anh Toàn',
      contactPhone: '0912 888 999',
      storage: 'Để nơi khô ráo, thoáng mát'
    },
    certificate: { name: 'VietGAP+', url: '#' },
    batch: {
      lot: 'LOT-KL-2802',
      packDate: '2026-02-28',
      expiryDate: '2026-03-28'
    },
    nutrition: {
      calories: 86,
      carbs: 20,
      fiber: 3,
      vitamins: ['Beta-carotene', 'Vitamin C']
    },
    usage: {
      tips: ['Nướng ở 180°C trong 45 phút để caramel hóa tốt'],
      recipes: ['Khoai lang nướng mật ong', 'Súp khoai lang kem tươi']
    },
    mapCoordinates: { lat: jitter(baseCoords.lat, 0.03), lng: jitter(baseCoords.lng, 0.03) },
    timeline: [
      { date: '2025-11-15', title: 'Làm luống', content: 'Làm đất, bón vôi, phủ bạt.' },
      { date: '2025-12-05', title: 'Trồng hom', content: 'Chọn hom giống mật, tưới ẩm.' },
      { date: '2026-02-28', title: 'Thu hoạch', content: 'Nhổ sáng sớm, phơi se, đóng thùng.' }
    ]
  },
  {
    id: 'qr-dalat-005',
    name: 'Bơ 034',
    coverImage: 'https://firebasestorage.googleapis.com/v0/b/traceability-d2da8.firebasestorage.app/o/bo-034.jpg?alt=media&token=8ff1dcd5-4540-4f1e-b8a7-06b2cf668b62',
    description: 'Bơ 034 cơm dẻo, béo thơm, hái đúng chín cây, ủ mát.',
    price: 78000,
    unit: 'kg',
    stock: 65,
    status: 'available',
    scanCount: 95,
    certifications: ['Organic'],
    originInfo: {
      origin: 'Lạc Dương, Lâm Đồng',
      harvestDate: '2026-05-05',
      farmName: 'Trang trại LangBiang',
      address: 'Sườn núi LangBiang, Lạc Dương',
      contactName: 'Anh Nghĩa',
      contactPhone: '0907 222 444',
      storage: 'Ủ chín ở nhiệt độ phòng, sau đó bảo quản mát 6°C'
    },
    certificate: { name: 'Organic', url: '#' },
    batch: {
      lot: 'LOT-BO-0505',
      packDate: '2026-05-05',
      expiryDate: '2026-05-20'
    },
    nutrition: {
      calories: 160,
      carbs: 8.5,
      protein: 2,
      fat: 14.7,
      fiber: 6.7,
      vitamins: ['Vitamin E', 'Folate', 'Kali']
    },
    usage: {
      tips: ['Ủ cùng chuối để bơ chín nhanh', 'Không làm lạnh khi bơ còn xanh cứng'],
      recipes: ['Sinh tố bơ sữa dừa', 'Bơ dầm sữa chua hạt chia']
    },
    mapCoordinates: { lat: jitter(baseCoords.lat, 0.03), lng: jitter(baseCoords.lng, 0.03) },
    timeline: [
      { date: '2025-10-01', title: 'Tỉa cành', content: 'Tỉa thông thoáng, bón phân hữu cơ.' },
      { date: '2026-03-20', title: 'Bao trái', content: 'Bao trái chống côn trùng, giữ sạch.' },
      { date: '2026-05-05', title: 'Thu hoạch', content: 'Hái chọn lọc, ủ chín tự nhiên.' }
    ]
  },
  {
    id: 'qr-dalat-006',
    name: 'Hồng treo gió',
    coverImage: 'https://firebasestorage.googleapis.com/v0/b/traceability-d2da8.firebasestorage.app/o/hong-treo-gio.jpg?alt=media&token=e0e8eb2f-4aee-4053-9208-e7d0353841ac',
    description: 'Hồng trứng sấy gió kiểu Nhật, dẻo ngọt, không chất bảo quản.',
    price: 220000,
    unit: 'kg',
    stock: 30,
    status: 'available',
    scanCount: 120,
    certifications: ['HACCP'],
    originInfo: {
      origin: 'Cầu Đất, Đà Lạt',
      harvestDate: '2026-01-18',
      farmName: 'Trang trại Cầu Đất',
      address: 'Thôn Trường Thọ, Cầu Đất',
      contactName: 'Anh Hải',
      contactPhone: '0933 666 777',
      storage: 'Bảo quản khô ráo, kín gió'
    },
    certificate: { name: 'HACCP', url: '#' },
    batch: {
      lot: 'LOT-HG-1801',
      packDate: '2026-01-18',
      expiryDate: '2026-07-18'
    },
    nutrition: {
      calories: 250,
      carbs: 60,
      fiber: 7,
      vitamins: ['Vitamin A']
    },
    usage: {
      tips: ['Dùng trực tiếp như snack', 'Kết hợp với trà nóng'],
      recipes: ['Hồng treo gió ăn kèm phô mai mềm']
    },
    mapCoordinates: { lat: jitter(baseCoords.lat, 0.03), lng: jitter(baseCoords.lng, 0.03) },
    timeline: [
      { date: '2025-12-01', title: 'Thu hoạch trái tươi', content: 'Chọn trái già giòn.' },
      { date: '2025-12-05', title: 'Gọt và treo', content: 'Gọt vỏ, treo gió 3 tuần.' },
      { date: '2026-01-18', title: 'Hoàn thiện', content: 'Ép dẹt nhẹ, đóng gói hút chân không.' }
    ]
  },
  {
    id: 'qr-dalat-007',
    name: 'Xà lách thủy canh',
    coverImage: 'https://firebasestorage.googleapis.com/v0/b/traceability-d2da8.firebasestorage.app/o/xa-lach.png?alt=media&token=2442fe6b-ea06-4c0d-b355-c95214979cd9',
    description: 'Xà lách mix thủy canh, sạch giòn, không dư lượng thuốc BVTV.',
    price: 32000,
    unit: 'kg',
    stock: 150,
    status: 'available',
    scanCount: 110,
    certifications: ['VietGAP'],
    originInfo: {
      origin: 'Đà Lạt',
      harvestDate: '2026-03-01',
      farmName: 'Nhà kính Phường 11',
      address: 'Phường 11, Đà Lạt',
      contactName: 'Chị Nhàn',
      contactPhone: '0908 777 444',
      storage: 'Giữ lạnh 4-6°C, tránh dập'
    },
    certificate: { name: 'VietGAP', url: 'https://www.vietgap.com.vn/' },
    batch: {
      lot: 'LOT-XL-0103',
      packDate: '2026-03-01',
      expiryDate: '2026-03-08'
    },
    nutrition: {
      calories: 15,
      carbs: 2.9,
      fiber: 1.3,
      vitamins: ['Vitamin K', 'Vitamin A']
    },
    usage: {
      tips: ['Rửa nhanh, để ráo, bảo quản hộp kín'],
      recipes: ['Salad mix dầu giấm', 'Wrap xà lách cuốn thịt nướng']
    },
    mapCoordinates: { lat: jitter(baseCoords.lat, 0.02), lng: jitter(baseCoords.lng, 0.02) },
    timeline: [
      { date: '2026-01-10', title: 'Gieo hạt', content: 'Gieo bọt biển, khử trùng nước.' },
      { date: '2026-02-05', title: 'Nuôi dinh dưỡng', content: 'Điều chỉnh EC, pH ổn định.' },
      { date: '2026-03-01', title: 'Thu hoạch', content: 'Cắt rễ, đóng hộp mát.' }
    ]
  },
  {
    id: 'qr-dalat-008',
    name: 'Nấm hương Đà Lạt',
    coverImage: 'https://firebasestorage.googleapis.com/v0/b/traceability-d2da8.firebasestorage.app/o/nam-huong.jpg?alt=media&token=1a7195d5-8a1c-4100-aed5-486a91815aab',
    description: 'Nấm hương trồng trong nhà lạnh, phơi sấy giữ hương tự nhiên.',
    price: 180000,
    unit: 'kg',
    stock: 70,
    status: 'available',
    scanCount: 75,
    certifications: ['HACCP'],
    originInfo: {
      origin: 'Đà Lạt',
      harvestDate: '2026-02-20',
      farmName: 'Trại nấm Xuân Thành',
      address: 'QL20, Đà Lạt',
      contactName: 'Anh Thành',
      contactPhone: '0909 555 222',
      storage: 'Để nơi khô, kín, tránh nắng'
    },
    certificate: { name: 'HACCP', url: '#' },
    batch: {
      lot: 'LOT-NH-2002',
      packDate: '2026-02-20',
      expiryDate: '2026-08-20'
    },
    nutrition: {
      calories: 35,
      carbs: 5,
      protein: 2.2,
      fiber: 2.5,
      vitamins: ['Vitamin D', 'B-complex']
    },
    usage: {
      tips: ['Ngâm nước ấm 15 phút trước khi nấu'],
      recipes: ['Nấm hương kho tiêu', 'Canh gà nấu nấm hương']
    },
    mapCoordinates: { lat: jitter(baseCoords.lat, 0.02), lng: jitter(baseCoords.lng, 0.02) },
    timeline: [
      { date: '2025-12-25', title: 'Cấy phôi', content: 'Cấy meo giống, ủ tối.' },
      { date: '2026-01-25', title: 'Chăm sóc', content: 'Điều chỉnh ẩm độ, thông thoáng.' },
      { date: '2026-02-20', title: 'Thu hái', content: 'Hái tai nấm đạt kích thước, sấy nhẹ.' }
    ]
  },
  {
    id: 'qr-dalat-009',
    name: 'Trà atiso túi lọc',
    coverImage: 'https://firebasestorage.googleapis.com/v0/b/traceability-d2da8.firebasestorage.app/o/atiso-tui-loc.jpg?alt=media&token=6170629c-3ffb-462f-812b-eb7cbbb4a317',
    description: 'Trà atiso sấy lạnh, túi lọc tiện dụng, giữ trọn dưỡng chất.',
    price: 65000,
    unit: 'hộp',
    stock: 200,
    status: 'available',
    scanCount: 50,
    certifications: ['ISO 22000'],
    originInfo: {
      origin: 'Đà Lạt',
      harvestDate: '2026-01-30',
      farmName: 'Xưởng Trà Xuân Trường',
      address: 'Xuân Trường, Đà Lạt',
      contactName: 'Anh Lợi',
      contactPhone: '0915 111 000',
      storage: 'Để nơi khô ráo, kín, tránh ẩm'
    },
    certificate: { name: 'ISO 22000', url: '#' },
    batch: {
      lot: 'LOT-TRA-3001',
      packDate: '2026-01-30',
      expiryDate: '2027-01-30'
    },
    nutrition: {
      calories: 2,
      carbs: 0.4,
      vitamins: ['Chất chống oxy hóa']
    },
    usage: {
      tips: ['Hãm 5 phút với nước 90°C', 'Có thể dùng lạnh với mật ong'],
      recipes: ['Trà atiso mật ong đá']
    },
    mapCoordinates: { lat: jitter(baseCoords.lat, 0.02), lng: jitter(baseCoords.lng, 0.02) },
    timeline: [
      { date: '2025-12-10', title: 'Sấy lá', content: 'Lá atiso sấy lạnh giữ màu.' },
      { date: '2026-01-05', title: 'Cắt sợi', content: 'Cắt sợi đóng túi lọc.' },
      { date: '2026-01-30', title: 'Đóng gói', content: 'Đóng túi hút ẩm, kiểm tra vi sinh.' }
    ]
  },
  {
    id: 'qr-dalat-010',
    name: 'Mật ong hoa cafe',
    coverImage: 'https://firebasestorage.googleapis.com/v0/b/traceability-d2da8.firebasestorage.app/o/mat-ong-hoa-cafe.png?alt=media&token=f7e48336-ab49-49db-9302-ab88a21b74c8',
    description: 'Mật ong hoa cafe nguyên chất, lọc thô giữ enzyme.',
    price: 120000,
    unit: 'chai 500ml',
    stock: 90,
    status: 'available',
    scanCount: 130,
    certifications: ['OCOP 4 sao'],
    originInfo: {
      origin: 'Lâm Hà, Lâm Đồng',
      harvestDate: '2026-03-05',
      farmName: 'Trang trại Ong Lâm Hà',
      address: 'Lâm Hà, Lâm Đồng',
      contactName: 'Chị Hoa',
      contactPhone: '0902 777 888',
      storage: 'Nơi khô thoáng, đậy kín nắp'
    },
    certificate: { name: 'OCOP 4 sao', url: '#' },
    batch: {
      lot: 'LOT-HC-0503',
      packDate: '2026-03-05',
      expiryDate: '2028-03-05'
    },
    nutrition: {
      calories: 304,
      carbs: 82,
      vitamins: ['Chất chống oxy hóa', 'Khoáng vi lượng']
    },
    usage: {
      tips: ['Không dùng nước sôi >60°C để giữ enzyme'],
      recipes: ['Trà chanh mật ong ấm', 'Yogurt mật ong granola']
    },
    mapCoordinates: { lat: jitter(baseCoords.lat, 0.03), lng: jitter(baseCoords.lng, 0.03) },
    timeline: [
      { date: '2026-01-15', title: 'Đặt đàn', content: 'Đặt đàn ong tại vườn cafe.' },
      { date: '2026-02-25', title: 'Thu mật', content: 'Quay mật, lọc thô.' },
      { date: '2026-03-05', title: 'Đóng chai', content: 'Đóng chai thủy tinh, tiệt trùng nắp.' }
    ]
  },
  {
    id: 'qr-dalat-011',
    name: 'Dâu tằm sấy dẻo',
    coverImage: 'https://firebasestorage.googleapis.com/v0/b/traceability-d2da8.firebasestorage.app/o/dau-tam-say-deo.jpg?alt=media&token=ccd74c5e-cb83-44cd-a5be-62be919188cc',
    description: 'Dâu tằm sấy dẻo giữ vitamin, vị chua ngọt tự nhiên.',
    price: 185000,
    unit: 'kg',
    stock: 55,
    status: 'available',
    scanCount: 65,
    certifications: ['HACCP'],
    originInfo: {
      origin: 'Đà Lạt',
      harvestDate: '2026-02-18',
      farmName: 'Trang trại Dâu Tằm 19',
      address: 'Phường 9, Đà Lạt',
      storage: 'Để nơi khô ráo, kín, tránh nắng'
    },
    certificate: { name: 'HACCP', url: '#' },
    batch: {
      lot: 'LOT-DTAM-1802',
      packDate: '2026-02-18',
      expiryDate: '2026-08-18',
      storage: 'Bảo quản khô, tránh ẩm'
    },
    nutrition: {
      calories: 325,
      carbs: 74,
      protein: 4,
      fiber: 7,
      vitamins: ['Vitamin C', 'Vitamin K']
    },
    usage: {
      tips: ['Ăn trực tiếp như snack, đậy kín sau khi mở', 'Kết hợp với yogurt hoặc ngũ cốc'],
      recipes: ['Granola dâu tằm', 'Trà dâu tằm mật ong']
    },
    mapCoordinates: { lat: jitter(baseCoords.lat, 0.02), lng: jitter(baseCoords.lng, 0.02) },
    timeline: [
      { date: '2026-01-05', title: 'Thu hoạch', content: 'Hái dâu tằm chín đậm.' },
      { date: '2026-01-10', title: 'Sấy', content: 'Sấy gió kết hợp sấy lạnh.' },
      { date: '2026-02-18', title: 'Đóng gói', content: 'Hút chân không, dán nhãn OCOP.' }
    ]
  },
  {
    id: 'qr-dalat-012',
    name: 'Hồng dẻo phô mai',
    coverImage: 'https://firebasestorage.googleapis.com/v0/b/traceability-d2da8.firebasestorage.app/o/hong-phomai.jpg?alt=media&token=3d2e66a3-644b-44be-88c9-bb4326d48399',
    description: 'Hồng dẻo kẹp phô mai, vị béo bùi lạ miệng.',
    price: 260000,
    unit: 'hộp 500g',
    stock: 40,
    status: 'available',
    scanCount: 70,
    certifications: ['OCOP 4 sao'],
    originInfo: {
      origin: 'Cầu Đất, Đà Lạt',
      harvestDate: '2026-01-25',
      farmName: 'Cầu Đất Farm',
      address: 'Cầu Đất, Đà Lạt',
      storage: 'Bảo quản mát 4-8°C'
    },
    certificate: { name: 'OCOP 4 sao', url: '#' },
    batch: {
      lot: 'LOT-HD-2501',
      packDate: '2026-01-25',
      expiryDate: '2026-07-25',
      storage: 'Đóng gói hút chân không, giữ mát'
    },
    nutrition: {
      calories: 290,
      carbs: 70,
      protein: 2.5,
      fiber: 5,
      vitamins: ['Vitamin A', 'Canxi']
    },
    usage: {
      tips: ['Dùng trực tiếp, làm lạnh nhẹ để ăn ngon hơn', 'Đậy kín sau khi mở túi'],
      recipes: ['Hồng dẻo phô mai ăn kèm hạt óc chó', 'Platter phô mai với hồng dẻo']
    },
    mapCoordinates: { lat: jitter(baseCoords.lat, 0.03), lng: jitter(baseCoords.lng, 0.03) },
    timeline: [
      { date: '2025-12-20', title: 'Treo gió', content: 'Treo 20 ngày, dẻo tự nhiên.' },
      { date: '2026-01-15', title: 'Ép dẹt', content: 'Ép nhẹ, phơi se.' },
      { date: '2026-01-25', title: 'Kẹp phô mai', content: 'Kẹp phô mai, hút chân không.' }
    ]
  },
  {
    id: 'qr-dalat-013',
    name: 'Nho thân gỗ (Jabuticaba)',
    coverImage: 'https://firebasestorage.googleapis.com/v0/b/traceability-d2da8.firebasestorage.app/o/nho-than-go.jpg?alt=media&token=8cdadac2-140b-4861-b3ca-1530279f7baa',
    description: 'Nho thân gỗ trồng thử nghiệm, vị chua ngọt lạ.',
    price: 350000,
    unit: 'kg',
    stock: 25,
    status: 'available',
    scanCount: 40,
    certifications: ['VietGAP'],
    originInfo: {
      origin: 'Đà Lạt',
      harvestDate: '2026-04-01',
      farmName: 'Vườn thử nghiệm LangBiang',
      address: 'LangBiang, Lạc Dương',
      storage: 'Giữ mát 6-10°C, tránh dập'
    },
    certificate: { name: 'VietGAP', url: '#' },
    batch: {
      lot: 'LOT-JAB-0104',
      packDate: '2026-04-01',
      expiryDate: '2026-04-10',
      storage: 'Đóng hộp mát, tiêu thụ sớm'
    },
    nutrition: {
      calories: 60,
      carbs: 15,
      protein: 1,
      fiber: 2,
      vitamins: ['Vitamin C', 'Polyphenol']
    },
    usage: {
      tips: ['Rửa nhẹ, ăn cả vỏ để giữ chất chống oxy hóa'],
      recipes: ['Mứt nho thân gỗ', 'Nước ép nho thân gỗ tươi']
    },
    mapCoordinates: { lat: jitter(baseCoords.lat, 0.03), lng: jitter(baseCoords.lng, 0.03) },
    timeline: [
      { date: '2025-11-01', title: 'Tỉa hoa', content: 'Tỉa hoa, giữ chùm khỏe.' },
      { date: '2026-02-20', title: 'Chăm sóc', content: 'Bón hữu cơ, kiểm soát sâu.' },
      { date: '2026-04-01', title: 'Thu hoạch', content: 'Thu chùm chín, làm rượu vang.' }
    ]
  },
  {
    id: 'qr-dalat-014',
    name: 'Rau củ mix Đà Lạt',
    coverImage: 'https://firebasestorage.googleapis.com/v0/b/traceability-d2da8.firebasestorage.app/o/rau-cu-mix.jpg?alt=media&token=4a4317ab-6f41-4663-a37d-2cb59b0a2d39',
    description: 'Combo rau củ (bông cải, cà rốt baby, khoai tây vàng) canh tác an toàn.',
    price: 120000,
    unit: 'combo 3kg',
    stock: 80,
    status: 'available',
    scanCount: 90,
    certifications: ['VietGAP'],
    originInfo: {
      origin: 'Trại Mát, Đà Lạt',
      harvestDate: '2026-03-14',
      farmName: 'HTX Rau sạch Trại Mát',
      address: 'Trại Mát, Đà Lạt',
      storage: 'Bảo quản mát 4-8°C'
    },
    certificate: { name: 'VietGAP', url: 'https://www.vietgap.com.vn/' },
    batch: {
      lot: 'LOT-RM-1403',
      packDate: '2026-03-14',
      expiryDate: '2026-03-21',
      storage: 'Đóng thùng xốp giữ lạnh'
    },
    nutrition: {
      calories: 45,
      carbs: 9,
      protein: 2,
      fiber: 3,
      vitamins: ['Vitamin A', 'Vitamin C']
    },
    usage: {
      tips: ['Rửa từng loại riêng, bảo quản trong hộp kín'],
      recipes: ['Lẩu rau củ Đà Lạt', 'Rau củ nướng mật ong']
    },
    mapCoordinates: { lat: jitter(baseCoords.lat, 0.02), lng: jitter(baseCoords.lng, 0.02) },
    timeline: [
      { date: '2025-12-28', title: 'Chuẩn bị luống', content: 'Phủ màng nông nghiệp.' },
      { date: '2026-01-20', title: 'Gieo hạt', content: 'Gieo bông cải, cà rốt, khoai tây vàng.' },
      { date: '2026-03-14', title: 'Thu hoạch', content: 'Rửa ozone, đóng gói mát 5°C.' }
    ]
  },
  {
    id: 'qr-dalat-015',
    name: 'Dâu tây Nhật Beni Hoppe',
    coverImage: 'https://firebasestorage.googleapis.com/v0/b/traceability-d2da8.firebasestorage.app/o/Beni-Hoppe.jpg?alt=media&token=e707220f-0003-49b9-b66b-d6d99fde060d',
    description: 'Dâu Beni Hoppe trái to, ngọt thanh, trồng giá thể sạch.',
    price: 200000,
    unit: 'kg',
    stock: 70,
    status: 'available',
    scanCount: 150,
    certifications: ['VietGAP'],
    originInfo: {
      origin: 'Đà Lạt',
      harvestDate: '2026-03-18',
      farmName: 'Trang trại Mimosa',
      address: 'Đèo Mimosa, Đà Lạt',
      storage: 'Giữ lạnh 4°C, tránh dập'
    },
    certificate: { name: 'VietGAP', url: 'https://www.vietgap.com.vn/' },
    batch: {
      lot: 'LOT-BH-1803',
      packDate: '2026-03-18',
      expiryDate: '2026-03-23',
      storage: 'Đóng khay PET, hút ẩm nhẹ'
    },
    nutrition: {
      calories: 32,
      carbs: 7.7,
      protein: 0.7,
      fiber: 2,
      vitamins: ['Vitamin C', 'Mangan']
    },
    usage: {
      tips: ['Không ngâm nước lâu, rửa nhẹ và dùng sớm'],
      recipes: ['Parfait dâu tây', 'Bánh tart dâu tây']
    },
    mapCoordinates: { lat: jitter(baseCoords.lat, 0.02), lng: jitter(baseCoords.lng, 0.02) },
    timeline: [
      { date: '2026-01-05', title: 'Trồng cây con', content: 'Cây cấy mô, giá thể sạch.' },
      { date: '2026-02-15', title: 'Tỉa lá', content: 'Tỉa lá già, kiểm soát sâu.' },
      { date: '2026-03-18', title: 'Thu hoạch', content: 'Hái thủ công, phân loại A.' }
    ]
  },
  {
    id: 'qr-dalat-016',
    name: 'Dâu tây Hàn Seolhyang',
    coverImage: 'https://firebasestorage.googleapis.com/v0/b/traceability-d2da8.firebasestorage.app/o/Dau-tay-Seolhyang.jpg?alt=media&token=4ef039a5-aae9-49b3-9fc9-631bb790d279',
    description: 'Dâu Seolhyang thơm, mọng nước, phù hợp ăn tươi.',
    price: 195000,
    unit: 'kg',
    stock: 85,
    status: 'available',
    scanCount: 140,
    certifications: ['VietGAP'],
    originInfo: {
      origin: 'Đà Lạt',
      harvestDate: '2026-03-20',
      farmName: 'Trang trại Lâm Văn',
      address: 'Phường 8, Đà Lạt',
      storage: 'Bảo quản 4°C, tránh va đập'
    },
    certificate: { name: 'VietGAP', url: 'https://www.vietgap.com.vn/' },
    batch: {
      lot: 'LOT-SH-2003',
      packDate: '2026-03-20',
      expiryDate: '2026-03-25',
      storage: 'Khay PET, hút ẩm nhẹ'
    },
    nutrition: {
      calories: 32,
      carbs: 7.7,
      protein: 0.7,
      fiber: 2,
      vitamins: ['Vitamin C', 'Folate']
    },
    usage: {
      tips: ['Ăn tươi hoặc làm smoothie, không rửa trước khi bảo quản'],
      recipes: ['Smoothie dâu sữa hạnh nhân', 'Bánh pancake topping dâu']
    },
    mapCoordinates: { lat: jitter(baseCoords.lat, 0.02), lng: jitter(baseCoords.lng, 0.02) },
    timeline: [
      { date: '2026-01-08', title: 'Trồng cây con', content: 'Giá thể xơ dừa + perlite.' },
      { date: '2026-02-18', title: 'Bón hữu cơ', content: 'Bón phân cá, humic.' },
      { date: '2026-03-20', title: 'Thu hoạch', content: 'Hái sáng sớm, đóng khay PET.' }
    ]
  },
  {
    id: 'qr-dalat-017',
    name: 'Dâu tây Mỹ Albion',
    coverImage: 'https://firebasestorage.googleapis.com/v0/b/traceability-d2da8.firebasestorage.app/o/dau-albion-.png?alt=media&token=f8aec1b2-bfb5-4be0-a081-3b05b9438f7b',
    description: 'Dâu Albion vị đậm, thịt chắc, thích hợp làm bánh.',
    price: 185000,
    unit: 'kg',
    stock: 75,
    status: 'available',
    scanCount: 120,
    certifications: ['VietGAP'],
    originInfo: {
      origin: 'Đà Lạt',
      harvestDate: '2026-03-22',
      farmName: 'Trang trại Đơn Dương',
      address: 'Đơn Dương, Lâm Đồng',
      storage: 'Giữ lạnh 4°C'
    },
    certificate: { name: 'VietGAP', url: 'https://www.vietgap.com.vn/' },
    batch: {
      lot: 'LOT-AL-2203',
      packDate: '2026-03-22',
      expiryDate: '2026-03-27',
      storage: 'Đóng khay, tem truy xuất'
    },
    nutrition: {
      calories: 32,
      carbs: 7.7,
      protein: 0.7,
      fiber: 2,
      vitamins: ['Vitamin C', 'Chất chống oxy hóa']
    },
    usage: {
      tips: ['Bảo quản ngăn mát, dùng trong 3 ngày'],
      recipes: ['Cheesecake dâu Albion', 'Mứt dâu ít đường']
    },
    mapCoordinates: { lat: jitter(baseCoords.lat, 0.03), lng: jitter(baseCoords.lng, 0.03) },
    timeline: [
      { date: '2026-01-10', title: 'Chuẩn bị giá thể', content: 'Trộn xơ dừa, trấu hun, perlite.' },
      { date: '2026-02-20', title: 'Chăm sóc', content: 'Tưới nhỏ giọt, cắt chùm già.' },
      { date: '2026-03-22', title: 'Thu hoạch', content: 'Hái chọn quả đỏ đều.' }
    ]
  },
  {
    id: 'qr-dalat-018',
    name: 'Dâu tây Hàn Maehyang',
    coverImage: 'https://firebasestorage.googleapis.com/v0/b/traceability-d2da8.firebasestorage.app/o/dau-tay-han-quoc-maehyang.jpg?alt=media&token=5bd9ba12-4158-4d99-9c93-b2aee71e869c',
    description: 'Dâu Maehyang hương thơm, độ brix cao, ruột hồng.',
    price: 190000,
    unit: 'kg',
    stock: 60,
    status: 'available',
    scanCount: 105,
    certifications: ['VietGAP'],
    originInfo: {
      origin: 'Đà Lạt',
      harvestDate: '2026-03-24',
      farmName: 'Trang trại An Bình',
      address: 'An Bình, Đà Lạt',
      storage: 'Giữ lạnh 4°C'
    },
    certificate: { name: 'VietGAP', url: 'https://www.vietgap.com.vn/' },
    batch: {
      lot: 'LOT-MH-2403',
      packDate: '2026-03-24',
      expiryDate: '2026-03-29',
      storage: 'Khay 250g, bọc màng co'
    },
    nutrition: {
      calories: 32,
      carbs: 7.7,
      protein: 0.7,
      fiber: 2,
      vitamins: ['Vitamin C', 'Mangan']
    },
    usage: {
      tips: ['Không rửa trước khi bảo quản, chỉ rửa trước khi ăn'],
      recipes: ['Salad dâu phô mai tươi', 'Sinh tố dâu chuối']
    },
    mapCoordinates: { lat: jitter(baseCoords.lat, 0.02), lng: jitter(baseCoords.lng, 0.02) },
    timeline: [
      { date: '2026-01-12', title: 'Trồng cây con', content: 'Mật độ 25cm, tưới phun sương.' },
      { date: '2026-02-22', title: 'Xử lý sâu', content: 'Biện pháp sinh học, pheromone.' },
      { date: '2026-03-24', title: 'Thu hoạch', content: 'Hái sáng, bảo quản 4°C.' }
    ]
  },
  {
    id: 'qr-dalat-019',
    name: 'Dâu tây Nhật Yotsuboshi',
    coverImage: 'https://firebasestorage.googleapis.com/v0/b/traceability-d2da8.firebasestorage.app/o/dau-tay-nhat-ban-y.jpg?alt=media&token=0f17ac66-1eb5-4b31-8639-f4a223532b3f',
    description: 'Dâu Yotsuboshi ngọt thanh, thích hợp ăn tươi và salad.',
    price: 210000,
    unit: 'kg',
    stock: 55,
    status: 'available',
    scanCount: 95,
    certifications: ['VietGAP'],
    originInfo: {
      origin: 'Đà Lạt',
      harvestDate: '2026-03-26',
      farmName: 'Trang trại Nhật Garden',
      address: 'Hoa Sơn, Đà Lạt',
      storage: 'Bảo quản mát 4°C'
    },
    certificate: { name: 'VietGAP', url: 'https://www.vietgap.com.vn/' },
    batch: {
      lot: 'LOT-YB-2603',
      packDate: '2026-03-26',
      expiryDate: '2026-03-31',
      storage: 'Khay PET, tem QR'
    },
    nutrition: {
      calories: 32,
      carbs: 7.7,
      protein: 0.7,
      fiber: 2,
      vitamins: ['Vitamin C', 'Folate']
    },
    usage: {
      tips: ['Để nguyên cuống khi rửa để giữ độ ngọt'],
      recipes: ['Salad dâu Yotsuboshi phô mai feta', 'Trà dâu tươi']
    },
    mapCoordinates: { lat: jitter(baseCoords.lat, 0.02), lng: jitter(baseCoords.lng, 0.02) },
    timeline: [
      { date: '2026-01-15', title: 'Trồng', content: 'Giá thể hữu cơ, che lưới.' },
      { date: '2026-02-25', title: 'Tỉa hoa', content: 'Giữ chùm khỏe, bỏ hoa nhỏ.' },
      { date: '2026-03-26', title: 'Thu hoạch', content: 'Hái tay, đóng hộp 250g.' }
    ]
  },
  {
    id: 'qr-dalat-020',
    name: 'Dâu tây Mỹ Sweet Charlie',
    coverImage: 'https://firebasestorage.googleapis.com/v0/b/traceability-d2da8.firebasestorage.app/o/d%C3%A2u-M%E1%BB%B9.jpg?alt=media&token=447dd85a-b343-4be1-9e32-678b1ddb2b59',
    description: 'Sweet Charlie ngọt gắt, thơm, phù hợp làm mứt.',
    price: 175000,
    unit: 'kg',
    stock: 65,
    status: 'available',
    scanCount: 88,
    certifications: ['VietGAP'],
    originInfo: {
      origin: 'Đà Lạt',
      harvestDate: '2026-03-28',
      farmName: 'Trang trại Sweet Farm',
      address: 'Thái Phiên, Đà Lạt',
      storage: 'Bảo quản 4°C'
    },
    certificate: { name: 'VietGAP', url: 'https://www.vietgap.com.vn/' },
    batch: {
      lot: 'LOT-SC-2803',
      packDate: '2026-03-28',
      expiryDate: '2026-04-02',
      storage: 'Đóng khay, hút ẩm nhẹ'
    },
    nutrition: {
      calories: 32,
      carbs: 7.7,
      protein: 0.7,
      fiber: 2,
      vitamins: ['Vitamin C', 'Chất chống oxy hóa']
    },
    usage: {
      tips: ['Giữ lạnh, không để gần thực phẩm có mùi'],
      recipes: ['Mứt dâu Sweet Charlie', 'Sinh tố dâu sữa chua']
    },
    mapCoordinates: { lat: jitter(baseCoords.lat, 0.02), lng: jitter(baseCoords.lng, 0.02) },
    timeline: [
      { date: '2026-01-18', title: 'Trồng cây con', content: 'Nhà kính lạnh, tưới nhỏ giọt.' },
      { date: '2026-02-26', title: 'Bón hữu cơ', content: 'Phân gà hoai, humic.' },
      { date: '2026-03-28', title: 'Thu hoạch', content: 'Hái sáng, cấp đông nhanh làm mứt.' }
    ]
  }
];
