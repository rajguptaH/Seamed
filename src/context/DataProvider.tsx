"use client"; 
import { entityService } from "@/services/entityService";
import React, { createContext, useCallback, useContext, useState } from "react";

type EntityMap = Record<string, any[]>;

interface DataContextProps {
  data: EntityMap;
  loading: Record<string, boolean>;
  fetchEntity: (name: string, endpoint: string) => Promise<any>;
  createEntity: (name: string, endpoint: string, payload: any) => Promise<void>;
  updateEntity: (name: string, endpoint: string, id: string, payload: any) => Promise<void>;
  deleteEntity: (name: string, endpoint: string, id: string) => Promise<void>;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<EntityMap>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const fetchEntity = useCallback(async (name: string, endpoint: string) => {
    setLoading((prev) => ({ ...prev, [name]: true }));
    const service = entityService(endpoint);
    try {
      const items = await service.getAll();
      console.log("Fetched data from API for Entity", endpoint ,items)
      setData((prev) => ({ ...prev, [name]: items }));
      return items; // ✅ return fetched data
    } finally {
      setLoading((prev) => ({ ...prev, [name]: false }));
    }
  }, []);

  const createEntity = useCallback(async (name: string, endpoint: string, payload: any) => {
    const service = entityService(endpoint);
    const newItem = await service.create(payload);
    setData((prev) => ({ ...prev, [name]: [...(prev[name] || []), newItem] }));
  }, []);

  const updateEntity = useCallback(async (name: string, endpoint: string, id: string, payload: any) => {
    const service = entityService(endpoint);
    const updated = await service.update(id, payload);
    setData((prev) => ({
      ...prev,
      [name]: (prev[name] || []).map((i: any) => (i.id === id ? updated : i)),
    }));
  }, []);

  const deleteEntity = useCallback(async (name: string, endpoint: string, id: string) => {
    const service = entityService(endpoint);
    await service.delete(id);
    setData((prev) => ({
      ...prev,
      [name]: (prev[name] || []).filter((i: any) => i.id !== id),
    }));
  }, []);

  return (
    <DataContext.Provider
      value={{ data, loading, fetchEntity, createEntity, updateEntity, deleteEntity }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
};
