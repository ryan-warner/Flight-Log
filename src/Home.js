import Globe from "./Globe"

function Home() {

    return (
        <div className="w-full h-full relative overflow-hidden">
            <div className="w-full h-full absolute inset-y-0 left-[25%]">
                <Globe />
            </div>
        </div>
    )
}

export default Home;