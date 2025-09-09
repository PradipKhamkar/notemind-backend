
interface INewNotePayload {
  type: TSource;
  sourceData: {
    link?: string;
    fileId?: string;
    originalPath?: string;
    uploadId?: string
  }
};

interface INoteContent {
  summary: string;
  actionPoints: string[];
  keyTopics: {
    title: string;
    description: string
  }[]
}
interface INote {
  _id: string;
  title: string;
  folder?: string;
  transcript: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  source: {
    type: string;
    link?: string;
    text?: string;
  };
  content: INoteContent;
  language: string;
  metaData: object;
}

type TSource = "youtube" | "web" | "pdf" | "audio" | 'video'

export { TSource, INewNotePayload, INote }