import { jsxDEV } from "react/jsx-dev-runtime";
const { useState, useEffect, useRef } = React;
const LoadingSpinner = () => /* @__PURE__ */ jsxDEV("div", { className: "loading", children: /* @__PURE__ */ jsxDEV("div", { className: "loading-spinner" }, void 0, false, {
  fileName: "<stdin>",
  lineNumber: 4,
  columnNumber: 55
}) }, void 0, false, {
  fileName: "<stdin>",
  lineNumber: 4,
  columnNumber: 30
});
const FridgeItem = ({ item }) => {
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: "fridge-item",
      title: item.name,
      style: { fontSize: "2rem", display: "flex", justifyContent: "center", alignItems: "center" },
      children: item.emoji
    },
    void 0,
    false,
    {
      fileName: "<stdin>",
      lineNumber: 9,
      columnNumber: 9
    }
  );
};
const Fridge = ({ contents, description, isOpen, onToggleDoor }) => {
  const items = contents?.items || [];
  return /* @__PURE__ */ jsxDEV("div", { className: "fridge-result", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "fridge-container", children: [
      /* @__PURE__ */ jsxDEV("div", { className: `fridge-door ${isOpen ? "open" : ""}`, onClick: onToggleDoor, children: /* @__PURE__ */ jsxDEV("div", { className: "fridge-handle" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 27,
        columnNumber: 21
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 26,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "fridge-contents", children: items.map((item, index) => /* @__PURE__ */ jsxDEV(FridgeItem, { item }, index, false, {
        fileName: "<stdin>",
        lineNumber: 31,
        columnNumber: 25
      })) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 29,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 25,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV("p", { children: description }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 35,
      columnNumber: 13
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 24,
    columnNumber: 9
  });
};
const GalleryItem = ({ fridge, onOpen }) => {
  return /* @__PURE__ */ jsxDEV("div", { className: "gallery-item", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "gallery-fridge", onClick: () => onOpen(fridge.id), children: [
      /* @__PURE__ */ jsxDEV("div", { className: "gallery-fridge-door", children: /* @__PURE__ */ jsxDEV("div", { className: "gallery-fridge-handle" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 46,
        columnNumber: 21
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 45,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "gallery-fridge-contents", children: fridge.contents?.items?.slice(0, 6).map((item, index) => /* @__PURE__ */ jsxDEV("div", { className: "fridge-item", style: { fontSize: "1.5rem", display: "flex", justifyContent: "center", alignItems: "center" }, children: item.emoji }, index, false, {
        fileName: "<stdin>",
        lineNumber: 50,
        columnNumber: 25
      })) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 48,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 44,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "gallery-item-info", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "gallery-item-username", children: fridge.username }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 57,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "gallery-item-description", children: fridge.description }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 58,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 56,
      columnNumber: 13
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 43,
    columnNumber: 9
  });
};
const App = () => {
  const [prompt, setPrompt] = useState("");
  const [currentFridge, setCurrentFridge] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFridgeOpen, setIsFridgeOpen] = useState(false);
  const [fridges, setFridges] = useState([]);
  const [creatorUsername, setCreatorUsername] = useState("");
  useEffect(() => {
    window.handleFridgeOpenedEvent = (data) => {
      const fridgeElement = document.getElementById(`fridge-${data.fridgeId}`);
      if (fridgeElement) {
        fridgeElement.scrollIntoView({ behavior: "smooth" });
        fridgeElement.classList.add("highlight");
        setTimeout(() => fridgeElement.classList.remove("highlight"), 2e3);
      }
    };
    fridgeSocketManager.getCreatorUsername().then((username) => {
      setCreatorUsername(username);
    });
    return () => {
      delete window.handleFridgeOpenedEvent;
    };
  }, []);
  useEffect(() => {
    const unsubscribe = fridgeSocketManager.subscribeFridges((updatedFridges) => {
      const sortedFridges = [...updatedFridges].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setFridges(sortedFridges);
    });
    return () => unsubscribe();
  }, []);
  const handleGenerateFridge = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setCurrentFridge(null);
    setIsFridgeOpen(false);
    try {
      const fridgeData = await fridgeGenerator.generateFridge(prompt);
      const newFridge = await fridgeSocketManager.createFridgeRecord(
        fridgeData.description,
        fridgeData.contents,
        null
        // We're not using an external image URL
      );
      setCurrentFridge({
        ...newFridge,
        contents: fridgeData.contents
      });
      setPrompt("");
    } catch (error) {
      console.error("Error generating fridge:", error);
      alert("There was an error generating your fridge. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  const handleToggleDoor = () => {
    setIsFridgeOpen(!isFridgeOpen);
    if (currentFridge && !isFridgeOpen) {
      fridgeSocketManager.sendFridgeOpenedEvent(currentFridge.id);
    }
  };
  const handleOpenGalleryFridge = (fridgeId) => {
    const fridge = fridges.find((f) => f.id === fridgeId);
    if (fridge) {
      setCurrentFridge(fridge);
      setIsFridgeOpen(true);
      fridgeSocketManager.sendFridgeOpenedEvent(fridgeId);
      document.querySelector(".generator-section").scrollIntoView({ behavior: "smooth" });
    }
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "app-container", children: [
    /* @__PURE__ */ jsxDEV("header", { className: "header", children: [
      /* @__PURE__ */ jsxDEV("h1", { children: "This Fridge Does Not Exist" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 167,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV("p", { children: "Generate a unique, imaginary fridge based on your description!" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 168,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 166,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV("section", { className: "generator-section", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "input-section", children: [
        /* @__PURE__ */ jsxDEV("label", { htmlFor: "prompt-input", children: "Describe what's in your imaginary fridge:" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 173,
          columnNumber: 21
        }),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            id: "prompt-input",
            className: "input-field",
            type: "text",
            value: prompt,
            onChange: (e) => setPrompt(e.target.value),
            placeholder: "E.g., a college student's fridge during finals week",
            disabled: isGenerating
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 174,
            columnNumber: 21
          }
        ),
        /* @__PURE__ */ jsxDEV("div", { className: "button-group", children: /* @__PURE__ */ jsxDEV(
          "button",
          {
            className: "button",
            onClick: handleGenerateFridge,
            disabled: isGenerating || !prompt.trim(),
            children: isGenerating ? "Generating..." : "Generate Fridge"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 184,
            columnNumber: 25
          }
        ) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 183,
          columnNumber: 21
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 172,
        columnNumber: 17
      }),
      isGenerating && /* @__PURE__ */ jsxDEV(LoadingSpinner, {}, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 194,
        columnNumber: 34
      }),
      currentFridge && /* @__PURE__ */ jsxDEV(
        Fridge,
        {
          contents: currentFridge.contents,
          description: currentFridge.description,
          isOpen: isFridgeOpen,
          onToggleDoor: handleToggleDoor
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 197,
          columnNumber: 21
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 171,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV("section", { className: "gallery-section", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "gallery-header", children: [
        /* @__PURE__ */ jsxDEV("h2", { children: "Community Fridges Gallery" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 208,
          columnNumber: 21
        }),
        /* @__PURE__ */ jsxDEV("p", { children: "Click on a fridge to view its contents" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 209,
          columnNumber: 21
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 207,
        columnNumber: 17
      }),
      fridges.length === 0 ? /* @__PURE__ */ jsxDEV("p", { children: "No fridges have been generated yet. Be the first to create one!" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 213,
        columnNumber: 21
      }) : /* @__PURE__ */ jsxDEV("div", { className: "gallery-grid", children: fridges.map((fridge) => /* @__PURE__ */ jsxDEV(
        GalleryItem,
        {
          id: `fridge-${fridge.id}`,
          fridge,
          onOpen: handleOpenGalleryFridge
        },
        fridge.id,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 217,
          columnNumber: 29
        }
      )) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 215,
        columnNumber: 21
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 206,
      columnNumber: 13
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 165,
    columnNumber: 9
  });
};
const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(/* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
  fileName: "<stdin>",
  lineNumber: 233,
  columnNumber: 13
}));
