import Image from "next/image";
import { useEffect, useState } from "react";
import { Driver } from "../../types/Driver";
import { Hint } from "../../types/Hint";
import { Hints } from "../../types/Hints";

type GameBoardProps = {
  hints: Hints[];
  guesses: Driver[];
};

const GameBoard = ({ hints, guesses }: GameBoardProps) => {
  const [board, setBoard] = useState<
    { value: string | number; hint: Hint }[][]
  >([...Array(6).fill(Array(7).fill({ value: "", hint: "" }))]);

  useEffect(() => {
    if (guesses.length > 0) {
      setBoard((prevBoard) => {
        const newBoard = [...prevBoard];

        guesses.forEach((guess, currentRow) => {
          const row = [
            { value: guess.name, hint: hints[currentRow]?.[0] || ("" as Hint) },
            { value: guess.flag, hint: hints[currentRow]?.[1] || ("" as Hint) },
            { value: guess.team, hint: hints[currentRow]?.[2] || ("" as Hint) },
            {
              value: guess.carNumber,
              hint: hints[currentRow]?.[3] || ("" as Hint),
            },
            { value: guess.age, hint: hints[currentRow]?.[4] || ("" as Hint) },
            {
              value: guess.firstYear,
              hint: hints[currentRow]?.[5] || ("" as Hint),
            },
            { value: guess.wins, hint: hints[currentRow]?.[6] || ("" as Hint) },
          ];

          newBoard[currentRow] = row;
        });

        return newBoard;
      });
    }
  }, [guesses, hints]);

  const truncateName = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1 && parts[1].length > 3
      ? parts[1].substring(0, 3).toUpperCase()
      : name.substring(0, 3).toUpperCase();
  };

  return (
    <div className="grid gap-4 mb-6 mx-auto max-w-screen-md">
      <div className="grid grid-cols-7 gap-2 text-center font-semibold text-sm">
        <div>Driver</div>
        <div>Flag</div>
        <div>Team</div>
        <div>Car Num</div>
        <div>Driver Age</div>
        <div>First Year</div>
        <div>Race Wins</div>
      </div>

      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-7 gap-2">
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className={`rounded-md relative md:w-24 h-12 border border-gray-700 flex items-center justify-center overflow-hidden text-center ${
                cell.hint === "correct"
                  ? "bg-green-500"
                  : cell.hint === "incorrect"
                  ? "bg-red-500"
                  : cell.hint === "up"
                  ? "bg-yellow-300 after:content-[''] after:absolute after:w-0 after:h-0 after:border-l-[75px] after:border-l-transparent after:border-r-[75px] after:border-r-transparent after:border-b-[50px] after:border-b-yellow-500"
                  : cell.hint === "down"
                  ? "bg-blue-300 after:content-[''] after:absolute after:w-0 after:h-0 after:border-l-[75px] after:border-l-transparent after:border-r-[75px] after:border-r-transparent after:border-t-[50px] after:border-t-blue-500"
                  : ""
              }`}
            >
              <span className="relative z-10">
                {colIndex === 0 ? (
                  <div className="text-sm">
                    <div className="sm:hidden">
                      {truncateName(cell.value as string)}
                    </div>
                    <div className="hidden sm:block">
                      {cell.value as string}
                    </div>
                  </div>
                ) : colIndex === 1 ? (
                  cell.value ? (
                    <div className="relative h-12 w-12">
                      <Image
                        src={cell.value as string}
                        alt="flag"
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                  ) : null
                ) : colIndex === 2 ? (
                  cell.value ? (
                    <div className="relative h-10 w-10">
                      <Image
                        src={
                          "/logos/" +
                          (cell.value as string).replace(" ", "") +
                          ".png"
                        }
                        alt={cell.value as string}
                        layout="fill"
                        objectFit="contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<span class="flex items-center justify-center h-full w-full">${cell.value}</span>`;
                          }
                        }}
                      />
                    </div>
                  ) : null
                ) : (
                  cell.value
                )}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
