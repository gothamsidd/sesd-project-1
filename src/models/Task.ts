import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITask extends Document {
  title: string;
  completed: boolean;
  userId: Types.ObjectId;
  subjectId: Types.ObjectId;
}

const schema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    completed: {
      type: Boolean,
      default: false
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true
    }
  },
  { timestamps: true }
);

export const Task = mongoose.model<ITask>("Task", schema);
