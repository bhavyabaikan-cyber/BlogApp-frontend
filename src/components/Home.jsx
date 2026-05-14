import { NavLink } from "react-router";
import { useAuth } from "../store/authStore";

import {
  pageBackground,
  pageWrapper,
  primaryBtn,
  secondaryBtn,
  headingClass,
  bodyText,
} from "../styles/common";

function Home() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const currentUser = useAuth((state) => state.currentUser);

  const getProfilePath = () => {
    if (!currentUser) return "/login";

    if (currentUser.role === "AUTHOR") return "/author-profile";
    if (currentUser.role === "ADMIN") return "/admin-profile";
    return "/user-profile";
  };

  return (
    <div className={pageBackground}>
      <section className={`${pageWrapper} text-center`}>
        <h1 className="text-5xl md:text-6xl font-bold text-[#1d1d1f] tracking-tight mb-5">
          Welcome to MyBlog
        </h1>

        <p className={`${bodyText} max-w-2xl mx-auto text-lg mb-8`}>
          Read articles, share ideas, and publish your thoughts with a simple
          blogging platform built for users, authors, and admins.
        </p>

        <div className="flex justify-center gap-4 mb-14">
          {isAuthenticated ? (
            <NavLink to={getProfilePath()} className={primaryBtn}>
              Go to Profile
            </NavLink>
          ) : (
            <>
              <NavLink to="/register" className={primaryBtn}>
                Get Started
              </NavLink>

              <NavLink to="/login" className={secondaryBtn}>
                Sign In
              </NavLink>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-[#f5f5f7] rounded-2xl p-7">
            <h2 className={headingClass}>Read</h2>
            <p className={`${bodyText} mt-3`}>
              Browse articles from different authors and discover new ideas.
            </p>
          </div>

          <div className="bg-[#f5f5f7] rounded-2xl p-7">
            <h2 className={headingClass}>Write</h2>
            <p className={`${bodyText} mt-3`}>
              Authors can create, edit, and manage their own articles easily.
            </p>
          </div>

          <div className="bg-[#f5f5f7] rounded-2xl p-7">
            <h2 className={headingClass}>Manage</h2>
            <p className={`${bodyText} mt-3`}>
              Admins can manage users, articles, and platform activity.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
