import ConstructorStandings from "./components/ConstructorStandings";
import DriverStandings from "./components/DriverStandings";
import StandingsTabs from "./components/StandingsTabs";

export default async function Rankings() {
  return (
    <div className="flex flex-col p-5">
      {/* Tabs pour mobile */}
      <StandingsTabs
        driversContent={<DriverStandings />}
        constructorsContent={<ConstructorStandings />}
      />

      {/* Affichage desktop côte à côte */}
      <div className="hidden lg:grid grid-cols-2 lg:divide-x gap-4 w-full">
        <div id="driver-standings" className="scroll-mt-16">
          <DriverStandings />
        </div>
        <div id="constructor-standings" className="scroll-mt-16">
          <ConstructorStandings />
        </div>
      </div>
    </div>
  );
}
