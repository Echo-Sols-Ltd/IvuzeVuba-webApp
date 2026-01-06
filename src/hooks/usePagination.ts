"use client";

import { useState, useEffect, useMemo } from "react";

export interface PaginationOptions {
  itemsPerPage?: number;
  resetOnDataChange?: boolean;
}

export function usePagination<T>(
  items: T[],
  options: PaginationOptions = {}
) {
  const { itemsPerPage: defaultItemsPerPage = 10, resetOnDataChange = true } = options;
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  // Reset to page 1 when items change (if enabled)
  useEffect(() => {
    if (resetOnDataChange) {
      setCurrentPage(1);
    }
  }, [items.length, resetOnDataChange]);

  // Ensure current page is valid when items per page changes
  useEffect(() => {
    const newTotalPages = Math.ceil(items.length / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  }, [itemsPerPage, items.length, currentPage]);

  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const changeItemsPerPage = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const paginationInfo = useMemo(() => ({
    startItem: items.length > 0 ? startIndex + 1 : 0,
    endItem: Math.min(endIndex, items.length),
    totalItems: items.length,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  }), [startIndex, endIndex, items.length, currentPage, totalPages]);

  return {
    currentPage,
    totalPages,
    itemsPerPage,
    currentItems,
    paginationInfo,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    changeItemsPerPage,
    setCurrentPage,
  };
}