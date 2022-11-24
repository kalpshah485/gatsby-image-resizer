import * as React from "react";

const ImageResize = () => {
  const canvasRef = React.useRef();
  const imageRef = React.useRef();
  const newImageRef = React.useRef();
  const anchorRef = React.useRef();
  const [width, setWidth] = React.useState();
  const [height, setHeight] = React.useState();
  const [aspectRatio, setAspectRatio] = React.useState();
  const widthIRef = React.useRef();
  const heightIRef = React.useRef();
  const checkboxIRef = React.useRef();
  const [resizeDone, setResizeDone] = React.useState(false);

  React.useEffect(() => {
    imageRef.current.onload = () => {
      const naturalWidth = imageRef.current.naturalWidth
      const naturalHeight = imageRef.current.naturalHeight
      heightIRef.current.max = naturalHeight;
      widthIRef.current.max = naturalWidth;
      const maxDivisor = gcd(naturalWidth, naturalHeight);
      const aspectWidth = naturalWidth / maxDivisor;
      const aspectHeight = naturalHeight / maxDivisor;
      setAspectRatio({
        w: aspectWidth, h: aspectHeight
      })
      console.log(naturalWidth, naturalHeight);
      console.log(aspectWidth + ":" + aspectHeight);
    }
    console.dir(imageRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function gcd(a, b) {
    return (b === 0) ? a : gcd(b, a % b);
  }

  function handleResize(e) {
    e.preventDefault();
    setResizeDone(false);
    const ctx = canvasRef.current.getContext("2d");
    canvasRef.current.width = widthIRef.current.value;
    canvasRef.current.height = heightIRef.current.value;
    setHeight(heightIRef.current.value);
    setWidth(widthIRef.current.value);
    // console.dir(canvasRef.current)
    // console.dir(ctx);
    // console.log(ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(imageRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    newImageRef.current.src = canvasRef.current.toDataURL('image/webp');
    anchorRef.current.href = newImageRef.current.src;
    anchorRef.current.download = newImageRef.current.alt;
    setResizeDone(true);
  }
  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        imageRef.current.src = fileReader.result;
        widthIRef.current.disabled = false;
        heightIRef.current.disabled = false;
        checkboxIRef.current.disabled = false;
      }
      fileReader.readAsDataURL(file);
    }
  }

  function handleImageHeightWidth(e) {
    if (!checkboxIRef.current.checked) return;
    if (e.target === widthIRef.current) {
      heightIRef.current.value = Math.round(widthIRef.current.value / aspectRatio.w * aspectRatio.h);
    } else {
      widthIRef.current.value = Math.round(heightIRef.current.value / aspectRatio.h * aspectRatio.w);
    }
  }

  return (
    <>
      <h1>Image Resize Page</h1>
      <form onSubmit={handleResize}>
        <h2>Please select image from your file system</h2>
        <input onChange={handleImageChange} type="file" required />
        <br />
        <input ref={checkboxIRef} id="aspectCheckbox" type="checkbox" disabled defaultChecked />
        <label htmlFor="aspectCheckbox">Maintain Aspect Ratio</label>
        <br />
        <input ref={widthIRef} onChange={handleImageHeightWidth} type="number" placeholder="width" min={1} max={2000} disabled required />
        <br />
        <input ref={heightIRef} onChange={handleImageHeightWidth} type="number" placeholder="height" min={1} max={2000} disabled required />
        <br />
        <button>Resize</button>
      </form>
      <canvas ref={canvasRef} style={{ display: "none" }}>

      </canvas>
      <div style={{ display: resizeDone ? "block" : "none" }}>
        <h2>Original Image</h2>
        <img ref={imageRef} alt="background" />
        <h2>Resized Image: {width}x{height}</h2>
        <img ref={newImageRef} alt="resized" style={{ margin: 0 }} />
        <br />
        <a ref={anchorRef} href="/">Download</a>
      </div>
    </>
  )
}

export default ImageResize;