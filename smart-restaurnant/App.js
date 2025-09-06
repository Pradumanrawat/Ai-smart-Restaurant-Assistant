
import express from "express";
import dotenv from "dotenv";
const app=express();
app.use(express.json());

dotenv.config();
import path from "path";

const __dirname=path.resolve();
import{ChatGoogleGenerativeAI}from "@langchain/google-genai"
import {AgentExecutor,createToolCallingAgent}from "langchain/agents"
import { DynamicStructuredTool } from "@langchain/core/tools";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import{z} from "zod";//schema validation library


//setup llm or using /creating model
//for gemini(google)

const model=new ChatGoogleGenerativeAI({
      model:"models/gemini-2.5-flash",
      maxOutputTokens:2048,
      temperature:0.7,
      apiKey:process.env.GOOGLE_API_KEY
});


//creating tool

const getmenutool=new DynamicStructuredTool({
     name:"get-menu",//you are creating a new tool called get-menu 

     description:"Returns the final answer for today's menu for the given category (breakfast,lunch,or dinner).Use this tool to directly answer the user's menu question",
     //this tells the llm when to use the tool.it says if somone asked about today menu--breakfast ,lunch ,dinner-use this tool
     
     schema:z.object({
         category:z.string().describe("Type of food. Example:breakfast,lunch,dinner")
     }),
     //this define the input that tool needs
     
     func :async({category})=>{
            const menus={
                 breakfast:"Aloo ki sbzi,Poha, Masala Chai",
                 lunch: "Paneer ButterMasala,Dal,Roti,Rice",
                 dinner:"Veg Biryanii,Raita,Salad<Gulab Jamun"
            }
            return menus[category.toLowerCase()]||"no menu found for that category";
     },
})


const prompt=ChatPromptTemplate.fromMessages([
    ["system", " you are a helpful assistant that uses tools when needed"],
    ["human","{input}"],
    ["ai", "{agent_scratchpad}"]
]);



const agent=await createToolCallingAgent({
    llm:model,
    tools:[getmenutool],
    prompt

})



const executor=await AgentExecutor.fromAgentAndTools({

    agent,
    tools:[getmenutool],
    verbose:true,//feature in executor to see detailed what is happenin in behind the console
    maxIterations:1,
    returnIntermediateSteps:true

})


app.get('/',(req,res)=>{
 res.sendFile(path.join(__dirname,'Public','index.html'));
})

app.post('/api/chat', async (req,res)=>{
       const userinput=req.body.input;
       try{
        const response=await executor.invoke({input:userinput});
console.log("Agent full response :",response);

const data=response.intermediateSteps[0].observation;
if(response.output  &&  response.output!='Agent stopped due to max iterations.'){
    return  res.json({output:response.output});
}
else if(data!=null){
return res.json({output:data});
}
res.status(500).jdon({output:  "Agent couldnot find a valid answer."});

       }catch(err){
console.log(err);
res.status(400).json({output: "Sorry,something went wrong please try again"});
       }
})


//creating server
app.listen(process.env.PORT,(req,res)=>{
    console.log(`server is live at  http://localhost:${process.env.PORT}`);
})








