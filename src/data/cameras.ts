import huyVideo from "../assets/huy.mp4";

const locations = [
  "Quận 1",
  "Quận 3",
  "Quận 4",
  "Quận 5",
  "Quận 7",
  "Bình Thạnh",
  "Phú Nhuận",
  "Tân Bình",
  "Thủ Đức",
];

const cameraNames = [
  "Camera Cổng Chính",
  "Camera Bãi Xe",
  "Camera Kho",
  "Camera Sảnh",
  "Camera Hành Lang",
  "Camera Khu Vực A",
  "Camera Khu Vực B",
  "Camera Nhà Xe",
  "Camera Lối Thoát Hiểm",
];

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const usedCoordinates = new Set<string>();

function generateCoordinate() {
  let lat: number;
  let lng: number;
  let key: string;

  do {
    lat = Number(random(10.75, 10.82).toFixed(6));
    lng = Number(random(106.65, 106.75).toFixed(6));

    key = `${lat}-${lng}`;
  } while (usedCoordinates.has(key));

  usedCoordinates.add(key);

  return {
    latitude: lat,
    longitude: lng,
  };
}

export const cameras = Array.from({ length: 200 }, (_, index) => {
  const coordinate = generateCoordinate();

  const online = Math.random() > 0.15;

  return {
    id: index + 1,

    name: `${cameraNames[index % cameraNames.length]} ${index + 1}`,

    latitude: coordinate.latitude,

    longitude: coordinate.longitude,

    address: locations[Math.floor(Math.random() * locations.length)],

    status: online ? "online" : "offline",

    streamUrl: huyVideo,

    signal: online ? Math.floor(random(60, 100)) : 0,

    lastSeen: new Date().toLocaleTimeString(),

    // Random camera vào 1 trong 3 zone
    zoneId: Math.floor(Math.random() * 3) + 1,
  };
});
