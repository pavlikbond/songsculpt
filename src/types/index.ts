export type Settings = {
  includeTitleSlide: boolean;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  fontSize: string;
  includeSectionTitles: boolean;
  textShadow: boolean;
  linesPerSlide: string;
};

export type Lyrics = {
  sectionTitle?: string | null;
  lyrics: string;
}[];

export type GeniusArtist = {
  api_path: string;
  header_image_url: string;
  id: number;
  image_url: string;
  is_meme_verified: boolean;
  is_verified: boolean;
  name: string;
  url: string;
};

export type GeniusStats = {
  unreviewed_annotations: number;
  concurrents: number;
  hot: boolean;
  pageviews: number;
};

export type GeniusSearchHit = {
  highlights: any[];
  index: string;
  type: string;
  result: {
    annotation_count: number;
    api_path: string;
    artist_names: string;
    full_title: string;
    header_image_thumbnail_url: string;
    header_image_url: string;
    id: number;
    lyrics_owner_id: number;
    lyrics_state: string;
    path: string;
    primary_artist_names: string;
    pyongs_count: number | null;
    relationships_index_url: string;
    release_date_components?: any;
    release_date_for_display: string;
    release_date_with_abbreviated_month_for_display: string;
    song_art_image_thumbnail_url: string;
    song_art_image_url: string;
    stats?: GeniusStats;
    title: string;
    title_with_featured: string;
    url: string;
    featured_artists: any[];
    primary_artist?: GeniusArtist;
    primary_artists?: GeniusArtist[];
  };
};
