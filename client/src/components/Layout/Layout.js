import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast";

const Layout = ({
  children,
  title = "Ecommerce app - shop now",
  description = "mern stack project",
  keywords = "mern,react,node,mongodb",
  author = "Techinfoyt",
}) => {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>

      <Header />

      <main className="app-main">{children}</main>

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "rgba(13,16,14,0.92)",
            color: "#f4f5ef",
            border: "1px solid rgba(253,235,7,0.4)",
            backdropFilter: "blur(16px)",
            borderRadius: "3px",
          },
        }}
      />

      <Footer />
    </>
  );
};

export default Layout;
