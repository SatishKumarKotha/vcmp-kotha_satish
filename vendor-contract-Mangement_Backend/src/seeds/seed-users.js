import bcrypt from "bcrypt";   // forpassword hashing
import connectionPool from "../config/db.js"  


// ---------created defaul seed users ---------------\\ 
const users = [
    {
        name: "admin",
        email: "admin@finvesco.com",
        role: "ADMIN"
    },
    {
        name: "procurement",
        email: "proc@finvesco.com",
        role: "PROCUREMENT"
    },
    {
        name: "finance",
        email: "finance@finvesco.com",
        role: "FINANCE"
    }
]

async function seedUsers(){
    try{
        // ---as of now i created one default password for all users ---------\\
        // ------ hased the password to store into db------ \\
    const passwordHash = await bcrypt.hash("Password@123", 10);  
       for(const user of users){
          //---------------check if user exist-------------\\
            const [existingUser] = await connectionPool.execute(
                "select * from users where email=?",
                [user.email]
            );
             //----------if user exit then continue the loop
            if(existingUser.length >0){
                console.log(`user ID is already crated with Email :${user.email}`);
                  continue;
            }

            //-----------------user not exist create the user------------------\\
               await connectionPool.execute(` INSERT INTO users ( name,email, password_hash,  role, status)
                                                            VALUES (?, ?, ?, ?, ?)
                                                            `,
                                                            [
                                                            user.name,
                                                            user.email,
                                                            passwordHash,
                                                            user.role,
                                                            "active"
                                                            ]
                                                        );
                                                        console.log(`user created with email:${user.email}`)
       }
       process.exit(0);
    }catch(error){
       console.error("Seed users creation failed:", error.message);
      process.exit(1);
    }
}
seedUsers();

