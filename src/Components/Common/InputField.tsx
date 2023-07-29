import {
  ControlsAnimationDefinition,
  None,
  motion,
  useAnimationControls,
} from "framer-motion";
import { RefObject } from "preact";
import { forwardRef, ForwardedRef } from "preact/compat";
import { StateUpdater } from "preact/hooks";

const ENTER_KEYCODE = 13;

const InputField = forwardRef(
  (
    props: {
      name: string;
      passedKey: number;
      handleInput: (e: string) => void;
      handleEmpty?: () => void;
      numeric?: boolean;
      errorCondition?: (e: any) => boolean;
      secondaryErrorCondition?: (e: any) => boolean;
    },
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const parseInput = (
      e: any,
      handleInput: (e: string) => void,
      handleEmpty?: () => void,
      errorCondition?: (e: any) => boolean,
      secondaryErrorCondition?: (e: any) => boolean
    ) => {
      if (e.target.value === "") return handleEmpty?.();
      if (errorCondition && errorCondition(e)) {
        errorAnimation.start(errorAnimationKeyframes);
        return ((e.target as HTMLInputElement).value = "");
      }
      if (secondaryErrorCondition && secondaryErrorCondition(e)) {
        secondaryErrorAnimation.start(secondaryErrorAnimationKeyframes);
        return ((e.target as HTMLInputElement).value = "");
      }
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

    return (
      <motion.input
        ref={ref}
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
            props.handleEmpty,
            props.errorCondition,
            props.secondaryErrorCondition
          )
        }
        onBlur={(e: any) =>
          parseInput(
            e,
            props.handleInput,
            props.handleEmpty,
            props.errorCondition,
            props.secondaryErrorCondition
          )
        }
        {...(props.numeric
          ? { type: "number", inputMode: "decimal" }
          : { type: "text" })}
      ></motion.input>
    );
  }
);

export default InputField;
