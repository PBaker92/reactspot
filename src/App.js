import React, { useReducer, useState, useRef } from 'react';
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import * as mobilenet from '@tensorflow-models/mobilenet';
import './App.css';
import Search from "./components/Search"
import Home from "./components/Home"

const machine = {
  initial: "initial",
  states: {
    initial: { on: { next: "loadingModel" } },
    loadingModel: { on: { next: "modelReady" } },
    modelReady: { on: { next: "imageReady" } },
    imageReady: { on: { next: "identifying" }, showImage: true },
    identifying: { on: { next: "complete" } },
    complete: { on: { next: "modelReady" }, showImage: true, showResults: true }
  }
};

function App() {
  const [results, setResults] = useState([]);
  const [imageURL, setImageURL] = useState(null);
  const [model, setModel] = useState(null);
  const imageRef = useRef();
  const inputRef = useRef();

  const reducer = (state, event) =>
    machine.states[state].on[event] || machine.initial;

  const [appState, dispatch] = useReducer(reducer, machine.initial);
  const next = () => dispatch("next");

  const loadModel = async () => {
    next();
    const model = await mobilenet.load();
    setModel(model);
    next();
  };

  const identify = async () => {
    next();
    const results = await model.classify(imageRef.current);
    setResults(results);
    next();
  };

  const reset = async () => {
    setResults([]);
    next();
  };

  const upload = () => inputRef.current.click();

  const handleUpload = event => {
    const { files } = event.target;
    if (files.length > 0) {
      const url = URL.createObjectURL(event.target.files[0]);
      setImageURL(url);
      next();
    }
  };

  const actionButton = {
    initial: { action: loadModel, text: "Start Here" },
    loadingModel: { text: "Loading Machine Learning Model...." },
    modelReady: { action: upload, text: "Upload Image for Identification" },
    imageReady: { action: identify, text: "Identify Breed" },
    identifying: { text: "Identifying..." },
    complete: { action: reset, text: "Reset" }
  };
  const { showImage, showResults } = machine.states[appState]


  return (
    <div>

      <div>
        <BrowserRouter>
          <header className="App Header">
            <h1>Spot</h1>
          </header>
          <ul className='Nav'>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/Search">Search</Link></li>
          </ul>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/Search" component={Search} />
            <Route path="*">404 Not Found</Route>
          </Switch>
        </BrowserRouter>
      </div>


      <div className="body">
        <div className="image">
          {showImage && <img src={imageURL} alt="upload-preview" ref={imageRef} />}
          <div className="filebutton">
            <input type="file" accept="image/*" capture="camera" onChange={handleUpload} ref={inputRef} />
          </div>
        </div>
        <div className="results">
          {showResults && (
            <ul>
              {results.map(({ className, probability }) => (
                <li key={className}>{`${className}: %${(probability * 100).toFixed(2
                )}`}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="button">
          <button onClick={actionButton[appState].action || (() => { })}>
            {actionButton[appState].text}
          </button>
        </div>

      </div>
    </div>
  );
}


export default App;