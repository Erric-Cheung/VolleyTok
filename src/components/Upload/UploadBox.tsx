const UploadBox = () => {
  return (
    <div className="flex flex-col border caret-transparent w-full p-8">
      <div className="flex flex-col text-center">
        <div className="font-bold">Select a video to upload</div>
        <div>mp4s</div>
      </div>
      <input className="hidden" type="file" id="file"></input>
      <label
        className="flex border align-center justify-center p-8 cursor-pointer w-full"
        htmlFor="file"
      >
        Select a file
      </label>
    </div>
  );
};

export default UploadBox;
