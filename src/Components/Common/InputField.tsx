import {
  ControlsAnimationDefinition,
  None,
  motion,
  useAnimationControls,
} from "framer-motion";
import { RefObject } from "preact";

const ENTER_KEYCODE = 13;

export default function InputField(props: {
  numeric: boolean;
  name: string;
  ref: RefObject<HTMLInputElement>;
  handleInput: (e: string) => void;
  errorCondition?: (e: any) => boolean;
  secondaryErrorCondition?: (e: any) => boolean;
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
      parseInput(
        e,
        props.handleInput,
        props.errorCondition,
        props.secondaryErrorCondition
      )
    }
    onBlur={(e: any) =>
      parseInput(
        e,
        props.handleInput,
        props.errorCondition,
        props.secondaryErrorCondition
      )
    }
    {...(props.numeric && { type: "number", inputMode: "decimal" })}
  ></motion.input>;
}

const parseInput = (
  e: any,
  handleInput: (e: string) => void,
  errorCondition?: (e: any) => boolean,
  secondaryErrorCondition?: (e: any) => boolean
) => {
  if (errorCondition && errorCondition(e)) {
    errorAnimation.start(errorAnimationKeyframes);
    return ((e.target as HTMLInputElement).value = "");
  }
  if (secondaryErrorCondition && secondaryErrorCondition(e)) {
    secondaryErrorAnimation.start(secondaryErrorAnimationKeyframes);
    return ((e.target as HTMLInputElement).value = "");
  }
  // if (e.target.value === "") return;
  // const newValue = parseFloat(e.target.value);
  // if (isNaN(newValue) || newValue <= 0) {
  //   errorAnimation.start(errorAnimationKeyframes);
  //   return ((e.target as HTMLInputElement).value = "");
  // } else if (props.limit && items.length >= props.limit) {
  //   secondaryErrorAnimation.start(secondaryErrorAnimationKeyframes);
  //   return ((e.target as HTMLInputElement).value = "");
  // }
  handleInput(e.target.value);
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
