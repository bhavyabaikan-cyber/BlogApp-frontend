import { NavLink } from "react-router";

function Footer() {
  return (
    <footer className="bg-white border-t border-[#e8e8ed] mt-16">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-[#6e6e73]">
          © {new Date().getFullYear()} MyBlog. All rights reserved.
        </p>

        <div className="flex items-center gap-5 text-sm">
          <NavLink
            to="/"
            className="text-[#6e6e73] hover:text-[#0066cc] transition-colors"
          >
            Home
          </NavLink>

          <NavLink
            to="/register"
            className="text-[#6e6e73] hover:text-[#0066cc] transition-colors"
          >
            Register
          </NavLink>

          <NavLink
            to="/login"
            className="text-[#6e6e73] hover:text-[#0066cc] transition-colors"
          >
            Login
          </NavLink>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
