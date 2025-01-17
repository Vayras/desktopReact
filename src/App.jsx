import React from "react";

export default function App() {
  const handleToggleChange = (event) => {
    runAppleScript();
  };

  const runAppleScript = () => {
    console.log("clicked");
    if (window.electron && typeof window.electron.runAppleScript === "function") {
      window.electron.runAppleScript();
    } else {
      console.error("Electron API is not available for AppleScript.");
    }
  };

  return (
    <div className="min-h-screen max-h-full bg-zinc-950 text-white flex justify-center items-center p-12">
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          onChange={handleToggleChange}
        />
        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
        <span className="ms-3 text-xl font-medium text-gray-900 dark:text-gray-300">
          Red Tint
        </span>
      </label>
    </div>
  );
}
