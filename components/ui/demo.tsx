import LoaderOne from "./loader-one";

export function LoaderDemo() {
    return (
        <div className="p-10 flex flex-col items-center gap-4 bg-black min-h-screen">
            <h1 className="text-white font-bold">Loader Demo</h1>
            <LoaderOne />
        </div>
    );
}
