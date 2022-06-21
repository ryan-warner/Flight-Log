function HeaderItem(props) {
    return (
    <div>
        <button className={props.classProps + " text-white text-md font-light"} onClick={props.click}><p>{props.item.heading}</p></button>
    </div>
    );
}

export default HeaderItem;