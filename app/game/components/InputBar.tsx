import { useEffect, useState } from "react";

const InputBar = ({ onSubmit }: { onSubmit: (driverName: string) => void }) => {
  const [driverName, setDriverName] = useState("");
  const [driversList, setDriversList] = useState<string[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<string[]>([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const [maxHeight, setMaxHeight] = useState("200px"); // Limite initiale de la hauteur des suggestions

  const fetchDrivers = async () => {
    const response = await fetch("/api/drivers");
    const data = await response.json();
    setDriversList(data);
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setDriverName(inputValue);

    if (inputValue) {
      const normalizeString = (str: string) =>
        str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      setFilteredDrivers(
        driversList.filter((driver) =>
          normalizeString(driver.toLowerCase()).includes(
            normalizeString(inputValue.toLowerCase())
          )
        )
      );
      setIsSuggestionsVisible(true);
    } else {
      setIsSuggestionsVisible(false);
    }
  };

  const handleSuggestionClick = (driver: string) => {
    setDriverName(driver);
    setIsSuggestionsVisible(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (driverName) {
      onSubmit(driverName); // Appel à la fonction onSubmit
      setDriverName(""); // Réinitialiser le champ de saisie
      setIsSuggestionsVisible(false); // Cacher les suggestions
    }
  };

  useEffect(() => {
    const adjustSuggestionsHeight = () => {
      const inputElement = document.querySelector("input");
      if (inputElement) {
        const inputRect = inputElement.getBoundingClientRect();
        const availableSpace = window.innerHeight - inputRect.bottom - 20; // Espace disponible en dessous de l'input
        setMaxHeight(`${Math.max(100, Math.min(availableSpace, 300))}px`); // Limite à 300px max
      }
    };

    // Ajuster la hauteur au chargement et au redimensionnement de la fenêtre
    adjustSuggestionsHeight();
    window.addEventListener("resize", adjustSuggestionsHeight);
    return () => {
      window.removeEventListener("resize", adjustSuggestionsHeight);
    };
  }, []);

  return (
    <div className="flex justify-center mt-4">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center space-x-2 w-full max-w-md"
      >
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Driver"
            className="w-full p-2 rounded-lg border border-gray-700 bg-white text-carbon-900 focus:outline-none"
            value={driverName}
            onChange={handleInputChange}
            autoComplete="off"
          />

          {isSuggestionsVisible && filteredDrivers.length > 0 && (
            <ul
              className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg mt-1 z-10 shadow-lg overflow-y-auto"
              style={{ maxHeight }}
            >
              {filteredDrivers.map((driver) => (
                <li
                  key={driver}
                  onClick={() => handleSuggestionClick(driver)}
                  className="px-4 py-2 hover:bg-red-600 hover:text-white cursor-pointer"
                >
                  {driver}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default InputBar;
