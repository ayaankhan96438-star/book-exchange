export const NON_FICTION_GENRES = [
  "Self Help",
  "Finance",
  "Business",
  "Biography",
  "History",
  "Religion and Spirituality",
  "Science",
  "Health",
  "Education and Study",
  "Politics",
  "Other Non-fiction",
] as const;

export type NonFictionGenre = (typeof NON_FICTION_GENRES)[number];
