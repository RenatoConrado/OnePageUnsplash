import React, { useEffect, useRef, useState } from "react";
import { hexToComplimentary, invertColor, loadData } from "./utils";

const UTM = "?utm_source=scrimba_degree&utm_medium=referral";
const URL = "https://apis.scrimba.com/unsplash/photos/random";

export default function App() {
  const [ photos, setPhotos ] = useState([]);
  const [ name, setName ] = useState("Renato");
  const [ hobby, setHobby ] = useState("Paint");
  const hobbyInput = useRef(null);

  async function fetchPhotos() {
    const photosUrl = hobby ? `${URL}/?count=1&query=${hobby}` : `${URL}/?count=1`;
    loadData({
      url: photosUrl,
      onSuccess: data => { setPhotos(data); },
      onError: error => { console.error("Failed to fetch photos: ", error); }
    });
  }
  useEffect(() => {
    fetchPhotos();
  }, [ hobby ]);

  return (
    <div className="container">
      { hobby && photos.map(photo => {
        const { id, color, urls, user } = photo;
        const complementaryColor = hexToComplimentary(color);
        const invertedColor = invertColor(color, "#000000");

        return (
          <div key={ id } className="item">
            <div
              className="img"
              style={ { backgroundImage: `url("${urls.regular}")` } }
            />
            <div
              className="frame"
              style={ { backgroundColor: invertedColor } }
            />

            <div className="text">
              <h4 className="name" style={ { color: color, backgroundColor: invertedColor } }>
                My name is { name }
              </h4>
              <div
                className="divider"
                style={ { backgroundColor: complementaryColor } }
              />
              <h5 className="position" style={ { backgroundColor: complementaryColor } }>
                I love { hobby }
              </h5>
            </div>

            <div className="caption">
              <span className="credits">
                { "Photo by " }
                <a href={ user.links.html + UTM } target="_blank" rel="noopener noreferrer">
                  { user.name }
                </a>
                { " on " }
                <a href={ "https://unsplash.com" + UTM } target="_blank" rel="noopener noreferrer">
                  { " Unsplash " }
                </a>
              </span>
            </div>
          </div>
        );
      }) }
    </div>
  );
}
