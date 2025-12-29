import fs from 'fs';
import path from 'path';

const mediaDirectory = path.join(process.cwd(), 'content', 'media');

// Types for podcasts
export interface PodcastSource {
  name: string;
  url: string;
  platform: string;
  description: string;
}

export interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  audioUrl: string;
  episodeUrl: string;
  originalSource: string;
}

export interface PodcastData {
  source: PodcastSource;
  episodes: PodcastEpisode[];
}

// Types for videos
export interface VideoChannel {
  id: string;
  name: string;
  url: string;
  description: string;
  active: boolean;
}

export interface Video {
  id: string;
  channelId: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  youtubeId: string;
  thumbnailUrl: string;
  tags: string[];
}

export interface VideoData {
  channels: VideoChannel[];
  videos: Video[];
}

// Get all podcast episodes
export function getPodcastData(): PodcastData {
  const filePath = path.join(mediaDirectory, 'podcasts.json');
  
  if (!fs.existsSync(filePath)) {
    return {
      source: {
        name: '',
        url: '',
        platform: '',
        description: '',
      },
      episodes: [],
    };
  }
  
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents) as PodcastData;
}

// Get all podcast episodes sorted by date (newest first)
export function getAllPodcastEpisodes(): PodcastEpisode[] {
  const data = getPodcastData();
  return data.episodes.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

// Get video data
export function getVideoData(): VideoData {
  const filePath = path.join(mediaDirectory, 'videos.json');
  
  if (!fs.existsSync(filePath)) {
    return {
      channels: [],
      videos: [],
    };
  }
  
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents) as VideoData;
}

// Get all videos sorted by date (newest first)
export function getAllVideos(): Video[] {
  const data = getVideoData();
  return data.videos.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

// Get videos by channel
export function getVideosByChannel(channelId: string): Video[] {
  const data = getVideoData();
  return data.videos
    .filter(video => video.channelId === channelId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Get a specific channel
export function getChannel(channelId: string): VideoChannel | undefined {
  const data = getVideoData();
  return data.channels.find(channel => channel.id === channelId);
}

// Get all channels
export function getAllChannels(): VideoChannel[] {
  const data = getVideoData();
  // Sort with active channels first
  return data.channels.sort((a, b) => {
    if (a.active === b.active) return 0;
    return a.active ? -1 : 1;
  });
}

// Helper to format duration
export function formatDuration(duration: string): string {
  return duration;
}

// Get all media items combined and sorted by date
export interface MediaItem {
  type: 'podcast' | 'video';
  id: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  url: string;
  source: string;
  channelName?: string;
}

export function getAllMedia(): MediaItem[] {
  const podcasts = getAllPodcastEpisodes();
  const videos = getAllVideos();
  const videoData = getVideoData();
  
  const podcastItems: MediaItem[] = podcasts.map(ep => ({
    type: 'podcast' as const,
    id: ep.id,
    title: ep.title,
    description: ep.description,
    date: ep.date,
    duration: ep.duration,
    url: ep.episodeUrl,
    source: 'The Interop Podcast (Substack)',
  }));
  
  const videoItems: MediaItem[] = videos.map(vid => {
    const channel = videoData.channels.find(c => c.id === vid.channelId);
    return {
      type: 'video' as const,
      id: vid.id,
      title: vid.title,
      description: vid.description,
      date: vid.date,
      duration: vid.duration,
      url: vid.youtubeId 
        ? `https://www.youtube.com/watch?v=${vid.youtubeId}` 
        : channel?.url || '',
      source: channel?.name || 'YouTube',
      channelName: channel?.name,
    };
  });
  
  return [...podcastItems, ...videoItems].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

