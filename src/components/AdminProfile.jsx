import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useAuth } from "../store/authStore";

import {
  loadingClass,
  errorClass,
  articleGrid,
  articleCardClass,
  articleTitle,
  ghostBtn,
} from "../styles/common";

export default function AdminProfile() {
  const navigate = useNavigate();
  const logout = useAuth((state) => state.logout);
  const currentUser = useAuth((state) => state.currentUser);

  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API = "http://localhost:5000/admin-api";

  const getAdminData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [dashboardRes, usersRes, articlesRes] = await Promise.all([
        axios.get(`${API}/dashboard`, { withCredentials: true }),
        axios.get(`${API}/users`, { withCredentials: true }),
        axios.get(`${API}/articles`, { withCredentials: true }),
      ]);

      setDashboard(dashboardRes.data.payload);
      setUsers(usersRes.data.payload);
      setArticles(articlesRes.data.payload);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAdminData();
  }, []);

  const onLogout = async () => {
    await logout();
    navigate("/login");
  };

  const toggleUserStatus = async (user) => {
    try {
      const res = await axios.patch(
        `${API}/users/${user._id}`,
        { isUserActive: !user.isUserActive },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u._id === user._id ? { ...u, isUserActive: !u.isUserActive } : u
          )
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user status");
    }
  };

  const toggleArticleStatus = async (article) => {
    try {
      const res = await axios.patch(
        `${API}/articles/${article._id}`,
        { isArticleActive: !article.isArticleActive },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setArticles((prevArticles) =>
          prevArticles.map((a) =>
            a._id === article._id
              ? { ...a, isArticleActive: !a.isArticleActive }
              : a
          )
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update article status");
    }
  };

  const deleteArticle = async (articleId) => {
    try {
      const res = await axios.delete(`${API}/articles/${articleId}`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setArticles((prevArticles) =>
          prevArticles.filter((article) => article._id !== articleId)
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete article");
    }
  };

  if (loading) {
    return <p className={loadingClass}>Loading admin dashboard...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {error && <p className={`${errorClass} mb-6`}>{error}</p>}

      <div className="bg-white border border-[#e8e8ed] rounded-3xl p-6 mb-8 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm text-[#6e6e73]">Welcome Admin</p>
          <h2 className="text-2xl font-semibold text-[#1d1d1f]">
            {currentUser?.firstName || "Admin"} Dashboard
          </h2>
        </div>

        <button
          className="bg-[#ff3b30] text-white text-sm px-5 py-2 rounded-full hover:bg-[#d62c23] transition"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>

      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-5 py-2 rounded-full text-sm ${
            activeTab === "dashboard"
              ? "bg-[#0066cc] text-white"
              : "bg-[#f5f5f7] text-[#1d1d1f]"
          }`}
        >
          Dashboard
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`px-5 py-2 rounded-full text-sm ${
            activeTab === "users"
              ? "bg-[#0066cc] text-white"
              : "bg-[#f5f5f7] text-[#1d1d1f]"
          }`}
        >
          Users
        </button>

        <button
          onClick={() => setActiveTab("articles")}
          className={`px-5 py-2 rounded-full text-sm ${
            activeTab === "articles"
              ? "bg-[#0066cc] text-white"
              : "bg-[#f5f5f7] text-[#1d1d1f]"
          }`}
        >
          Articles
        </button>
      </div>

      {activeTab === "dashboard" && dashboard && (
        <div className={articleGrid}>
          <div className={articleCardClass}>
            <p className="text-sm text-[#6e6e73]">Total Users</p>
            <h3 className="text-3xl font-bold text-[#1d1d1f]">
              {dashboard.totalUsers}
            </h3>
          </div>

          <div className={articleCardClass}>
            <p className="text-sm text-[#6e6e73]">Active Users</p>
            <h3 className="text-3xl font-bold text-[#1d1d1f]">
              {dashboard.activeUsers}
            </h3>
          </div>

          <div className={articleCardClass}>
            <p className="text-sm text-[#6e6e73]">Total Articles</p>
            <h3 className="text-3xl font-bold text-[#1d1d1f]">
              {dashboard.totalArticles}
            </h3>
          </div>

          <div className={articleCardClass}>
            <p className="text-sm text-[#6e6e73]">Active Articles</p>
            <h3 className="text-3xl font-bold text-[#1d1d1f]">
              {dashboard.activeArticles}
            </h3>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="bg-white border border-[#e8e8ed] rounded-3xl overflow-hidden">
          {users.length === 0 ? (
            <p className="text-center py-10 text-[#a1a1a6]">No users found</p>
          ) : (
            users.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-5 border-b border-[#e8e8ed]"
              >
                <div>
                  <h3 className="font-semibold text-[#1d1d1f]">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-sm text-[#6e6e73]">{user.email}</p>
                  <p className="text-xs text-[#a1a1a6]">{user.role}</p>
                </div>

                <button
                  onClick={() => toggleUserStatus(user)}
                  className={`text-sm px-4 py-2 rounded-full text-white ${
                    user.isUserActive ? "bg-[#ff3b30]" : "bg-[#34c759]"
                  }`}
                >
                  {user.isUserActive ? "Deactivate" : "Activate"}
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "articles" && (
        <div className={articleGrid}>
          {articles.length === 0 ? (
            <p className="text-[#a1a1a6] text-sm">No articles found</p>
          ) : (
            articles.map((article) => (
              <div className={articleCardClass} key={article._id}>
                <p className={articleTitle}>{article.title}</p>

                <p className="text-sm text-[#6e6e73] mt-1">
                  {article.content?.slice(0, 90)}...
                </p>

                <p className="text-xs text-[#a1a1a6] mt-2">
                  Author: {article.author?.firstName || "Unknown"}
                </p>

                <p className="text-xs mt-2">
                  Status:{" "}
                  <span
                    className={
                      article.isArticleActive
                        ? "text-[#248a3d]"
                        : "text-[#cc2f26]"
                    }
                  >
                    {article.isArticleActive ? "Active" : "Inactive"}
                  </span>
                </p>

                <div className="flex gap-3 mt-4">
                  <button
                    className={ghostBtn}
                    onClick={() => toggleArticleStatus(article)}
                  >
                    {article.isArticleActive ? "Deactivate" : "Activate"}
                  </button>

                  <button
                    className="text-[#ff3b30] text-sm font-medium"
                    onClick={() => deleteArticle(article._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
