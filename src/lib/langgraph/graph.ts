// import { StateGraph, Annotation, START, END } from "@langchain/langgraph";

// // 1️⃣ Define your graph state schema
// const StateAnnotation = Annotation.Root({
//   messages: Annotation<string[]>({
//     reducer: (state, update) => [...state, ...update],
//     default: () => [],
//   }),
// });

// // 2️⃣ Create the graph instance
// //    Explicitly declare type parameters for state + node IDs
// const graph = new StateGraph<
//   typeof StateAnnotation,
//   "retriever" | "generate" // ← Add your custom node IDs here
// >(StateAnnotation);

// // 3️⃣ Add Nodes
// graph.addNode("retriever", async (state) => {
//   return {
//     messages: [...state.messages, "Retrieving documents..."],
//   };
// });

// graph.addNode("generate", async (state) => {
//   return {
//     messages: [...state.messages, "Generating response..."],
//   };
// });

// // 4️⃣ Add Edges
// graph.addEdge(START, "retriever");
// graph.addEdge("retriever", "generate");
// graph.addEdge("generate", END);

// // 5️⃣ Compile graph
// export const ragGraph = graph.compile();
