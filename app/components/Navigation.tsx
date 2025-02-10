export default function Navigation() {
    const handleRedirect = () => {
        window.location.href = "http://localhost:3000/signin"
    }

    return (
        <div className="flex justify-between items-center p-2 bg-[#f86c71] rounded-md">
            <div className="flex items-center ml-[10%]">
                <h1 className="text-2xl font-semibold text-[#ffffff] mr-1">Boring</h1>
                <h1 className="text-2xl font-semibold">Cloud</h1>
            </div>

            <div className="flex p-2 items-center mr-[10%]">
                <button
                    onClick={handleRedirect}
                    className="text-xl font-semibold
                bg-[#fecbca] p-2 px-4 rounded-md"
                >Get Started</button>
            </div>
        </div>
    )
}
