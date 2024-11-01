import { IUser } from "@/types/user"
import mongoose, { models, Schema, Types } from "mongoose"

export interface ICommentBase {
    user: IUser
    text: string
}

export interface IComment extends ICommentBase, Document {
    _id: Types.ObjectId
    createdAt: Date
    updatedAt: Date
}

const CommentSchema = new Schema<IComment>(
    {
        user: {
            userId: {
                type: String,
                required: true
            },
            firstName: {
                type: String,
                required: true
            },
            lastName: {
                type: String
            },
            userImage: {
                type: String,
                required: true
            }
        },
        text: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
)

export const Comment = models.Comment || mongoose.model<IComment>("Comment", CommentSchema)