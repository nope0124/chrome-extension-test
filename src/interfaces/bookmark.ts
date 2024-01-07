export interface GetBookmarksResponse {
  BookmarkLinks: BookmarkLink[];
}

export interface BookmarkLink {
  url: string;
  urlTitle: string;
  faviconUrl: string;
}
