import { useState, useMemo } from 'react';

export function useSearch(data, searchTerm) {
  return useMemo(() => {
    return data.filter(
      item =>
        item.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.last_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);
}
