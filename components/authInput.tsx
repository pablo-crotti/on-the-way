import { ChangeEvent, useState, useRef, useEffect } from 'react'

interface InputProps {
    type: 'text' | 'number' | 'email' | 'password'
    name: string
    placeholder: string
    error: boolean
    icon: string
    autocomplete?: string
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export default function AuthInput(props: InputProps) {
    const [height, setHeight] = useState(0)
    const ref = useRef<HTMLElement>(null)
    const circle = useRef<HTMLElement>(null)

    const handleOnFocus = () => {
        if (!circle.current) return
        if (!ref.current) return
        circle.current.style.transform = `translateX(${ref.current.clientWidth - height}px)`;
        ref.current.style.paddingLeft = "1rem";
        ref.current.style.paddingRight = `${height * 1.2}px`;
    }

    const handleOnBlur = () => {
        if (!circle.current) return
        if (!ref.current) return
        circle.current.style.transform = "translateX(0)";
        ref.current.style.paddingLeft = `${height * 1.2}px`
        ref.current.style.paddingRight = "1rem"
    }

    useEffect(() => {
        if (!ref.current) return
        setHeight(ref.current.clientHeight)
        ref.current.style.paddingLeft = `${height * 1.2}px`
        if (circle.current) {
            circle.current.style.height = `${height}px`
        }
    })
    return (
        <div className="w-3/4 static">
            <span className="transition-all ease-in-out duration-300 flex items-center justify-center bg-white rounded-full aspect-square absolute material-symbols-rounded text-gray" ref={circle as React.RefObject<HTMLSpanElement>}>{props.icon}</span>
            <input
                className="box-border bg-gray-2 w-full rounded-full py-4 text-white focus:outline-none focus:border-yellow focus:ring-1 focus:ring-yellow focus:bg-transparent focus:placeholder-transparent caret-yellow"
                type={props.type}
                name={props.name}
                placeholder={props.placeholder}
                autoComplete={props.autocomplete}
                onChange={props.onChange}
                ref={ref as React.RefObject<HTMLInputElement>}
                onFocus={handleOnFocus}
                onBlur={handleOnBlur}
            />
        </div>
    )
}