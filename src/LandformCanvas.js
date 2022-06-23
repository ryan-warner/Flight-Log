import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import earthLandmass from "./assets/earthLandmass.png"

const LandformCanvas = forwardRef((props, ref) => {
    const [testPixel, setTestPixel] = useState(null)

    useEffect(() => {
        const canvas = ref.current;
        const context = canvas.getContext("2d");
        var image = new Image()
        image.src = earthLandmass
        image.onload = function() {
            //const imageWidth = image.width
            //const imageHeight = image.height
            //console.log(imageHeight)
            context.canvas.width = image.width
            context.canvas.height = image.height
            context.drawImage(image, 0, 0)
            props.onLoad();
            //console.log(image.width)
            //console.log(context.getImageData(1,1,1,2).data)
            //console.log(ref.current.getContext("2d").getImageData(1,1,1,2).data)
        }
    })

    return (
        <canvas ref={ref} ></canvas>
    )
})

export default LandformCanvas