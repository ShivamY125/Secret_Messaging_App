import {z} from "zod";
 


// for username we have not created object bcz here we ahve only one value username.
export const usernameValidation = z 
     .string()
     .min(4, "Username must beatleast 4 character")
     .max(20, "Username cannot be more than 20 character.")
     .regex(/^[a-zA-Z0-9]+$/, "Username must not contain special character")
     

     // Here in SignUp we have multiple value in the form name,email,password so we need to create object for checking.

     export const signUpSchema = z.object({
         
        username: usernameValidation,
        email: z.string().email({message: "Invalid email Address"}),
        password: z.string().min(8, {message: 'Min 8 char is required'})

     })