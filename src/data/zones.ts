import type { Zone } from "../types/zone";

export const zones: Zone[] = [
  {
    id: 1,
    name: "Tòa nhà A",
    description: "Khu vực văn phòng tầng 1",
    color: "#2563eb",
    polygon: [
      [10.7775, 106.7],
      [10.778, 106.701],
      [10.7768, 106.7015],
      [10.7763, 106.7005],
    ],
  },
  {
    id: 2,
    name: "Bãi xe",
    description: "Khu vực giữ xe",
    color: "#16a34a",
    polygon: [
      [10.7758, 106.6995],
      [10.7765, 106.6998],
      [10.776, 106.7008],
      [10.7753, 106.7002],
    ],
  },
  {
    id: 3,
    name: "Kho",
    description: "Khu vực kho hàng",
    color: "#dc2626",
    polygon: [
      [10.779, 106.703],
      [10.7795, 106.704],
      [10.7787, 106.7044],
      [10.7782, 106.7033],
    ],
  },
];
