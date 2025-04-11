from typing import Annotated
from typing_extensions import TypedDict
from langgraph.graph import START, END, StateGraph
from langgraph.graph.message import add_messages
from langgraph.checkpoint.memory import MemorySaver
from dotenv import load_dotenv
from langchain.chat_models import init_chat_model
from langchain_core.prompts import ChatPromptTemplate, PromptTemplate 
from langchain_core.messages import SystemMessage , trim_messages
from langchain_core.messages.utils import count_tokens_approximately

load_dotenv()

class state(TypedDict):
    messages: Annotated[list , add_messages]

class chatbot():

    def __init__(self, model_name , model_provider):
        self.model = init_chat_model(model=model_name , model_provider=model_provider)

        self.graphBuilder = StateGraph(state)

        self.graphBuilder.add_node("llm" , self.llm)

        self.graphBuilder.add_edge("llm" , END)
        self.graphBuilder.add_edge(START, "llm")

        checkpointer = MemorySaver()
        self.graph = self.graphBuilder.compile(checkpointer=checkpointer)

    def llm(self , state : state):
        return {
            "messages" : self.model.invoke(
                state["messages"]
            )
        }

    def set_config(self , config):
        # sample template : config = {"configurable" : {"thread_id" : n}}
        self.config = config
        self.thread_key = config["configurable"]["thread_id"]
    
    async def astream(self, message):

        # print(self.graph.get_state(self.config))

        fin = ""

        all_msgs = self.graph.get_state(self.config).values["messages"] + [{"role":  "user" , "content": message}]
        self.graph.update_state(self.config , {"messages": all_msgs})

        async for chunk in self.model.astream(
            trim_messages(
                all_msgs,
                max_tokens = 1000,
                token_counter = count_tokens_approximately,
                include_system = True,
                allow_partial = True 
            )
        ):
            # print(chunk)
            fin += chunk.content
            yield chunk.content
        
        ai_message = [{"role" : "ai" , "content" : fin}]
        all_msgs = self.graph.get_state(self.config).values["messages"] + ai_message

        # print(all_msgs)
        self.graph.update_state(self.config , {"messages": all_msgs})

    def set_system_prompt(self, prompt):
        self.system_prompt = [{"role":"system" , 'content' : prompt}]
        self.graph.update_state(self.config , {"messages": self.system_prompt})

    def invoke(self , message) :
        temp = self.graph.invoke(
            {
                "messages" : message
            },config = self.config
        )
        
        return temp["messages"][-1].content