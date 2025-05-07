import { resend } from "@/lib/resend";

import VerificationEmail from "../../emails/VerificationEmail";

import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username:string,
    verifyCode:string
): Promise<ApiResponse>{
      
    try{

        await resend.emails.send({
          from:'yshivam91yadav@gmail.com',
          to: email,
          subject: 'Secret Message | Email Verification Code ',
          react: VerificationEmail({username, otp:verifyCode})

        });

         return {success: true, message:'Verification Email send Successfully'};


    }catch(emailError){
      console.log("Error Sending verification Email", emailError);
      // reason to send here is we can se we have used Promise which is returning APIResponse.
      // so we need to satisfy the response for this.
      return {success: false, message:'failed to send verification Email'}
    }

}




