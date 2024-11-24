import ConstructorStandings from "./components/ConstructorStandings";
import DriverStandings from "./components/DriverStandings";

export default function Rankings() {
  return (
    <div className="flex p-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:divide-x gap-4 w-full">
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
