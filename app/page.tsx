"use client";
import { useState } from "react";

import MainBlock from "./components/MainBlock/MainBlock";
import FirstChoice from "./components/FirstChoice/FirstChoice";
import SecondaryChoice from "./components/SecondaryChoice/SecondaryChoice";
import ThirdChoice from "./components/ThirdChoice/ThirdChoice";
import RoadMap from "./components/RoadMap/RoadMap";
import mock from "./data/mock.json";

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
  const [currentId, setCurrentDescription] = useState<Section>(mock[0]);

  const [currentLifePoint, setCurrentLifePoint] = useState(0);

  const [currentWeapons, setCurrentWeapons] = useState<string[]>([]);

  const [currentMoney, setCurrentMoney] = useState(0);

  const [currentStuff, setCurrentStuff] = useState<string[]>([""]);

  const updateChoice = (nextId: number) => {
    const nextSection = mock.find((section) => section.id === nextId);
    if (nextSection) {
      if (nextSection.impact && nextSection.impact.length > 0) {
        nextSection.impact.forEach((effect) => {
          if (effect.endurance !== undefined) {
            setCurrentLifePoint((prev) => prev + effect.endurance);
          }
          if (effect.money !== undefined) {
            setCurrentMoney((prev) => prev + effect.money);
          }
        });
      }
      if (nextSection.items && nextSection.items.length > 0) {
        const weapon = nextSection.items[0].weapons;
        if (weapon) {
          setCurrentWeapons((prev) => [...prev, weapon]);
        }
        const money = nextSection.items[1].money;
        if (money) {
          setCurrentMoney(currentMoney + money);
        }
        const stuff = nextSection.items[2].stuff;
        if (stuff) {
          setCurrentStuff((prev) => [...prev, ...stuff]);
        }
      }

      setCurrentDescription(nextSection);
    }
  };

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
          <MainBlock description={currentId} money={currentMoney} />
          <div className={s.choice}>
            <FirstChoice onClick={updateChoice} choice={currentId} />
            <SecondaryChoice onClick={updateChoice} choice={currentId} />
            <ThirdChoice onClick={updateChoice} choice={currentId} />
          </div>
        </div>
      </main>
    </div>
  );
}
