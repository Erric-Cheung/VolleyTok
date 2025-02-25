interface PostVideoProps {
  videoUrl: string;
}

const PostVideo = ({ videoUrl }: PostVideoProps) => {
  return (
    <div className="relative flex h-full w-full items-center rounded justify-center overflow-hidden">
      <div className="rounded w-full h-full overflow-hidden">
        <video
          className="absolute w-full h-full object-contain bg-black"
          controls
          autoPlay
          muted
        >
          <source src={videoUrl} type="video/mp4"></source>
        </video>
      </div>
    </div>
  );
};

export default PostVideo;
