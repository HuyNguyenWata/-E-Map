import { useMemo, useState } from "react";

import type { Camera } from "../types/camera";

import type { CameraFilter } from "../types/filter";

const defaultFilter: CameraFilter = {
  keyword: "",

  status: "all",

  alert: "all",
};

export default function useCameraFilter(cameras: Camera[]) {
  const [filter, setFilter] = useState<CameraFilter>(defaultFilter);

  const filtered = useMemo(() => {
    return cameras.filter((camera) => {
      // search

      const keyword = filter.keyword.toLowerCase();

      const matchKeyword =
        camera.name.toLowerCase().includes(keyword) ||
        camera.address.toLowerCase().includes(keyword);

      // status

      const matchStatus =
        filter.status === "all" || camera.status === filter.status;

      // alert

      let matchAlert = true;

      if (filter.alert === "critical") {
        matchAlert = camera.alert?.severity === "critical";
      }

      if (filter.alert === "warning") {
        matchAlert = camera.alert?.severity === "warning";
      }

      if (filter.alert === "none") {
        matchAlert = !camera.alert;
      }

      return matchKeyword && matchStatus && matchAlert;
    });
  }, [cameras, filter]);

  return {
    filter,

    setFilter,

    filtered,
  };
}
