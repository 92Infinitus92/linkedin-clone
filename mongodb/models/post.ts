import { IUser } from "@/types/user"
import { Comment, IComment, ICommentBase } from "./comment"
import { model, Model, models, Schema, Types } from "mongoose"

export interface IPostBase {
    user: IUser
    text: string
    imageUrl?: string
    comments?: IComment[]
    likes?: string[]
}

export interface IPost extends IPostBase, Document {
    createdAt: Date
    updatedAt: Date
    _id: Types.ObjectId
}

interface IPostMethods {
    likePost: (userId: string) => Promise<void>
    unlikePost: (userId: string) => Promise<void>
    commentOnPost: (comment: ICommentBase) => Promise<void>
    getAllComments(): Promise<IComment[]>
    removePost: () => Promise<void>
}

interface IPostStatics {
    getAllPosts: () => Promise<IPostDocument[]> 
}

export interface IPostDocument extends IPost, IPostMethods {} //singular instance of a post

interface IPostModel extends IPostStatics, Model<IPostDocument> {} // all posts

const PostSchema = new Schema<IPostDocument>(
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
        imageUrl: {
            type: String
        },
        comments: [
            {
                type: [Schema.Types.ObjectId],
                ref: "Comment",
                default: []
            }
        ],
        likes: [
            {
                type: [String]
            }
        ]
    },
    {
        timestamps: true
    }
)

PostSchema.methods.likePost = async function (userId: string) {
    try {
        await this.updateOne({
            $addToSet: {
                likes: userId
            }
        })
    } catch (error) {
        throw new Error("Error liking post")
    }
}

PostSchema.methods.unlikePost = async function (userId: string) {
    try {
        await this.updateOne({
            $pull: {
                likes: userId
            }
        })
    } catch (error) {
        throw new Error("Error unliking post")
    }
}

PostSchema.methods.commentOnPost = async function (commentToAdd: ICommentBase) {
    try {
       const comment = await Comment.create(commentToAdd)
       this.comments.push(comment._id)
       await this.save()
    } catch (error) {
        throw new Error("Error commenting on post")
    }
}

PostSchema.methods.getAllComments = async function () {
    try {
        await this.populate({
            path: "comments",
            options: {
                sort: {
                    createdAt: -1
                }
            }
        })
        return this.comments
    } catch (error) {
        throw new Error("Error getting all comments")
    }
}

PostSchema.methods.removePost = async function () {
    try {
        await this.model("Post").deleteOne({ _id: this._id })
    } catch (error) {
        throw new Error("Error removing post")
    }
}

PostSchema.statics.getAllPosts = async function () {
    try {
        const posts = await this.find().sort({ createdAt: -1 }).populate({
            path: "comments",
            options: {
                sort: {
                    createdAt: -1
                }
            }
        }).lean()//convert mongoose object to plain js object

        return posts.map((post: IPostDocument) => (
            {
                ...post,
                createdAt: post.createdAt.toISOString(),
                updatedAt: post.updatedAt.toISOString(),
                _id: post._id.toString(),
                comments: post.comments?.map((comment: IComment) => (
                    {
                        ...comment,
                        _id: comment._id.toString()
                    }
                ))
            }
        ))
    } catch (error) {
        throw new Error("Error getting all posts")
    }
}

export const Post =models.Post as IPostModel || model<IPostDocument, IPostModel>("Post", PostSchema)