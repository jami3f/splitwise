import { useEffect } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";

export default function Tooltip(props: { children: JSX.Element }) {
  useEffect(() => {
    for (const child in (props.children as unknown as HTMLElement).innerHTML) {
      console.log(child);
    }
  }, []);
  return <div className="w-20 h-10 border-2 border-black" />;
}
