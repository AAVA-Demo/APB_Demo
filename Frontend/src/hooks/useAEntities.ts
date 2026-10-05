import { useEffect, useState } from "react";
import { getAEntities } from "../api/aApi";
import { AEntity } from "../types/a";

export function useAEntities() {
  const [data, setData] = useState<AEntity[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getAEntities()
      .then((res) => {
        if (isMounted) {
          setData(res);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message ?? "Failed to load data");
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
}
