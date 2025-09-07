import FolderModel from "../models/folder.model"


const create = async (userId: string, name: string, icon?: string) => {
  try {
    const newFolder = await FolderModel.create({ name, icon, createdBy: userId });
    return {
      name: newFolder.name,
      icon: newFolder.icon,
      _id: newFolder._id,
      createdAt:newFolder.createdBy,
      updatedAt:newFolder.updatedAt
    }
  } catch (error) {
    throw error
  }
}


export default {create}