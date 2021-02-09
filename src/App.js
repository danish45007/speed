import React, { useEffect, useRef, useState } from "react";
import "./styles.css";

// Word Component
let Word = ({ text, active, correct }) => {
  if (correct === true) {
    return <span className="correct">{text} </span>;
  }

  if (correct === false) {
    return <span className="incorrect">{text} </span>;
  }

  if (active) {
    return <span className="active">{text} </span>;
  }
  return <span>{text} </span>;
};

// Timer Component
const Timer = ({ startCounting, correctWords }) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  useEffect(() => {
    let id;
    if (startCounting) {
      // time-counter logic
      id = setInterval(() => {
        setTimeElapsed((oldtime) => oldtime + 1);
      }, 1000);
    }
    // cleanup func
    return () => {
      clearInterval(id);
    };
  }, [startCounting]);

  const min = timeElapsed / 60;
  const speed = (correctWords / min || 0).toFixed(2);
  return (
    <div>
      <p>Timer: {timeElapsed} SEC</p>
      <p>Speed: {speed} WPM</p>
    </div>
  );
};

// optimize the renders
Word = React.memo(Word);

export default function App() {
  const [userInput, setUserInput] = useState("");
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [correctWordArray, setCorrectWordArray] = useState([]);
  const [startCounting, setStartCounting] = useState(false);
  const getWord = () =>
    `Alice was beginning to get very tired of sitting 
  by her sister on the bank and of having nothing to do once or twice 
  she had peeped into the book her sister was reading but it had no 
  pictures or conversations in it and what is the use of a book thought 
  Alice without pictures or conversation`.split(" ");
  // .sort(() => Math.random() > 0.5 ? 1 : -1)

  const processInput = (value) => {
    // startCounting => true when use start typing

    // To stop
    if (activeWordIndex === cloud.current.length) {
      return;
    }
    if (!startCounting) {
      setStartCounting(true);
    }
    if (value.endsWith(" ")) {
      // Mark input to complete after completion
      if (activeWordIndex === cloud.current.length - 1) {
        setStartCounting(false);
        setUserInput("Completed!!!");
      } else {
        setUserInput("");
      }
      setActiveWordIndex((index) => index + 1);
      // the input word is correct
      setCorrectWordArray((data) => {
        const word = value.trim();
        const newData = [...data];
        newData[activeWordIndex] = word === cloud.current[activeWordIndex];
        return newData;
      });
    } else {
      setUserInput(value);
    }
  };
  const cloud = useRef(getWord());

  return (
    <div className="App">
      <h1>Speed Test using reactjs</h1>
      <Timer
        startCounting={startCounting}
        correctWords={correctWordArray.filter(Boolean).length}
      />
      <div>
        <p>
          {cloud.current.map((word, index) => {
            return (
              <Word
                key={index}
                text={word}
                active={index === activeWordIndex}
                correct={correctWordArray[index]}
              />
            );
          })}
        </p>
        <input
          placeholder="start typing...."
          type="text"
          value={userInput}
          onChange={(e) => processInput(e.target.value)}
        />
      </div>
    </div>
  );
}
