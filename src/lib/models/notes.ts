import mongoose, { Schema, Document } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";


export interface INote extends Document {
  title: string;
  description: string;

  owner: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}


const NoteSchema = new Schema<INote>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);


NoteSchema.plugin(mongoosePaginate);


export type NoteModel = mongoose.PaginateModel<INote>;


export const Note: NoteModel =
  (mongoose.models.Note as NoteModel) ||
  mongoose.model<INote, NoteModel>("Note", NoteSchema);
