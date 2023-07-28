import { motion, useAnimationControls } from "framer-motion";
import { RefObject } from "preact";

export default function InputField(props: {
  numeric: boolean;
  name: string;
  ref: RefObject<HTMLInputElement>;
  handleInput: Function;
  passedKey: number;
}) {
  <motion.input
    ref={ref}
    title={name}
    key={props.passedKey}
    animate={errorAnimation}
    transition={{ duration: 0.5 }}
    className="border self-center rounded"
    onKeyDown={(e: any) => e.keyCode === 13 && parseInput(e)}
    onBlur={parseInput}
    {...(props.numeric && { type: "number", inputMode: "decimal" })}
  ></motion.input>;
}

const parseInput = (e: any) => {
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
