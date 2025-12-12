"use client";
import {useEffect, useState} from "react";
import MainBlock from "./components/MainBlock/MainBlock";
import RoadMap from "./components/RoadMap/RoadMap";
import s from "./style.module.css";
import DynamicChoices from "@/app/components/DynamicChoices/DynamicChoices";

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
    <div>
      <h1>Les chroniques imprévisibles</h1>
      <main className={s.adventure}>
        <RoadMap
          lifePoint={currentLifePoint}
          weapons={currentWeapons}
          money={currentMoney}
          stuff={currentStuff}
        />
        <div className={s.container}>
          <div className={s.read} >
          <MainBlock description={currentSection} money={currentMoney} />
          </div>
          <div className={s.choice}>
            <DynamicChoices onClick={updateChoice} choice={currentSection} />
          </div>
        </div>
      </main>
    </div>
  );
}
