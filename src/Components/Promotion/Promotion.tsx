import { ForwardedRef, forwardRef } from "preact/compat";
import { useState, StateUpdater } from "preact/hooks";
import { RefObject } from "preact";
import { InputField } from "../Common";

const Promotion = forwardRef(
  (
    props: {
      className: string;
      passedKey: number;
      promotion: number | undefined;
      setPromotion: StateUpdater<number|undefined>;
    },
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const handleInput = (e: any) => {
      props.setPromotion(parseFloat(e.target.value));
    };
    return (
      <div id="item-entry" className="p-2 grid grid-cols-7 gap-x-2 border-b">
        <p className={"self-center col-span-2" + " " + props.className}>
          Promotion (%)
        </p>
        {props.promotion ? (
          <div>{props.promotion == 0 ? "No promotion" : props.promotion}</div>
        ) : (
          <InputField
            name="Promotion"
            ref={ref as RefObject<HTMLInputElement>}
            handleInput={handleInput}
            passedKey={props.passedKey}
            errorCondition={(e: any) => {
              const val = parseFloat(e.target.value);
              return isNaN(val) || val <= 0;
            }}
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
