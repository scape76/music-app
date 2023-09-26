import { createRef } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import { Button } from "./ui/button";
import { Icons } from "./Icons";

export function ImageCropper({ image }: { image: string }) {
  const cropperRef = createRef<ReactCropperElement>();

  return (
    <div className="mt-8 grid place-items-center space-y-5">
      <Cropper
        ref={cropperRef}
        className="h-[450px] w-[450px] object-cover"
        zoomTo={0.5}
        initialAspectRatio={1 / 1}
        preview=".img-preview"
        src={image}
        viewMode={1}
        minCropBoxHeight={10}
        minCropBoxWidth={10}
        background={false}
        responsive={true}
        autoCropArea={1}
        checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
        guides={true}
      />
      <div className="flex items-center justify-center space-x-2">
        <Button
          aria-label="Crop image"
          type="button"
          size="sm"
          className="h-8"
          onClick={() => {
            //   onCrop()
            //   setIsOpen(false)
          }}
        >
          <Icons.crop className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
          Crop Image
        </Button>
        <Button
          aria-label="Reset crop"
          type="button"
          variant="outline"
          size="sm"
          className="h-8"
          // onClick={() => {
          //   cropperRef.current?.cropper.reset()
          //   setCropData(null)
          // }}
        >
          <Icons.reset className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
          Reset Crop
        </Button>
      </div>
    </div>
  );
}
