// import crypto from "crypto";

// async function decryptMessage(message: string) {
//   try {
//     const decipher = crypto.createDecipheriv(Algorithm, Buffer.from(SecurityKey, "hex"), Buffer.from(IV, "hex"));
//     const decryptedData = Buffer.concat([decipher.update(Buffer.from(message, "hex")), decipher.final()]).toString();

//     if (!decryptedData) {
//       return Promise.reject(ErrorKey.RejectBasicAuthentication);
//     }

//     const arrayDecryptMessage = decryptedData.split(",");
//     if (arrayDecryptMessage.length === 4) {
//       return {
//         deviceId: arrayDecryptMessage[0],
//         model: arrayDecryptMessage[1],
//         platform: arrayDecryptMessage[2],
//         device: arrayDecryptMessage[3]
//       };
//     }

//     return Promise.reject(ErrorKey.RejectBasicAuthentication);
//   } catch (error) {
//     getLogger().debug({
//       error,
//       message,
//       labels: { type: LabelLogger.BasicAuthentication }
//     }, "basicAuthentication");

//     return Promise.reject(ErrorKey.RejectBasicAuthentication);
//   }
// }
