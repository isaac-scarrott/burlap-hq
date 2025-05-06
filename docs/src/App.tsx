import { useState } from "react";
import { Sheet, SheetPresence } from "burlap";

// Define a type for our sheet items, similar to src/App.tsx
type SheetItem = {
  id: "sampleSheet";
  timestamp: number;
};

function App() {
  const [count, setCount] = useState(0);
  const [sheetStack, setSheetStack] = useState<SheetItem[]>([]);

  // Function to open a sheet
  const openSheet = (id: "sampleSheet") => {
    const newSheet = { id, timestamp: Date.now() };
    setSheetStack((prev) => [...prev, newSheet]);
  };

  // Function to close the top-most sheet
  const closeTopSheet = () => {
    setSheetStack((prev) => prev.slice(0, -1));
  };

  return (
    <>
      <>
        <h1>Vite + React (with Burlap-style Sheet)</h1>
        <div className='card'>
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className='read-the-docs'>
          Click on the Vite and React logos to learn more
        </p>
        <button
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            cursor: "pointer",
          }}
          onClick={() => openSheet("sampleSheet")}
        >
          Open Sample Sheet
        </button>
      </>

      <SheetPresence>
        {sheetStack.map((sheet) => (
          <Sheet
            key={`${sheet.id}-${sheet.timestamp}`}
            onClose={() => closeTopSheet()}
          >
            <h1 style={{ marginTop: "4rem" }}>Sample Sheet</h1>
            <p>This is a sample sheet demonstrating the Burlap UI.</p>
            <p>Drag from the left edge to close, or tap ← (if configured).</p>
          </Sheet>
        ))}
      </SheetPresence>
    </>
  );
}

export default App;
