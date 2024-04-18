export default function Loading() {
    return (
        <div className="w-full min-h-screen flex justify-center items-center">
            <img
                className="w-64 h-64"
                src="/loader/loader.gif"
                alt="Chargement..."
            />
        </div>
    );
}