export default function Button(props: {
  text: string;
  handleClick: () => void;
  icon?: string;
}) {
  return (
    <button
      className=" bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold text-sm my-2 ml-2 py-2 px-2 rounded inline-flex items-center transition-colors"
      type="button"
      onClick={props.handleClick}
    >
      {props.icon && (
        <img
          alt={`${props.icon} icon`}
          src={props.icon}
          className="w-5 mr-1"
        ></img>
      )}
      {props.text}
    </button>
  );
}
