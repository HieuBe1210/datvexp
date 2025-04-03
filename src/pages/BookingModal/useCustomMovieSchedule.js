import { useMemo } from "react";
import { useMovieSchedule } from "../Home/MovieSchedule/MovieScheduleHandle";

export const useCustomMovieSchedule = (movieId) => {
  const movieSchedule = useMovieSchedule();

  // Lọc groupedShowtimes theo movieId
  const filteredShowtimes = useMemo(() => {
    const filtered = {};
    Object.keys(movieSchedule.groupedShowtimes).forEach((key) => {
      if (parseInt(key) === movieId) {
        filtered[key] = movieSchedule.groupedShowtimes[key];
      }
    });
    return filtered;
  }, [movieSchedule.groupedShowtimes, movieId]);

  return {
    ...movieSchedule,
    groupedShowtimes: filteredShowtimes,
  };
};
