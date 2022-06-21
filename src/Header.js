import HeaderItem from './HeaderItem';
import { MenuIcon } from "@heroicons/react/outline";
import { XIcon } from "@heroicons/react/outline";

function Header(props) {
  const headerItemsReact = [];
  const headerItems = [
    {heading: "About"},
    {heading: "FAQ"},
    {heading: "Log In"}
  ]
  const pageTitleContent = {"heading": "Flight Log"};
  const width = window.innerWidth;

  const pageTitle = <HeaderItem classProps="text-opacity-100" item={pageTitleContent}/>;
  var counter = 0
  
  headerItems.forEach(element => {
    headerItemsReact.push(<HeaderItem classProps="text-opacity-70 hover:text-opacity-100" click={() => console.log("clicked")} item={element} key={counter+=1} />)
  });

  return (
    <div className="h-16 flex justify-between w-full md:p-8 px-4 py-4 text-2xl font-medium items-center absolute z-10">
      {pageTitle}
      <div className="flex flex-row w-auto h-full gap-4 text-xl font-light items-center">
        {
            width < 640 ? 
                (props.menuState ? 
                    <XIcon className="h-full flex-shrink stroke-1" onClick={() => console.log("menu clicked")}/> : 
                    <MenuIcon className="h-full flex-shrink stroke-1" onClick={() => console.log("menu clicked")}/>
                ) : 
            headerItemsReact}
      </div>
    </div>
  );
}

export default Header;
