from chatbot import chatbot
import asyncio

llm = chatbot(model_name = "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free" , model_provider = "together")

llm.set_config({
    "configurable" : {"thread_id" : "1"}
})


llm.set_system_prompt("You are a helpful AI agent with the task of helping the user in any way possible. Dont give any answer larger than 100 words, but also dont make them too short either") # pro tip in the system prompt add that dont ever show that the word limit is of 100 words or add that you have to give concise answers to limit the token usage 

async def temp():
    while True:
        inp = input("User: ")
        if inp == 'q':
            break
        
        print("AI: ",end="")

        async for i in llm.astream(inp):
            print(i,flush=True , end="")
        print()
        
asyncio.run(temp())