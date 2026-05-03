import mongoose, { Document, Schema } from "mongoose";

export interface IView extends Document {
  blogId: number;
  count: number;
}

const viewSchema: Schema = new Schema({
  blogId: { type: Number, required: true, unique: true },
  count: { type: Number, default: 0 },
});

export const View = mongoose.model<IView>("views", viewSchema);
