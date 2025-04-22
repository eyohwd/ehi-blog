import { ConnectDB } from "@/lib/config/db"
import BlogModel from "@/lib/models/BlogModel";
const { NextResponse } = require("next/server")
import {writeFile} from 'fs/promises'
const fs = require('fs')

const LoadDB = async () => {
    await ConnectDB();
}

LoadDB();

      // API Endpoint to get all Blogs
export async function GET(request){

    const blogId = request.nextUrl.searchParams.get('id');
    if (blogId) {
        const blog = await BlogModel.findById(blogId);
        return NextResponse.json(blog)
    }else{
        const blogs = await BlogModel.find({});
         return NextResponse.json({blogs})
    }
}

// API Endpoint for uploading Blogs.
export async function POST(request) {
    const formData = await request.formData();
    const timestamp = Date.now();

    const image = formData.get('image');
    // store image in public folder. first convert the image to byte data
    const imageByteData = await image.arrayBuffer();
    // store bytedata to buffer
    const buffer = Buffer.from(imageByteData);
    // define the path where you want to store the image
    const path = `./public/${timestamp}_${image.name}`;
    // defined the buffer on this path, so use the writeFile function. import it.
      await writeFile(path,buffer);
      const imgUrl = `/${timestamp}_${image.name}`;
      
     const blogData = {
        title: `${formData.get('title')}`,
        description: `${formData.get('description')}`,
        category: `${formData.get('category')}`,
        author: `${formData.get('author')}`,
        image: `${imgUrl}`,
        authorImg: `${formData.get('authorImg')}`
     }
          await BlogModel.create(blogData);
          console.log('blog saved');
      return NextResponse.json({success:true, msg:'Blog Added'})
}

// Creating API Endpoint to delete Blog

export async function DELETE(request){
    const id = await request.nextUrl.searchParams.get('id');
    const blog = await BlogModel.findById(id);
    fs.unlink(`./public${blog.image}`, ()=>{});
    await BlogModel.findByIdAndDelete(id);
    return NextResponse.json({msg:"Blog Deleted"})
}