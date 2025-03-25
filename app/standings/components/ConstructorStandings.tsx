"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ConstructorStandings() {
  const currentYear = new Date().getFullYear();
  const url =
    "https://api.jolpi.ca/ergast/f1/" + currentYear + "/constructorstandings/";
  const { data, error } = useSWR(url, fetcher);

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-600 font-bold">Erreur de chargement...</div>
      </div>
    );
  if (!data)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-300"></div>
      </div>
    );

  const standings =
    data?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings ||
    [];

  return (
    <div className="w-full max-w-4xl mx-auto lg:px-24 px-2 pb-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        Constructor Standings {currentYear}
      </h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b-2 border-gray-300 text-center">
                #
              </th>
              <th className="py-2 px-4 border-b-2 border-gray-300 text-center">
                Constructor
              </th>
              <th className="py-2 px-4 border-b-2 border-gray-300 text-center">
                Points
              </th>
            </tr>
          </thead>
          <tbody>
            {standings.map(
              (
                constructor: {
                  Constructor: {
                    constructorId: string;
                    name: string;
                  };
                  points: string;
                },
                index: number
              ) => (
                <tr
                  key={constructor.Constructor.constructorId}
                  className={`${
                    index % 2 === 0 ? "bg-opacity-50" : "bg-opacity-5"
                  } hover:bg-gray-100 transition duration-150`}
                >
                  <td className="py-2 px-4 border-b border-gray-200 text-center">
                    {index + 1}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {constructor.Constructor.name}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-center">
                    {constructor.points}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
