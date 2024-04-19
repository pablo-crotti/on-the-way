"use client";

import { useState, useEffect, useRef } from "react";
import { Title } from "@/components/title";
import { Text } from "@/components/text";
import { fetchPodcasts } from "../actions";
import { get } from "http";
import "./styles.css";
import PrimaryButton from "@/components/primarybutton";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const collectionModel = {
    id: "",
    name: "",
    image: "",
    number: 0,
    createdAt: "",
    updatedAt: "",
  };

  const [allCollections, setAllCollections] = useState([collectionModel]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [slidePostion, setSlidePosition] = useState("before");
  const [nbCollection, setNbCollection] = useState(0);

  const getAllCollections = () => {
    fetch(`/api/collection?all=true`).then((res) =>
      res.json().then((data) => {
        setAllCollections(data);
        setLoading(false);
        setNbCollection(data.length);
        console.log(data);
      })
    );
  };

  function renderCollections() {
    return allCollections.map((collection, i) => {
      return (
        <li
          key={i}
          className={`slide animate slide-${i} ${
            slideIndex - i != 0 ? slidePostion : "active"
          } flex justify-center`}
        >
          <img src={`/illustrations/${collection.image}`} />
          <h1 className="text-center my-3">{collection.name}</h1>
          <a
            className="flex justify-center"
            href={`/series/${allCollections[allCollections.length - 1].id}`}
          >
            <PrimaryButton type="button">Ecouter</PrimaryButton>
          </a>
        </li>
      );
    });
  }

  //Carousel

  function prev() {
    setSlidePosition("before");

    if (slideIndex == nbCollection - 1) {
      setSlideIndex(0);
    } else {
      setSlideIndex(slideIndex + 1);
    }
  }

  function next() {
    setSlidePosition("after");

    if (slideIndex == 0) {
      setSlideIndex(nbCollection - 1);
    } else {
      setSlideIndex(slideIndex - 1);
    }
  }

  useEffect(() => {
    getAllCollections();
  }, []);

  return (
    <>
      {loading ? (
        <div className="w-full min-h-screen flex justify-center items-center">
          <img
            className="w-64 h-64"
            src="/loader/loader.gif"
            alt="Chargement..."
          />
        </div>
      ) : (
        <>
          <div>
            <Title type="h1">PODCAST</Title>
            <img src="/logo/on-the-way.png" alt="podcast" />
          </div>

          <div className="mb-8 flex justify-center">
            <a
              href={`/series/${allCollections[allCollections.length - 1].id}`}
              className="flex items-center bg-white border border-gray-200 rounded-lg shadow flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <img
                className="object-cover h-auto w-1/3 rounded-none rounded-s-lg"
                src={`/illustrations/${
                  allCollections[allCollections.length - 1].image
                }`}
                alt=""
              />
              <div className="flex flex-col justify-between p-4 leading-normal">
                <h5 className="mb-2 text-l text-left font-bold tracking-tight text-gray-900 dark:text-white">
                  {allCollections[allCollections.length - 1].name}
                </h5>
                <div></div>
              </div>
            </a>
          </div>
          <div className="mb-8">
            <Title type="h2">À propos</Title>
            <Text>
              Vous vous trouvez sur le site dédié au podcast On The Way qui a
              pour objectif de vous faire découvrir la ville
              d'Yverdon-les-Bains. Venez donc découvrir les lieux de la ville,
              son histoire, ses événements et plus encore à travers une histoire
              fictive de 5 épisodes
            </Text>
          </div>

          <div className="mb-8">
            <Title type="h2">Publication</Title>
            <Text>
              Le podcast sera composé de 8 épisodes pour la première saison et
              chaque épisode sortira le lundi aux alentours de 7h30. Ne ratez
              donc aucun épisode !!
            </Text>
          </div>

          <div className="carousel-container">
            <ul className="animate">{renderCollections()}</ul>
            <div id="controls">
              <span className="prev" onClick={prev}>
                <svg
                  width="23"
                  height="33"
                  viewBox="0 0 23 33"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.0614 32.1318C21.3609 31.8583 21.599 31.5335 21.7619 31.176C21.9248 30.8184 22.0094 30.4351 22.0108 30.048C22.0123 29.6609 21.9305 29.2777 21.7702 28.9201C21.6099 28.5626 21.3742 28.2378 21.0767 27.9643L8.62321 16.4965L21.1609 5.02873C21.765 4.4761 22.1061 3.72657 22.109 2.94502C22.1118 2.16348 21.7763 1.41394 21.1762 0.861308C20.576 0.308673 19.7605 -0.00178786 18.9089 -0.00178779C18.0573 -0.00178771 17.2394 0.308673 16.6352 0.861309L1.80334 14.4276C1.50379 14.701 1.26573 15.0258 1.10281 15.3834C0.939889 15.7409 0.855298 16.1242 0.853878 16.5113C0.852457 16.8984 0.934233 17.2817 1.09453 17.6392C1.25483 17.9968 1.4905 18.3216 1.78804 18.595L16.5204 32.1613C17.74 33.2844 19.8011 33.2844 21.0614 32.1318Z"
                    fill="#90B39C"
                  />
                </svg>
              </span>
              <span className="next flex flex-row-reverse" onClick={next}>
                <svg
                  width="23"
                  height="34"
                  viewBox="0 0 23 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.93534 0.875228C1.63474 1.14641 1.39544 1.46939 1.23115 1.82571C1.06686 2.18202 0.980802 2.56466 0.977905 2.95172C0.975008 3.33878 1.05533 3.72266 1.21426 4.08139C1.3732 4.44012 1.60764 4.76666 1.90415 5.04231L14.3142 16.6027L1.73248 27.976C1.12617 28.5241 0.782258 29.271 0.776408 30.0525C0.770559 30.834 1.10325 31.586 1.70129 32.1431C2.29933 32.7002 3.11374 33.0167 3.96534 33.0231C4.81695 33.0295 5.636 32.7252 6.24232 32.1771L21.1264 18.7226C21.427 18.4514 21.6663 18.1284 21.8305 17.7721C21.9948 17.4158 22.0809 17.0331 22.0838 16.6461C22.0867 16.259 22.0064 15.8751 21.8474 15.5164C21.6885 15.1577 21.4541 14.8311 21.1575 14.5555L6.47659 0.879665C5.26118 -0.252538 3.2 -0.267967 1.93534 0.875228Z"
                    fill="#90B39C"
                  />
                </svg>
              </span>
            </div>
          </div>
        </>
      )}
    </>
  );
}
