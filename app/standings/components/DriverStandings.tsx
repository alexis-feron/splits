"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DriverStandings() {
  const { data, error } = useSWR(
    "https://ergast.com/api/f1/current/driverStandings.json",
    fetcher
  );

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
    data.MRData.StandingsTable.StandingsLists[0].DriverStandings;

  return (
    <div className="w-full max-w-4xl mx-auto lg:px-24 px-2 pb-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        Driver Standings 2024
      </h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b-2 border-gray-300 text-center">
                #
              </th>
              <th className="py-2 px-4 border-b-2 border-gray-300 text-center">
                Driver
              </th>
              <th className="py-2 px-4 border-b-2 border-gray-300 text-center">
                Points
              </th>
            </tr>
          </thead>
          <tbody>
            {standings.map(
              (
                driver: {
                  Driver: {
                    driverId: string;
                    givenName: string;
                    familyName: string;
                  };
                  points: string;
                },
                index: number
              ) => (
                <tr
                  key={driver.Driver.driverId}
                  className={`${
                    index % 2 === 0 ? "bg-opacity-50" : "bg-opacity-5"
                  } hover:bg-gray-100 transition duration-150`}
                >
                  <td className="py-2 px-4 border-b border-gray-200 text-center">
                    {index + 1}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {driver.Driver.givenName} {driver.Driver.familyName}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-center">
                    {driver.points}
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
