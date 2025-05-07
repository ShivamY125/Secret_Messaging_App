import dbConnect from "@/lib/dbConnect";
import UserModal from "@/modal/User";

import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
export default async function POST(request: Request, response:Response){
   await dbConnect();

   try{
    const {username, email, password}= await request.json();
        
    const existingVerifiedUserByUsername =  await UserModal.findOne({
        username,
        isVerified:true
    })
      
    if(existingVerifiedUserByUsername){
          return Response.json({
             success: false,
             message: "User already exist , Please Login"
          },
        {
            status: 400
        });
    }

       const existingUserByEmail =  await UserModal.findOne({
            email
        });

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if(existingUserByEmail){
         // This the condition when user email exist but the isVerified is not done .
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: `User already present with same email ${existingUserByEmail.email}`
                 }, {status: 400})
            }else{
                   const hashedpassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
                   
                   existingUserByEmail.password = hashedpassword;
                   existingUserByEmail.verifyCode = verifyCode;
                   existingUserByEmail.verifyCodeexpiry = new  Date(Date.now()+ 60*60*100)
                   
                   await existingUserByEmail.save()
            }
             

        }else{

            // Here we are coming bcz this user has come here first time, as we have not recieved this user in email.
           const hashedpassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
          
          // Here expiryDate is const still we are chainging value bcz we are storing object here , so it never matter we are using let,const or anyother thing.
           const expiryDate = new Date()
           expiryDate.setHours(expiryDate.getHours()+1);  // So we are getting the current time and adding 1 hr of expiry to the code .
           
           // Save this user:- 

           const newUser = new UserModal({
              username: username,
                 email: email,
                 password: hashedpassword,
                 verifyCode: verifyCode,
                 verifyCodeexpiry: expiryDate,
                 isVerified:false,
                 isAcceptingMessage: true,
                 messages: [],
            
           });

           await newUser.save();
        }
    
     // Send verification Email
          
    const emailResponse =  await sendVerificationEmail(
        email, username,verifyCode
    );

    if(!emailResponse.success){
      return Response.json({
         success: false,
         message: `User not verified, ${emailResponse.message}`
      }, {status: 500})
    }

    // If user is verified.
       
    return Response.json({
        success: true,
        message: `User is Registered , Verify the Mail, ${emailResponse.message}`
     }, {status: 201})



   }catch(err){
    console.log('error registering user', err);
    return Response.json({
        success: false,
        message:'Error registering user'
    },{
        status:500
    });
   }
}