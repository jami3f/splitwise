import { ControlsAnimationDefinition, None, motion, useAnimationControls } from "framer-motion";
import { RefObject } from "preact";

const ENTER_KEYCODE = 13;

export default function InputField(props: {
  numeric: boolean;
  name: string;
  ref: RefObject<HTMLInputElement>;
  errorCondition?: boolean;
  secondaryErrorCondition?: boolean;
  handleInput: Function;
  passedKey: number;
}) {
  <motion.input
    ref={props.ref}
    title={props.name}
    key={props.passedKey}
    animate={errorAnimation}
    transition={{ duration: 0.5 }}
    className="border self-center rounded"
    onKeyDown={(e: any) =>
      e.keyCode === ENTER_KEYCODE &&
      parseInput(e, props.errorCondition, props.handleInput)
    }
    onBlur={(e: any) => parseInput(e, props.errorCondition, props.handleInput)}
    {...(props.numeric && { type: "number", inputMode: "decimal" })}
  ></motion.input>;
}

const parseInput = (
  e: any,
  errorCondition: boolean | undefined,
  handleInput: Function
) => {
  if (errorCondition) {
    errorAnimation.start(errorAnimationKeyframes);
    return ((e.target as HTMLInputElement).value = "");
  }
  if (e.target.value === "") return;
  const newValue = parseFloat(e.target.value);
  if (isNaN(newValue) || newValue <= 0) {
    errorAnimation.start(errorAnimationKeyframes);
    return ((e.target as HTMLInputElement).value = "");
  } else if (props.limit && items.length >= props.limit) {
    secondaryErrorAnimation.start(secondaryErrorAnimationKeyframes);
    return ((e.target as HTMLInputElement).value = "");
  }
  handleInput();
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
const secondaryErrorAnimation = useAnimationControls();
const secondaryErrorAnimationKeyframes: ControlsAnimationDefinition = {
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
