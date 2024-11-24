import { Card } from "@/app/components/ui/card";
import Stats from "@/app/types/Stats";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

const Statistics = ({ onClose }: { onClose: () => void }) => {
  const [stats, setStats] = useState<Stats>({
    played: 0,
    won: 0,
    lost: 0,
    streak: 0,
    maxStreak: 0,
  });

  useEffect(() => {
    const storedStats = localStorage.getItem("game_stats");
    if (storedStats) {
      setStats(JSON.parse(storedStats));
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-opacity-50 bg-black flex items-center justify-center z-50">
      <Card className="relative bg-white border rounded-lg p-6 max-w-lg w-full">
        <button className="absolute top-2 right-2 h-10 w-10" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <h2 className="text-xl font-bold mb-4">Statistics</h2>
        <p>Played: {stats.played}</p>
        <p>Won: {stats.won}</p>
        <p>Lost: {stats.lost}</p>
        <p>Streak: {stats.streak}</p>
        <p>Max Streak: {stats.maxStreak}</p>
      </Card>
    </div>
  );
};

export default Statistics;
