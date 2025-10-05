import FolderModel from "../models/folder.model"
import { IFolder } from "../types/folder.type";
import { INote } from "../types/note.type";


const create = async (userId: string, name: string, icon?: string) => {
  try {
    const newFolder = await FolderModel.create({ name, icon, createdBy: userId });
    return {
      name: newFolder.name,
      icon: newFolder.icon,
      _id: newFolder._id,
      createdAt: newFolder.createdBy,
      updatedAt: newFolder.updatedAt
    }
  } catch (error) {
    console.log('Error In Create Folder::', error)
    throw error
  }
}

const remove = async (folderId: string, userId: string) => {
  try {
    const isFolder = await FolderModel.findOneAndDelete({ _id: folderId, createdBy: userId });
    return
  } catch (error) {
    throw error
  }
}


const update = async (folderId: string, payload: IFolder, userId: string) => {
  try {
    // @ts-ignore
    delete payload["_id"]
    const updatedFolder = await FolderModel.findOneAndUpdate({ _id: folderId, createdBy: userId }, payload, { returnDocument: "after" });
    if (!updatedFolder) throw new Error('Folder Not Found!')
    return updatedFolder
  } catch (error) {
    throw error
  }
}

const updateSequence = async (folders: IFolder[], userId: string) => {
  try {
    const bulkOps = folders.map(f => ({
      updateOne: {
        filter: { _id: f._id,createdBy:userId },
        update: { $set: { order: f.order } },
      },
    }));
    await FolderModel.bulkWrite(bulkOps);
    return { message: "sequences update successfully!" }
  } catch (error) {
    throw error
  }
}

export default { create, remove, update, updateSequence }