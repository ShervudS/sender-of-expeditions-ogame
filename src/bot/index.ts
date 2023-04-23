import axios from "axios";

const baseUrl = `https://api.telegram.org/bot${process.env.TG_BOT}/sendMessage?chat_id=${process.env.CHAT_ID}`;

export const sendMessageBot = async (message: string) => {
  try {
    axios(`${baseUrl}&text=${message}`);
  } catch (error) {
    console.log(error);
  }
};

// export const sendMediaBot = async (media: string) => {
//   try {
//     axios(
//       `https://api.telegram.org/bot${process.env.TG_BOT}/sendMessage?chat_id=${process.env.CHAT_ID}&text=${message}`
//     );
//   } catch (error) {
//     console.log(error);
//   }
// };
