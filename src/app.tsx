import "preact/debug";
import { useState, useRef, useEffect } from "preact/hooks";
import { RefObject } from "preact";
import { Headings, Row } from "./Components/Table";
import { SubtotalView, TotalView } from "./Components/Totals";
import { Button, CreatePerson, CreateSharedItem } from "./Components/Buttons";
import { TopBar } from "./Components/Visual";
import { Item, Person } from "./Types";
import { Promotion, PromotionCap } from "./Components/Promotion";

function showToolTip(e: Event, ref: RefObject<HTMLDivElement>) {
  const target = e.target as HTMLElement;
  const tooltip = ref.current;
  if (tooltip) {
    tooltip.style.display = "block";
    tooltip.style.left = `${target.offsetLeft + target.offsetWidth}px`;
    tooltip.style.top = `${target.offsetTop}px`;
    tooltip.innerHTML = target.title;
  }
}

export function App() {
  function handleNameClick(event: Event) {
    const name = (event.target as HTMLParagraphElement).innerText;
    if (selection.filter((i) => i.name === name).length > 0) {
      setSelection((old) => old.filter((person) => person.name !== name));
      return;
    }
    setSelection((old) => [...old, people[name]]);
  }

  const [promotion, setPromotion] = useState<number>();
  const [promotionCap, setPromotionCap] = useState<number>();

  const [service, setService] = useState<{ [key: string]: Person }>({
    Service: {
      name: "Service",
      items: [],
      total: 0,
      id: -1,
    },
  });
  const [people, setPeople] = useState<{ [key: string]: Person }>({});
  const [shared, setShared] = useState<Person[][]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selection, setSelection] = useState<Person[]>([]);
  const [inputRefs, setInputRefs] = useState<{
    [key: string]: HTMLInputElement | null;
  }>({
    Promotion: null,
    "Promotion Cap": null,
    Service: null,
  });

  useEffect(() => {
    inputRefs["Promotion"]?.focus();
  }, [inputRefs["Promotion"]]);

  useEffect(() => {
    console.log(inputRefs);
    const savedPeople: string[] = JSON.parse(
      localStorage.getItem("people") || "[]"
    );

    setPeople(() => {
      console.log(
        savedPeople.reduce(
          (_: { [name: string]: Person }, name: string, index: number) => ({
            [name]: {
              name: name,
              items: [],
              total: 0,
              id: index,
            },
          }),
          {}
        )
      );
      return savedPeople.reduce(
        (obj: { [name: string]: Person }, name: string, index: number) => ({
          ...obj,
          [name]: {
            name: name,
            items: [],
            total: 0,
            id: index,
          },
        }),
        {}
      );
    });
  }, []);

  useEffect(() => {
    console.log(people);
    localStorage.setItem("people", JSON.stringify(Object.keys(people)));
  }, [people]);

  // useEffect(() => {
  //   const totalLength = Object.keys(people).length + shared.length + 3;
  //   inputRefs.current = inputRefs.current.slice(0, totalLength);
  // }, [shared]);

  function refocus(key: string) {
    switch (key) {
      case "Promotion":
        inputRefs["Promotion Cap"]?.focus();
        break;
      case "Promotion Cap":
        inputRefs["Service"]?.focus();
        break;
      default:
        inputRefs[key]?.focus();
    }
  }

  function addToRefObject(ref: HTMLInputElement) {
    if (ref === null || ref === undefined) return;
    setInputRefs((old) => ({ ...old, [ref.title]: ref }));
  }

  let keyCount = 0;

  return (
    <div className="w-screen overflow-hidden">
      <TopBar />
      <div className="md:pt-20 md:pl-20 md:pr-20">
        <div className="w-64 flex flex-col divide-y justify-center border-x border-t rounded-t">
          <Promotion
            promotion={promotion}
            passedKey={-3}
            setPromotion={setPromotion}
            addToRefObject={addToRefObject}
            refocus={refocus}
          />
          <PromotionCap
            passedKey={-2}
            promotionCap={promotionCap}
            setPromotionCap={setPromotionCap}
            addToRefObject={addToRefObject}
            refocus={refocus}
          />
        </div>
        <div id="section-container" className="grid md:grid-cols-65/35">
          <div
            id="item-entry-container"
            className="w-auto h-auto border-y border-l text-center rounded-bl"
          >
            <Headings />
            <Row
              people={[service["Service"]]}
              setPeople={setService}
              passedKey={keyCount++}
              className="text-orange-500"
              handleNameClick={() => {}}
              refocus={refocus}
              addToRefObject={addToRefObject}
            />
            {Object.values(people).map((person) => (
              <Row
                setPeople={setPeople}
                passedKey={keyCount++}
                className={selectionMode ? "text-blue-600 cursor-pointer" : ""}
                people={[person]}
                handleNameClick={handleNameClick}
                refocus={refocus}
                addToRefObject={addToRefObject}
              >
                <p>{person.id + 3}</p>
              </Row>
            ))}
            {shared.map((people) => (
              <Row
                setPeople={setPeople}
                passedKey={keyCount++}
                className="text-gray-700"
                people={[...people]}
                handleNameClick={() => {}}
                refocus={refocus}
                addToRefObject={addToRefObject}
              ></Row>
            ))}
            <div className="flex flex-row items-center">
              <CreatePerson people={people} setPeople={setPeople} />
              <CreateSharedItem
                {...{
                  selection,
                  setSelection,
                  selectionMode,
                  setSelectionMode,
                  shared,
                  setShared,
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 border w-full rounded-r">
            <SubtotalView
              people={[...Object.values(people), ...Object.values(service)]}
            />
            <TotalView
              promotion={promotion}
              promotionCap={promotionCap}
              service={service["Service"].total}
              people={Object.values(people)}
            />
          </div>
          <Button
            text="Clear People"
            handleClick={() => setPeople({})}
            className="w-28"
          />
        </div>
      </div>
    </div>
  );
}
