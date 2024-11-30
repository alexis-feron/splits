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
            {
              value: guess.teams[guess.teams.length - 1],
              hint: hints[currentRow]?.[2] || ("" as Hint),
            },
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
    <div className="grid gap-2 sm:gap-3 mb-6 mx-auto max-w-screen-md">
      <div className="grid grid-cols-7 gap-2 text-center font-semibold text-xs md:text-md lg:text-base">
        <div className="flex flex-col justify-end items-center text-center h-full">
          Driver
        </div>
        <div className="flex flex-col justify-end items-center text-center h-full">
          Flag
        </div>
        <div className="flex flex-col justify-end items-center text-center h-full">
          Team
        </div>
        <div className="flex flex-col justify-end items-center text-center h-full">
          Car Num
        </div>
        <div className="flex flex-col justify-end items-center text-center h-full">
          Driver Age
        </div>
        <div className="flex flex-col justify-end items-center text-center h-full">
          First Year
        </div>
        <div className="flex flex-col justify-end items-center text-center h-full">
          Race Wins
        </div>
      </div>

      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-7 gap-1 sm:gap-2">
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className={`text-white rounded-md relative md:w-24 h-12 border border-gray-700 flex items-center justify-center overflow-hidden text-center ${
                cell.hint === "correct"
                  ? "bg-customGreen"
                  : cell.hint === "incorrect"
                  ? "bg-customRed"
                  : cell.hint === "partially correct"
                  ? "bg-customYellow"
                  : cell.hint === "up"
                  ? "bg-customPurple bg-opacity-50 after:content-[''] after:border-b-customPurple after:absolute after:w-0 after:h-0 after:border-l-[75px] after:border-l-transparent after:border-r-[75px] after:border-r-transparent after:border-b-[50px]"
                  : cell.hint === "down"
                  ? "bg-customBlue bg-opacity-50 text-black after:content-[''] after:border-customBlue after:absolute after:w-0 after:h-0 after:border-l-[75px] after:border-l-transparent after:border-r-[75px] after:border-r-transparent after:border-t-[50px]"
                  : ""
              }`}
            >
              <span className="relative z-10 text-sm md:text-md lg:text-lg break-words">
                {colIndex === 0 ? (
                  <div>
                    <div className="sm:hidden">
                      {truncateName(cell.value as string)}
                    </div>
                    <div className="hidden sm:block md:text-sm">
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
                        className="p-1"
                      />
                    </div>
                  ) : null
                ) : colIndex === 2 ? (
                  cell.value ? (
                    <div className="relative h-10 w-10">
                      <Image
                        src={
                          "/logos/" +
                          (
                            (cell.value as string)
                              .replace("F1", "")
                              .replace("Team", "")
                              .replace("Racing", "")
                              .replace("-Climax", "")
                              .replace("-Ford", "")
                              .replace(" ", "") + ".png"
                          ).replace(" ", "")
                        }
                        alt={cell.value as string}
                        layout="fill"
                        objectFit="contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<span class="flex items-center justify-center h-full w-full md:text-sm">${cell.value}</span>`;
                          }
                        }}
                        className="p-1"
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
