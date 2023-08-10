import { ForwardedRef, forwardRef } from "preact/compat";
import { useState, StateUpdater } from "preact/hooks";
import { JSX, RefObject } from "preact";
import { InputField } from "../Common";

const Modifier = forwardRef(
  (
    props: {
      name: string;
      modifier: number | undefined;
      setModifier: StateUpdater<number | undefined>;
      addToRefObject: (ref: HTMLInputElement) => void;
      refocus: (key: string) => void;
      children: string;
      colour: string;
      className?: string;
    },
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const handleInput = (e: any) => {
      props.setModifier(() => parseFloat(e.target.value));
      console.log(props.modifier);
      props.refocus(props.name);
    };
    return (
      <div className="grid grid-cols-2 justify-items-center p-2">
        <p className={props.colour + " " + props.className}>{props.name}</p>
        {props.modifier !== undefined ? (
          <div>{props.children}</div>
        ) : (
          <InputField
            name={props.name}
            ref={ref as RefObject<HTMLInputElement>}
            handleInput={handleInput}
            addToRefObject={props.addToRefObject}
            errorCondition={(e: any) => {
              const val = parseFloat(e.target.value);
              return isNaN(val) || val < 0;
            }}
            className="w-20"
            numeric
          />
        )}
      </div>
    );
  }
);

export default Modifier;
