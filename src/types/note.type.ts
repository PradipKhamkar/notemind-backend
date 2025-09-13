
interface INewNotePayload {
  type: TSource;
  sourceData: {
    link?: string;
    fileId?: string;
    originalPath?: string;
    uploadId?: string
  }
};
interface INote {
  _id: string;
  title: string;
  folder?: string;
  transcript: {
    speaker: string,
    transcript: string;
    duration: string;
  }[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  source: {
    type: string;
    link?: string;
    text?: string;
  };
  summary: string;
  keyPoints: string[];
  sections: {
    heading: string;
    content: string
  }[];
  language: string;
  metaData: object;
}

type TSource = "youtube" | "web" | "pdf" | "audio" | 'video'

export { TSource, INewNotePayload, INote }