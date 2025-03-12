import React from "react";
import "./App.css";
import { Link, Route, Routes } from "react-router-dom";
import Watch from "./Watch";
import Home from "./Home";
import { listing } from "./listing";
import { Helmet } from "react-helmet";

function App() {
  return (
    <>
      <section className="top-0 flex justify-center w-full h-16 border-b shadow-md bg-dusk-700/70 border-dusk-900 backdrop-blur-sm">
        <div className="flex items-center w-full px-2 max-w-screen-2xl">
          <Link
            to="/"
            className="text-inherit hover:text-inherit hover:brightness-110"
          >
            <h1 className="w-full text-3xl">
              <span className="text-dusk-200">ani</span>mewing
            </h1>
          </Link>
        </div>
      </section>

      <Routes>
        <Route path="/" element={<Home />} />
        {Object.entries(listing).map(([anime, metadata], i) => (
          <Route
            key={i}
            path={`/${anime}`}
            element={
              <>
                <Helmet>
                  <title>animewing | {metadata.title}</title>
                </Helmet>
                <Watch anime={anime} metadata={metadata} />
              </>
            }
          />
        ))}
      </Routes>
    </>
  );
}

export default App;
