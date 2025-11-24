import { storage } from "../../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadImage = async (
  uri: string,
  folder: string = "listings"
): Promise<string> => {
  try {
    console.log("1. Starting Upload for URI:", uri);

    // 1. Convert URI to Blob (Web & Mobile friendly way)
    const response = await fetch(uri);
    const blob = await response.blob();

    console.log("2. Blob created:", blob.size, "bytes");

    // 2. Create Reference
    const filename = `${folder}/${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}`;
    const storageRef = ref(storage, filename);

    // 3. Upload
    console.log("3. Uploading to:", filename);
    const snapshot = await uploadBytes(storageRef, blob);
    console.log("4. Upload success!");

    // 4. Get URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("5. File available at:", downloadURL);

    return downloadURL;
  } catch (error: any) {
    console.error("❌ UPLOAD FAILED DETAILS:", error);
    // On Web, this helps us see if it's a Permissions issue
    if (error.code === "storage/unauthorized") {
      console.error(
        "⚠️ Check Firebase Console -> Storage -> Rules. Is it in Test Mode?"
      );
    }
    throw error;
  }
};
