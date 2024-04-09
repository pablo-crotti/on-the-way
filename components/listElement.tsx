import Link from "next/link";

export function ListElement(props: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-4 w-full h-20	bg-gray rounded-2xl">
      <span className="material-symbols-rounded flex justify-center items-center w-1/6 h-full text-4xl bg-gray-2 rounded-2xl">
        {props.icon}
      </span>
      <div className="flex w-9/12 items-center justify-between">
        {props.text}
        <span className="material-symbols-rounded text-yellow ">edit</span>
      </div>
    </div>
  );
}

export function LinkElement(props: {
  href: string;
  icon: string;
  text: string;
}) {
  return (
    <Link
      href={props.href}
      className="flex items-center gap-4 w-full h-20 bg-gray rounded-2xl"
    >
      <span className="material-symbols-rounded flex justify-center items-center w-1/6 h-full text-4xl bg-gray-2 rounded-2xl">
        {props.icon}
      </span>
      <div className="flex w-9/12 items-center justify-between">
        {props.text}
        <span className="material-symbols-rounded text-yellow">arrow_forward_ios</span>
      </div>
    </Link>
  );
}
