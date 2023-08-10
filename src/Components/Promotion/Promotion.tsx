import { ForwardedRef, forwardRef } from "preact/compat";
import { useState, StateUpdater } from "preact/hooks";
import { RefObject } from "preact";
import { InputField } from "../Common";

const Promotion = forwardRef(
  (
    props: {
      passedKey: number;
      promotion: number | undefined;
      setPromotion: StateUpdater<number | undefined>;
      addToRefObject: (ref: HTMLInputElement) => void;
      refocus: (key: string) => void;
      className?: string;
    },
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const name = "Promotion";
    const handleInput = (e: any) => {
      props.setPromotion(() => parseFloat(e.target.value));
      console.log(props.promotion);
      props.refocus(name);
    };
    return (
      <div className="grid grid-cols-2 justify-items-center p-2">
        <p className={"text-green-700" + " " + props.className}>
          Promotion (%)
        </p>
        {props.promotion !== undefined ? (
          <div>
            {props.promotion == 0 ? "No Promotion" : props.promotion + "%"}
          </div>
        ) : (
          <InputField
            name={name}
            ref={ref as RefObject<HTMLInputElement>}
            handleInput={handleInput}
            addToRefObject={props.addToRefObject}
            passedKey={props.passedKey}
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

export default Promotion;
//   <Row
//             names={["Promotion (%)"]}
//             setPeople={setPeople}
//             passedKey={keyCount++}
//             className="text-green-700"
//             people={[promotion, maxPromotion, ...Object.values(people)]}
//             handleNameClick={() => {}}
//             limit={1}
//             ref={(el: HTMLInputElement | null) => (inputRefs.current[0] = el)}
//             refocus={refocus}
//             usePercentage
//           >
//             <PromotionTotal
//               promotion={promotion.items[0]?.price}
//               maxPromotion={maxPromotion.items[0]?.price}
//               people={[...Object.values(people)]}
//             />
//           </Row>
