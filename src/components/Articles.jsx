import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

import {
  articleGrid,
  articleCardClass,
  articleTitle,
  ghostBtn,
  loadingClass,
  errorClass,
  timestampClass,
} from "../styles/common";

function Articles() {
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatDateIST = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const navigateToArticleByID = (articleObj) => {
    navigate(`/article/${articleObj._id}`, {
      state: articleObj,
    });
  };

  useEffect(() => {
    const getArticles = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get("http://localhost:5000/user-api/articles", {
          withCredentials: true,
        });

        if (res.status === 200) {
          setArticles(res.data.payload);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch articles");
      } finally {
        setLoading(false);
      }
    };

    getArticles();
  }, []);

  if (loading) {
    return <p className={loadingClass}>Loading articles...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold text-[#1d1d1f] mb-6">Articles</h2>

      {error && <p className={errorClass}>{error}</p>}

      {articles.length === 0 ? (
        <p className="text-[#a1a1a6] text-sm text-center py-10">
          No articles available yet
        </p>
      ) : (
        <div className={articleGrid}>
          {articles.map((articleObj) => (
            <div className={articleCardClass} key={articleObj._id}>
              <div className="flex flex-col h-full">
                <div>
                  <p className={articleTitle}>{articleObj.title}</p>

                  <p className="text-sm text-[#6e6e73] mt-1">
                    {articleObj.content?.slice(0, 80)}...
                  </p>

                  <p className={`${timestampClass} mt-2`}>
                    {formatDateIST(articleObj.createdAt)}
                  </p>
                </div>

                <button
                  className={`${ghostBtn} mt-auto pt-4`}
                  onClick={() => navigateToArticleByID(articleObj)}
                >
                  Read Article →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Articles;
