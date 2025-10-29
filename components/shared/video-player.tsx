import { generateImageURL } from "@/utils";

export default function VideoPlayer({ videoKey }: { videoKey: string }) {
  const url = generateImageURL(videoKey);
  return (
    <div>
      <video controls>
        <source src={url} type="video/mp4" />
      </video>
    </div>
  );
}
