import { useState, useCallback } from "react";
import apiService from "../services/api";

export const useApartmentSearch = () => {
  const [searchResult, setSearchResult] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchApartments = useCallback(async (query: string, userId = null) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiService.searchApartments(query, userId);
      setSearchResult(result);
      return result;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else setError(err as string);
      console.error("Search error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getRecommendations = useCallback(async (searchId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiService.getRecommendations(searchId);
      setRecommendations(result.recommendations || []);
      return result.recommendations || [];
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else setError(err as string);
      console.error("Recommendations error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setSearchResult(null);
    setRecommendations([]);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    searchResult,
    recommendations,
    isLoading,
    error,
    searchApartments,
    getRecommendations,
    clearResults,
    clearError,
  };
};
