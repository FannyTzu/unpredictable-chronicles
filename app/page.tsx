"use client";
import {useEffect, useState} from "react";

import MainBlock from "./components/MainBlock/MainBlock";
import FirstChoice from "./components/FirstChoice/FirstChoice";
import SecondaryChoice from "./components/SecondaryChoice/SecondaryChoice";
import ThirdChoice from "./components/ThirdChoice/ThirdChoice";
import RoadMap from "./components/RoadMap/RoadMap";


import s from "./style.module.css";

interface Item {
  weapons?: string;
  money?: number;
  stuff?: string[];
  power?: number;
}

interface Section {
  id: number;
  description: string;
  choices: { label: string; nextId: number }[];
  impact?: { endurance?: number; money?: number }[];
  items?: Item[];
}

export default function Home() {
  const [currentSection, setCurrentSection] = useState<Section | null>(null);

  const [currentLifePoint, setCurrentLifePoint] = useState(0);

  const [currentWeapons, setCurrentWeapons] = useState<string[]>([]);

  const [currentMoney, setCurrentMoney] = useState(0);

  const [currentStuff, setCurrentStuff] = useState<string[]>([]);

  const fetchSection = (id: number) => {
    fetch(`http://localhost:3001/pages/${id}`)
        .then(res => res.json())
        .then(nextSection => {
          // Update stats
          if (nextSection.impact) {
            nextSection.impact.forEach((effect: any) => {
              if (effect.endurance) setCurrentLifePoint(prev => prev + effect.endurance);
              if (effect.money) setCurrentMoney(prev => prev + effect.money);
            });
          }

          if (nextSection.items) {
            const weapon = nextSection.items[0]?.weapons;
            if (weapon) setCurrentWeapons(prev => [...prev, weapon]);

            const money = nextSection.items[1]?.money;
            if (money) setCurrentMoney(prev => prev + money);

            const stuff = nextSection.items[2]?.stuff;
            if (stuff) setCurrentStuff(prev => [...prev, ...stuff]);
          }

          setCurrentSection(nextSection);
        });
  };

  const updateChoice = (nextId: number) => {
    fetchSection(nextId);
  };

  useEffect(() => {
    fetchSection(1);
  }, []);

  if (!currentSection) return <p>Chargement...</p>;


  return (
    <div className={s.container}>
      <h1>Les chroniques imprévisibles</h1>
      <main className={s.main}>
        <RoadMap
          lifePoint={currentLifePoint}
          weapons={currentWeapons}
          money={currentMoney}
          stuff={currentStuff}
        />
        <div className={s.read}>
          <MainBlock description={currentSection} money={currentMoney} />
          <div className={s.choice}>
            <FirstChoice onClick={updateChoice} choice={currentSection} />
            <SecondaryChoice onClick={updateChoice} choice={currentSection} />
            <ThirdChoice onClick={updateChoice} choice={currentSection} />
          </div>
        </div>
      </main>
    </div>
  );
}
