import { ForwardedRef, forwardRef } from "preact/compat";
import { useState, StateUpdater } from "preact/hooks";
import { RefObject } from "preact";
import { InputField } from "../Common";

const Promotion = forwardRef(
  (
    props: {
      passedKey: number;
      promotion: number | undefined;
      setPromotion: StateUpdater<number|undefined>;
      className?: string;
    },
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const handleInput = (e: any) => {
      props.setPromotion(() => parseFloat(e.target.value));
      console.log(props.promotion)
    };
    return (
      <div className="grid grid-cols-2 justify-items-center p-2">
        <p className={"text-green-700" +" " + props.className}>
          Promotion (%)
        </p>
        {props.promotion !== undefined ? (
          <div>{props.promotion == 0 ? "No Promotion" : props.promotion + "%"}</div>
        ) : (
          <InputField
            name="Promotion"
            ref={ref as RefObject<HTMLInputElement>}
            handleInput={handleInput}
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
