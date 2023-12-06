// import axios from "axios";

// export const sendMessage = async (message: string) => {
//     console.log("here");

//     try {
//         const url = `http://localhost:8090/message`;
//         console.log('Request URL:', url);

//         const payload = await axios.post(
//             url,
//             { message: "test"}, // Pass an object with the message property
//             { headers: { 'Content-Type': 'application/json' } }
//         );

//         console.log(payload.data);
//     } catch (error) {
//         console.error('Error sending channel to backend:', error);
//     }
// }
