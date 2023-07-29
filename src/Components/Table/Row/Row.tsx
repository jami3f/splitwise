import { MutableRef, useEffect, useState } from "preact/hooks";
import { JSX, RefObject } from "preact";
import { ForwardedRef, forwardRef } from "preact/compat";
import { Person } from "../../../Classes";
import {
  AnimationControls,
  ControlsAnimationDefinition,
  motion,
  useAnimationControls,
} from "framer-motion";

import { InputField } from "../../Common";
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

    const errorAnimation = useAnimationControls();
    const errorAnimationKeyframes: ControlsAnimationDefinition = {
      x: [-5, 5, -5, 5, -5, 0],
      outlineColor: [
        "rgb(255, 0, 0)",
        "rgb(255, 0, 0)",
        "rgb(255, 0, 0)",
        "rgb(255, 0, 0)",
        "rgb(255, 0, 0)",
        "rgb(0, 0, 0)",
      ],
    };
    const itemErrorAnimation = useAnimationControls();
    const itemErrorAnimationKeyframes: ControlsAnimationDefinition = {
      x: [-2, 2, -2, 2, -2, 0],
      color: [
        "rgb(255, 0, 0)",
        "rgb(255, 0, 0)",
        "rgb(255, 0, 0)",
        "rgb(255, 0, 0)",
        "rgb(255, 0, 0)",
        "rgb(0, 0, 0)",
      ],
    };

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
          className={"self-center col-span-2" + " " + props.className}
        >
          {name}
        </p>
        <InputField
          name={name}
          ref={ref as RefObject<HTMLInputElement>}
          handleInput={handleInput}
          passedKey={props.passedKey}
          errorCondition={(e: any) => {
            const val = parseFloat(e.target.value);
            return isNaN(val) || val <= 0;
          }}
          secondaryErrorCondition={() =>
            props.limit !== undefined && items.length >= props.limit
          }
          numeric
        />
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
