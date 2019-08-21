import * as functions from "firebase-functions";
import * as admin from 'firebase-admin';
admin.initializeApp();
const db = admin.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);

export const createChat = functions.firestore
    .document("games/{gameId}")
    .onCreate(async (snap, context) => {
        const gameData: any = snap.data();
        console.log(gameData);
        const gameId = context.params.gameId;
        const uid = gameData.admin;
        console.log(`gameId: ${gameId}, uid: ${uid}`)

        const data = {
            id: gameId,
            admin: uid,
            createdAt: Date.now(),
            count: 0,
            messages: []
        };

        return db.collection('chats').doc(gameId).set(data);
    });

export const deleteChat = functions.firestore
    .document("games/{gameId}")
    .onDelete(async (snap, context) => {
        const gameId = context.params.gameId;

        return db.collection('chats').doc(gameId).delete();
    });

export const archiveChat = functions.firestore
    .document("chats/{chatId}")
    .onUpdate(change => {
        const data: any = change.after.data();

        const maxLen = 100;
        const msgLen = data.messages.length;
        const charLen = JSON.stringify(data).length;

        const batch = db.batch();

        if (charLen >= 10000 || msgLen >= maxLen) {

            // Always delete at least 1 message
            const deleteCount = msgLen - maxLen <= 0 ? 1 : msgLen - maxLen
            data.messages.splice(0, deleteCount);

            const ref = db.collection("chats").doc(change.after.id);

            batch.set(ref, data, { merge: true });

            return batch.commit();
        } else {
            return null;
        }
    });