export default function PrimaryButton({ children, type }: { children: React.ReactNode, type?: "button" | "submit" | "reset" }) {
    return (
        <button
        type={type || "button"}
        className="text-white bg-primary hover:bg-primarydark focus:outline-none focus:ring-0 font-medium rounded-full text-sm px-7 py-2.5 text-center me-2 mb-2"
        >
        {children}
        </button>
    );
}
