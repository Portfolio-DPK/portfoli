/**
 * Playlist for the "A little music" section. Each track plays through the official YouTube embed,
 * so no audio files are stored on this site. To add a song, add a line with its YouTube video id
 * (the part after `v=` in the video link).
 */
export interface Track {
  id: string;
  title: string;
  artist: string;
  /** YouTube video id */
  yt: string;
}

/** every song starts this many seconds in (set to 0 to play from the very beginning) */
export const START_AT = 10;

export const tracks: Track[] = [
  { id: 'trove', title: 'Trở Về', artist: 'Wxrdie ft. JustaTee', yt: 'KOStDZ_Lbxc' }, // bản audio gốc (3:15), vào beat ngay từ giây đầu
  { id: 'khima', title: 'Khi Mà', artist: 'Ronboogz', yt: '7G4iiOVGiQM' },
  { id: 'haidstnhoc', title: 'Hai Đứa Nhóc', artist: 'Ronboogz', yt: 'XWexgEEBxBQ' },
  { id: 'lanman', title: 'Lan Man', artist: 'Ronboogz', yt: '5TcSXaX98pc' },
  { id: 'nhannhu', title: 'Nhắn Nhủ', artist: 'Ronboogz', yt: 'xZaBBr98iv4' },
  { id: 'giothi', title: 'Giờ Thì', artist: 'Bùi Trường Linh', yt: '69ZDBWoj5YM' },
  { id: 'somnhuvay', title: 'Sớm Như Vậy', artist: 'Bùi Trường Linh', yt: '6hNenqz0ISA' },
  { id: 'taivi', title: 'Tại Vì Em', artist: 'Bùi Trường Linh', yt: '34S6CdddkRw' },
];

export const cover = (yt: string) => `https://i.ytimg.com/vi/${yt}/hqdefault.jpg`;
export const watchUrl = (yt: string) => `https://www.youtube.com/watch?v=${yt}`;


