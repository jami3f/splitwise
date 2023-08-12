import { StateUpdater } from "preact/hooks";
import Button from "./Button";

export default function EditPeople(props: {
  setRemoveState: StateUpdater<boolean>;
}) {
  return (
    <Button
      text="Edit People"
      handleClick={() => props.setRemoveState((old) => !old)}
    />
  );
}
