import { useEffect, useState } from "react";

import { apiFetch } from "../services/api";
import { getCardMetadataEndpoint } from "../services/card";

type MetadataKey = "types" | "attributes" | "races" | "archetypes";

const cache: Record<MetadataKey, string[] | undefined> = {
  types: undefined,
  attributes: undefined,
  races: undefined,
  archetypes: undefined,
};

const promises: Partial<Record<MetadataKey, Promise<string[]>>> = {};

const DEFAULTS: Record<MetadataKey, string[]> = {
  types: ["Monster", "Spell", "Trap"],
  attributes: ["LIGHT", "DARK", "FIRE", "WIND", "WATER", "EARTH", "DIVINE"],
  races: [],
  archetypes: [],
};

/**
 * Fetches card metadata list items for a specific key (types, attributes, races, or archetypes)
 * utilizing an in-memory cache and promise-sharing to prevent duplicate requests.
 *
 * @param key - The metadata dictionary key to query.
 * @returns A promise resolving to the metadata options array.
 */
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
        const data = (await res.json()) as string[];
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

/**
 * Custom React hook that fetches and exposes Yu-Gi-Oh! card filter metadata collections
 * (types, attributes, races, and archetypes) for catalog filter selections.
 * Safe lifecycle handling avoids setting state if the component has unmounted.
 *
 * @returns An object containing arrays for types, attributes, races, and archetypes.
 */
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
