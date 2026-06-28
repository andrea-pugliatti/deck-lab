import { useEffect, useState } from "react";

import { apiFetch } from "../services/api";
import { getCardMetadataEndpoint } from "../services/card";

type MetadataKey = "types" | "attributes" | "races" | "archetypes";

const cache: Record<MetadataKey, string[] | null> = {
  types: null,
  attributes: null,
  races: null,
  archetypes: null,
};

const promises: Partial<Record<MetadataKey, Promise<string[]>>> = {};

const DEFAULTS: Record<MetadataKey, string[]> = {
  types: ["Monster", "Spell", "Trap"],
  attributes: ["LIGHT", "DARK", "FIRE", "WIND", "WATER", "EARTH", "DIVINE"],
  races: [],
  archetypes: [],
};

async function fetchMetadata(key: MetadataKey): Promise<string[]> {
  if (cache[key]) {
    return cache[key]!;
  }

  if (!promises[key]) {
    promises[key] = apiFetch(getCardMetadataEndpoint(key))
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch ${key}: ${res.statusText}`);
        }
        const data = await res.json();
        cache[key] = data;
        return data;
      })
      .catch((err) => {
        delete promises[key];
        throw err;
      });
  }

  return promises[key]!;
}

export function useCardMetadata() {
  const [types, setTypes] = useState<string[]>(() => cache.types || DEFAULTS.types);
  const [attributes, setAttributes] = useState<string[]>(
    () => cache.attributes || DEFAULTS.attributes,
  );
  const [races, setRaces] = useState<string[]>(() => cache.races || DEFAULTS.races);
  const [archetypes, setArchetypes] = useState<string[]>(
    () => cache.archetypes || DEFAULTS.archetypes,
  );

  useEffect(() => {
    let active = true;

    if (!cache.types) {
      fetchMetadata("types")
        .then((data) => {
          if (active) setTypes(data);
        })
        .catch((err) => {
          console.error("Failed to load types metadata:", err);
        });
    }

    if (!cache.attributes) {
      fetchMetadata("attributes")
        .then((data) => {
          if (active) setAttributes(data);
        })
        .catch((err) => {
          console.error("Failed to load attributes metadata:", err);
        });
    }

    if (!cache.races) {
      fetchMetadata("races")
        .then((data) => {
          if (active) setRaces(data);
        })
        .catch((err) => {
          console.error("Failed to load races metadata:", err);
        });
    }

    if (!cache.archetypes) {
      fetchMetadata("archetypes")
        .then((data) => {
          if (active) setArchetypes(data);
        })
        .catch((err) => {
          console.error("Failed to load archetypes metadata:", err);
        });
    }

    return () => {
      active = false;
    };
  }, []);

  return { types, attributes, races, archetypes };
}
