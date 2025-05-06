import { useState } from "react";
import "./App.css";
import { Sheet, SheetPresence } from "burlap";

// Define a type for our sheet items
type SheetItem = {
  id: string; // Allow any string for ID
  timestamp: number;
};

// Define props for the SheetHeader component
type SheetHeaderProps = {
  id: string;
  onClose: () => void;
  onOpenAnother: () => void; // Added prop to open another sheet
};

// New SheetHeader component
const SheetHeader: React.FC<SheetHeaderProps> = ({
  id,
  onClose,
  onOpenAnother,
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: "10px",
        borderBottom: "1px solid #eee",
      }}
    >
      <h1 style={{ marginTop: "0", marginBottom: "0", fontSize: "1.5rem" }}>
        Sheet: {id}
      </h1>
      <div>
        <button
          onClick={onOpenAnother}
          className='cta-button primary'
          style={{ marginRight: "10px" }}
        >
          Open Another
        </button>
        <button onClick={onClose} className='cta-button secondary'>
          Close
        </button>
      </div>
    </div>
  );
};

function App() {
  const [sheetStack, setSheetStack] = useState<SheetItem[]>([]);

  // Function to open a sheet
  const openSheet = (id: string) => {
    // Accept string ID
    const newSheet = { id, timestamp: Date.now() };
    setSheetStack((prev) => [...prev, newSheet]);
  };

  // Function to close the top-most sheet
  const closeTopSheet = () => {
    setSheetStack((prev) => prev.slice(0, -1));
  };

  return (
    <div className='container'>
      <header className='header'>
        <nav className='navbar'>
          <div className='logo'>Burlap</div>
          <div className='nav-links'>
            <a href='#'>Community</a>
            <a href='#'>Documentation</a>
            <a href='#' className='nav-button'>
              Get Access
            </a>
          </div>
        </nav>
        <div className='hero-content'>
          <div className='beta-badge'>Beta release</div>
          <h1>Native-like swipeable sheets on the web</h1>
          <p>
            Bring your web app to a whole new level with the most advanced
            swipeable sheet ever engineered for the web. Available for React.
          </p>
          <div className='hero-buttons'>
            <button className='cta-button primary'>Get Access &gt;</button>
            <button className='cta-button secondary'>Documentation &gt;</button>
          </div>
        </div>
      </header>

      <main className='main-content'>
        <section className='gallery'>
          <div
            className='gallery-item sheet-page-item'
            onClick={() => openSheet("sampleSheet")}
          >
            Sheet Page 1
          </div>
          <div // New gallery item
            className='gallery-item sheet-page-item'
            onClick={() => openSheet("anotherSheet")}
            style={{ marginLeft: "10px" }} // Add some spacing
          >
            Sheet Page 2
          </div>
        </section>
      </main>

      <SheetPresence>
        {sheetStack.map((sheet) => (
          <Sheet
            key={`${sheet.id}-${sheet.timestamp}`}
            onClose={() => closeTopSheet()}
            style={{ padding: "20px", minHeight: "300px" }}
          >
            <SheetHeader
              id={sheet.id}
              onClose={closeTopSheet}
              onOpenAnother={() => openSheet(`${sheet.id}-child`)}
            />

            <p style={{ marginTop: "20px" }}>
              This is a sample sheet demonstrating the Burlap UI.
            </p>
            <p>
              Drag from the edge (usually left or top, depending on type) to
              close, or use programmatic controls.
            </p>
          </Sheet>
        ))}
      </SheetPresence>
    </div>
  );
}

export default App;
