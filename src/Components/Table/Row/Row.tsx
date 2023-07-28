import { useEffect, useState } from "preact/hooks";
import { JSX } from "preact";
import { ForwardedRef, forwardRef } from "preact/compat";
import { Person } from "../../../Classes";
import {
  AnimationControls,
  ControlsAnimationDefinition,
  motion,
  useAnimationControls,
} from "framer-motion";

import { ISharedItem, DisplayType, ItemsDisplay, TotalDisplay } from "./index";

const Row = forwardRef(
  (
    props: {
      people: Person[];
      handleNameClick: (event: Event) => void;
      passedKey: number;
      refocus: Function;
      className?: string;
      name?: string;
      limit?: number;
      children?: JSX.Element;
    },
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const [items, updateItems] = useState<ISharedItem[]>([]);

    function addItem(price: number) {
      const ids = props.people.map((p) => p.id);
      updateItems((old) => [...old, { ids, price }]);
      props.people.forEach((p) =>
        p.addItem({ id: p.id, price: price / props.people.length })
      );
    }
    function removeItem(ids: number[]) {
      const compArrays = (a: number[], b: number[]) => {
        if (a.length !== b.length) return false;
        return a.every((v, i) => v === b[i]);
      };
      updateItems((old) => old.filter((i) => !compArrays(i.ids, ids)));
      props.people.forEach((p, index) => p.removeItem(ids[index]));
    }

    const promotion = props.name === "Promotion";
    let name = props.name || props.people.map((p) => p.name).join("\n");



    const handleInput = (e: any) => {
      if (e.target.value === "") return;
      const newValue = parseFloat(e.target.value);
      if (isNaN(newValue) || newValue <= 0) {
        errorAnimation.start(errorAnimationKeyframes);
        return ((e.target as HTMLInputElement).value = "");
      } else if (props.limit && items.length >= props.limit) {
        itemErrorAnimation.start(itemErrorAnimationKeyframes);
        return ((e.target as HTMLInputElement).value = "");
      }
      if (promotion) {
        updateItems([{ ids: [0], price: newValue }]);
        props.people[0].setItems([{ id: 0, price: newValue }]);
      } else addItem(newValue);
      e.target.value = "";
      props.refocus(props.passedKey);
    };

    return (
      <div id="item-entry" className="p-2 grid grid-cols-7 gap-x-2 border-b">
        <p
          onClick={props.handleNameClick}
          className={"self-center w-1/4 col-span-2" + " " + props.className}
        >
          {name}
        </p>
        <motion.input
          ref={ref}
          title={name}
          key={props.passedKey}
          animate={errorAnimation}
          transition={{ duration: 0.5 }}
          className="border self-center rounded"
          onKeyDown={(e: any) => e.keyCode === 13 && handleInput(e)}
          onBlur={handleInput}
          type="number"
          inputMode="decimal"
        ></motion.input>
        <ItemsDisplay
          items={items}
          removeItem={removeItem}
          type={promotion ? DisplayType.Percent : DisplayType.Price}
          itemErrorAnimation={itemErrorAnimation}
        />
        {props.children ? (
          props.children
        ) : (
          <TotalDisplay people={props.people} items={items} />
        )}
      </div>
    );
  }
);

export default Row;
