
import fs from "node:fs/promises"
import path from "node:path"


const db=path.join(import.meta.dirname,"data.json")

export function createDB(){
    return {
        async getbyname(resorce,nam){
                    const data=await fs.readFile(db,"utf-8")
                    const users=JSON.parse(data)
        
                    return users[resorce].find((x)=>x.name===nam)
        
                },
        async getall(resorce){
            const  users_data=await fs.readFile(db, "utf-8")
            const users=JSON.parse(users_data)
            return users[resorce];
        },
        async getby_id(resorce,id){
            const  users_data=await fs.readFile(db, "utf-8")
            const jsonfile=JSON.parse(users_data)

            return jsonfile[resorce].find((x)=>x.id==id);

        },

        async delete(resorce,id){
            let  users_data=await fs.readFile(db, "utf-8")
            const jsonfile=JSON.parse(users_data)
            
            //check if the user exist 
            
            const user=jsonfile[resorce].find((x)=>x.id==id)
            if(user){
                
                const new_resource=jsonfile[resorce].filter((s)=>s.id!=id)
                
                await fs.writeFile(db,JSON.stringify({
                    ...jsonfile,
                    [resorce]:new_resource
                }))
            }
            else{
                console.log("user not found");
                
            }
            
        },


        async create(resorce,obj){
            //create id 
        const  new_id=Math.floor(Math.random()*100000)
        //get data from the json file 
        const  users_data=await fs.readFile(db, "utf-8")
        const jsonfile=JSON.parse(users_data)

            const newresource=[...jsonfile[resorce],{...obj,"id":new_id}]

            await fs.writeFile(db,JSON.stringify({
                ...jsonfile,
                [resorce]:newresource
            }))

        },


        async update(resorce,id,data){
            //get the data from the file 
            const new_data=await fs.readFile(db,"utf-8")
            //parse it to be json  
            const json=JSON.parse(new_data)

            const new_resorce=json[resorce].map((x)=>{
                if(x.id!=id){
                    return x;
                }
                else {
                    return{
                        ...x,
                        ...data,
                        id:x.id
                    }
                }
            })
            await fs.writeFile(db,JSON.stringify({
                    ...json,
                    [resorce]:new_resorce
                }))

            
        }
    }
}