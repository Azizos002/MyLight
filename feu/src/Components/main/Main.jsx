import React, { useState, useEffect } from 'react';
import TrafficLight from '../TrafficLight';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';

import './Main.css';
import bgImg from '../../Assets/roadCross.svg'

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAwDOBao006k2-cRD5ay8PFRtrZRqEUQxM",
  authDomain: "project1-93792.firebaseapp.com",
  databaseURL: "https://project1-93792-default-rtdb.firebaseio.com",
  projectId: "project1-93792",
  storageBucket: "project1-93792.firebasestorage.app",
  messagingSenderId: "847328482575",
  appId: "1:847328482575:web:4384c400dfbc1bce05da7a",
  measurementId: "G-KVWJQCZ6JC"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const  Main = () => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [timer, setTimer] = useState(20);
  const [isFlipped, setIsFlipped] = useState(false);

  const road1Color = isFlipped ? (x > y ? 'red' : 'green') : (x > y ? 'green' : 'red');
  const road2Color = isFlipped ? (x > y ? 'green' : 'red') : (x > y ? 'red' : 'green');

  const fetchData = async () => {
    try {
      const snapshot = await get(ref(database, '/py'));
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (data.image1 !== x) setX(data.image1);
        if (data.image2 !== y) setY(data.image2);
      } else {
        console.log("Aucune donnée trouvée !");
      }
    } catch (error) {
      console.error("Erreur de récupération des données:", error);
    }
  };

  useEffect(() => {
    fetchData();

    const fetchInterval = setInterval(() => {
      fetchData();
      setTimer(20);
    }, 20000);

    const flipInterval = setInterval(() => {
      setIsFlipped((prev) => !prev);
    }, 10000);

    const countdown = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 20));
    }, 1000);

    return () => {
      clearInterval(fetchInterval);
      clearInterval(flipInterval);
      clearInterval(countdown);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="Appp">
      <div className="container">

        {/* Section de gauche */}
        <div className="left-section">
          <h1 className="title">Feux de signalisation</h1>

          {/* Nouvelle minuterie stylée */}
          <div className="timer-container">
            <svg className="timer-circle" width="100" height="100">
              <circle
                className="timer-background"
                cx="50"
                cy="50"
                r="45"
              />
              <circle
                className="timer-progress"
                cx="50"
                cy="50"
                r="45"
                style={{
                  strokeDashoffset: `${(timer / 20) * 283}`
                }}
              />
            </svg>
            <div className="timer-text">{timer}</div>
          </div>

          <div className="controls">
          <p>Valeur actuelle de Route 1 : 
            <span className="value-x" style={{ color: x > y ? '#27ae60' : '#e74c3c', padding:'5px', fontSize:'25px' }}>{x}</span>
          </p>
          <p>Valeur actuelle de Route 2 : 
            <span className="value-y" style={{ color: y > x ? '#27ae60' : '#e74c3c', padding:'5px', fontSize:'25px' }}>{y}</span>
          </p>
        </div>
        </div>

        {/* Section de droite */}
        <div className="right-section">
          <div className="image-container">
            <img src={bgImg} alt="Intersection" className="intersection-image" />
          </div>

          <div className="traffic-lights">
            <div className="roadLight1">
              <TrafficLight color={road1Color} />
            </div>
            <div className="roadLight2">
              <TrafficLight color={road2Color} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;