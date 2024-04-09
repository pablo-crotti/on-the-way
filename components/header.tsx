"use client";
import Link from "next/link";

export default function Header(props: { title: string, leftButton: { icon: string, link: string }, rightButton: { icon: string, link: string } }) {
    let displayLeftButton: boolean = false;
    let displayRightButton: boolean = false;
    props.leftButton.icon && props.leftButton.link ? displayLeftButton = true : displayLeftButton = false;
    props.rightButton.icon && props.rightButton.link ? displayRightButton = true : displayRightButton = false;

    return (
        <header className="bg-gray p-5 w-full border-t-4 border-yellow flex flex-row shadow-lg shadow-black/50">
            <Link href={props.leftButton.link} className={"text-left align-middle text-font-secondary " + (!displayLeftButton ? "pointer-events-none hidden" : "basis-[20%]")}><span className="material-symbols-rounded h-full align-middle">{props.leftButton.icon}</span></Link>
            <h1 className={"text-xl font-bold text-center align-middle " + (!displayLeftButton && !displayRightButton ? "w-full" : "basis-[60%]")}>{props.title}</h1>
            <Link href={props.rightButton.link} className={"text-right align-middle text-font-secondary " + (!displayRightButton ? "pointer-events-none hidden" : "basis-[20%]")}><span className="material-symbols-rounded h-full align-middle">{props.rightButton.icon}</span></Link>
        </header>
    )
}