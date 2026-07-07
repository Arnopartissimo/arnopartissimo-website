interface VideoEmbedProps {
  url: string;
  className?: string;
  title?: string;
}

function defaultTitle(url: string) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    return `Video from ${host}`;
  } catch {
    return 'Embedded video';
  }
}

export function VideoEmbed({ url, className, title }: VideoEmbedProps) {
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
  const isVimeo = url.includes('vimeo.com');

  let embedUrl = url;

  if (isYouTube) {
    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
    embedUrl = `https://www.youtube.com/embed/${videoId}`;
  } else if (isVimeo) {
    const videoId = url.split('/').pop();
    embedUrl = `https://player.vimeo.com/video/${videoId}`;
  }

  if (isYouTube || isVimeo) {
    return (
      <div className={className}>
        <iframe
          src={embedUrl}
          title={title || defaultTitle(url)}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="aspect-video w-full"
        />
      </div>
    );
  }

  return (
    <video controls className={className}>
      <source src={url} />
    </video>
  );
}
