import { ConnectDB } from "@/lib/config/db";
import EmailModel from "@/lib/models/EmailModel";
import { NextResponse } from "next/server";

// connect to db
const LoadDB = async()=>{
    await ConnectDB();
}
LoadDB();

export async function POST(request) {
    // get the form data input into formData
   const formData = await request.formData();
   // get the email field into the emailData
   const emailData ={
    email:`${formData.get('email')}`
   }
   // save email data to db
   await EmailModel.create(emailData);
   // generate a response
   return NextResponse.json({success:true,msg:"Email Subscribed"}) 
}

export async function GET(request) {
    const emails = await EmailModel.find({});
    // generate a response
    return NextResponse.json({emails});
}

export async function DELETE(request){
    const id = await request.nextUrl.searchParams.get('id')
    await EmailModel.findByIdAndDelete(id);
     return NextResponse.json({success:true, msg:"Email Deleted"})
}