import { useCallback, useEffect, useState } from "react";
import { deletePerson, getPeople } from "../api/client";
import type { Person } from "../types/face";

export default function usePeople() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    return getPeople()
      .then(setPeople)
      .catch((err) => console.error("Không tải được danh sách người:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addPerson = useCallback((person: Person) => {
    setPeople((prev) => [person, ...prev]);
  }, []);

  const removePerson = useCallback(async (id: number) => {
    await deletePerson(id);
    setPeople((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return { people, loading, addPerson, removePerson, refresh };
}
