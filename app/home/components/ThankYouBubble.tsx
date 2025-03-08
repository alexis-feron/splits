import Link from "next/link";
import { useState } from "react";

export default function LocalThankYouBubble() {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <div className="relative">
      {/* Bulle de remerciements */}
      <div className="absolute bottom-4 right-4 z-10">
        <button
          onClick={handleOpenModal}
          className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-100"
          title="Remerciements"
        >
          🙏
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
            {/* Bouton de fermeture */}
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            {/* Contenu de la modal */}
            <h2 className="text-lg font-semibold text-center mb-4">
              Special Thanks To:
            </h2>
            <ul className="text-sm text-gray-600 list-disc list-inside">
              <li>
                Data Source:{" "}
                <Link
                  href="https://api.jolpi.ca/ergast/"
                  className="hover:text-black"
                  target="_blank"
                  title="Jolpica Ergast API"
                  rel="noopener noreferrer"
                >
                  Jolpica Ergast API
                </Link>
              </li>
              <li>
                Game Inspiration:{" "}
                <Link
                  href="https://stewardle.com/"
                  className="hover:text-black"
                  target="_blank"
                  title="Stewardle"
                  rel="noopener noreferrer"
                >
                  Stewardle
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
