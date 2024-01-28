import { IconMinus, IconPlus, IconTextSize, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { FONT_SIZE_RANGE } from "../constants/app";

export default function TextSizeControl() {
  const [min, max] = FONT_SIZE_RANGE;
  const [menu, setMenu] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [visible, setVisible] = useState(false);
  const [ping, setPing] = useState(false);

  useEffect(() => {
    // Check if there's a font-size already set.
    const initialSize = localStorage.getItem("fontSize");
    if (initialSize) setFontSize(parseFloat(initialSize));
    else localStorage.setItem("fontSize", "16");

    // Check if user knows about the font-size control.
    const ctrlSeen = JSON.parse(localStorage.getItem("ctrlSeen") ?? "false");
    if (!ctrlSeen) setPing(true);

    // Observe the content block on whether to show the control or not.
    const text = document.getElementById("content-section");
    const ob = new IntersectionObserver(
      ([block]) => {
        setVisible(block.isIntersecting);
        if (!block.isIntersecting) setMenu(false);
      },
      { root: null, rootMargin: "-80% 0px -120px 0px", threshold: 0 }
    );

    if (text) ob.observe(text);
    return () => ob.disconnect();
  }, []);

  const changeSize = (dir: 0.5 | -0.5) => {
    const newSize = fontSize + dir;
    if (newSize >= min && newSize <= max) {
      setFontSize(newSize);
      localStorage.setItem("fontSize", newSize.toString());
      window.dispatchEvent(new Event("fontSize"));
    }
  };

  const toggleMenu = () => {
    setMenu((v) => !v);
    if (ping) {
      setPing(false);
      localStorage.setItem("ctrlSeen", "true");
    }
  };

  return (
    <div
      className={`fixed bottom-2 md:bottom-4 right-2 left-auto md:right-auto md:left-4 font-body shadow-md  transition-opacity ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="relative flex items-center bg-gray-800 border border-gray-500 rounded-md">
        {menu && (
          <>
            <span className="mx-2 text-white">Font Size: </span>
            <button
              className="btn btn-sm btn-square btn-ghost text-white"
              onClick={() => changeSize(-0.5)}
              disabled={fontSize === min}
            >
              <IconMinus size={18} />
            </button>
            <div
              className="flex justify-center items-center text-white"
              style={{ width: "42px" }}
            >
              {fontSize}
            </div>
            <button
              className="btn btn-sm btn-square btn-ghost text-white"
              onClick={() => changeSize(0.5)}
              disabled={fontSize === max}
            >
              <IconPlus size={18} />
            </button>
          </>
        )}
        <button
          className={`btn btn-sm btn-square btn-ghost ${
            menu ? "text-red-500" : "text-white"
          }`}
          onClick={toggleMenu}
        >
          {menu ? <IconX size={18} /> : <IconTextSize size={18} />}
        </button>
        {ping && (
          <>
            <span className="absolute -top-1 -left-1 right-auto md:-right-1 md:left-auto h-2 w-2 inline-flex rounded-full bg-violet-400"></span>
            <span className="animate-ping absolute -top-2 -left-2 right-auto md:-right-2 md:left-auto h-4 w-4 inline-flex rounded-full bg-violet-400"></span>
          </>
        )}
      </div>
    </div>
  );
}
