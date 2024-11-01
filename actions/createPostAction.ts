'use server'

import { AddPostRequest } from "@/app/api/posts/route";
import { Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user"
import {  currentUser } from "@clerk/nextjs/server"

export default async function createPostAction(formData: FormData) {
    const user = await currentUser();

    if (!user) {
        throw new Error('User not found')
    }
    const input = formData.get('postInput')
    const image = formData.get('image') as File
    let imageUrl: string | undefined

    if(!input){
        throw new Error('Post cannot be empty')
    }

    const userDB: IUser = {
        userId: user.id,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        userImage: user.imageUrl
    }

    try {

    if (image.size > 0) {
        imageUrl = URL.createObjectURL(image)
        const post = {
            user: userDB,
            text: input,
            imageUrl
        }

        await Post.create(post)
    } else {
        const post = {
            user: userDB,
            text: input
        }

        await Post.create(post)
    }

    } catch (error) {
        throw new Error('Error creating post')
    }
}