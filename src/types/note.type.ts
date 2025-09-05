
interface INewNotePayload {
  type: TSource;
  sourceData: {
    link?: string;
    fileId?:string;
  }
};

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
  content: string;
  language: string;
}

type TSource = "youtube" | "web" | "pdf" | "audio"

export { TSource, INewNotePayload, INote }