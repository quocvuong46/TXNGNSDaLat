export interface ProductDetail {
  id: string;
  name: string;
  coverImage: string;
  description: string;
  originInfo: {
    origin: string;
    harvestDate: string;
    farmName: string;
    address: string;
  };
  certificate: {
    name: string;
    url: string;
  };
  mapCoordinates: {
    lat: number;
    lng: number;
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
    coverImage: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=1200&q=80',
    description: 'Dâu tây giống New Zealand trồng nhà kính, tưới nhỏ giọt, thu hoạch lúc 5h sáng.',
    originInfo: {
      origin: 'Đà Lạt, Lâm Đồng',
      harvestDate: '2026-03-15',
      farmName: 'Trang trại Lê Hồng Phong',
      address: '35 Lê Hồng Phong, Đà Lạt'
    },
    certificate: { name: 'VietGAP', url: 'https://www.vietgap.com.vn/' },
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
    coverImage: 'https://images.unsplash.com/photo-1506807803488-8eafc15323c1?auto=format&fit=crop&w=1200&q=80',
    description: 'Atiso tím canh tác hữu cơ, giàu chất chống oxy hóa, xử lý lạnh ngay sau thu hoạch.',
    originInfo: {
      origin: 'Xuân Trường, Đà Lạt',
      harvestDate: '2026-03-10',
      farmName: 'Nông trại Xuân Trường',
      address: 'Thôn Đa Lộc, Xuân Trường'
    },
    certificate: { name: 'GlobalGAP', url: 'https://www.globalgap.org/' },
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
    coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    description: 'Cà chua bi trồng thủy canh, quả chùm ngọt, rửa ozone trước đóng gói.',
    originInfo: {
      origin: 'Xuân Thọ, Đà Lạt',
      harvestDate: '2026-03-12',
      farmName: 'Farm Xuân Thọ',
      address: 'Xã Xuân Thọ, Đà Lạt'
    },
    certificate: { name: 'VietGAP', url: 'https://www.vietgap.com.vn/' },
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
    coverImage: 'https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?auto=format&fit=crop&w=1200&q=80',
    description: 'Khoai lang mật ruột vàng, trồng trên đất bazan, ngọt đậm, nướng dẻo.',
    originInfo: {
      origin: 'Đức Trọng, Lâm Đồng',
      harvestDate: '2026-02-28',
      farmName: 'HTX Rau sạch Trại Mát',
      address: 'Thôn Liên Hiệp, Đức Trọng'
    },
    certificate: { name: 'VietGAP+', url: '#' },
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
    coverImage: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80',
    description: 'Bơ 034 cơm dẻo, béo thơm, hái đúng chín cây, ủ mát.',
    originInfo: {
      origin: 'Lạc Dương, Lâm Đồng',
      harvestDate: '2026-05-05',
      farmName: 'Trang trại LangBiang',
      address: 'Sườn núi LangBiang, Lạc Dương'
    },
    certificate: { name: 'Organic', url: '#' },
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
    coverImage: 'https://images.unsplash.com/photo-1601000937791-5e4e38ce510f?auto=format&fit=crop&w=1200&q=80',
    description: 'Hồng trứng sấy gió kiểu Nhật, dẻo ngọt, không chất bảo quản.',
    originInfo: {
      origin: 'Cầu Đất, Đà Lạt',
      harvestDate: '2026-01-18',
      farmName: 'Trang trại Cầu Đất',
      address: 'Thôn Trường Thọ, Cầu Đất'
    },
    certificate: { name: 'HACCP', url: '#' },
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
    coverImage: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=1200&q=80',
    description: 'Xà lách mix thủy canh, sạch giòn, không dư lượng thuốc BVTV.',
    originInfo: {
      origin: 'Đà Lạt',
      harvestDate: '2026-03-01',
      farmName: 'Nhà kính Phường 11',
      address: 'Phường 11, Đà Lạt'
    },
    certificate: { name: 'VietGAP', url: 'https://www.vietgap.com.vn/' },
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
    coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    description: 'Nấm hương trồng trong nhà lạnh, phơi sấy giữ hương tự nhiên.',
    originInfo: {
      origin: 'Đà Lạt',
      harvestDate: '2026-02-20',
      farmName: 'Trại nấm Xuân Thành',
      address: 'QL20, Đà Lạt'
    },
    certificate: { name: 'HACCP', url: '#' },
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
    coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    description: 'Trà atiso sấy lạnh, túi lọc tiện dụng, giữ trọn dưỡng chất.',
    originInfo: {
      origin: 'Đà Lạt',
      harvestDate: '2026-01-30',
      farmName: 'Xưởng Trà Xuân Trường',
      address: 'Xuân Trường, Đà Lạt'
    },
    certificate: { name: 'ISO 22000', url: '#' },
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
    coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    description: 'Mật ong hoa cafe nguyên chất, lọc thô giữ enzyme.',
    originInfo: {
      origin: 'Lâm Hà, Lâm Đồng',
      harvestDate: '2026-03-05',
      farmName: 'Trang trại Ong Lâm Hà',
      address: 'Lâm Hà, Lâm Đồng'
    },
    certificate: { name: 'OCOP 4 sao', url: '#' },
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
    coverImage: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=1200&q=80',
    description: 'Dâu tằm sấy dẻo giữ vitamin, vị chua ngọt tự nhiên.',
    originInfo: {
      origin: 'Đà Lạt',
      harvestDate: '2026-02-18',
      farmName: 'Trang trại Dâu Tằm 19',
      address: 'Phường 9, Đà Lạt'
    },
    certificate: { name: 'HACCP', url: '#' },
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
    coverImage: 'https://images.unsplash.com/photo-1601000937791-5e4e38ce510f?auto=format&fit=crop&w=1200&q=80',
    description: 'Hồng dẻo kẹp phô mai, vị béo bùi lạ miệng.',
    originInfo: {
      origin: 'Cầu Đất, Đà Lạt',
      harvestDate: '2026-01-25',
      farmName: 'Cầu Đất Farm',
      address: 'Cầu Đất, Đà Lạt'
    },
    certificate: { name: 'OCOP 4 sao', url: '#' },
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
    coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    description: 'Nho thân gỗ trồng thử nghiệm, vị chua ngọt lạ.',
    originInfo: {
      origin: 'Đà Lạt',
      harvestDate: '2026-04-01',
      farmName: 'Vườn thử nghiệm LangBiang',
      address: 'LangBiang, Lạc Dương'
    },
    certificate: { name: 'VietGAP', url: '#' },
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
    coverImage: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=1200&q=80',
    description: 'Combo rau củ (bông cải, cà rốt baby, khoai tây vàng) canh tác an toàn.',
    originInfo: {
      origin: 'Trại Mát, Đà Lạt',
      harvestDate: '2026-03-14',
      farmName: 'HTX Rau sạch Trại Mát',
      address: 'Trại Mát, Đà Lạt'
    },
    certificate: { name: 'VietGAP', url: 'https://www.vietgap.com.vn/' },
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
    coverImage: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=1200&q=80',
    description: 'Dâu Beni Hoppe trái to, ngọt thanh, trồng giá thể sạch.',
    originInfo: {
      origin: 'Đà Lạt',
      harvestDate: '2026-03-18',
      farmName: 'Trang trại Mimosa',
      address: 'Đèo Mimosa, Đà Lạt'
    },
    certificate: { name: 'VietGAP', url: 'https://www.vietgap.com.vn/' },
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
    coverImage: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=1200&q=80',
    description: 'Dâu Seolhyang thơm, mọng nước, phù hợp ăn tươi.',
    originInfo: {
      origin: 'Đà Lạt',
      harvestDate: '2026-03-20',
      farmName: 'Trang trại Lâm Văn',
      address: 'Phường 8, Đà Lạt'
    },
    certificate: { name: 'VietGAP', url: 'https://www.vietgap.com.vn/' },
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
    coverImage: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=1200&q=80',
    description: 'Dâu Albion vị đậm, thịt chắc, thích hợp làm bánh.',
    originInfo: {
      origin: 'Đà Lạt',
      harvestDate: '2026-03-22',
      farmName: 'Trang trại Đơn Dương',
      address: 'Đơn Dương, Lâm Đồng'
    },
    certificate: { name: 'VietGAP', url: 'https://www.vietgap.com.vn/' },
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
    coverImage: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=1200&q=80',
    description: 'Dâu Maehyang hương thơm, độ brix cao, ruột hồng.',
    originInfo: {
      origin: 'Đà Lạt',
      harvestDate: '2026-03-24',
      farmName: 'Trang trại An Bình',
      address: 'An Bình, Đà Lạt'
    },
    certificate: { name: 'VietGAP', url: 'https://www.vietgap.com.vn/' },
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
    coverImage: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=1200&q=80',
    description: 'Dâu Yotsuboshi ngọt thanh, thích hợp ăn tươi và salad.',
    originInfo: {
      origin: 'Đà Lạt',
      harvestDate: '2026-03-26',
      farmName: 'Trang trại Nhật Garden',
      address: 'Hoa Sơn, Đà Lạt'
    },
    certificate: { name: 'VietGAP', url: 'https://www.vietgap.com.vn/' },
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
    coverImage: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=1200&q=80',
    description: 'Sweet Charlie ngọt gắt, thơm, phù hợp làm mứt.',
    originInfo: {
      origin: 'Đà Lạt',
      harvestDate: '2026-03-28',
      farmName: 'Trang trại Sweet Farm',
      address: 'Thái Phiên, Đà Lạt'
    },
    certificate: { name: 'VietGAP', url: 'https://www.vietgap.com.vn/' },
    mapCoordinates: { lat: jitter(baseCoords.lat, 0.02), lng: jitter(baseCoords.lng, 0.02) },
    timeline: [
      { date: '2026-01-18', title: 'Trồng cây con', content: 'Nhà kính lạnh, tưới nhỏ giọt.' },
      { date: '2026-02-26', title: 'Bón hữu cơ', content: 'Phân gà hoai, humic.' },
      { date: '2026-03-28', title: 'Thu hoạch', content: 'Hái sáng, cấp đông nhanh làm mứt.' }
    ]
  }
];
