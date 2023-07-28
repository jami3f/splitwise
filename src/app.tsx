import {
  useState,
  useRef,
  useEffect
} from "preact/hooks";
import { RefObject } from "preact";
import {
  Headings,
  Row, PromotionTotal,
  MaxPromotionTotal
} from "./Components/Table";
import { SubtotalView, TotalView } from "./Components/Totals";
import { CreateSharedItem } from "./Components/Buttons";
import { TopBar } from "./Components/Visual";
import { Person } from "./Classes";

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
  const people: { [key: string]: Person } = {
    Dan: new Person("Dan", 3),
    Jamie: new Person("Jamie", 4),
    Leena: new Person("Leena", 5),
    Sophie: new Person("Sophie", 6),
  };

  function handleNameClick(event: Event) {
    const name = (event.target as HTMLParagraphElement).innerText;
    if (selection.filter((i) => i.name === name).length > 0) {
      setSelection((old) => old.filter((person) => person.name !== name));
      return;
    }
    setSelection((old) => [...old, people[name]]);
  }

  const promotion = new Person("Promotion", 0);
  const maxPromotion = new Person("Max Promotion", 1);
  const service = new Person("Service", 2);
  promotion.limit = 1;
  maxPromotion.limit = 1;

  const [shared, setShared] = useState<Person[][]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selection, setSelection] = useState<Person[]>([]);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    const totalLength = Object.keys(people).length + shared.length + 3;
    inputRefs.current = inputRefs.current.slice(0, totalLength);
    console.log(inputRefs.current);
  }, [shared]);

  function refocus(index: number) {
    if (index > 1) inputRefs.current[index]?.focus();
    else {
      inputRefs.current[index + 1]?.focus();
    }
  }

  let keyCount = 0;

  return (
    <div className="w-screen overflow-hidden">
      <TopBar />
      <div
        id="section-container"
        className="grid md:grid-cols-65/35 grid-rows-2 md:pt-20 md:pl-20 md:pr-20"
      >
        <div
          id="item-entry-container"
          className="w-auto h-auto border-y border-l"
        >
          <Headings />
          <Row
            passedKey={keyCount++}
            className="text-green-700"
            people={[promotion, maxPromotion, ...Object.values(people)]}
            name="Promotion"
            handleNameClick={() => {}}
            limit={1}
            ref={(el: HTMLInputElement | null) =>
              (inputRefs.current[0] = el)
            }
            refocus={refocus}
          >
            <PromotionTotal
              promotion={promotion.items[0]?.price}
              maxPromotion={maxPromotion.items[0]?.price}
              people={[...Object.values(people)]}
            />
          </Row>
          <Row
            passedKey={keyCount++}
            className="text-green-500"
            people={[maxPromotion]}
            limit={1}
            handleNameClick={() => {}}
            ref={(el: HTMLInputElement | null) =>
              (inputRefs.current[1] = el)
            }
            refocus={refocus}
          >
            <MaxPromotionTotal
              promotion={promotion.items[0]?.price}
              maxPromotion={maxPromotion.items[0]?.price}
              people={[...Object.values(people)]}
            />
          </Row>
          <Row
            passedKey={keyCount++}
            className="text-orange-500"
            people={[service]}
            handleNameClick={() => {}}
            ref={(el: HTMLInputElement | null) =>
              (inputRefs.current[2] = el)
            }
            refocus={refocus}
          />
          {Object.values(people).map((person) => (
            <Row
              passedKey={keyCount++}
              className={selectionMode ? "text-blue-600 cursor-pointer" : ""}
              people={[person]}
              handleNameClick={handleNameClick}
              refocus={refocus}
            />
          ))}
          {shared.map((people) => (
            <Row
              passedKey={keyCount++}
              className="text-gray-700"
              people={[...people]}
              handleNameClick={() => {}}
              refocus={refocus}
            ></Row>
          ))}
          <div className="flex flex-row items-center">
            {/* <CreatePerson /> */}
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
        <div className="grid grid-cols-2 border w-full">
          <SubtotalView people={[...Object.values(people), service]} />
          <TotalView
            promotion={promotion.total}
            maxPromotion={maxPromotion.total}
            service={service.total}
            people={Object.values(people)}
          />
        </div>
      </div>
    </div>
  );
}
