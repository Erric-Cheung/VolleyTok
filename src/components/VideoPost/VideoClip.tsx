const VideoClip = () => {
  return (
    <div className="aspect-[0.54717/1]">
      <video controls autoPlay muted>
        <source src="/clip1.mp4" type="video/mp4"></source>
      </video>
    </div>
  );
};

export default VideoClip;
