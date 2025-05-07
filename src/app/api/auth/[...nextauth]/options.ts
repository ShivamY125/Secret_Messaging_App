import {NextAuthOptions} from "next-auth";
import { CredentialsProvider } from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";

import dbConnect from "@/lib/dbConnect";

import UserModal from "@/modal/User";



export const authOptions: NextAuthOptions = {
      
    providers: [
        CredentialsProvider({
           id: "credentials",
           name: "Credentials",

           credentials:{
               email: {label:"Email", type:"text", placeholder:"abcde@gmail.com"},
               password: {label: "Password", type: "password", placeholder: "********"}
           },

           async authorize(credentials:any): Promise<any>{
                await dbConnect();

                try{

                   const user =  await UserModal.findOne({
                       $or: [
                        {email: credentials.identifier},
                        {username: credentials.username}
                       ]  
                    })
                    
                    if(!user){
                        throw new Error('No user found with the Email');
                    }

                    if(user.isVerified){
                        throw new Error('Please verify the account before Login.');
                    }
                    
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    if(isPasswordCorrect){
                        return user;
                    }else{
                        throw new Error("Incorrect password.");
                    }
                }catch(err: any){
                    throw new Error(err);
                }
              

           }


        })
    ]

}