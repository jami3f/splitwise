import {
  ControlsAnimationDefinition,
  None,
  motion,
  useAnimationControls,
} from "framer-motion";
import { RefObject } from "preact";
import { forwardRef, ForwardedRef } from "preact/compat";
import { StateUpdater, useEffect, useRef } from "preact/hooks";
import { inputErrorKeyframes } from "../../assets/Keyframes";

const ENTER_KEYCODE = 13;

const InputField = forwardRef(
  (
    props: {
      name: string;
      handleInput: (e: any) => void;
      addToRefObject?: (ref: HTMLInputElement) => void;
      handleEmpty?: () => void;
      numeric?: boolean;
      errorCondition?: (e: any) => boolean;
      className?: string;
    },
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const parseInput = (
      e: any,
      handleInput: (e: any) => void,
      handleEmpty?: () => void,
      errorCondition?: (e: any) => boolean
    ) => {
      if (e.target.value === "") return handleEmpty?.();
      if (errorCondition && errorCondition(e)) {
        inputErrorAnimation.start(inputErrorKeyframes);
        return ((e.target as HTMLInputElement).value = "");
      }
      handleInput(e);
    };

    const inputErrorAnimation = useAnimationControls();

    const localRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      props.addToRefObject?.(localRef.current as HTMLInputElement);
    }, []);

    return (
      <motion.input
        ref={localRef}
        title={props.name}
        animate={inputErrorAnimation}
        transition={{ duration: 0.5 }}
        className={`border self-center rounded ${props.className}`}
        onKeyDown={(e: any) =>
          e.keyCode === ENTER_KEYCODE &&
          parseInput(
            e,
            props.handleInput,
            props.handleEmpty,
            props.errorCondition
          )
        }
        onBlur={(e: any) =>
          parseInput(
            e,
            props.handleInput,
            props.handleEmpty,
            props.errorCondition
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
