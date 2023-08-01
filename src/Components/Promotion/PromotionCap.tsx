import { forwardRef, ForwardedRef } from "preact/compat";
import { RefObject } from "preact";
import { useState, StateUpdater } from "preact/hooks";
import { InputField } from "../Common";

const PromotionCap = forwardRef(
  (
    props: {
      passedKey: number;
      promotionCap: number | undefined;
      setPromotionCap: StateUpdater<number | undefined>;
      className?: string;
    },
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const handleInput = (e: any) => {
      props.setPromotionCap(() => parseFloat(e.target.value));
      console.log(props.promotionCap);
    };
    return (
      <div className="grid grid-cols-2 justify-items-center p-2">
        <p className={"text-green-500" + " " + props.className}>
          Promotion Cap
        </p>
        {props.promotionCap !== undefined ? (
          <div>
            {props.promotionCap == 0
              ? "No Promotion Cap"
              : "£" + props.promotionCap.toFixed(2)}
          </div>
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

export default PromotionCap;

{
  /* <Row
names={["Promotion Cap"]}
setPeople={setPeople}
passedKey={keyCount++}
className="text-green-500"
people={[maxPromotion]}
limit={1}
handleNameClick={() => {}}
ref={(el: HTMLInputElement | null) => (inputRefs.current[1] = el)}
refocus={refocus}
>
<MaxPromotionTotal
  promotion={promotion.items[0]?.price}
  maxPromotion={maxPromotion.items[0]?.price}
  people={[...Object.values(people)]}
/>
</Row> */
}
