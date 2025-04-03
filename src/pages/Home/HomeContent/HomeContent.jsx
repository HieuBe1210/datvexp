import React, { useState, useEffect, useRef } from "react";
import "./HomeContent.scss";
import { CardMovieHome } from "../../../components/Cards/Cards";
import { fetchMoviesByTab } from "../../../services/service/serviceMovie";
import FullPageSkeleton from "../../../components/Skeleton/FullPageSkeleton";
import LoadingIcon from "../../../components/LoadingIcon";
import LoadingScreen from "../../../components/Loading/LoadingScreen";
export const HomeContent = () => {
  const [nowShowingMovies, setNowShowingMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loadingNowShowing, setLoadingNowShowing] = useState(true);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);

  const nowShowingScrollRef = useRef(null);
  const upcomingScrollRef = useRef(null);

  useEffect(() => {
    const fetchNowShowingMovies = async () => {
      setLoadingNowShowing(true);
      try {
        const data = await fetchMoviesByTab("nowShowing");
        setNowShowingMovies(data);
      } catch (error) {
        console.error("Error fetching now showing movies:", error);
      } finally {
        setLoadingNowShowing(false);
      }
    };

    fetchNowShowingMovies();
  }, []);

  useEffect(() => {
    const fetchUpcomingMovies = async () => {
      setLoadingUpcoming(true);
      try {
        const data = await fetchMoviesByTab("upcoming");
        setUpcomingMovies(data);
      } catch (error) {
        console.error("Error fetching upcoming movies:", error);
      } finally {
        setLoadingUpcoming(false);
      }
    };

    fetchUpcomingMovies();
  }, []);

  // Đặt lại vị trí cuộn khi danh sách được tải
  useEffect(() => {
    if (!loadingNowShowing && nowShowingScrollRef.current) {
      nowShowingScrollRef.current.scrollLeft = 0; // Cuộn về đầu danh sách
    }
  }, [loadingNowShowing]);

  useEffect(() => {
    if (!loadingUpcoming && upcomingScrollRef.current) {
      upcomingScrollRef.current.scrollLeft = 0; // Cuộn về đầu danh sách
    }
  }, [loadingUpcoming]);

  const scrollNowShowingLeft = () => {
    if (nowShowingScrollRef.current) {
      nowShowingScrollRef.current.scrollBy({ left: -700, behavior: "smooth" });
    }
  };

  const scrollNowShowingRight = () => {
    if (nowShowingScrollRef.current) {
      nowShowingScrollRef.current.scrollBy({ left: 700, behavior: "smooth" });
    }
  };

  const scrollUpcomingLeft = () => {
    if (upcomingScrollRef.current) {
      upcomingScrollRef.current.scrollBy({ left: -700, behavior: "smooth" });
    }
  };

  const scrollUpcomingRight = () => {
    if (upcomingScrollRef.current) {
      upcomingScrollRef.current.scrollBy({ left: 700, behavior: "smooth" });
    }
  };

  return (
    <div className="home__content">
      {/* Section 1: Phim Đang Chiếu */}
      <section className="movie-section movie-section-nowShowing">
        <h2 className="section-title section-title-nowShowing">Phim Đang Chiếu</h2>
        {loadingNowShowing ? (
          <div className="loading-screen">
            <LoadingScreen />
          </div>
        ) : (
          <div className="movie-scroll-container">
            <button className="scroll-button left" onClick={scrollNowShowingLeft}>
              &lt;
            </button>
            <div className="home__movie" ref={nowShowingScrollRef}>
              {nowShowingMovies.length > 0 ? (
                nowShowingMovies.map((item, index) => (
                  <CardMovieHome item={item} index={index + 1} />
                ))
              ) : (
                <p>Không có phim nào đang chiếu.</p>
              )}
            </div>
            <button className="scroll-button right" onClick={scrollNowShowingRight}>
              &gt;
            </button>
          </div>
        )}
      </section>

      {/* Section 2: Phim Sắp Chiếu */}
      <section className="movie-section movie-section-upcoming">
        <h2 className="section-title">Phim Sắp Chiếu</h2>
        {loadingUpcoming ? (
          <div className="loading-screen">
            <LoadingScreen />
          </div>
        ) : (
          <div className="movie-scroll-container">
            <button className="scroll-button left" onClick={scrollUpcomingLeft}>
              &lt;
            </button>
            <div className="home__movie" ref={upcomingScrollRef}>
              {upcomingMovies.length > 0 ? (
                upcomingMovies.map((item, index) => <CardMovieHome item={item} index={index + 1} />)
              ) : (
                <p>Không có phim nào sắp chiếu.</p>
              )}
            </div>
            <button className="scroll-button right" onClick={scrollUpcomingRight}>
              &gt;
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
