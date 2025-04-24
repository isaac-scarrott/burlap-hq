import { useState } from "react";
import Home from "./Home";
import Sheet from "./Sheet";

export default function App() {
  const [openSheet, setOpenSheet] = useState<"page2" | "page3" | null>(null);

  return (
    <>
      <Home open={(id) => setOpenSheet(id)} />

      {openSheet && (
        <Sheet onClose={() => setOpenSheet(null)}>
          <h1 style={{ marginTop: "4rem" }}>
            {openSheet === "page2" ? "Page 2" : "Page 3"}
          </h1>
          <p>Drag from the left edge to close, or tap ←.</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur
            optio quasi explicabo? Consectetur dolorum deserunt minima
            provident.
          </p>
        </Sheet>
      )}
    </>
  );
}
